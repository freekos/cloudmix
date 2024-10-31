import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/service';
import { RequestError } from '../../helpers/requestError';
import { requestHandler } from '../../helpers/requestHandler';
import { prisma } from '../../lib/prisma';

const DELETE = requestHandler(async function (req, data) {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const chatId = parseInt(params.chatId);

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      users: {
        some: {
          id: sessionUser.id,
        },
      },
    },
  });
  if (!chat) {
    throw new RequestError('Chat not found', 404);
  }

  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  return NextResponse.json(null, { status: 200 });
});

const GET = requestHandler(async function (req, data) {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const chatId = parseInt(params.chatId);

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      users: {
        some: {
          id: sessionUser.id,
        },
      },
    },
    include: {
      users: true,
      messages: true,
    },
  });
  if (!chat) {
    throw new RequestError('Chat not found', 404);
  }

  return NextResponse.json(chat, { status: 200 });
});

export { DELETE, GET };
