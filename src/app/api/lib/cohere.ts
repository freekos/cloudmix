import { CohereClientV2 } from 'cohere-ai';
import { env } from '../configs/env';

export const cohere = new CohereClientV2({
  token: env.COHERE_API_KEY,
});
