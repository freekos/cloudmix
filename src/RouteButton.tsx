'use client'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

interface RouteButtonProps extends PropsWithChildren {
	path: string
}

export default function RouteButton({ children, path }: RouteButtonProps) {
	const router = useRouter()

	return <button onClick={() => router.push(path)}>{children}</button>
}
