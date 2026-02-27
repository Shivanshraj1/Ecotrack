import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import TopNavbar from '../components/TopNavbar'

const types = ['Plastic', 'Paper', 'Wet', 'Metal']

const LogWastePage = () => {
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const predicted = types[Math.floor(Math.random() * types.length)]
    const w = Number(weight || 0)
    setResult({
      predicted,
      points: Math.round(w * 10),
      co2: (w * 1.4).toFixed(1),
    })
  }

  return (
    <DashboardLayout>
      <TopNavbar title="Log Waste" />
      <form onSubmit={onSubmit} className="card max-w-2xl space-y-4">
        <input className="input" type="file" accept="image/*" />
        <input className="input" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight (kg)" />
        <button className="btn-primary">Submit</button>
      </form>

      {result && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-slate-500">Predicted Type</p><p className="text-2xl font-bold">{result.predicted}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Points Earned</p><p className="text-2xl font-bold">{result.points}</p></div>
          <div className="card"><p className="text-sm text-slate-500">CO2 Saved</p><p className="text-2xl font-bold">{result.co2} kg</p></div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default LogWastePage
