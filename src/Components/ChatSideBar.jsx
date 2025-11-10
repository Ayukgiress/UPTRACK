import React, { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useChatStore } from './Store/useChatStore';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';
import { useAuth } from '../Pages/AuthContext';

export default function ChatSideBar() {
  const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser, unreadMessagesPerUser } = useChatStore();
  const { onlineUsers, currentUser, currentUserLoading } = useAuth();

  useEffect(() => {
    if (!currentUserLoading && currentUser?._id) {
      getUsers(currentUser);
    }
  }, [getUsers, currentUserLoading, currentUser]);

  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser, setSelectedUser]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-24 lg:w-72 border-r border-base flex flex-col transition-all duration-200 bg-white">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const displayName = user.userName || user.name || user.fullName || user.email || 'User';
          const unreadCount = unreadMessagesPerUser[user._id] || 0;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 text-left rounded-lg transition-colors relative
                ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-base-200'}`}
            >
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center relative
                ${isSelected ? 'border-white' : 'border-base-300 bg-base-300'}`}
              >
                <span className="text-sm font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:block flex-1 min-w-0">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-sm text-base-content/70 truncate">{user.email}</p>
                <div className="text-xs text-base-content/60">
                  {onlineUsers?.includes(user._id) ? 'online' : 'offline'}
                </div>
              </div>
            </button>
          );
        })}
        {users.length === 0 && (
          <div className="px-4 py-6 text-sm text-base-content/70">
            No contacts available.
          </div>
        )}
      </div>
    </aside>
  );
}
