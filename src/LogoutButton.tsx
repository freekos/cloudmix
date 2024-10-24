'use client'
import { signOut, useSession } from 'next-auth/react'

export const LogoutButton = () => {
	const session = useSession()
	console.log(session)

	const handleLogout = async () => {
		try {
			await signOut({ redirect: false })
		} catch (error) {
			console.log(error)
		}
	}
	return <button onClick={handleLogout}>Logout</button>
}
