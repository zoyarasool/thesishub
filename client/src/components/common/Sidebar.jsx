import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
    <>
      {/* Top bar with hamburger — always visible */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <GraduationCap className="text-primary" size={18} />
          </div>
          <span className="text-base font-bold text-primary">ThesisHub</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <GraduationCap className="text-primary" size={20} />
            </div>
            <span className="text-lg font-bold text-primary">ThesisHub</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavLink to={dashboardPath} className={linkClass} onClick={() => setOpen(false)}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
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
    </>
  )
}