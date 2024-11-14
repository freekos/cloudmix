import { authorizeRequest } from '@/app/api/auth/auth.service';
import { getBody } from '@/app/api/helpers/getBody';
import { requestHandler } from '@/app/api/helpers/requestHandler';
import { NextResponse } from 'next/server';
import { updateMessageDto } from '../../dto';
import { deleteMessage, updateMessage } from '../../message.service';

const PATCH = requestHandler(async (req, data) => {
  await authorizeRequest(req);

  const params = await data.params;
  const messageId = params.messageId;

  const body = await getBody(req.body);
  const dto = await updateMessageDto.parseAsync(body);

  const updatedMessage = await updateMessage(dto, messageId);

  return NextResponse.json(updatedMessage, { status: 200 });
});

const DELETE = requestHandler(async (req, data) => {
  await authorizeRequest(req);

  const params = await data.params;
  const messageId = params.messageId;

  const deletedMessage = await deleteMessage(messageId);

  return NextResponse.json(deletedMessage, { status: 200 });
});

export { DELETE, PATCH };
