import { z } from 'zod';

export const getUsersDto = z.object({
  // page: z.number(),
  // limit: z.number(),
  search: z.string().optional(),
});
