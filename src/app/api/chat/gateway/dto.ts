import { z } from 'zod';

export const defaultDto = z.object({
  connectionId: z.string(),
  payload: z.any(),
});
