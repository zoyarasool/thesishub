import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        <div className="max-w-4xl mx-auto px-8 pb-10 space-y-6">{children}</div>
      </div>
    </div>
  )
}