import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import ProjectForm from '../../components/project/ProjectForm'
import MilestoneTracker from '../../components/project/MilestoneTracker'
import DocumentList from '../../components/project/DocumentList'
import MeetingHistory from '../../components/project/MeetingHistory'
import { useAuth } from '../../context/AuthContext'
import { getMyProjects } from '../../services/projectService'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    setLoading(true)
    try {
      const res = await getMyProjects()
      setProject(res.data.data[0] || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statusStyles = {
    unassigned: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    approved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    rejected: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
  }

  return (
    <DashboardLayout
      title={`Welcome, ${user?.fullName?.split(' ')[0]}`}
      subtitle="Here's an overview of your thesis journey."
    >
      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
      ) : !project ? (
        <ProjectForm onSuccess={fetchProject} />
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{project.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{project.description}</p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full capitalize shrink-0 ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>

            {project.groupMembers?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Group Members</p>
                <div className="flex flex-wrap gap-2">
                  {project.groupMembers.map((m, i) => (
                    <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">
                      {m.name} ({m.studentId})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.supervisor && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Supervisor</p>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {project.supervisor.fullName} · {project.supervisor.facultyId}
                </p>
              </div>
            )}
          </div>

          {project.status === 'approved' && (
            <>
              <MilestoneTracker projectId={project._id} isSupervisor={false} />
              <MeetingHistory projectId={project._id} isSupervisor={false} />
            </>
          )}

          {(project.status === 'approved' || project.status === 'pending') && (
            <DocumentList projectId={project._id} canUpload={true} />
          )}
        </>
      )}
    </DashboardLayout>
  )
}