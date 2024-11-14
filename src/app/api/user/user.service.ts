import { User } from '@prisma/client';
import { getHashedPassword } from '../helpers/getHashedPassword';
import { prisma } from '../lib/prisma';
import { CreateBotDto, CreateUserDto, UpdateUserDto } from './dto';

const selectFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  username: true,
  isBot: true,
  botType: true,
};

export async function createUser(dto: CreateUserDto) {
  const createdUser = await prisma.user.create({
    data: {
      username: dto.username,
      password: dto.password,
    },
    select: selectFields,
  });

  return createdUser;
}

export async function updateUser(dto: UpdateUserDto, userId: string) {
  let hashedPassword;
  if (dto.password) {
    hashedPassword = await getHashedPassword(dto.password);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: dto.username,
      password: hashedPassword,
      updatedAt: new Date(),
    },
    select: selectFields,
  });

  return updatedUser;
}

export async function deleteUser(userId: string) {
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
    select: selectFields,
  });

  return deletedUser;
}

export async function createBot(dto: CreateBotDto) {
  const createdBot = await prisma.user.create({
    data: {
      username: dto.username,
      isBot: true,
      botType: dto.type,
    },
    select: selectFields,
  });

  return createdBot;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    where: {
      isBot: false,
      botType: null,
    },
    select: selectFields,
  });

  return users;
}

export async function getUsersWithoutMe(sessionUser: User) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: sessionUser.id,
      },
      isBot: false,
      botType: null,
    },
    select: selectFields,
  });

  return users;
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isBot: false,
      botType: null,
    },
    select: selectFields,
  });

  return user;
}

export async function getBots() {
  const bots = await prisma.user.findMany({
    where: {
      isBot: true,
      botType: {
        not: null,
      },
    },
    select: selectFields,
  });

  return bots;
}

export async function getBot(botId: string) {
  return prisma.user.findUnique({
    where: {
      id: botId,
      isBot: true,
      botType: {
        not: null,
      },
    },
    select: selectFields,
  });
}
