import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { login } from '../service';
import { loginDto } from './dto';

const POST = requestHandler(async function (req) {
  const body = await getBody(req.body);
  const dto = await loginDto.parseAsync(body);

  return login(req, dto);
});

export { POST };
