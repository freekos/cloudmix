import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/service';
import { requestHandler } from '../../helpers/requestHandler';
import { prisma } from '../../lib/prisma';

const GET = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);
  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  const usersWithoutPrivateChat = await prisma.user.findMany({
    where: {
      NOT: { id: sessionUser.id },
      chats: {
        none: {
          isGroup: false,
          users: {
            some: { id: sessionUser.id },
          },
        },
      },
      ...(search && {
        username: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    },
  });

  return NextResponse.json(usersWithoutPrivateChat, { status: 200 });
});

export { GET };
