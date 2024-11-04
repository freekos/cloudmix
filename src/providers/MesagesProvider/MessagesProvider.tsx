'use client';

import { MessageStatus } from '@/constants/messageStatus';
import { TMessageModel } from '@/types/models';
import { TTemporaryMessage } from '@/types/temporaryMessage';
import { useSession } from 'next-auth/react';

import { chatApi } from '@/services/api/chat';
import { TMessageItem } from '@/types/messageItem';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWebsocket } from '../WebsocketProvider';

const MessagesContext = createContext<{
  messages: TMessageModel[];
  temporaryMessages: TTemporaryMessage[];
  unreadMessages: TMessageModel[];
  resultMessages: TMessageItem[];
  isLoading: boolean;
  setMessages: Dispatch<SetStateAction<TMessageModel[]>>;
  setTemporaryMessages: Dispatch<SetStateAction<TTemporaryMessage[]>>;
  setUnreadMessages: Dispatch<SetStateAction<TMessageModel[]>>;
  handleGetMessages: (chatId: string) => Promise<void>;
} | null>(null);

export const MessagesProvider = ({ children }: PropsWithChildren) => {
  const [messages, setMessages] = useState<TMessageModel[]>([]);
  const [temporaryMessages, setTemporaryMessages] = useState<
    TTemporaryMessage[]
  >([]);
  const [unreadMessages, setUnreadMessages] = useState<TMessageModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { subscribeToMessage, updateMessageReceipt } = useWebsocket();
  const session = useSession();
  const userId = session.data?.user.id;

  const resultMessages = useMemo<TMessageItem[]>(() => {
    return [...messages, ...temporaryMessages];
  }, [messages, temporaryMessages]);

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.topic === 'receivedMessage') {
      setMessages((prev) => [...prev, data.message]);
      setUnreadMessages((prev) => [...prev, data.message]);
    }
    if (data.topic === 'sentMessage') {
      console.log(data);
      setTemporaryMessages((prev) =>
        prev.filter((message) => message.id !== data.tempId),
      );
      setMessages((prev) => [...prev, data.message]);
    }
    if (data.topic === 'updatedMessageReceipt') {
      setMessages((prev) => {
        const message = prev.find(
          (message) => message.id === data.messageReceipt.messageId,
        );
        if (!message) {
          return prev;
        }

        const receipt = message.receipts.find(
          (receipt) => receipt.id === data.messageReceipt.id,
        );
        if (!receipt || receipt.status === data.messageReceipt.status) {
          return prev;
        }

        return prev.map((message) => {
          if (message.id !== data.messageReceipt.messageId) return message;
          return {
            ...message,
            receipts: message.receipts.map((receipt) => {
              if (receipt.id !== data.messageReceipt.id) return receipt;
              return { ...receipt, status: data.messageReceipt.status };
            }),
          };
        });
      });
    }
  }, []);

  const handleGetMessages = useCallback(async (chatId: string) => {
    try {
      setIsLoading(true);
      const res = await chatApi.getMessages(chatId);
      setMessages(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleGetUnreadMessages = async () => {
      try {
        const sentRes = await chatApi.getChatsMessages({
          status: MessageStatus.SENT,
        });
        const deliveredRes = await chatApi.getChatsMessages({
          status: MessageStatus.DELIVERED,
        });

        setUnreadMessages([...sentRes, ...deliveredRes]);
      } catch (error) {}
    };

    handleGetUnreadMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    messages.forEach((message) => {
      if (!message.receipts) {
        return;
      }

      const receipt = message.receipts.find(
        (receipt) => receipt.userId === userId && receipt.status,
      );
      if (!receipt || receipt.status !== MessageStatus.READ) {
        return;
      }

      setUnreadMessages((prev) =>
        prev.filter((prevMessage) => prevMessage.id !== message.id),
      );
    });
  }, [messages, userId]);

  useEffect(() => {
    unreadMessages.forEach((message) => {
      const receipt = message.receipts.find(
        (receipt) => receipt.userId === userId && receipt.status,
      );
      if (!receipt || receipt.status !== MessageStatus.SENT) {
        return;
      }

      updateMessageReceipt(message.id, MessageStatus.DELIVERED);
    });
  }, [unreadMessages, userId]);

  useEffect(() => {
    const unsubscribe = subscribeToMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);
  return (
    <MessagesContext.Provider
      value={{
        messages,
        temporaryMessages,
        unreadMessages,
        resultMessages,
        isLoading,
        setMessages,
        setTemporaryMessages,
        setUnreadMessages,
        handleGetMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }

  return context;
};
