import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '../auth/auth.service';
import { requestHandler } from '../helpers/requestHandler';
import { getUsersWithoutMe } from './user.service';

const GET = requestHandler(async (req: NextRequest) => {
  const { sessionUser } = await authorizeRequest(req);

  const users = await getUsersWithoutMe(sessionUser);

  return NextResponse.json(users, { status: 200 });
});

export { GET };
