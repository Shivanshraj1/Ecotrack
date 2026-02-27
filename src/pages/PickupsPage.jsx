import DashboardLayout from '../layouts/DashboardLayout'
import TopNavbar from '../components/TopNavbar'
import StatusBadge from '../components/StatusBadge'
import { pickupRequests } from '../data/mockData'

const PickupsPage = () => (
  <DashboardLayout>
    <TopNavbar title="Pickups" />
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th className="pb-3">Request</th><th className="pb-3">Location</th><th className="pb-3">Schedule Date</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {pickupRequests.map((p) => (
            <tr key={p.id}>
              <td className="py-3">{p.id}</td>
              <td>{p.location}</td>
              <td>{p.date}</td>
              <td><StatusBadge status={p.status} /></td>
              <td><button className="btn-secondary py-1.5">Confirm Pickup</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
)

export default PickupsPage
