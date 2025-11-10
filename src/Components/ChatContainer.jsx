import React, { useEffect, useRef } from "react";
import { useChatStore } from "./Store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useAuth } from "../Pages/AuthContext";
import { formatMessageTime } from "../lib/utils";
import { Bell } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, markMessagesAsRead } = useChatStore();
  const { currentUser } = useAuth();
  const messageListRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?.email) return;
    getMessages(selectedUser.email);
    markMessagesAsRead(selectedUser._id);
  }, [selectedUser, getMessages, markMessagesAsRead]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedUser) {
    return null;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-base-100 to-base-200">
      <ChatHeader />
      
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages && messages.length > 0 ? (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser?._id;
              const author = isOwnMessage ? currentUser : selectedUser;
              const authorInitial = author?.userName?.charAt(0) || author?.name?.charAt(0) || author?.email?.charAt(0) || "U";
              
              return (
                <div 
                  key={message._id} 
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div 
                    className={`flex max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    } items-end gap-2 sm:gap-3`}
                  >
                    {/* Avatar */}
                    <div
                      className={`hidden sm:flex size-8 sm:size-10 rounded-full flex-shrink-0 shadow-md border-2 items-center justify-center font-semibold text-sm ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-base-200 text-base-content border-base-300"
                      }`}
                    >
                      {authorInitial.toUpperCase()}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col min-w-0 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm relative ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground rounded-br-md rounded-tl-3xl"
                          : "bg-base-100 text-base-content border border-base-200 rounded-bl-md rounded-tr-3xl"
                      }`}
                    >
                      {/* New message indicator for incoming messages */}
                      {!isOwnMessage && message.isNew && (
                        <div className="absolute -left-2 top-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      {/* Image */}
                      {message.image && (
                        <div className="mb-2">
                          <img
                            src={message.image}
                            alt="message attachment"
                            className="rounded-xl max-h-64 w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Voice */}
                      {message.voice && (
                        <div className="mb-2">
                          <audio controls className="w-full max-w-[240px]">
                            <source src={message.voice} type="audio/mpeg" />
                          </audio>
                        </div>
                      )}

                      {/* Text */}
                      {message.text && (
                        <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere mb-1">
                          {message.text}
                        </p>
                      )}

                      {/* Timestamp */}
                      <div 
                        className={`text-[10px] sm:text-xs opacity-70 mt-1 ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-base-content/60">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation!</p>
            </div>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;