import { chatApi } from '@/services/api/chat';
import { TChatModel } from '@/types/models';
import { useQuery } from 'react-query';

export const useChatByUserIdQuery = (userId: string) => {
  return useQuery<TChatModel>({
    queryKey: ['chat', userId],
    retry: false,
    queryFn: async () => {
      const response = await chatApi.getChatByUserId(userId);
      return response;
    },
  });
};
