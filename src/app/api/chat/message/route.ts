import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/auth.service';
import { requestHandler } from '../../helpers/requestHandler';
import { getMessagesDto } from '../dto';
import { getMessages } from '../message.service';

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

  const messages = await getMessages(dto, sessionUser);

  return NextResponse.json(messages, { status: 200 });
});

export { GET };
