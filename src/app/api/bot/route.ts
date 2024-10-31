import { NextResponse } from 'next/server';
import { authorizeRequest } from '../auth/service';
import { BotTypes } from '../constants/botTypes';
import { getBody } from '../helpers/getBody';
import { requestHandler } from '../helpers/requestHandler';
import { botDto } from './dto';
import { coherePrompt, openaiPrompt } from './service';

const POST = requestHandler(async function (req) {
  await authorizeRequest(req);
  const body = await getBody(req.body);
  const dto = await botDto.parseAsync(body);

  switch (dto.type) {
    case BotTypes.OPENAI:
      return openaiPrompt(dto.message);
    case BotTypes.COHERE:
      return coherePrompt(dto.message);
    default:
      return NextResponse.json({ error: 'Invalid bot type' }, { status: 400 });
  }
});

export { POST };
