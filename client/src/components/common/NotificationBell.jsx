import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { getMyNotifications, markAsRead } from '../../services/notificationService'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications()
      setNotifications(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleOpen = async () => {
    setOpen(!open)
    const unread = notifications.filter((n) => !n.isRead)
    if (unread.length > 0) {
      await Promise.all(unread.map((n) => markAsRead(n._id)))
      fetchNotifications()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400 p-4 text-center">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="p-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                <p className="text-sm text-slate-700 dark:text-slate-200">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}