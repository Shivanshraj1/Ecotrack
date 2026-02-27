import Sidebar from '../components/Sidebar'

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    <Sidebar />
    <main className="ml-64 p-6">{children}</main>
  </div>
)

export default DashboardLayout
