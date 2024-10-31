import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '../configs/env';
import { getHashedPassword } from '../helpers/getHashedPassword';
import { RequestError } from '../helpers/requestError';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
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
  await prisma.user.create({
    data: {
      username: dto.username,
      password: hashedPassword,
      updatedAt: null,
    },
  });

  return NextResponse.json(null, { status: 201 });
}

export async function login(userAgent: any, dto: LoginDto) {
  const user = await prisma.user.findUnique({
    where: {
      username: dto.username,
    },
  });
  if (!user) {
    throw new RequestError('User not found', 400);
  }

  const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordCorrect) {
    throw new RequestError('Invalid password', 400);
  }

  const { refreshToken, accessToken } = await createSession(userAgent, user.id);

  return NextResponse.json(
    { refreshToken, accessToken, user },
    { status: 200 },
  );
}

export async function refreshTokens(req: NextRequest, dto: RefreshTokenDto) {
  const decodedToken = jwt.verify(dto.refreshToken, env.JWT_SECRET);
  if (!decodedToken.sub) {
    throw new RequestError('Token is not valid', 400);
  }
  const userId = parseInt(decodedToken.sub as string);

  const sessionRefreshToken = await redis.get(getSessionRefreshKey(userId));
  if (sessionRefreshToken !== dto.refreshToken) {
    throw new RequestError('Token is not valid', 401);
  }

  await deleteSession(userId);

  const { refreshToken, accessToken } = await createSession(req, userId);

  return NextResponse.json({ refreshToken, accessToken }, { status: 200 });
}

export async function logout(sessionUser: User) {
  await deleteSession(sessionUser.id);

  return NextResponse.json(null, { status: 200 });
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
  const decodedToken = jwt.verify(token, env.JWT_SECRET);
  if (!decodedToken.sub) {
    throw new RequestError('Invalid or expired token', 403);
  }
  const userId = parseInt(decodedToken.sub as string);

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

async function createSession(userAgent: any, userId: number) {
  const session = await getSession(userId);
  if (session) {
    await deleteSession(userId);
  }

  const { accessToken, refreshToken } = generateTokens(userId);
  const { device, os, browser } = userAgent;

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
  await redis.hmset(getSessionMetaKey(userId), {
    device,
    os,
    browser,
  });

  return { refreshToken, accessToken };
}

async function deleteSession(userId: number) {
  await redis.del(getSessionAccessKey(userId));
  await redis.del(getSessionRefreshKey(userId));
  await redis.del(getSessionMetaKey(userId));
}

async function getSession(userId: number) {
  const accessToken = await redis.get(getSessionAccessKey(userId));
  const refreshToken = await redis.get(getSessionRefreshKey(userId));
  const meta = await redis.hgetall(getSessionMetaKey(userId));

  return { accessToken, refreshToken, meta };
}

function generateTokens(userId: number) {
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

function getSessionRefreshKey(userId: number) {
  return `session:refresh:${userId}`;
}

function getSessionAccessKey(userId: number) {
  return `session:access:${userId}`;
}

function getSessionMetaKey(userId: number) {
  return `session:meta:${userId}`;
}
