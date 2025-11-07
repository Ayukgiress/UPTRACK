import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import FloatingChatIcon from '../Components/FloatingChatIcon';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 p-6 lg:p-8">
        <Outlet />
      </main>
      <FloatingChatIcon />
    </div>
  );
};

export default Dashboard;
