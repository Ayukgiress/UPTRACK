import React from "react";

const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-6">
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-4">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p3 flex item-center gap-3">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 mb-12" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
