import Redis from 'ioredis';
import { env } from '../configs/env';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
  tls: {},
});
