import { NextResponse } from 'next/server';
import { authorizeRequest } from '../auth/service';
import { getBody } from '../helpers/getBody';
import { requestHandler } from '../helpers/requestHandler';
import { prisma } from '../lib/prisma';
import { createChatDto, getChatsDto } from './dto';

const POST = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);

  const body = await getBody(req.body);
  const dto = await createChatDto.parseAsync(body);
  console.log(dto, '[CHAT]: Create chat');

  const newChat = await prisma.chat.create({
    data: {
      isGroup: dto.isGroup,
      name: dto.name,
      users: {
        connect: [...dto.usersIds, sessionUser.id].map((id) => ({ id })),
      },
    },
  });

  return NextResponse.json(newChat, { status: 201 });
});

const GET = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const isGroup = req.nextUrl.searchParams.get('isGroup') ?? undefined;
  const orderBy = req.nextUrl.searchParams.get('orderBy') ?? undefined;

  const params = {
    search,
    isGroup,
    orderBy,
  };

  const dto = await getChatsDto.parseAsync(params);

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: { id: sessionUser.id },
      },
      ...(dto.isGroup !== undefined && { isGroup: dto.isGroup }),
      ...(dto.search && {
        name: {
          contains: dto.search,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: { createdAt: dto.orderBy },
    include: {
      users: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          receipts: {
            where: {
              userId: sessionUser.id,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(chats, { status: 200 });
});

export { GET, POST };
