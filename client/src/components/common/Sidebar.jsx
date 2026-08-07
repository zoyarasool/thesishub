import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user?.role === 'student' ? '/student/dashboard' : '/supervisor/dashboard'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
    }`

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen flex flex-col sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GraduationCap className="text-primary" size={20} />
        </div>
        <span className="text-lg font-bold text-primary">ThesisHub</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        <NavLink to={dashboardPath} className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
            {user?.fullName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{user?.role} · {user?.department}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}