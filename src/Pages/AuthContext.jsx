import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../lib/constants.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [refetchCurrentUser, setRefetchCurrentUser] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const isAuthenticated = Boolean(currentUser) && !currentUserLoading;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    setCurrentUserLoading(false);
    setOnlineUsers([]);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const fetchCurrentUser = async (token) => {
    try {
      console.log('Fetching current user with token:', token);
      
      const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        console.error('Failed to fetch user:', response.status);
        throw new Error("Failed to fetch current user");
      }
  
      const userData = await response.json();
      console.log('Received user data:', userData);
  
      if (userData && userData.success && userData.data && userData.data._id) {
        setCurrentUser(userData.data);

        // Connect to socket after successful login
        const newSocket = io(API_BASE_URL, {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to socket server');
          newSocket.emit('join', userData.data._id);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from socket server');
        });

        newSocket.on('getOnlineUsers', (onlineUserIds) => {
          console.log('Received online users:', onlineUserIds);
          // Filter out the current user from online users
          const filteredOnlineUsers = onlineUserIds.filter(id => id !== userData.data._id);
          setOnlineUsers(filteredOnlineUsers);
        });

        setSocket(newSocket);
      } else {
        console.error('Invalid user data format:', userData);
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    } finally {
      setCurrentUserLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('Initial token check:', Boolean(token));
    
    if (token) {
      setCurrentUserLoading(true);
      fetchCurrentUser(token);
    } else {
      setCurrentUserLoading(false);
    }
  }, [refetchCurrentUser]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      logout,
      currentUser,
      setCurrentUser,
      currentUserLoading,
      setRefetchCurrentUser,
      onlineUsers,
      setOnlineUsers,
      socket,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
