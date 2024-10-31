import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { refreshTokens } from '../service';
import { refreshTokenDto } from './dto';

const POST = requestHandler(async (req) => {
  const body = await getBody(req.body);
  const dto = await refreshTokenDto.parseAsync(body);

  return refreshTokens(req, dto);
});

export { POST };
