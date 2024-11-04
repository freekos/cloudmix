import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { NextResponse } from 'next/server';

import { authorizeByToken } from '../../auth/service';
import { MessageStatus } from '../../constants/messageStatus';
import { getBody } from '../../helpers/getBody';
import { RequestError } from '../../helpers/requestError';
import { requestHandler } from '../../helpers/requestHandler';
import { apiGatewayManagementClient } from '../../lib/apiGatewayManagementClient';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { defaultDto } from './dto';

enum ChatGatewayAction {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SEND_TYPING = 'sendTyping',
  SEND_MESSAGE = 'sendMessage',
  // UPDATE_MESSAGE = 'updateMessage',
  // DELETE_MESSAGE = 'deleteMessage',
  SUBSCRIBE_USER_UPDATES = 'subscribeUserUpdates',
  UNSUBSCRIBE_USER_UPDATES = 'unsubscribeUserUpdates',
  UPDATE_MESSAGE_RECEIPT = 'updateMessageReceipt',
}
enum ChatGatewayTopic {
  TYPING = 'typing',
  RECEIVED_MESSAGE = 'receivedMessage',
  SENT_MESSAGE = 'sentMessage',
  UPDATED_USER = 'updatedUser',
  UPDATED_MESSAGE_RECEIPT = 'updatedMessageReceipt',
}

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await defaultDto.parseAsync(body);
  console.log(dto, 'CHAT');

  const { sessionUser } = await authorizeByToken(dto.payload.token);
  const userId = sessionUser.id;

  switch (dto.payload.action) {
    case ChatGatewayAction.CONNECT: {
      await redis.set(`connection:${userId}`, dto.connectionId);
      const userUpdatesSubscribers = await redis.smembers(
        `subscription:user:${userId}`,
      );

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userUpdatesSubscribers,
          },
        },
      });
      const subscriberUsers = await Promise.all(
        users.map(async (user) => {
          const connectionId = await redis.get(`connection:${user.id}`);
          return { ...user, connectionId };
        }),
      );

      await Promise.all(
        subscriberUsers.map(async ({ connectionId, ...user }) => {
          if (!connectionId) {
            return;
          }

          const subscriberMessageCommand = new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              topic: ChatGatewayTopic.UPDATED_USER,
              user,
              status: true,
            }),
          });
          await apiGatewayManagementClient.send(subscriberMessageCommand);
        }),
      );
      break;
    }
    case ChatGatewayAction.DISCONNECT: {
      await redis.del(`connection:${userId}`);

      const userUpdatesSubscribers = await redis.smembers(
        `subscription:user:${userId}`,
      );

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userUpdatesSubscribers,
          },
        },
      });
      const subscriberUsers = await Promise.all(
        users.map(async (user) => {
          const connectionId = await redis.get(`connection:${user.id}`);
          return { ...user, connectionId };
        }),
      );

      await Promise.all(
        subscriberUsers.map(async ({ connectionId, ...user }) => {
          if (!connectionId) {
            return;
          }

          const subscriberMessageCommand = new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              topic: ChatGatewayTopic.UPDATED_USER,
              user,
              status: false,
            }),
          });
          await apiGatewayManagementClient.send(subscriberMessageCommand);
        }),
      );
      break;
    }
    case ChatGatewayAction.SEND_TYPING: {
      const { chatId, status } = dto.payload;

      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          users: true,
        },
      });
      if (!chat) {
        throw new RequestError('Chat not found', 404);
      }

      const recipientUsers = await Promise.all(
        chat.users
          .filter((user) => user.id !== userId)
          .map(async (user) => {
            const connectionId = await redis.get(`connection:${user.id}`);
            return { ...user, connectionId };
          }),
      );

      await Promise.all(
        recipientUsers.map(async ({ connectionId, ...user }) => {
          if (!connectionId) {
            return;
          }

          const typingCommand = new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              topic: ChatGatewayTopic.TYPING,
              chat,
              user,
              status,
            }),
          });
          await apiGatewayManagementClient.send(typingCommand);
        }),
      );

      break;
    }
    case ChatGatewayAction.SEND_MESSAGE: {
      try {
        const { chatId, tempId, content } = dto.payload;
        const senderId = userId;

        const chat = await prisma.chat.findUnique({
          where: { id: chatId },
          include: {
            users: true,
          },
        });
        if (!chat) {
          throw new RequestError('Chat not found', 404);
        }

        const recipientMessage = await prisma.message.create({
          data: {
            chatId: chat.id,
            senderId,
            content,
          },
        });

        await prisma.messageReceipt.createMany({
          data: chat.users
            .filter((user) => user.id !== senderId)
            .map((user) => ({
              messageId: recipientMessage.id,
              userId: user.id,
              status: MessageStatus.SENT,
            })),
        });

        const receipts = await prisma.messageReceipt.findMany({
          where: {
            messageId: recipientMessage.id,
          },
        });

        const sentMessageCommand = new PostToConnectionCommand({
          ConnectionId: dto.connectionId,
          Data: JSON.stringify({
            topic: ChatGatewayTopic.SENT_MESSAGE,
            chat,
            message: { ...recipientMessage, receipts },
            tempId,
          }),
        });
        await apiGatewayManagementClient.send(sentMessageCommand);

        const recipientUsers = await Promise.all(
          chat.users
            .filter((user) => user.id !== senderId)
            .map(async (user) => {
              const connectionId = await redis.get(`connection:${user.id}`);
              return { ...user, connectionId };
            }),
        );

        await Promise.all(
          recipientUsers.map(async ({ connectionId, ...user }) => {
            if (!connectionId) {
              return;
            }

            const receivedMessageCommand = new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: JSON.stringify({
                topic: ChatGatewayTopic.RECEIVED_MESSAGE,
                chat,
                message: { ...recipientMessage, receipts },
              }),
            });
            await apiGatewayManagementClient.send(receivedMessageCommand);
          }),
        );
      } catch (error) {
        console.log(error);
      }

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
