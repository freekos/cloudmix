import { z } from 'zod';
import { BotTypes } from '../constants/botTypes';

export const botDto = z.object({
  type: z.nativeEnum(BotTypes),
  message: z.string(),
});
