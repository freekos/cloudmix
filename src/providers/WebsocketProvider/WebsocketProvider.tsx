'use client';

import { env } from '@/configs/envConfig';
import { useSession } from 'next-auth/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

const WebsocketContext = createContext<{
  socket: WebSocket | null;
  onSendMessage: (message: string) => void;
} | null>(null);

export const WebsocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const session = useSession();
  const token = session.data?.accessToken;

  const onSendMessage = (message: string) => {
    if (!socket || !token) {
      return;
    }

    socket.send(
      JSON.stringify({
        action: 'sendMessage',
        token,
        chatId: 1,
        message: message,
      }),
    );
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const ws = new WebSocket(env.WEBSOCKET_URL);
    setSocket(ws);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: 'connect',
          token,
        }),
      );
      console.log('connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        console.log(data.message);
        // setReceivedMessage(data.message?.content);
      }
      console.log(data);
    };

    ws.onclose = () => {
      console.log('closed');
    };

    return () => {
      // ws.send(
      //   JSON.stringify({
      //     action: 'disconnect',
      //     token,
      //   }),
      // );
      ws.close();
      setSocket(null);
    };
  }, [token]);

  return (
    <WebsocketContext.Provider value={{ socket, onSendMessage }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error('useWebsocket must be used within a WebsocketProvider');
  }

  return context;
};
