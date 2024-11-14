import { z } from 'zod';
import { BotType } from '../constants/botType';

export const botDto = z.object({
  type: z.nativeEnum(BotType),
  message: z.string(),
});
