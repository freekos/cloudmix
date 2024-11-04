import { z } from 'zod';

export const getMessagesDto = z.object({
  // page: z.number(),
  // limit: z.number(),
  search: z.string().optional(),
});
