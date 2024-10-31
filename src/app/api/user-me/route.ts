import { NextRequest, NextResponse } from 'next/server';

import { authorizeRequest } from '../auth/service';
import { getBody } from '../helpers/getBody';
import { getHashedPassword } from '../helpers/getHashedPassword';
import { RequestError } from '../helpers/requestError';
import { requestHandler } from '../helpers/requestHandler';
import { prisma } from '../lib/prisma';
import { updateUserDto } from './dto';

const PATCH = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);

  const body = await getBody(req.body);
  const dto = await updateUserDto.parseAsync(body);

  let hashedPassword;
  if (dto.password) {
    hashedPassword = await getHashedPassword(dto.password);
  }
  const updatedUser = await prisma.user.update({
    where: sessionUser,
    data: {
      username: dto.username,
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
});

const DELETE = requestHandler(async function (req: NextRequest) {
  const { sessionUser } = await authorizeRequest(req);

  await prisma.user.delete({
    where: sessionUser,
  });

  return NextResponse.json(null, { status: 200 });
});

const GET = requestHandler(async function (req: NextRequest) {
  const { sessionUser } = await authorizeRequest(req);

  const user = await prisma.user.findUnique({
    where: sessionUser,
  });
  if (!user) {
    throw new RequestError('User not found', 404);
  }

  return NextResponse.json(user, { status: 200 });
});

export { DELETE, GET, PATCH };
