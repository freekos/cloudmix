import { getSession } from '@/getSession'
import { Providers } from '@/providers/Providers'
import { PropsWithChildren } from 'react'

export default async function AuthLayout({ children }: PropsWithChildren) {
	const session = await getSession()

	return <Providers session={session}>{children}</Providers>
}
