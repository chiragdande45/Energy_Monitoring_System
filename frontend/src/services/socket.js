import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

let socket = null;

export const connectSocket = (deviceId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });
    
    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });
    
    socket.emit('join', deviceId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
