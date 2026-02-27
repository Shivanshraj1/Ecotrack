const tones = {
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-green-100 text-green-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
}

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status] ?? 'bg-slate-100 text-slate-700'}`}>
    {status}
  </span>
)

export default StatusBadge
