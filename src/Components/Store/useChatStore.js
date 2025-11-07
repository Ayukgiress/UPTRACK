import { create } from 'zustand';
import { toast } from "sonner";
import { axiosInstance } from "../../lib/axois";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    unreadMessages: 0,
    isChatOpen: false,

    getUsers: async (currentUser) => {
        set({ isUsersLoading: true })
        try {
            const token = localStorage.getItem('token');

            const res = await axiosInstance.get(`/projects/api/project-contributors/${currentUser._id}`, {
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

    subscribeToMessages: (socket) => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            const { selectedUser, isChatOpen } = get();
            const isMessageForCurrentChat = selectedUser && newMessage.senderId === selectedUser._id;

            set((state) => ({
                messages: [...state.messages, newMessage],
                unreadMessages: isMessageForCurrentChat || isChatOpen ? state.unreadMessages : state.unreadMessages + 1
            }));
        });
    },

    unsubscribeFromMessages: (socket) => {
        if (!socket) return;

        socket.off('newMessage');
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

    markMessagesAsRead: () => set({ unreadMessages: 0 }),

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
