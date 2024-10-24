'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

interface ProvidersProps extends PropsWithChildren {
	session: Session | null
}

export const Providers = ({ children, session }: ProvidersProps) => {
	return <SessionProvider session={session}>{children}</SessionProvider>
}
