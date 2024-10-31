import { NextRequest, NextResponse } from 'next/server';
import { RequestError } from './requestError';

export function requestHandler(
  cb: (req: NextRequest, data: any) => Promise<NextResponse>,
) {
  return async function (req: NextRequest, data: any) {
    try {
      return await cb(req, data);
    } catch (error) {
      console.error(error);

      if (error instanceof RequestError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }

      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 },
      );
    }
  };
}
