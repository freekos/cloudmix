import { NextResponse } from 'next/server';

import { getBody } from '@/app/api/helpers/getBody';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { connectDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await connectDto.parseAsync(body);
  console.log(dto, '[CHAT]: Websocket connected');

  return NextResponse.json(null, { status: 200 });
});

export { POST };
