import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateChatDto, GetChatsDto, UpdateChatDto } from './dto';

export async function createChat(dto: CreateChatDto, sessionUser: User) {
  const createdChat = await prisma.chat.create({
    data: {
      type: dto.type,
      name: dto.name,
      users: {
        connect: [...dto.userIds, sessionUser.id].map((id) => ({ id })),
      },
    },
  });

  return createdChat;
}

export async function updateChat(chatId: string, dto: UpdateChatDto) {
  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      name: dto.name,
    },
  });

  return updatedChat;
}

export async function deleteChat(chatId: string) {
  const deletedChat = await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  return deletedChat;
}

export async function getChats(dto: GetChatsDto, sessionUser: User) {
  const whereConditions: any = {
    users: {
      some: { id: sessionUser.id },
    },
  };

  if (dto.type !== undefined) {
    whereConditions.type = dto.type;
  }

  if (dto.search) {
    whereConditions.name = {
      contains: dto.search,
      mode: 'insensitive',
    };
  }

  const chats = await prisma.chat.findMany({
    where: whereConditions,
    orderBy: { createdAt: dto.orderBy },
    include: {
      users: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          receipts: {
            where: {
              userId: sessionUser.id,
            },
          },
        },
      },
    },
  });

  return chats;
}

export async function getChat(chatId: string) {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });

  return chat;
}
