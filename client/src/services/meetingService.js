import api from './api'

export const createMeeting = (data) => api.post('/meetings', data)
export const getProjectMeetings = (projectId) => api.get(`/meetings/${projectId}`)
export const updateMeeting = (id, data) => api.put(`/meetings/${id}`, data)
export const deleteMeeting = (id) => api.delete(`/meetings/${id}`)