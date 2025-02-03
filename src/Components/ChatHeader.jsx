import React from 'react';
import { useChatStore } from './Store/useChatStore';
import { useAuth } from '../Pages/AuthContext';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuth(); 

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser || "/avatar.png"} alt={selectedUser.userName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <x />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
