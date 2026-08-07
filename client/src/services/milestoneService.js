import api from './api'

export const createMilestone = (data) => api.post('/milestones', data)
export const getProjectMilestones = (projectId) => api.get(`/milestones/${projectId}`)
export const updateMilestone = (id, data) => api.put(`/milestones/${id}`, data)
export const deleteMilestone = (id) => api.delete(`/milestones/${id}`)