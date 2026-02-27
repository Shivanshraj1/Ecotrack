import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import DashboardLayout from '../layouts/DashboardLayout'
import TopNavbar from '../components/TopNavbar'
import StatusBadge from '../components/StatusBadge'
import { adminMetrics, recyclerVerifications } from '../data/mockData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

const growthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{ label: 'Platform Growth', data: [120, 250, 420, 590, 760, 940], borderColor: '#16a34a', tension: 0.3 }],
}

const AdminPage = () => (
  <DashboardLayout>
    <TopNavbar title="Admin Panel" />
    <div className="grid gap-6 md:grid-cols-3">
      <div className="card"><p className="text-sm text-slate-500">Total Users</p><p className="text-3xl font-bold">{adminMetrics.users.toLocaleString()}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Total Waste Processed</p><p className="text-3xl font-bold">{adminMetrics.wasteProcessed.toLocaleString()} kg</p></div>
      <div className="card"><p className="text-sm text-slate-500">Total CO2 Saved</p><p className="text-3xl font-bold">{adminMetrics.co2Saved.toLocaleString()} kg</p></div>
    </div>

    <div className="card mt-6">
      <h3 className="mb-4 text-lg font-semibold">Platform Growth</h3>
      <Line data={growthData} />
    </div>

    <div className="card mt-6 overflow-x-auto">
      <h3 className="mb-4 text-lg font-semibold">Recycler Verification</h3>
      <table className="min-w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th className="pb-3">Recycler</th><th className="pb-3">City</th><th className="pb-3">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {recyclerVerifications.map((r) => (
            <tr key={r.name}><td className="py-3">{r.name}</td><td>{r.city}</td><td><StatusBadge status={r.status} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
)

export default AdminPage
