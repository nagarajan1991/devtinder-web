import io from "socket.io-client";
import { BASE_URL } from "./constants";

const createSocketConnection = () => {
  const baseUrl = location.hostname === "localhost" ? "http://localhost:7777" : "/";
  const socket = io(baseUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000
  });

  // Suppress connection errors in production
  socket.on('connect_error', (error) => {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Socket connection error:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    // Only log disconnection in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Socket disconnected:', reason);
    }
  });

  return socket;
};

export default createSocketConnection;