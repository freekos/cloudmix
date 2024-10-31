export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserModel extends BaseModel {
  username: string;
  chats?: ChatModel[];
  messages: MessageModel[];
  readReceipts: ReadReceiptModel[];
}

export interface ChatModel extends BaseModel {
  isGroup: boolean;
  name?: string;
  messages: MessageModel[];
  users: UserModel[];
}

export interface MessageModel extends BaseModel {
  content: string;
  senderId: number;
  chatId: number;
  replyToId?: number;
  sender: UserModel;
  chat: ChatModel;
  replyTo?: MessageModel;
  replies: MessageModel[];
}

export interface ReadReceiptModel extends BaseModel {
  messageId: number;
  userId: number;
}
