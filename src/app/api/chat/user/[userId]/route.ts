import { authorizeRequest } from '@/app/api/auth/service';
import { RequestError } from '@/app/api/helpers/requestError';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { prisma } from '@/app/api/lib/prisma';
import { NextResponse } from 'next/server';

const GET = requestHandler(async (req, data) => {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const userId = params.userId;

  const chat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      users: {
        every: {
          id: {
            in: [userId, sessionUser.id],
          },
        },
      },
    },
    include: {
      users: true,
    },
  });
  if (!chat) {
    throw new RequestError('Chat not found', 404);
  }

  return NextResponse.json(chat, { status: 200 });
});

export { GET };
