/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				console.log(credentials, 'MEEEM')
				if (
					credentials?.email === 'test@example.com' &&
					credentials?.password === 'secret'
				) {
					return {
						id: 1,
						name: 'Test User',
						email: credentials.email,
						image: '',
					} as any
				}

				return null
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token }) {
			return token
		},
		async session({ session }) {
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
}
