import { z } from 'zod';

export const connectDto = z.object({
  connectionId: z.string(),
  token: z.string(),
});
