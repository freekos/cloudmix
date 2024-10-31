import { z } from 'zod';

export const updateMessageDto = z.object({
  content: z.string(),
});
