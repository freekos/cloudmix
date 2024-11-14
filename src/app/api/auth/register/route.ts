import { NextRequest, NextResponse } from 'next/server';
import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { register } from '../auth.service';
import { registerDto } from './dto';

const POST = requestHandler(async function (req: NextRequest) {
  const body = await getBody(req.body);
  const dto = await registerDto.parseAsync(body);
  console.log(dto, `[REGISTER:DTO] ${dto}`);

  const user = await register(dto);

  return NextResponse.json(user, { status: 201 });
});

export { POST };
