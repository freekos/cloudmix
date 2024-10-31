import { chatApi } from '@/services/api/chat';
import { MessageModel } from '@/types/models';
import { useQuery } from 'react-query';

interface UseMessagesQueryParams {
  chatId: string;
}

export const useMessagesQuery = ({ chatId }: UseMessagesQueryParams) => {
  return useQuery<MessageModel[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await chatApi.getMessages(chatId);
      return response;
    },
  });
};
