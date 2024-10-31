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

  await prisma.chat.create({
    data: {
      isGroup: dto.isGroup,
      name: dto.name,
      users: {
        connect: [...dto.usersIds, sessionUser.id].map((id) => ({ id })),
      },
    },
  });

  return NextResponse.json(null, { status: 201 });
});

const GET = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);
  const page = req.nextUrl.searchParams.get('page') ?? '1';
  const limit = req.nextUrl.searchParams.get('limit') ?? '10';
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const isGroup = req.nextUrl.searchParams.get('isGroup') ?? undefined;
  const orderBy = req.nextUrl.searchParams.get('orderBy') ?? undefined;
  const params = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    isGroup,
    orderBy,
  };
  console.log(params);

  const dto = await getChatsDto.parseAsync(params);

  const searchCondition = dto.search
    ? {
        name: {
          contains: dto.search,
          mode: 'insensitive',
        },
      }
    : {};

  // const chatTypeCondition =
  // 	typeof dto.isGroup === 'boolean' ? { isGroup: dto.isGroup } : {}

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: { id: sessionUser.id },
      },
      // ...searchCondition,
      // ...chatTypeCondition,
    },
    take: dto.limit,
    skip: dto.limit * (dto.page - 1),
    orderBy: { createdAt: dto.orderBy || 'desc' },
    include: {
      users: true,
    },
  });

  return NextResponse.json(chats, { status: 200 });
});

export { GET, POST };
