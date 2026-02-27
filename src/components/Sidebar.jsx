import { Link, NavLink } from 'react-router-dom'

const Sidebar = ({ isAdmin = true }) => {
  const navClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <Link to="/dashboard" className="mb-8 block text-2xl font-extrabold text-brand">ECOTRACK</Link>
      <nav className="space-y-2">
        <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>
        <NavLink className={navClass} to="/log">Log Waste</NavLink>
        <NavLink className={navClass} to="/pickups">Pickups</NavLink>
        <NavLink className={navClass} to="/rewards">Rewards</NavLink>
        {isAdmin && <NavLink className={navClass} to="/admin">Admin</NavLink>}
        <NavLink className={navClass} to="/login">Logout</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
