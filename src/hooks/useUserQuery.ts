import { userApi } from '@/services/api/user';
import { TUserModel } from '@/types/models';
import { useQuery } from 'react-query';

export const useUserQuery = (userId: string) => {
  return useQuery<TUserModel>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await userApi.getUser(userId);
      return res;
    },
  });
};
