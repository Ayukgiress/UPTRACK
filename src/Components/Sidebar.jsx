import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Clock, CheckCircle, Settings, Grid } from 'lucide-react';  // Use Grid for Overview
import Profile from './Profile';

const Sidebar = () => {
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
    { icon: Home, text: 'Home', path: '/' },
    { icon: Grid, text: 'Overview', path: '/dashboard' },  // Updated icon here
    { icon: Clock, text: 'Pending Todos', path: '/dashboard/pending' },
    { icon: CheckCircle, text: 'Completed', path: '/dashboard/completed' },
    { icon: Settings, text: 'Settings', path: '/dashboard/settings' }
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
          fixed top-0 left-0 h-full bg-white z-40
          transition-all duration-300 ease-in-out
          ${isMobile
            ? isOpen ? 'translate-x-0 w-72' : '-translate-x-full'
            : isOpen ? 'w-72' : 'w-20'
          }
          shadow-xl
        `}
      >
        <div className="p-6 border-b flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <h1
            className={`font-bold text-xl transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Dashboard
          </h1>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`
                  flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 
                  transition-all duration-200 group
                  ${isActive ? 'bg-blue-50 text-blue-600' : ''}
                `}
              >
                <item.icon
                  size={24}
                  className={`
                    ${isActive ? 'text-blue-600' : 'text-gray-500'}
                    group-hover:text-blue-600 transition-colors
                  `}
                />
                <span
                  className={`ml-4 transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  {item.text}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
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
