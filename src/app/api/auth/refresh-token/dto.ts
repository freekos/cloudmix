import { z } from 'zod';

export type RefreshTokenDto = z.infer<typeof refreshTokenDto>;

export const refreshTokenDto = z.object({
  refreshToken: z.string(),
});
