import { NextResponse, userAgentFromString } from 'next/server';
import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { refreshTokens } from '../auth.service';
import { refreshTokenDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await refreshTokenDto.parseAsync(body);
  const userAgent = userAgentFromString(
    req.headers.get('user-agent') as string,
  );
  console.log(`[REFRESH-TOKEN:DTO] ${dto}`);
  console.log('[REFRESH-TOKEN:USER-AGENT]', userAgent);

  const session = await refreshTokens(dto, userAgent);

  return NextResponse.json(session, { status: 200 });
});

export { POST };
