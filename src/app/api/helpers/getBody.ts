/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getBody(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(buffer);
}
