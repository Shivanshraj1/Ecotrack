import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import AdminPage from './pages/AdminPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LogWastePage from './pages/LogWastePage'
import LoginPage from './pages/LoginPage'
import PickupsPage from './pages/PickupsPage'
import RegisterPage from './pages/RegisterPage'
import RewardsPage from './pages/RewardsPage'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  if (loading) return <LoadingSpinner />

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage darkMode={darkMode} toggleTheme={() => setDarkMode((prev) => !prev)} />} />
      <Route path="/log" element={<LogWastePage />} />
      <Route path="/pickups" element={<PickupsPage />} />
      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
