import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from './Store/useChatStore';
import { useNavigate } from 'react-router-dom';

const FloatingChatIcon = () => {
  const { getTotalUnreadMessages } = useChatStore();
  const unreadMessages = getTotalUnreadMessages();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard?chat=open');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="relative bg-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Open Chat"
      >
        <MessageCircle size={24} />
        {unreadMessages > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadMessages > 99 ? '99+' : unreadMessages}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChatIcon;