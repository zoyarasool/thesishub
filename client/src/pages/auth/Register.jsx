import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const departments = ['AI', 'SE', 'CS', 'CYB', 'IT']

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)

  const [role, setRole] = useState('student')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    studentId: '',
    facultyId: '',
    interestedTopics: '',
    availableForSupervision: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role,
        department: formData.department,
      }

      if (role === 'student') {
        payload.studentId = formData.studentId
      } else {
        payload.facultyId = formData.facultyId
        payload.interestedTopics = formData.interestedTopics
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
        payload.availableForSupervision = formData.availableForSupervision
      }

      await register(payload)
      toast.success('Account created successfully!')
      navigate(role === 'student' ? '/student/dashboard' : '/supervisor/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">ThesisHub</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              role === 'student' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('supervisor')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              role === 'supervisor' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Supervisor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {role === 'student' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
              <input
                type="text"
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Faculty ID</label>
                <input
                  type="text"
                  name="facultyId"
                  required
                  value={formData.facultyId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interested Research Topics <span className="text-slate-400">(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="interestedTopics"
                  placeholder="e.g. Machine Learning, NLP"
                  value={formData.interestedTopics}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="availableForSupervision"
                  id="availableForSupervision"
                  checked={formData.availableForSupervision}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="availableForSupervision" className="text-sm text-slate-700 dark:text-slate-300">
                  Available for Supervision
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}