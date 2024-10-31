import { z } from 'zod';

export const updateUserDto = z.object({
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(6).max(20).optional(),
});
