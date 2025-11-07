import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Clock, CheckCircle, Settings, Grid, BarChart3, UserCheck, FolderOpen, MessageCircle } from 'lucide-react';
import Profile from './Profile';
import { useTranslation } from 'react-i18next';
import { useChatStore } from './Store/useChatStore';


const Sidebar = () => {
  const { t } = useTranslation();
  const { unreadMessages } = useChatStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: Home, text: t('Home'), path: '/' },
    { icon: Grid, text: t('Overview'), path: '/dashboard' },
    { icon: Clock, text: t('Pending'), path: '/dashboard/pending' },
    { icon: CheckCircle, text: t('Completed'), path: '/dashboard/completed' },
    { icon: UserCheck, text: t('Supervisor'), path: '/dashboard/supervisor' },
    { icon: FolderOpen, text: t('Projects'), path: '/dashboard/projects' },
    { icon: BarChart3, text: t('Analytics'), path: '/dashboard/charts' },
    { icon: MessageCircle, text: t('Chat'), path: '/dashboard', badge: unreadMessages > 0 ? unreadMessages : null },
    { icon: Settings, text: t('Settings'), path: '/dashboard/settings' }
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg hover:bg-muted transition-colors border border-border"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

        <div
          className={`
          fixed top-0 left-0 h-full bg-card z-40
          transition-all duration-300 ease-in-out
          ${isMobile
            ? isOpen ? 'translate-x-0 w-72' : '-translate-x-full'
            : isOpen ? 'w-72' : 'w-20'
          }
          shadow-2xl border-r border-border
        `}
      >
        <div className="p-6 border-b border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <h1
            className={`font-bold text-xl text-card-foreground transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Tasky.Dev
          </h1>
        </div>

        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  isMobile && setIsOpen(false);
                  if (item.text === t('Chat')) {
                    // Navigate to overview and open chat
                    window.location.href = '/dashboard?chat=open';
                  }
                }}
                className={`
                  flex items-center px-4 py-3 mb-2 rounded-xl text-muted-foreground hover:bg-muted
                  transition-all duration-200 group
                  ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                `}
              >
                <item.icon
                  size={20}
                  className={`
                    ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                    group-hover:text-foreground transition-colors
                  `}
                />
                <span
                  className={`ml-3 transition-opacity duration-300 font-medium
                    ${isOpen ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  {item.text}
                </span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className={`transition-opacity duration-300 w-full
              ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
