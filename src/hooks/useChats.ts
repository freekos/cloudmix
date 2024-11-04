import { useWebsocket } from '@/providers/WebsocketProvider';
import { chatApi } from '@/services/api/chat';
import { TChatItem } from '@/types/chatItem';
import { TMessageItem } from '@/types/messageItem';

import { useCallback, useEffect, useState } from 'react';

export const useChats = (
  chatId: string | undefined,
  resultMessages: Array<TMessageItem>,
) => {
  const [chats, setChats] = useState<TChatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const { subscribeToMessage } = useWebsocket();

  const chatLastMessage = resultMessages[resultMessages.length - 1];

  const handleGetChats = async () => {
    try {
      setIsLoading(true);
      const res = await chatApi.getChats();
      setChats(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.topic === 'receivedMessage') {
        setChats((prev) => {
          if (data.chat.id === chatId) {
            return prev;
          }

          const chat = chats.find((chat) => chat.id === data.chat.id);
          if (!chat) {
            return [{ ...data.chat, messages: [data.message] }, ...prev];
          }

          if (chat.messages[0].id === data.message.id) {
            return prev;
          }

          chat.messages = [data.message];
          return [...prev];
        });
      }
    },
    [chatId],
  );

  useEffect(() => {
    handleGetChats();
  }, []);

  useEffect(() => {
    setChats((prev) => {
      if (!chatId) {
        return prev;
      }

      const chat = chats.find((chat) => chat.id === chatId);
      if (!chat) {
        return prev;
      }

      chat.messages = [chatLastMessage];
      return [...prev];
    });
  }, [chatId, chatLastMessage]);

  useEffect(() => {
    const unsubscribe = subscribeToMessage(handleMessage);

    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  return {
    chats,
    isLoading,
    search,
    setSearch,
  };
};
