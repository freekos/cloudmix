import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { env } from '../configs/env';
import { getHashedPassword } from '../helpers/getHashedPassword';
import { RequestError } from '../helpers/requestError';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { UserAgent } from '../types/userAgent';
import { LoginDto } from './login/dto';
import { RefreshTokenDto } from './refresh-token/dto';
import { RegisterDto } from './register/dto';

export async function register(dto: RegisterDto) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: dto.username,
    },
  });
  if (existingUser) {
    throw new RequestError('Username already exists', 400);
  }

  const hashedPassword = await getHashedPassword(dto.password);
  const createdUser = await prisma.user.create({
    data: {
      username: dto.username,
      password: hashedPassword,
    },
  });

  return createdUser;
}

export async function login(dto: LoginDto, userAgent: UserAgent) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: dto.username,
    },
  });
  if (!existingUser) {
    throw new RequestError('User not found', 400);
  }

  const isPasswordCorrect = await bcrypt.compare(
    dto.password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    throw new RequestError('Invalid password', 400);
  }

  const { refreshToken, accessToken } = await createSession(
    existingUser.id,
    userAgent,
  );

  return { refreshToken, accessToken, user: existingUser };
}

export async function refreshTokens(
  dto: RefreshTokenDto,
  userAgent: UserAgent,
) {
  const decodedToken = await decodeToken(dto.refreshToken);
  if (!decodedToken || !decodedToken.sub) {
    throw new RequestError('Token is not valid', 400);
  }
  const userId = decodedToken.sub as string;

  const sessionRefreshToken = await redis.get(getSessionRefreshKey(userId));
  if (sessionRefreshToken !== dto.refreshToken) {
    throw new RequestError('Token is not valid', 401);
  }

  const { refreshToken, accessToken } = await createSession(userId, userAgent);

  return { refreshToken, accessToken };
}

export async function logout(sessionUser: User) {
  await deleteSession(sessionUser.id);

  return null;
}

export async function authorizeRequest(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new RequestError('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  return authorizeByToken(token);
}

export async function authorizeByToken(token: string) {
  let decodedToken = await decodeToken(token);
  if (!decodedToken || !decodedToken.sub) {
    throw new RequestError('Invalid or expired token', 403);
  }
  const userId = decodedToken.sub as string;

  const sessionAccessToken = await redis.get(getSessionAccessKey(userId));
  if (sessionAccessToken !== token) {
    throw new RequestError('Invalid or expired token', 403);
  }

  const sessionUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!sessionUser) {
    throw new RequestError('Invalid or expired token', 403);
  }

  return { sessionUser, token };
}

async function createSession(userId: string, userAgent: UserAgent) {
  const session = await getSession(userId);
  if (session) {
    await deleteSession(userId);
  }

  const { accessToken, refreshToken } = generateTokens(userId);

  await redis.set(
    getSessionAccessKey(userId),
    accessToken,
    'EX',
    env.ACCESS_TOKEN_EXPIRY,
  );
  await redis.set(
    getSessionRefreshKey(userId),
    refreshToken,
    'EX',
    env.REFRESH_TOKEN_EXPIRY,
  );
  await redis.hmset(getSessionMetaKey(userId), userAgent);

  return { refreshToken, accessToken };
}

async function deleteSession(userId: string) {
  await redis.del(getSessionAccessKey(userId));
  await redis.del(getSessionRefreshKey(userId));
  await redis.del(getSessionMetaKey(userId));
}

async function getSession(userId: string) {
  const accessToken = await redis.get(getSessionAccessKey(userId));
  const refreshToken = await redis.get(getSessionRefreshKey(userId));
  const meta = await redis.hgetall(getSessionMetaKey(userId));

  return { accessToken, refreshToken, meta };
}

async function decodeToken(token: string): Promise<JwtPayload | string | null> {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function generateTokens(userId: string) {
  const jwtSecret = env.JWT_SECRET;
  const payload = { sub: userId };
  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, jwtSecret, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

function getSessionRefreshKey(userId: string) {
  return `session:refresh:${userId}`;
}

function getSessionAccessKey(userId: string) {
  return `session:access:${userId}`;
}

function getSessionMetaKey(userId: string) {
  return `session:meta:${userId}`;
}
