
'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

interface ServerToClientEvents {
  subscribed: (data: { message: string }) => void;
  initialData: (data: any) => void;
  customUpdate: (data: any) => void;
}

interface ClientToServerEvents {
  subscribe: (data: { id: string }) => void;
}

export const useSocket = (subscribeId: string | null, callback: (data: any) => void) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    if (!subscribeId) {
      if(socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set for WebSocket.');
      callback({ error: { title: 'Configuration Error', message: 'The application is missing the backend URL.' } });
      return;
    }

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(backendUrl, {
      path: '/socket',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.IO Connected!', socket.id);
      socket.emit('subscribe', { id: subscribeId });
    });

    socket.on('subscribed', (data) => {
      console.log('Socket.IO Subscribed:', data.message);
    });

    socket.on('initialData', (data) => {
      console.log('Socket.IO Initial data:', data);
    });

    socket.on('customUpdate', (data) => {
      callback(data);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      callback({ error: { title: 'Connection Error', message: 'Could not connect to the enrollment service. Please try again later.' } });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [subscribeId, callback]);

  return socketRef;
};
