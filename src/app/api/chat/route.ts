import { NextResponse } from 'next/server';
import { authorizeRequest } from '../auth/auth.service';
import { requestHandler } from '../helpers/requestHandler';
import { getChats } from './chat.service';
import { getChatsDto } from './dto';

const GET = requestHandler(async function (req) {
  const { sessionUser } = await authorizeRequest(req);
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const type = req.nextUrl.searchParams.get('type') ?? undefined;
  const orderBy = req.nextUrl.searchParams.get('orderBy') ?? undefined;
  const params = {
    search,
    type,
    orderBy,
  };
  const dto = await getChatsDto.parseAsync(params);
  console.log('[CHATS]', dto);

  const chats = await getChats(dto, sessionUser);

  return NextResponse.json(chats, { status: 200 });
});

export { GET };
