import { Link } from 'react-router-dom'

const features = [
  'AI-powered waste classification',
  'Eco points and sustainability rewards',
  'Real-time environmental impact tracking',
  'Recycler integration and pickup automation',
]

const steps = ['Log waste with image + weight', 'AI predicts type and impact', 'Schedule recycler pickup', 'Track points and progress']

const LandingPage = () => (
  <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">AI Sustainability Platform</p>
      <h1 className="text-5xl font-extrabold">Turn Waste into Measurable Impact</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">EcoTrack helps businesses and communities classify waste, automate recycling workflows, and quantify climate impact in one production-ready dashboard.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link className="btn-primary" to="/register">Get Started</Link>
        <Link className="btn-secondary" to="/login">Login</Link>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
      {features.map((feature) => (
        <article key={feature} className="card bg-panel dark:bg-slate-900">
          <h3 className="font-semibold">{feature}</h3>
        </article>
      ))}
    </section>

    <section className="mx-auto max-w-6xl px-6 pb-20">
      <h2 className="mb-6 text-2xl font-bold">How It Works</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step, idx) => (
          <div key={step} className="card">
            <p className="text-sm font-semibold text-brand">Step {idx + 1}</p>
            <p className="mt-2 font-medium">{step}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="border-t border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800">© {new Date().getFullYear()} EcoTrack. Built for sustainable operations.</footer>
  </div>
)

export default LandingPage
