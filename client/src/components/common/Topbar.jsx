import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import NotificationBell from './NotificationBell'

export default function Topbar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-5 md:py-6">
      <div className="min-w-0">
        {title && <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{title}</h1>}
        {subtitle && <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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