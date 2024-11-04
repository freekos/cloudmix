import { authorizeRequest } from '@/app/api/auth/service';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { prisma } from '@/app/api/lib/prisma';
import { NextResponse } from 'next/server';
import { getMessagesDto } from './dto';

const GET = requestHandler(async function (req, data) {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const chatId = params.chatId;
  // const page = req.nextUrl.searchParams.get('page') ?? '1';
  // const limit = req.nextUrl.searchParams.get('limit') ?? '10';
  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  const searchParams = {
    // page: parseInt(page),
    // limit: parseInt(limit),
    search,
  };
  console.log(searchParams);

  const dto = await getMessagesDto.parseAsync(searchParams);

  const messages = await prisma.message.findMany({
    where: {
      chatId: chatId,
      chat: {
        users: {
          some: {
            id: sessionUser.id,
          },
        },
      },
      ...(dto.search && {
        content: {
          contains: dto.search,
          mode: 'insensitive',
        },
      }),
    },
    include: {
      sender: true,
      receipts: true,
    },
  });

  return NextResponse.json(messages, { status: 200 });
});

export { GET };
