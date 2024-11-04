import { TChatModel, TMessageModel, TUserModel } from '@/types/models';
import { baseApi } from '../base';
import {
  CreateChatDto,
  GetChatsDto,
  GetChatsMessagesDto,
  GetUsersDto,
  UpdateMessageDto,
} from './types';

class ChatApi {
  path = '/chat';

  async createChat(data: CreateChatDto): Promise<TChatModel> {
    return await baseApi.post(this.path, data);
  }
  async deleteChat(chatId: string) {
    return await baseApi.delete(`${this.path}/${chatId}`);
  }
  async getChats(params: GetChatsDto = {}): Promise<TChatModel[]> {
    return await baseApi.get(this.path, { params });
  }
  async getChat(chatId: string): Promise<TChatModel> {
    return await baseApi.get(`${this.path}/${chatId}`);
  }
  async getChatByUserId(userId: string): Promise<TChatModel> {
    return await baseApi.get(`${this.path}/user/${userId}`);
  }

  async updateMessage(
    chatId: string,
    messageId: string,
    data: UpdateMessageDto,
  ) {
    return await baseApi.patch(
      `${this.path}/${chatId}/message/${messageId}`,
      data,
    );
  }
  async deleteMessage(chatId: string, messageId: string) {
    return await baseApi.delete(`${this.path}/${chatId}/message/${messageId}`);
  }
  async getMessages(chatId: string): Promise<TMessageModel[]> {
    return await baseApi.get(`${this.path}/${chatId}/message`);
  }
  async getChatsMessages(
    params: GetChatsMessagesDto = {},
  ): Promise<TMessageModel[]> {
    return await baseApi.get(`${this.path}/message`, { params });
  }

  async getUsers(params: GetUsersDto = {}): Promise<TUserModel[]> {
    return await baseApi.get(`${this.path}/user`, { params });
  }
}

export const chatApi = new ChatApi();
