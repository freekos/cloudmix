import { requestHandler } from '../../helpers/requestHandler';
import { authorizeRequest, logout } from '../service';

const POST = requestHandler(async (req) => {
  const { sessionUser } = await authorizeRequest(req);

  return logout(sessionUser);
});

export { POST };
