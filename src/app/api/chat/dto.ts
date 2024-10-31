import { z } from 'zod';
import { OrderBy } from '../constants/orderBy';

export const createChatDto = z.object({
  isGroup: z.boolean().optional(),
  name: z.string().optional(),
  usersIds: z.array(z.number()),
});

export const getChatsDto = z.object({
  page: z.number(),
  limit: z.number(),
  search: z.string().optional(),
  isGroup: z.boolean().optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});
