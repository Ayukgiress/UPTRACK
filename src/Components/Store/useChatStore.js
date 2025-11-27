import { create } from 'zustand';
import { toast } from "sonner";
import { axiosInstance } from "../../lib/axois";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    unreadMessagesPerUser: {}, // { userId: count }
    isChatOpen: false,

    getUsers: async (currentUser) => {
        set({ isUsersLoading: true })
        try {
            const token = localStorage.getItem('token');

            const res = await axiosInstance.get(`/api/project-contributors/${currentUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Ensure we always have an array to work with
            const contributors = Array.isArray(res.data) ? res.data : [];

            // Include the current user (owner) first, then the invited contributors
            set({ users: [currentUser, ...contributors.filter(user => user._id && user._id !== currentUser._id)] });
        } catch (error) {
            toast.error('Failed to load contributors');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userEmail) => {
        if (!userEmail) {
            console.warn('getMessages called with undefined userEmail');
            set({ messages: [] });
            return;
        }
        set({ isMessagesLoading: true });
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(`/message/${encodeURIComponent(userEmail)}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            set({ messages: res.data });
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to get messages");
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    clearMessages: () => set({ messages: [] }),

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser?.email) {
            toast.error('Select a contact to start chatting');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.post(
                `/message/send/${encodeURIComponent(selectedUser.email)}`,
                messageData,
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error('Send message error:', error);
            toast.error('Failed to send message');
        }
    },

    subscribeToMessages: (socket, currentUserId) => {
        if (!socket) return;

        // Request notification permission if not granted
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        socket.on('newMessage', (newMessage) => {
            const { selectedUser, isChatOpen, unreadMessagesPerUser, users } = get();
            const isMessageForCurrentChat = selectedUser && newMessage.senderId === selectedUser._id;

            // Don't increment unread count for the user's own messages
            if (newMessage.senderId === currentUserId) {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
                return;
            }

            if (!isMessageForCurrentChat && !isChatOpen) {
                set((state) => ({
                    messages: [...state.messages, newMessage],
                    unreadMessagesPerUser: {
                        ...state.unreadMessagesPerUser,
                        [newMessage.senderId]: (state.unreadMessagesPerUser[newMessage.senderId] || 0) + 1
                    }
                }));

                // Show browser notification if chat is not open
                if ('Notification' in window && Notification.permission === 'granted') {
                    const sender = users.find(u => u._id === newMessage.senderId);
                    const senderName = sender ? (sender.userName || sender.name || sender.fullName || sender.email || 'Unknown') : 'Unknown';
                    new Notification(`New message from ${senderName}`, {
                        body: newMessage.text || 'You have a new message',
                        icon: '/vite.svg' // optional
                    });
                }
            } else {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }
        });
    },

    unsubscribeFromMessages: (socket) => {
        if (!socket) return;

        socket.off('newMessage');
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        // Mark messages as read for the selected user
        if (selectedUser) {
            set((state) => ({
                unreadMessagesPerUser: {
                    ...state.unreadMessagesPerUser,
                    [selectedUser._id]: 0
                }
            }));
        }
    },

    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

    markMessagesAsRead: (userId) => {
        if (userId) {
            set((state) => ({
                unreadMessagesPerUser: {
                    ...state.unreadMessagesPerUser,
                    [userId]: 0
                }
            }));
        }
    },

    getTotalUnreadMessages: () => {
        const { unreadMessagesPerUser } = get();
        return Object.values(unreadMessagesPerUser).reduce((total, count) => total + count, 0);
    },

    findUserByEmail: async (email) => {
        try {
            const token = localStorage.getItem('token');
            // Use the existing users endpoint to find by email
            const res = await axiosInstance.get('/message/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Find the user with matching email
            const user = res.data.find(u => u.email === email);
            return user || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    },
}));
