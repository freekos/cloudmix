import { useWebsocket } from '@/providers/WebsocketProvider';
import { chatApi } from '@/services/api/chat';
import { TMessageModel } from '@/types/models';
import { useEffect, useMemo, useState } from 'react';

export const useMessages = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<TMessageModel[]>([]);
  const [temporaryMessages, setTemporaryMessages] = useState<
    Partial<TMessageModel>[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { subscribeToMessage } = useWebsocket();

  const resultMessages = useMemo(() => {
    return [...messages, ...temporaryMessages];
    // .sort((a, b) => {
    //   if (!a.createdAt || !b.createdAt) {
    //     return 0;
    //   }
    //   const dateA = new Date(a.createdAt);
    //   const dateB = new Date(b.createdAt);
    //   return dateA.getTime() - dateB.getTime();
    // });
  }, [messages, temporaryMessages]);

  useEffect(() => {
    if (!chatId || temporaryMessages.length) {
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        const res = await chatApi.getMessages(chatId);
        setMessages(res);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [chatId, temporaryMessages]);

  useEffect(() => {
    const unsubscribe = subscribeToMessage((event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        if (data.topic === 'receivedMessage') {
          setMessages((prev) => [...prev, data.message]);
        }
        if (data.topic === 'sentMessage') {
          setTemporaryMessages((prev) =>
            prev.filter((message) => message.id !== data.tempId),
          );
          setMessages((prev) => [...prev, data.message]);
        } else if (data.topic === 'updatedMessageReceipt') {
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    messages,
    temporaryMessages,
    error,
    isLoading,
    setTemporaryMessages,
    resultMessages,
  };
};
