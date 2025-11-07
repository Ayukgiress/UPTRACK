import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useChatStore } from './Store/useChatStore';
import { useAuth } from '../Pages/AuthContext';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      setIsOnline(onlineUsers.includes(selectedUser._id));
    } else {
      setIsOnline(false);
    }
  }, [selectedUser, onlineUsers]);

  return (
    <div className="p-4 border-b border-base-300 bg-gradient-to-r from-base-100 to-base-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full relative shadow-md border-2 border-base-300 bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary" />
            {isOnline && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-base-100 rounded-full"></div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg text-base-content">
              {selectedUser?.userName || selectedUser?.name || selectedUser?.email}
            </h3>
            <p className={`text-sm font-medium ${
              isOnline
                ? "text-green-600 dark:text-green-400"
                : "text-base-content/60"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-circle hover:bg-base-300 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
