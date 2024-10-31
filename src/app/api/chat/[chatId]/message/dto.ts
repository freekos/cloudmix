import { z } from 'zod';
import { OrderBy } from '@/app/api/constants/orderBy';

export const getMessagesDto = z.object({
  page: z.number(),
  limit: z.number(),
  search: z.string().optional(),
  isGroup: z.boolean().optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});
