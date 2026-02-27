import AnimatedCounter from './AnimatedCounter'

const StatCard = ({ icon, label, value, unit, helper }) => (
  <div className="card hover:-translate-y-0.5">
    <div className="mb-4 text-2xl">{icon}</div>
    <h4 className="text-sm text-slate-500 dark:text-slate-400">{label}</h4>
    <p className="mt-1 text-3xl font-bold">
      <AnimatedCounter value={value} /> {unit}
    </p>
    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
  </div>
)

export default StatCard
