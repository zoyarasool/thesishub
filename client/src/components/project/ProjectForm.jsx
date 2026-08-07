import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { createProject, getSupervisors } from '../../services/projectService'
import { sendRequest } from '../../services/requestService'

const steps = ['Thesis Details', 'Select Supervisor', 'Review & Submit']

export default function ProjectForm({ onSuccess }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preferredTopics: '',
  })
  const [groupMembers, setGroupMembers] = useState([{ name: '', studentId: '' }])

  const [supervisors, setSupervisors] = useState([])
  const [loadingSupervisors, setLoadingSupervisors] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)

  useEffect(() => {
    if (step === 1) fetchSupervisors()
  }, [step])

  const fetchSupervisors = async () => {
    setLoadingSupervisors(true)
    try {
      const res = await getSupervisors()
      setSupervisors(res.data.data)
    } catch (err) {
      toast.error('Failed to load supervisors')
    } finally {
      setLoadingSupervisors(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleMemberChange = (index, field, value) => {
    const updated = [...groupMembers]
    updated[index][field] = value
    setGroupMembers(updated)
  }

  const addMember = () => setGroupMembers([...groupMembers, { name: '', studentId: '' }])
  const removeMember = (index) => setGroupMembers(groupMembers.filter((_, i) => i !== index))

  const validateStep1 = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in the thesis title and description')
      return false
    }
    return true
  }

  const goNext = () => {
    if (step === 0 && !validateStep1()) return
    if (step === 1 && !selectedSupervisor) {
      toast.error('Please select a supervisor to continue')
      return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const filteredSupervisors = supervisors.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.interestedTopics.some((t) => t.toLowerCase().includes(q))
    )
  })

  const handleFinalSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        preferredTopics: formData.preferredTopics
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        groupMembers: groupMembers.filter((m) => m.name && m.studentId),
      }
      const projectRes = await createProject(payload)
      const project = projectRes.data.data

      await sendRequest({ projectId: project._id, supervisorId: selectedSupervisor._id })

      toast.success('Thesis proposal submitted and request sent!')
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Step Indicator */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5">
        <div className="flex items-center justify-between max-w-md">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                    i < step
                      ? 'bg-white text-indigo-600'
                      : i === step
                      ? 'bg-white text-indigo-600 ring-4 ring-indigo-300'
                      : 'bg-indigo-400/40 text-white'
                  }`}
                >
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className="text-[11px] text-indigo-50 mt-1.5 whitespace-nowrap hidden sm:block">
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-10 sm:w-16 mx-1 ${i < step ? 'bg-white' : 'bg-indigo-400/40'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* STEP 0: Thesis Details */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tell us about your thesis</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thesis Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thesis Idea / Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred Research Topics <span className="text-slate-400 dark:text-slate-500">(comma separated, optional)</span>
              </label>
              <input
                type="text"
                name="preferredTopics"
                placeholder="e.g. Machine Learning, NLP"
                value={formData.preferredTopics}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Group Members</label>
              <div className="space-y-3">
                {groupMembers.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Student ID"
                      value={member.studentId}
                      onChange={(e) => handleMemberChange(index, 'studentId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {groupMembers.length > 1 && (
                      <button type="button" onClick={() => removeMember(index)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:underline"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Select Supervisor */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Choose your supervisor</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">Select one supervisor to send your request to.</p>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, department, or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {loadingSupervisors ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading supervisors...</p>
            ) : filteredSupervisors.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No supervisors found.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredSupervisors.map((sup) => {
                  const isSelected = selectedSupervisor?._id === sup._id
                  return (
                    <button
                      type="button"
                      key={sup._id}
                      onClick={() => setSelectedSupervisor(sup)}
                      className={`w-full text-left flex items-center justify-between border rounded-xl p-4 transition ${
                        isSelected
                          ? 'border-primary bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-primary'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{sup.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{sup.facultyId} · {sup.department}</p>
                        {sup.interestedTopics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sup.interestedTopics.map((topic, i) => (
                              <span key={i} className="text-xs bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Review & Submit */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Review your submission</h2>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Thesis Title</p>
                <p className="text-sm text-slate-800 dark:text-slate-100">{formData.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Description</p>
                <p className="text-sm text-slate-800 dark:text-slate-100">{formData.description}</p>
              </div>
              {groupMembers.some((m) => m.name) && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Group Members</p>
                  <div className="flex flex-wrap gap-2">
                    {groupMembers.filter((m) => m.name).map((m, i) => (
                      <span key={i} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full">
                        {m.name} ({m.studentId})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-xl p-4">
              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">Sending request to</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedSupervisor?.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedSupervisor?.facultyId} · {selectedSupervisor?.department}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}