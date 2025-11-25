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
  const [authInitialized, setAuthInitialized] = useState(false);
  const [refetchCurrentUser, setRefetchCurrentUser] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // FIXED: isAuthenticated should depend ONLY on currentUser
  const isAuthenticated = Boolean(currentUser);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    setOnlineUsers([]);
    setCurrentUserLoading(false);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error("Failed to refresh access token");

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      return data.accessToken;
    }

    throw new Error("Invalid refresh token response");
  };

  let initialAttempt = true;

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        return await fetchCurrentUser(newToken);
      }

      if (!response.ok) throw new Error("Failed to fetch current user");

      const userData = await response.json();
      if (userData?.success && userData?.data?._id) {
        setCurrentUser(userData.data);

        // SOCKET CONNECT
        if (!socket) {
          const newSocket = io(API_BASE_URL, {
            auth: { token }
          });

          newSocket.on('connect', () => {
            newSocket.emit('join', userData.data._id);
          });

          newSocket.on('getOnlineUsers', (onlineUserIds) => {
            setOnlineUsers(onlineUserIds.filter(id => id !== userData.data._id));
          });

          setSocket(newSocket);
        }
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (initialAttempt) {
        initialAttempt = false;
        setTimeout(() => logout(), 1000);
      } else {
        logout();
      }
    } finally {
      setCurrentUserLoading(false);
      setAuthInitialized(true); // IMPORTANT FIX
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setCurrentUserLoading(true);
      fetchCurrentUser(token);
    } else {
      setCurrentUserLoading(false);
      setAuthInitialized(true); // Still initialize even with no token
    }
  }, [refetchCurrentUser]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token && currentUser) logout();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      logout,
      currentUser,
      setCurrentUser,
      currentUserLoading,
      authInitialized,           // ✔️ FIX: ADDED
      setRefetchCurrentUser,
      onlineUsers,
      setOnlineUsers,
      socket,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
