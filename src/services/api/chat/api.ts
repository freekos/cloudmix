import { ChatModel, MessageModel, UserModel } from '@/types/models';
import { baseApi } from '../base';
import {
  CreateChatDto,
  GetChatsDto,
  GetUsersDto,
  UpdateMessageDto,
} from './types';

class ChatApi {
  path = '/chat';

  async createChat(data: CreateChatDto) {
    return await baseApi.post(this.path, data);
  }
  async deleteChat(chatId: string) {
    return await baseApi.delete(`${this.path}/${chatId}`);
  }
  async getChats(params: GetChatsDto): Promise<ChatModel[]> {
    return await baseApi.get(this.path, { params });
  }
  async getChat(chatId: string): Promise<ChatModel> {
    return await baseApi.get(`${this.path}/${chatId}`);
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
  async getMessages(chatId: string): Promise<MessageModel[]> {
    return await baseApi.get(`${this.path}/${chatId}/message`);
  }

  async getUsers(params: GetUsersDto): Promise<UserModel[]> {
    return await baseApi.get(`${this.path}/user`, { params });
  }
}

export const chatApi = new ChatApi();
