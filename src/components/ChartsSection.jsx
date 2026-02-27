import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const ChartsSection = ({ pieData, barData }) => (
  <section className="grid gap-6 lg:grid-cols-2">
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Waste Distribution</h3>
      <Pie data={pieData} />
    </div>
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold">Monthly Waste Logged</h3>
      <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
    </div>
  </section>
)

export default ChartsSection
