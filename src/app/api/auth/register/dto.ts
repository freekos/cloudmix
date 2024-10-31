import { z } from 'zod';

export type RegisterDto = z.infer<typeof registerDto>;

export const registerDto = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});
