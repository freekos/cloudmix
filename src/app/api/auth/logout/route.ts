import { NextResponse } from 'next/server';
import { requestHandler } from '../../helpers/requestHandler';
import { authorizeRequest, logout } from '../auth.service';

const POST = requestHandler(async (req) => {
  const { sessionUser } = await authorizeRequest(req);

  const session = await logout(sessionUser);

  return NextResponse.json(session, { status: 200 });
});

export { POST };
