import { LogoutButton } from '@/LogoutButton'
import RouteButton from '@/RouteButton'

export const dynamic = 'force-dynamic'

export default async function Home() {
	// const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
	// const data = await res.json()
	// await new Promise(resolve => setTimeout(resolve, 2000))
	// console.log(data)

	return (
		<div>
			<h1>SSR (Server-Side Rendering)</h1>
			<RouteButton path='/dashboard'>Dashboard</RouteButton>
			<LogoutButton />
			{/* <p>{data.title}</p>
			<p>{data.body}</p> */}
			{/* <Suspense fallback={<div>Loading...</div>}>
				<TodoDetail />
			</Suspense> */}
		</div>
	)
}
