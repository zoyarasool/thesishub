import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import NotificationBell from './NotificationBell'

export default function Topbar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between px-8 py-6">
      <div>
        {title && <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>}
        {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <NotificationBell />
      </div>
    </div>
  )
}