import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { NextResponse } from 'next/server';

import { authorizeByToken } from '../../auth/service';
import { getBody } from '../../helpers/getBody';
import { RequestError } from '../../helpers/requestError';
import { requestHandler } from '../../helpers/requestHandler';
import { apiGatewayManagementClient } from '../../lib/apiGatewayManagementClient';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { defaultDto } from './dto';

const POST = requestHandler(async function (req) {
  const body = await getBody(req.body);
  const dto = await defaultDto.parseAsync(body);
  console.log(dto, 'CHAT');

  const { sessionUser } = await authorizeByToken(dto.payload.token);
  const userId = sessionUser.id;

  switch (dto.payload.action) {
    case 'connect': {
      await redis.set(`connectionUser:${userId}`, dto.connectionId);
      break;
    }
    case 'disconnect': {
      await redis.del(`connectionUser:${userId}`);
      break;
    }
    case 'joinChat': {
      const chatId = dto.payload.chatId;
      await redis.set(`userInChat:${userId}`, chatId);

      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { users: true },
      });
      if (!chat) {
        throw new RequestError('Chat not found', 404);
      }

      const otherConnectionIds = await Promise.all(
        chat.users
          .filter((user) => user.id !== userId)
          .map((user) => redis.get(`connectionUser:${user.id}`)),
      );

      otherConnectionIds.forEach(async (connectionId) => {
        if (!connectionId) return;

        const command = new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ event: 'userJoined', userId, chatId }),
        });
        await apiGatewayManagementClient.send(command);
      });

      break;
    }
    case 'leaveChat': {
      const chatId = dto.payload.chatId;
      await redis.del(`userInChat:${userId}`);

      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { users: true },
      });
      if (!chat) {
        throw new RequestError('Chat not found', 404);
      }

      const otherUserConnectionIds = await Promise.all(
        chat.users
          .filter((user) => user.id !== userId)
          .map((user) => redis.get(`connectionUser:${user.id}`)),
      );

      otherUserConnectionIds.forEach(async (connectionId) => {
        if (!connectionId) return;

        const command = new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ event: 'userLeft', userId, chatId }),
        });
        await apiGatewayManagementClient.send(command);
      });

      break;
    }
    case 'sendMessage': {
      const chatId = dto.payload.chatId;
      const message = dto.payload.message;
      const senderId = sessionUser.id;
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          users: true,
        },
      });
      if (!chat) {
        throw new RequestError('Chat not found', 404);
      }

      const newMessage = await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: senderId,
          content: message,
        },
      });

      const receiverConnectionIds = await Promise.all(
        chat.users
          .filter((user) => user.id !== senderId)
          .map((user) => {
            return redis.get(`connectionUser:${user.id}`);
          }),
      );

      receiverConnectionIds.forEach(async (receiverConnectionId) => {
        if (!receiverConnectionId) {
          return;
        }

        const command = new PostToConnectionCommand({
          ConnectionId: receiverConnectionId,
          Data: JSON.stringify({ message: newMessage }),
        });
        await apiGatewayManagementClient.send(command);
      });

      break;
    }
    case 'typing': {
      const chatId = dto.payload.chatId;
      const status = dto.payload.status;
    }
  }

  return NextResponse.json(null, { status: 200 });
});

export { POST };
