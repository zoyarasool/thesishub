import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Circle, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getProjectMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../../services/milestoneService'

const statusConfig = {
  pending: { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  'in-progress': { label: 'In Progress', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  completed: { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  overdue: { label: 'Overdue', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
}

export default function MilestoneTracker({ projectId, isSupervisor }) {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMilestones()
  }, [projectId])

  const fetchMilestones = async () => {
    setLoading(true)
    try {
      const res = await getProjectMilestones(projectId)
      setMilestones(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestone.title.trim()) {
      toast.error('Please enter a milestone title')
      return
    }
    setSaving(true)
    try {
      await createMilestone({
        projectId,
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: newMilestone.dueDate || undefined,
        order: milestones.length,
      })
      toast.success('Milestone added')
      setNewMilestone({ title: '', description: '', dueDate: '' })
      setShowAddForm(false)
      fetchMilestones()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add milestone')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateMilestone(id, { status })
      fetchMilestones()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMilestone(id)
      toast.success('Milestone removed')
      fetchMilestones()
    } catch (err) {
      toast.error('Failed to delete milestone')
    }
  }

  const nextStatus = (current) => {
    if (current === 'pending') return 'in-progress'
    if (current === 'in-progress') return 'completed'
    return 'pending'
  }

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400 text-sm">Loading milestones...</p>
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Milestones</h2>
        {isSupervisor && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <Plus size={16} /> Add Milestone
          </button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddMilestone}
          className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-5 space-y-3"
        >
          <input
            type="text"
            placeholder="Milestone title (e.g. Literature Review)"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
         <div>
  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
  <input
    type="date"
    value={newMilestone.dueDate}
    onChange={(e) => setNewMilestone((p) => ({ ...p, dueDate: e.target.value }))}
    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  />
</div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add'}
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

      {milestones.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
          No milestones set yet.
        </p>
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => {
            const config = statusConfig[m.status]
            return (
              <div
                key={m._id}
                className="flex items-start gap-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
              >
                <button
                  onClick={() => handleStatusChange(m._id, nextStatus(m.status))}
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
                    m.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : m.status === 'in-progress'
                      ? 'bg-amber-400 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}
                  title="Click to update status"
                >
                  {m.status === 'completed' ? (
                    <Check size={14} />
                  ) : m.status === 'in-progress' ? (
                    <Clock size={12} />
                  ) : (
                    <Circle size={0} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium text-slate-800 dark:text-slate-100 ${m.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {m.title}
                    </p>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  {m.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{m.description}</p>
                  )}
                  {m.dueDate && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Due: {new Date(m.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {isSupervisor && (
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}