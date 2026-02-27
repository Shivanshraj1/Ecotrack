import DashboardLayout from '../layouts/DashboardLayout'
import EmptyState from '../components/EmptyState'
import TopNavbar from '../components/TopNavbar'
import { badges, leaderboard } from '../data/mockData'

const RewardsPage = () => {
  const total = 12450
  const toward = 75

  return (
    <DashboardLayout>
      <TopNavbar title="Rewards" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <p className="text-sm text-slate-500">Total Eco Points</p>
          <p className="mt-2 text-3xl font-bold">{total.toLocaleString()} pts</p>
          <div className="mt-5 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
            <div style={{ width: `${toward}%` }} className="h-3 rounded-full bg-brand" />
          </div>
          <p className="mt-2 text-xs text-slate-500">{toward}% toward next reward tier</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Badges Earned</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {badges.map((b) => <li key={b} className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">{b}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="mb-4 text-lg font-semibold">Leaderboard</h3>
        {leaderboard.length ? (
          <ul className="space-y-2">
            {leaderboard.map((u, i) => <li key={u.name} className="flex justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-800"><span>{i + 1}. {u.name}</span><strong>{u.points} pts</strong></li>)}
          </ul>
        ) : (
          <EmptyState title="No leaderboard data" description="Complete your first activity to appear here." />
        )}
      </div>
    </DashboardLayout>
  )
}

export default RewardsPage
