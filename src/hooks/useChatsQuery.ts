import { chatApi, GetChatsDto } from '@/services/api/chat';
import { ChatModel } from '@/types/models';
import { useQuery } from 'react-query';

interface UseChatsQueryParams extends GetChatsDto {}

export const useChatsQuery = (params: UseChatsQueryParams) => {
  return useQuery<ChatModel[]>({
    queryKey: ['chats', params],
    queryFn: async () => {
      const response = await chatApi.getChats(params);
      return response;
    },
  });
};
