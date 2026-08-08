import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import StudentDashboard from './pages/student/StudentDashboard'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'
import Profile from './pages/common/Profile'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/dashboard"
          element={
            <ProtectedRoute allowedRole="supervisor">
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App