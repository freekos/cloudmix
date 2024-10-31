import Redis from 'ioredis';
import { env } from '../configs/env';

export const redis = new Redis(env.REDIS_URL);
