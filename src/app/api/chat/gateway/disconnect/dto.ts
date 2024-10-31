import { z } from 'zod';

export const disconnectDto = z.object({
  connectionId: z.string(),
});
