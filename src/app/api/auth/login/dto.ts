import { z } from 'zod';

export type LoginDto = z.infer<typeof loginDto>;

export const loginDto = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});
