import { MessageStatus } from '@/constants/messageStatus';
import { OrderBy } from '@/constants/orderBy';

export interface CreateChatDto {
  name?: string;
  isGroup?: boolean;
  usersIds: string[];
}

export interface GetChatsDto {
  // page: number;
  // limit: number;
  search?: string;
  isGroup?: boolean;
  orderBy?: OrderBy;
}

export interface UpdateMessageDto {
  content: string;
}

export interface GetUsersDto {
  search?: string;
}

export interface GetChatsMessagesDto {
  search?: string;
  status?: MessageStatus;
  orderBy?: OrderBy;
}
