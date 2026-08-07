import { useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, Sun, Moon, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GraduationCap className="text-primary" size={20} />
        </div>
        <span className="text-lg font-bold text-primary">ThesisHub</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <NotificationBell />
        <button
          onClick={() => navigate('/profile')}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
          title="Account Settings"
        >
          <Settings size={18} />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user?.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} · {user?.department}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}