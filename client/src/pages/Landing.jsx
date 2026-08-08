import { Link } from 'react-router-dom'
import { GraduationCap, Users, ListChecks, FileText, Calendar, Bell, ArrowRight } from 'lucide-react'

const features = [
  { icon: Users, title: 'Supervisor Matching', desc: 'Find and connect with supervisors based on department and research interests.' },
  { icon: ListChecks, title: 'Milestone Tracking', desc: 'Track thesis progress with clear, structured milestones.' },
  { icon: FileText, title: 'Document Sharing', desc: 'Submit and review thesis documents in one place.' },
  { icon: Calendar, title: 'Meeting Scheduling', desc: 'Schedule and keep a history of supervision meetings.' },
  { icon: Bell, title: 'Real-time Notifications', desc: 'Stay updated on request approvals and important changes.' },
  { icon: GraduationCap, title: 'Built for Academia', desc: 'Designed specifically for thesis and research supervision workflows.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <GraduationCap className="text-primary" size={20} />
          </div>
          <span className="text-lg font-bold text-primary">ThesisHub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20 md:py-28">
       <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
  Bridging <span className="text-primary">students</span> and <span className="text-primary">supervisors</span>.
</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-5 max-w-2xl mx-auto">
          ThesisHub connects students with faculty supervisors and brings proposals, milestones,
          documents, and meetings together in one place.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="text-slate-600 dark:text-slate-300 font-medium px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
            >
              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="text-primary" size={20} />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-slate-400 dark:text-slate-600 pb-10">
        ThesisHub — Campus Research & Thesis Collaboration Hub
      </footer>
    </div>
  )
}