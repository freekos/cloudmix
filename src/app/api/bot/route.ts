import { NextResponse } from 'next/server';
import { authorizeRequest } from '../auth/auth.service';
import { BotType } from '../constants/botType';
import { getBody } from '../helpers/getBody';
import { requestHandler } from '../helpers/requestHandler';
import { coherePrompt, openaiPrompt } from './bot.service';
import { botDto } from './dto';

const POST = requestHandler(async (req) => {
  await authorizeRequest(req);
  const body = await getBody(req.body);
  const dto = await botDto.parseAsync(body);

  switch (dto.type) {
    case BotType.OPENAI:
      return openaiPrompt(dto.message);
    case BotType.COHERE:
      return coherePrompt(dto.message);
    default:
      return NextResponse.json({ error: 'Invalid bot type' }, { status: 400 });
  }
});

export { POST };
