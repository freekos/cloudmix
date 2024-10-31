import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/app/api/auth/service';
import { getBody } from '@/app/api/helpers/getBody';
import { RequestError } from '@/app/api/helpers/requestError';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { prisma } from '@/app/api/lib/prisma';
import { updateMessageDto } from './dto';

const PATCH = requestHandler(async (req, data) => {
  const { sessionUser } = await authorizeRequest(req);

  const body = await getBody(req.body);
  const dto = await updateMessageDto.parseAsync(body);

  const params = await data.params;
  const chatId = parseInt(params.chatId);
  const messageId = parseInt(params.messageId);
  console.log(chatId, messageId);

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      chatId,
      senderId: sessionUser.id,
    },
  });
  if (!message) {
    throw new RequestError('Message not found', 404);
  }

  await prisma.message.update({
    where: {
      id: messageId,
      chatId,
      senderId: sessionUser.id,
    },
    data: {
      content: dto.content,
    },
  });

  return NextResponse.json(null, { status: 200 });
});

const DELETE = requestHandler(async (req, data) => {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const chatId = parseInt(params.chatId);
  const messageId = parseInt(params.messageId);

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      chatId,
      senderId: sessionUser.id,
    },
  });
  if (!message) {
    throw new RequestError('Message not found', 404);
  }

  await prisma.message.delete({
    where: {
      id: messageId,
      chatId,
      senderId: sessionUser.id,
    },
  });

  return NextResponse.json(null, { status: 200 });
});

export { DELETE, PATCH };
