import { NextResponse } from 'next/server';
import { authorizeRequest } from '../../auth/auth.service';
import { getBody } from '../../helpers/getBody';
import { requestHandler } from '../../helpers/requestHandler';
import { updateUserDto } from '../dto';
import { deleteUser, updateUser } from '../user.service';

const PATCH = requestHandler(async (req) => {
  const { sessionUser } = await authorizeRequest(req);

  const body = await getBody(req.body);
  const dto = await updateUserDto.parseAsync(body);
  console.log('[USER]/[ME]', dto);

  const updatedUser = await updateUser(dto, sessionUser.id);

  return NextResponse.json(updatedUser, { status: 200 });
});

const DELETE = requestHandler(async (req) => {
  const { sessionUser } = await authorizeRequest(req);

  const deletedUser = await deleteUser(sessionUser.id);

  return NextResponse.json(deletedUser, { status: 200 });
});

export { DELETE, PATCH };
