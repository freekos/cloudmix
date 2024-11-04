import { TUserModel } from '@/types/models';
import { baseApi } from '../base';

class UserApi {
  path = '/user';

  async getUser(userId: string): Promise<TUserModel> {
    return await baseApi.get(`${this.path}/${userId}`);
  }
}

export const userApi = new UserApi();
