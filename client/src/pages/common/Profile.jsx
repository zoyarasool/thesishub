import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Lock, Trash2 } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, changePassword, deleteAccount } from '../../services/authService'

const departments = ['AI', 'SE', 'CS', 'CYB', 'IT']

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    department: user?.department || '',
    interestedTopics: user?.interestedTopics?.join(', ') || '',
    availableForSupervision: user?.availableForSupervision ?? true,
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const payload = {
        fullName: profileData.fullName,
        department: profileData.department,
      }
      if (user.role === 'supervisor') {
        payload.interestedTopics = profileData.interestedTopics
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
        payload.availableForSupervision = profileData.availableForSupervision
      }
      const res = await updateProfile(payload)
      updateUser(res.data.data)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await changePassword(passwordData)
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      toast.success('Account deleted')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm'
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'

  return (
    <DashboardLayout title="Account Settings" subtitle="Manage your profile and account preferences.">
      {/* Edit Profile */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <User size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Edit Profile</h2>
        </div>

        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profileData.fullName}
            onChange={handleProfileChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={user?.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </div>

        <div>
          <label className={labelClass}>Department</label>
          <select
            name="department"
            value={profileData.department}
            onChange={handleProfileChange}
            className={inputClass}
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {user?.role === 'supervisor' && (
          <>
            <div>
              <label className={labelClass}>
                Interested Research Topics <span className="text-slate-400">(comma separated)</span>
              </label>
              <input
                type="text"
                name="interestedTopics"
                value={profileData.interestedTopics}
                onChange={handleProfileChange}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="availableForSupervision"
                id="availableForSupervision"
                checked={profileData.availableForSupervision}
                onChange={handleProfileChange}
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
          disabled={savingProfile}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {savingProfile ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lock size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Change Password</h2>
        </div>

        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            required
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            name="newPassword"
            required
            minLength={6}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 size={18} className="text-red-600" />
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deleting your account is permanent and cannot be undone. All your projects and requests will be removed.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Permanently'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}