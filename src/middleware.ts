import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	console.log(pathname, 'LOOOL')

	return NextResponse.next()
}
