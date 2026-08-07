import { useState } from 'react'
import { ChevronDown, ChevronUp, Check, X, ListChecks } from 'lucide-react'
import toast from 'react-hot-toast'
import { respondToRequest } from '../../services/requestService'
import MilestoneTracker from '../project/MilestoneTracker'
import DocumentList from '../project/DocumentList'
import MeetingHistory from '../project/MeetingHistory'

const statusStyles = {
  pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
}

export default function RequestCard({ request, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [showMilestones, setShowMilestones] = useState(false)
  const [responding, setResponding] = useState(false)
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [message, setMessage] = useState('')

  const handleRespond = async (status) => {
    if (status === 'approved' && (!meetingDate || !meetingTime)) {
      toast.error('Please select meeting date and time')
      return
    }
    setResponding(true)
    try {
      await respondToRequest(request._id, {
        status,
        meetingDate,
        meetingTime,
        responseMessage: message,
      })
      toast.success(status === 'approved' ? 'Request approved' : 'Request rejected')
      onUpdate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond')
    } finally {
      setResponding(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">{request.project.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {request.student.fullName} · {request.student.studentId} · {request.student.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusStyles[request.status]}`}>
            {request.status}
          </span>
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Thesis Idea</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{request.project.description}</p>
          </div>

          {request.project.groupMembers?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Group Members</p>
              <div className="flex flex-wrap gap-2">
                {request.project.groupMembers.map((m, i) => (
                  <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">
                    {m.name} ({m.studentId})
                  </span>
                ))}
              </div>
            </div>
          )}

          {request.status === 'pending' ? (
            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Meeting Time</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Message (optional)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleRespond('approved')}
                  disabled={responding}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() => handleRespond('rejected')}
                  disabled={responding}
                  className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ) : (
            <>
              {request.meetingDate && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Meeting Scheduled</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {new Date(request.meetingDate).toLocaleDateString()} at {request.meetingTime}
                  </p>
                  {request.responseMessage && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{request.responseMessage}"</p>
                  )}
                </div>
              )}

              {request.status === 'approved' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <button
                    onClick={() => setShowMilestones(!showMilestones)}
                    className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                  >
                    <ListChecks size={16} />
                    {showMilestones ? 'Hide Milestones' : 'Manage Milestones'}
                  </button>

                  {showMilestones && (
                    <MilestoneTracker projectId={request.project._id} isSupervisor={true} />
                  )}

                  <DocumentList projectId={request.project._id} canUpload={false} />
                  <MeetingHistory projectId={request.project._id} isSupervisor={true} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}