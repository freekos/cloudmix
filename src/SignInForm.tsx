/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { signIn, useSession } from 'next-auth/react'

export const SignInForm = () => {
	const session = useSession()
	console.log(session)

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		try {
			const res = await signIn('credentials', {
				email: 'test@example.com',
				password: 'secret',
				redirect: false,
			})
			console.log(res)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input />
			<input />
			<button type='submit'>Login</button>
		</form>
	)
}
