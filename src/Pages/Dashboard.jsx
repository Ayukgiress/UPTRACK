import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { isAuthenticated, currentUserLoading, authInitialized } = useAuth();

  if (!authInitialized) {
    // While auth state not initialized, show enhanced loading screen
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16"></div>
        <style>{`
          .loader {
            border-top-color: #3b82f6;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
