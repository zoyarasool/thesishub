import api from './api'

export const createProject = (data) => api.post('/projects', data)
export const getMyProjects = () => api.get('/projects/my-projects')
export const getSupervisors = (filters = {}) => api.get('/projects/supervisors', { params: filters })