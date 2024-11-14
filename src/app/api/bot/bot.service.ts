import { NextResponse } from 'next/server';
import { cohere } from '../lib/cohere';
import { openai } from '../lib/openai';

export async function openaiPrompt(prompt: string) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stream = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        });
        for await (const chunk of stream) {
          controller.enqueue(chunk.choices[0]?.delta?.content || '');
        }
        controller.close();
      } catch (error) {
        console.log(error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream);
}

export async function coherePrompt(prompt: string) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const cohereStream = await cohere.chatStream({
          model: 'command-r-plus-08-2024',
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const chunk of cohereStream) {
          if (chunk.type === 'content-delta') {
            const content = chunk.delta?.message?.content?.text;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        }
        controller.close();
      } catch (error) {
        console.error(error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
