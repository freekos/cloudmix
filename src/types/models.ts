import { MessageStatus } from '@/constants/messageStatus';

export interface TBaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TUserModel extends TBaseModel {
  username: string;
  chats: TChatModel[];
  messages: TMessageModel[];
  receipts: TMessageReceiptModel[];
}

export interface TChatModel extends TBaseModel {
  isGroup: boolean;
  name: string;
  messages: TMessageModel[];
  users: TUserModel[];
}

export interface TMessageModel extends TBaseModel {
  content: string;
  senderId: string;
  chatId: string;
  replyToId?: string;
  sender: TUserModel;
  chat: TChatModel;
  replyTo: TMessageModel;
  replies: TMessageModel[];
  receipts: TMessageReceiptModel[];
}

export interface TMessageReceiptModel extends TBaseModel {
  messageId: string;
  userId: string;
  timestamp: string;
  status: MessageStatus;
}
