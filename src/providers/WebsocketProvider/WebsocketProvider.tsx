'use client';

import { env } from '@/configs/envConfig';
import { MessageStatus } from '@/constants/messageStatus';
import { useSession } from 'next-auth/react';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const WebsocketContext = createContext<{
  socket: WebSocket | null;
  subscribeToMessage: (callback: (event: MessageEvent) => void) => () => void;
  sendMessage: (chatId: string, tempId: string, message: string) => void;
  sendTyping: (chatId: string, status: boolean) => void;
  subscribeUserUpdates: (userIds: string[]) => void;
  unsubscribeUserUpdates: (userIds: string[]) => void;
  updateMessageReceipt: (messageId: string, status: MessageStatus) => void;
} | null>(null);

export const WebsocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const session = useSession();
  const token = session.data?.accessToken;

  const messageSubscribers: Array<(event: MessageEvent) => void> = [];

  const subscribeToMessage = (callback: (event: MessageEvent) => void) => {
    messageSubscribers.push(callback);

    return () => {
      messageSubscribers.splice(messageSubscribers.indexOf(callback), 1);
    };
  };

  const sendMessage = useCallback(
    (chatId: string, tempId: string, content: string) => {
      if (!socket || !token) {
        return;
      }

      socket.send(
        JSON.stringify({
          action: 'sendMessage',
          token,
          chatId,
          tempId,
          content,
        }),
      );
    },
    [socket, token],
  );

  const sendTyping = useCallback(
    (chatId: string, status: boolean) => {
      if (!socket || !token) {
        return;
      }

      socket.send(
        JSON.stringify({
          action: 'sendTyping',
          token,
          chatId,
          status,
        }),
      );
    },
    [socket, token],
  );

  const subscribeUserUpdates = useCallback(
    (userIds: string[]) => {
      if (!socket || !token || !userIds.length) {
        return;
      }

      socket.send(
        JSON.stringify({
          action: 'subscribeUserUpdates',
          token,
          userIds,
        }),
      );
    },
    [socket, token],
  );

  const unsubscribeUserUpdates = useCallback(
    (userIds: string[]) => {
      if (!socket || !token || !userIds.length) {
        return;
      }

      socket.send(
        JSON.stringify({
          action: 'unsubscribeUserUpdates',
          token,
          userIds,
        }),
      );
    },
    [socket, token],
  );

  const updateMessageReceipt = useCallback(
    (messageId: string, status: MessageStatus) => {
      if (!socket || !token) {
        return;
      }

      socket.send(
        JSON.stringify({
          action: 'updateMessageReceipt',
          token,
          messageId,
          status,
        }),
      );
    },
    [socket, token],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const ws = new WebSocket(env.WEBSOCKET_URL);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: 'connect',
          token,
        }),
      );
      setSocket(ws);
      console.log('connected');
    };

    ws.onmessage = (event) => {
      // console.log(event);
      messageSubscribers.forEach((callback) => callback(event));
    };

    ws.onclose = () => {
      ws.send(
        JSON.stringify({
          action: 'disconnect',
          token,
        }),
      );
      console.log('closed');
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [token]);

  return (
    <WebsocketContext.Provider
      value={{
        socket,
        subscribeToMessage,
        sendMessage,
        sendTyping,
        subscribeUserUpdates,
        unsubscribeUserUpdates,
        updateMessageReceipt,
      }}
    >
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
