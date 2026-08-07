import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import RequestCard from '../../components/request/RequestCard'
import { useAuth } from '../../context/AuthContext'
import { getMyRequests } from '../../services/requestService'

const tabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('pending')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [activeTab])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await getMyRequests(activeTab)
      setRequests(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title={`Welcome, ${user?.fullName}`} subtitle="Manage your supervision requests here.">
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 text-sm font-medium rounded-md transition ${
              activeTab === tab.key ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No {activeTab} requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <RequestCard key={req._id} request={req} onUpdate={fetchRequests} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}