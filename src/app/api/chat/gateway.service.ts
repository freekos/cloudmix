import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { User } from '@prisma/client';
import { ChatGatewayTopic } from '../constants/chatGateway';
import { RequestError } from '../helpers/requestError';
import { apiGatewayManagementClient } from '../lib/apiGatewayManagementClient';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { createPrivateMessage } from './message.service';

export async function connect(
  connectionId: string,
  payload: {
    sessionUser: User;
  },
) {
  await redis.set(`connection:${payload.sessionUser.id}`, connectionId);

  const userUpdatesSubscriberIds = await redis.smembers(
    `subscription:user:${payload.sessionUser.id}`,
  );

  _sendUserUpdatesSubscribers(userUpdatesSubscriberIds, true);
}

export async function disconnect(
  connectionId: string,
  payload: { sessionUser: User },
) {
  await redis.del(`connection:${payload.sessionUser.id}`);

  const userUpdatesSubscriberIds = await redis.smembers(
    `subscription:user:${payload.sessionUser.id}`,
  );

  _sendUserUpdatesSubscribers(userUpdatesSubscriberIds, false);
}

export async function sendTyping(
  connectionId: string,
  payload: {
    sessionUser: User;
    chatId: string;
    status: boolean;
  },
) {
  const chat = await prisma.chat.findUnique({
    where: { id: payload.chatId },
    include: {
      users: true,
    },
  });
  if (!chat) {
    throw new RequestError('Chat not found', 404);
  }

  const recipientUsers = await Promise.all(
    chat.users
      .filter((user) => user.id !== payload.sessionUser.id)
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
          status: payload.status,
        }),
      });
      await apiGatewayManagementClient.send(typingCommand);
    }),
  );
}

export async function sendPrivateMessage(
  connectionId: string,
  payload: {
    sessionUser: User;
    userId: string;
    content: string;
    tempId: string;
  },
) {
  const { chat, message, receipts } = await createPrivateMessage(
    payload.userId,
    payload.content,
    payload.sessionUser.id,
  );

  const sentMessageCommand = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: JSON.stringify({
      topic: ChatGatewayTopic.SENT_MESSAGE,
      chat,
      message: { ...message, receipts },
      tempId: payload.tempId,
    }),
  });
  await apiGatewayManagementClient.send(sentMessageCommand);

  const recipientUsers = await Promise.all(
    chat.users
      .filter((user) => user.id !== payload.sessionUser.id)
      .map(async (user) => {
        const connectionId = await redis.get(`connection:${user.id}`);
        return { ...user, connectionId };
      }),
  );

  await Promise.all(
    recipientUsers.map(async ({ connectionId }) => {
      if (!connectionId) {
        return;
      }

      const receivedMessageCommand = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          topic: ChatGatewayTopic.RECEIVED_MESSAGE,
          chat,
          message: { ...message, receipts },
        }),
      });
      await apiGatewayManagementClient.send(receivedMessageCommand);
    }),
  );
}

export async function subscribeUserUpdates() {}

export async function unsubscribeUserUpdates() {}

export async function updateMessageReceipt() {}

async function _sendUserUpdatesSubscribers(
  userUpdatesSubscriberIds: string[],
  status: boolean,
) {
  const userUpdatesSubscribers = await prisma.user.findMany({
    where: {
      id: {
        in: userUpdatesSubscriberIds,
      },
    },
  });
  const userUpdatesSubscribersWithConnectionId = await Promise.all(
    userUpdatesSubscribers.map(async (user) => {
      const connectionId = await redis.get(`connection:${user.id}`);
      return { ...user, connectionId };
    }),
  );

  await Promise.all(
    userUpdatesSubscribersWithConnectionId.map(
      async ({ connectionId, ...user }) => {
        if (!connectionId) {
          return;
        }

        const subscriberMessageCommand = new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({
            topic: ChatGatewayTopic.UPDATED_USER,
            user,
            status,
          }),
        });
        await apiGatewayManagementClient.send(subscriberMessageCommand);
      },
    ),
  );
}
