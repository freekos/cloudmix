import { ChatType, MessageStatus } from '@prisma/client';
import { z } from 'zod';
import { OrderBy } from '../constants/orderBy';

export type CreateChatDto = z.infer<typeof createChatDto>;

export type UpdateChatDto = z.infer<typeof updateChatDto>;

export type GetChatsDto = z.infer<typeof getChatsDto>;

export type CreateMessageDto = z.infer<typeof createMessageDto>;

export type UpdateMessageDto = z.infer<typeof updateMessageDto>;

export type GetMessagesDto = z.infer<typeof getMessagesDto>;

export const createChatDto = z.object({
  type: z.nativeEnum(ChatType),
  name: z.string().optional(),
  userIds: z.array(z.string()),
});

export const updateChatDto = z.object({
  name: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

export const getChatsDto = z.object({
  // page: z.number(),
  // limit: z.number(),
  type: z.nativeEnum(ChatType).optional(),
  search: z.string().optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});

export const createMessageDto = z.object({
  content: z.string(),
  chatId: z.string(),
  senderId: z.string(),
});

export const updateMessageDto = z.object({
  content: z.string(),
});

export const getMessagesDto = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(MessageStatus).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});
