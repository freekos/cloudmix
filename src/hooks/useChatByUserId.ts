import { chatApi } from '@/services/api/chat';
import { TChatModel } from '@/types/models';
import { useEffect, useState } from 'react';

export const useChatByUserId = (userId: string) => {
  const [chat, setChat] = useState<TChatModel | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await chatApi.getChatByUserId(userId);
        setChat(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  return {
    chat,
    isLoading,
    setChat,
  };
};
