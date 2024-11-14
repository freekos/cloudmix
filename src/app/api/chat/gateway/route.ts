import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { NextResponse } from 'next/server';

import { authorizeByToken } from '../../auth/auth.service';
import {
  ChatGatewayAction,
  ChatGatewayTopic,
} from '../../constants/chatGateway';
import { getBody } from '../../helpers/getBody';
import { RequestError } from '../../helpers/requestError';
import { requestHandler } from '../../helpers/requestHandler';
import { apiGatewayManagementClient } from '../../lib/apiGatewayManagementClient';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { connect, disconnect, sendPrivateMessage } from '../gateway.service';
import { defaultDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await defaultDto.parseAsync(body);
  console.log(dto, 'CHAT');

  const { sessionUser } = await authorizeByToken(dto.payload.token);
  const userId = sessionUser.id;

  const { connectionId } = dto;

  switch (dto.payload.action) {
    case ChatGatewayAction.CONNECT: {
      await connect(connectionId, {
        sessionUser,
      });

      break;
    }
    case ChatGatewayAction.DISCONNECT: {
      await disconnect(connectionId, { sessionUser });

      break;
    }
    case ChatGatewayAction.SEND_TYPING: {
      const { chatId, status } = dto.payload;

      break;
    }
    case ChatGatewayAction.SEND_PRIVATE_MESSAGE: {
      const { userId, tempId, content } = dto.payload;

      await sendPrivateMessage(connectionId, {
        userId,
        tempId,
        content,
        sessionUser,
      });

      break;
    }
    case ChatGatewayAction.SUBSCRIBE_USER_UPDATES: {
      const { userIds } = dto.payload;

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      await Promise.all(
        users.map(async (user) => {
          await redis.sadd(`subscription:user:${user.id}`, userId);
          const userConnectionId = await redis.get(`connection:${user.id}`);

          const subscriberMessageCommand = new PostToConnectionCommand({
            ConnectionId: dto.connectionId,
            Data: JSON.stringify({
              topic: ChatGatewayTopic.UPDATED_USER,
              user,
              status: !!userConnectionId,
            }),
          });

          await apiGatewayManagementClient.send(subscriberMessageCommand);
        }),
      );

      break;
    }
    case ChatGatewayAction.UNSUBSCRIBE_USER_UPDATES: {
      const { userIds } = dto.payload;

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      await Promise.all(
        users.map(async (user) => {
          await redis.srem(`subscription:user:${user.id}`, userId);
        }),
      );

      break;
    }
    case ChatGatewayAction.UPDATE_MESSAGE_RECEIPT: {
      const { messageId, status } = dto.payload;

      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message) {
        throw new RequestError('Message not found', 404);
      }

      const messageReceipt = await prisma.messageReceipt.update({
        where: {
          messageId_userId: {
            messageId,
            userId,
          },
        },
        data: { status },
      });

      const connectionId = await redis.get(`connection:${message.senderId}`);
      if (!connectionId) {
        throw new RequestError('Connection not found', 404);
      }

      const command = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          topic: ChatGatewayTopic.UPDATED_MESSAGE_RECEIPT,
          messageReceipt,
        }),
      });
      await apiGatewayManagementClient.send(command);

      break;
    }
  }

  return NextResponse.json(null, { status: 200 });
});

export { POST };
