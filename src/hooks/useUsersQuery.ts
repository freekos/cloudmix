import { chatApi, GetUsersDto } from '@/services/api/chat';
import { TUserModel } from '@/types/models';
import { useQuery } from 'react-query';

interface UseUsersQueryParams extends GetUsersDto {}

export const useUsersQuery = (params: UseUsersQueryParams) => {
  return useQuery<TUserModel[]>({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await chatApi.getUsers(params);
      return response;
    },
  });
};
