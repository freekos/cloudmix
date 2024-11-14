import { NextResponse, userAgentFromString } from 'next/server';
import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { login } from '../auth.service';
import { loginDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await loginDto.parseAsync(body);
  const userAgent = userAgentFromString(
    req.headers.get('user-agent') as string,
  );
  console.log(`[LOGIN:DTO] ${dto}`);
  console.log('[LOGIN:USER-AGENT]', userAgent);

  const session = await login(dto, userAgent);

  return NextResponse.json(session, { status: 200 });
});

export { POST };
