export const dashboardStats = [
  { label: 'Total Waste Logged', value: 3280, unit: 'kg', icon: '♻️', helper: 'Across all categories' },
  { label: 'Eco Points Earned', value: 12450, unit: 'pts', icon: '🌱', helper: 'Team contribution score' },
  { label: 'CO₂ Saved', value: 987, unit: 'kg', icon: '🌍', helper: 'Estimated emissions avoided' },
  { label: 'Pickup Requests', value: 42, unit: '', icon: '🚛', helper: 'This month' },
]

export const wasteDistribution = {
  labels: ['Plastic', 'Paper', 'Wet', 'Metal'],
  datasets: [
    {
      label: 'Waste Distribution',
      data: [34, 28, 22, 16],
      backgroundColor: ['#16a34a', '#22c55e', '#86efac', '#14532d'],
      borderWidth: 0,
    },
  ],
}

export const monthlyWaste = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Waste Logged (kg)',
      data: [320, 410, 480, 530, 620, 710],
      backgroundColor: '#16a34a',
      borderRadius: 8,
      barThickness: 26,
    },
  ],
}

export const recentActivity = [
  { type: 'Plastic', weight: 15.2, points: 152, co2: 22, status: 'Pending' },
  { type: 'Paper', weight: 8.4, points: 84, co2: 12, status: 'Completed' },
  { type: 'Metal', weight: 4.1, points: 61, co2: 9, status: 'Completed' },
  { type: 'Wet', weight: 18.7, points: 94, co2: 17, status: 'Pending' },
]

export const pickupRequests = [
  { id: '#PK-1024', location: 'Downtown Hub', date: '2026-03-03', status: 'Pending' },
  { id: '#PK-1025', location: 'Green Residency', date: '2026-03-05', status: 'Scheduled' },
  { id: '#PK-1026', location: 'Tech Park Block C', date: '2026-03-06', status: 'Completed' },
]

export const leaderboard = [
  { name: 'Ava Green', points: 2120 },
  { name: 'Noah Recycle', points: 1980 },
  { name: 'Mia Earth', points: 1745 },
]

export const badges = ['Plastic Pro', 'Recycler Rookie', 'Carbon Saver']

export const adminMetrics = {
  users: 1240,
  wasteProcessed: 52300,
  co2Saved: 18500,
}

export const recyclerVerifications = [
  { name: 'Urban Cycle Ltd.', city: 'Austin', status: 'Approved' },
  { name: 'EcoRoute Services', city: 'Denver', status: 'Pending' },
  { name: 'GreenLoop Partners', city: 'Seattle', status: 'Approved' },
]
