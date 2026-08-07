import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getProjectMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from '../../services/meetingService'

const statusStyles = {
  scheduled: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  completed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
}

export default function MeetingHistory({ projectId, isSupervisor }) {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMeeting, setNewMeeting] = useState({ date: '', time: '', agenda: '' })
  const [saving, setSaving] = useState(false)
  const [notesDraft, setNotesDraft] = useState({})

  useEffect(() => {
    fetchMeetings()
  }, [projectId])

  const fetchMeetings = async () => {
    setLoading(true)
    try {
      const res = await getProjectMeetings(projectId)
      setMeetings(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newMeeting.date || !newMeeting.time) {
      toast.error('Please select date and time')
      return
    }
    setSaving(true)
    try {
      await createMeeting({ projectId, ...newMeeting })
      toast.success('Meeting scheduled')
      setNewMeeting({ date: '', time: '', agenda: '' })
      setShowAddForm(false)
      fetchMeetings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule meeting')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateMeeting(id, { status })
      fetchMeetings()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleSaveNotes = async (id) => {
    try {
      await updateMeeting(id, { notes: notesDraft[id] })
      toast.success('Notes saved')
      fetchMeetings()
    } catch (err) {
      toast.error('Failed to save notes')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMeeting(id)
      toast.success('Meeting removed')
      fetchMeetings()
    } catch (err) {
      toast.error('Failed to delete meeting')
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Meeting History</h2>
        {isSupervisor && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <Plus size={16} /> Schedule Meeting
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting((p) => ({ ...p, date: e.target.value }))}
              className={inputClass}
            />
            <input
              type="time"
              value={newMeeting.time}
              onChange={(e) => setNewMeeting((p) => ({ ...p, time: e.target.value }))}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Agenda (optional)"
            value={newMeeting.agenda}
            onChange={(e) => setNewMeeting((p) => ({ ...p, agenda: e.target.value }))}
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
            >
              {saving ? 'Scheduling...' : 'Schedule'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 px-3"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
          No meetings scheduled yet.
        </p>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m._id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {new Date(m.date).toLocaleDateString()} at {m.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusStyles[m.status]}`}>
                    {m.status}
                  </span>
                  {isSupervisor && (
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {m.agenda && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-medium">Agenda:</span> {m.agenda}
                </p>
              )}

              {m.notes && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{m.notes}"</p>
              )}

              {isSupervisor && m.status === 'scheduled' && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <textarea
                    placeholder="Add meeting notes..."
                    rows={2}
                    value={notesDraft[m._id] ?? m.notes ?? ''}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [m._id]: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveNotes(m._id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => handleStatusChange(m._id, 'completed')}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
                    >
                      <Check size={12} /> Mark Completed
                    </button>
                    <button
                      onClick={() => handleStatusChange(m._id, 'cancelled')}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline"
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}