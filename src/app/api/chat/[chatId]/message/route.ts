import { authorizeRequest } from '@/app/api/auth/auth.service';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { prisma } from '@/app/api/lib/prisma';
import { NextResponse } from 'next/server';
import { getMessagesDto } from './dto';

const GET = requestHandler(async function (req, data) {
  const { sessionUser } = await authorizeRequest(req);

  const params = await data.params;
  const chatId = params.chatId as string;
  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  const searchParams = {
    search,
  };
  const dto = await getMessagesDto.parseAsync(searchParams);

  const whereConditions: any = {
    chatId: chatId,
    chat: {
      users: {
        some: {
          id: sessionUser.id,
        },
      },
    },
  };

  if (dto.search) {
    whereConditions.content = {
      contains: dto.search,
      mode: 'insensitive',
    };
  }

  const messages = await prisma.message.findMany({
    where: whereConditions,
    include: {
      sender: true,
      receipts: true,
    },
  });

  return NextResponse.json(messages, { status: 200 });
});

export { GET };
