import { PropsWithChildren } from 'react'
import { ProtectedRouteClient } from './ProtectedRouteClient'

// export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
	return <ProtectedRouteClient>Layout\{children}</ProtectedRouteClient>
}
