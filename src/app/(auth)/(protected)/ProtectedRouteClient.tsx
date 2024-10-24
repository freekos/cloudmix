'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

export const ProtectedRouteClient = ({ children }: PropsWithChildren) => {
	const session = useSession()
	const router = useRouter()
	console.log(session, 'P-ROUTE')

	useEffect(() => {
		if (!!session.data?.user) return
		router.push('/auth/signin')
	}, [session?.data?.user])

	if (!session?.data?.user) {
		return null
	}

	return <>{children}</>
}
