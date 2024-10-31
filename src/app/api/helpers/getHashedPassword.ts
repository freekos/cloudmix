import * as bcrypt from 'bcrypt';
import { env } from '../configs/env';

export async function getHashedPassword(password: string) {
  return bcrypt.hash(password, parseInt(env.BCRYPT_SALT));
}
