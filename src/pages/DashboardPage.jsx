import ChartsSection from '../components/ChartsSection'
import RecentActivityTable from '../components/RecentActivityTable'
import StatCard from '../components/StatCard'
import TopNavbar from '../components/TopNavbar'
import DashboardLayout from '../layouts/DashboardLayout'
import { dashboardStats, monthlyWaste, recentActivity, wasteDistribution } from '../data/mockData'

const DashboardPage = ({ toggleTheme, darkMode }) => (
  <DashboardLayout>
    <TopNavbar title="Dashboard">
      <button className="btn-secondary text-sm" onClick={toggleTheme}>{darkMode ? 'Light' : 'Dark'}</button>
    </TopNavbar>

    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
    </section>

    <div className="mt-6">
      <ChartsSection pieData={wasteDistribution} barData={monthlyWaste} />
    </div>

    <div className="mt-6">
      <RecentActivityTable rows={recentActivity} />
    </div>
  </DashboardLayout>
)

export default DashboardPage
