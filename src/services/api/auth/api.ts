import { baseApi } from '../base';
import { RefreshTokenDto, RegisterDto } from './types';

class AuthApi {
  path = '/auth';

  async register(data: RegisterDto) {
    return await baseApi.post(`${this.path}/register`, data);
  }
  async refreshToken(data: RefreshTokenDto) {
    return await baseApi.post(`${this.path}/refresh-token`, data);
  }
  async logout() {
    return await baseApi.post(`${this.path}/logout`);
  }
}

export const authApi = new AuthApi();
