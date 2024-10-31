import { NextResponse } from 'next/server';

import { getBody } from '@/app/api/helpers/getBody';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { redis } from '@/app/api/lib/redis';
import { disconnectDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await disconnectDto.parseAsync(body);
  console.log(dto, '[CHAT]: Websocket disconnected');

  await redis.del(`chat:${dto.connectionId}`);

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
});

export { POST };
