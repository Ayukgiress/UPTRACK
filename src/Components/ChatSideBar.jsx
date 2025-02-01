import React, { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useChatStore } from './Store/useChatStore';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';

export default function ChatSideBar() {
  const { getUsers, users, selectedUser, isUsersLoading } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Container</span>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user.id}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors
              ${selectedUser?.id === user.id ? 'bg-base-200' : ''}`}
          >
            {/* Add user content here, for example: */}
            <div className="w-10 h-10 rounded-full bg-base-300" />
            <div className="hidden lg:block">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-base-content/70">{user.status}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}