import { MessageStatus, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { GetMessagesDto, UpdateMessageDto } from './dto';

export async function createPrivateMessage(
  userId: string,
  content: string,
  senderId: string,
) {
  const [chat, message, receipts] = await prisma.$transaction(
    async (prisma) => {
      let chat = await prisma.chat.findFirst({
        where: {
          users: {
            every: {
              id: {
                in: [userId, senderId],
              },
            },
          },
        },
        include: {
          users: true,
        },
      });

      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            users: {
              connect: [{ id: userId }, { id: senderId }],
            },
          },
          include: {
            users: true,
          },
        });
      }

      const message = await prisma.message.create({
        data: {
          chatId: chat.id,
          content: content,
          senderId: senderId,
        },
      });

      const userIds = chat.users
        .filter((user) => user.id !== senderId)
        .map((user) => user.id);
      const receipts = await createMessageReceipts(message.id, userIds);

      return [chat, message, receipts];
    },
  );

  return { chat, message, receipts };
}

export async function createMessageReceipts(
  messageId: string,
  userIds: string[],
) {
  await prisma.messageReceipt.createMany({
    data: userIds.map((userId) => ({
      messageId,
      userId,
      status: MessageStatus.sent,
    })),
  });

  const receipts = await prisma.messageReceipt.findMany({
    where: {
      messageId,
    },
  });

  return receipts;
}

export async function updateMessage(dto: UpdateMessageDto, messageId: string) {
  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      content: dto.content,
    },
  });

  return updatedMessage;
}

export async function deleteMessage(messageId: string) {
  const deletedMessage = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  return deletedMessage;
}

export async function getMessages(dto: GetMessagesDto, sessionUser: User) {
  const whereConditions: any = {
    AND: [
      {
        chat: {
          users: {
            some: {
              id: sessionUser.id,
            },
          },
        },
      },
      { senderId: { not: sessionUser.id } },
      {
        OR: [
          {
            receipts: {
              none: {
                userId: sessionUser.id,
              },
            },
          },
        ],
      },
    ],
  };

  if (dto.search) {
    whereConditions.AND.push({
      content: {
        contains: dto.search,
        mode: 'insensitive',
      },
    });
  }

  if (dto.status) {
    whereConditions.AND[2].OR.push({
      receipts: {
        some: {
          userId: sessionUser.id,
          status: dto.status,
        },
      },
    });
  }

  const messages = await prisma.message.findMany({
    where: whereConditions,
    orderBy: {
      createdAt: dto.orderBy,
    },
    include: {
      sender: true,
      chat: true,
      receipts: {
        where: {
          userId: sessionUser.id,
        },
      },
    },
  });

  return messages;
}
