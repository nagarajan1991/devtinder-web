import React, { createContext, useContext, useState, useEffect } from 'react';
import createSocketConnection from '../utils/socket';
import { useSelector } from 'react-redux';

const UserStatusContext = createContext();

export const useUserStatus = () => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error('useUserStatus must be used within a UserStatusProvider');
  }
  return context;
};

export const UserStatusProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!user) return;

    const socket = createSocketConnection();

    // Join user status room
    socket.emit('joinUserStatus', { userId: user._id });

    // Handle online users list
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(new Set(users));
    });

    // Handle user going online
    socket.on('userOnline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set([...prev, userId]);
        return newSet;
      });
    });

    // Handle user going offline
    socket.on('userOffline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Handle network status changes
    const handleOnline = () => {
      setIsOnline(true);
      socket.emit('userOnline', { userId: user._id });
    };

    const handleOffline = () => {
      setIsOnline(false);
      socket.emit('userOffline', { userId: user._id });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      socket.emit('userOffline', { userId: user._id });
      socket.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const getStatusColor = (userId) => {
    if (isUserOnline(userId)) {
      return 'bg-success'; // Green for online
    }
    return 'bg-base-300'; // Gray for offline
  };

  const getStatusText = (userId) => {
    if (isUserOnline(userId)) {
      return 'Online';
    }
    return 'Offline';
  };

  const value = {
    onlineUsers,
    isOnline,
    isUserOnline,
    getStatusColor,
    getStatusText
  };

  return (
    <UserStatusContext.Provider value={value}>
      {children}
    </UserStatusContext.Provider>
  );
};
