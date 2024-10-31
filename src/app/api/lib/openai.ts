import OpenAI from 'openai';
import { env } from '../configs/env';

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
