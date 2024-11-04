import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/service';
import { requestHandler } from '../../helpers/requestHandler';
import { prisma } from '../../lib/prisma';
import { getMessagesDto } from './dto';

const GET = requestHandler(async (req) => {
  const { sessionUser } = await authorizeRequest(req);

  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const status = req.nextUrl.searchParams.get('status') ?? undefined;
  const orderBy = req.nextUrl.searchParams.get('orderBy') ?? 'desc';

  const params = {
    search,
    status,
    orderBy,
  };
  const dto = await getMessagesDto.parseAsync(params);

  const whereConditions: any = {
    AND: [
      {
        chat: {
          users: {
            some: {
              id: sessionUser.id,
            },
          },
        },
      },
      { senderId: { not: sessionUser.id } },
      {
        OR: [
          {
            receipts: {
              none: {
                userId: sessionUser.id,
              },
            },
          },
        ],
      },
    ],
  };

  if (dto.search) {
    whereConditions.AND.push({
      content: {
        contains: dto.search,
        mode: 'insensitive',
      },
    });
  }

  if (dto.status) {
    whereConditions.AND[2].OR.push({
      receipts: {
        some: {
          userId: sessionUser.id,
          status: dto.status,
        },
      },
    });
  }

  const messages = await prisma.message.findMany({
    where: whereConditions,
    orderBy: {
      createdAt: dto.orderBy,
    },
    include: {
      sender: true,
      chat: true,
      receipts: {
        where: {
          userId: sessionUser.id,
        },
      },
    },
  });

  return NextResponse.json(messages, { status: 200 });
});

export { GET };
