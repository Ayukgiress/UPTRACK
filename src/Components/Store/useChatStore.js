import { create } from 'zustand';
import { toast } from "sonner";
import { axiosInstance } from "../../lib/axois";

export const useChatStore = create((set,get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const token = localStorage.getItem('token');  

            const res = await axiosInstance.get('/message/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            set({ users: res.data });
        } catch (error) {
            toast.error('failure');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const token = localStorage.getItem('token'); 

            const res = await axiosInstance.get(`/messages/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            set({ message: res.data });
        } catch (error) {
            toast.error("failure to get messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages } =get()
        try {
            const rse = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error('failure to send message')

        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
