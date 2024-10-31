import { NextRequest } from 'next/server';
import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { register } from '../service';
import { registerDto } from './dto';

const POST = requestHandler(async function (req: NextRequest) {
  const body = await getBody(req.body);
  const dto = await registerDto.parseAsync(body);
  console.log(dto);

  return register(dto);
});

export { POST };
