import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/service';
import { RequestError } from '../../helpers/requestError';
import { requestHandler } from '../../helpers/requestHandler';
import { prisma } from '../../lib/prisma';

const GET = requestHandler(async (req, data) => {
  await authorizeRequest(req);
  const params = await data.params;
  const userId = params.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new RequestError('User not found', 404);
  }

  return NextResponse.json(user, { status: 200 });
});

export { GET };
