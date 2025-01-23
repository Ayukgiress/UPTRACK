import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'; 
import Sidebar from '../Components/Sidebar';
import { useAuth } from './AuthContext';  

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex items-start justify-start h-screen bg-gray-100">
    <Sidebar />

    <main className="flex flex-col w-full sm:w-3/4 px-6 py-8  lg:ml-72 xl:w-[190rem] h-full">
      <Outlet />
    </main>
  </div>
  );
};

export default Dashboard;
