import { chatApi } from '@/services/api/chat';
import { ChatModel } from '@/types/models';
import { useQuery } from 'react-query';

interface UseChatQueryParams {
  chatId: string;
}

export const useChatQuery = ({ chatId }: UseChatQueryParams) => {
  return useQuery<ChatModel>({
    queryKey: ['chat'],
    queryFn: async () => {
      const response = await chatApi.getChat(chatId);
      return response;
    },
  });
};
