import { BotType } from '@prisma/client';
import { z } from 'zod';

export type CreateUserDto = z.infer<typeof createUserDto>;

export type UpdateUserDto = z.infer<typeof updateUserDto>;

export type CreateBotDto = z.infer<typeof createBotDto>;

export const createUserDto = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});

export const updateUserDto = z.object({
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(6).max(20).optional(),
});

export const createBotDto = z.object({
  username: z.string().min(3).max(20),
  type: z.nativeEnum(BotType),
});
