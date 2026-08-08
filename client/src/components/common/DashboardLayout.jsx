import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Topbar title={title} subtitle={subtitle} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-10 space-y-6">{children}</div>
    </div>
  )
}