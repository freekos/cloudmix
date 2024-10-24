export default async function TodoDetail() {
	const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
		cache: 'no-store',
	})
	const data = await res.json()
	await new Promise(resolve => setTimeout(resolve, 2000))
	console.log(data)

	return (
		<div>
			<h1>SSR (Server-Side Rendering)</h1>
			<p>{data.title}</p>
			<p>{data.body}</p>
		</div>
	)
}
