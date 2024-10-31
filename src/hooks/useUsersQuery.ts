import { chatApi, GetUsersDto } from '@/services/api/chat';
import { UserModel } from '@/types/models';
import { useQuery } from 'react-query';

interface UseUsersQueryParams extends GetUsersDto {}

export const useUsersQuery = (params: UseUsersQueryParams) => {
  return useQuery<UserModel[]>({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await chatApi.getUsers(params);
      return response;
    },
  });
};
