import StatusBadge from './StatusBadge'

const RecentActivityTable = ({ rows }) => (
  <div className="card overflow-x-auto">
    <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
    <table className="min-w-full text-left text-sm">
      <thead className="text-slate-500">
        <tr>
          <th className="pb-3">Waste Type</th>
          <th className="pb-3">Weight (kg)</th>
          <th className="pb-3">Points Earned</th>
          <th className="pb-3">CO2 Saved</th>
          <th className="pb-3">Pickup Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((row, idx) => (
          <tr key={`${row.type}-${idx}`}>
            <td className="py-3">{row.type}</td>
            <td>{row.weight}</td>
            <td>{row.points}</td>
            <td>{row.co2} kg</td>
            <td><StatusBadge status={row.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default RecentActivityTable
