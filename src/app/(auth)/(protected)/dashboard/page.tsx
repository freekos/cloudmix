import RouteButton from '@/RouteButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
	return (
		<div>
			Dashboard
			<RouteButton path='/'>Home</RouteButton>
		</div>
	)
}
