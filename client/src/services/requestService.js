import api from './api'

export const sendRequest = (data) => api.post('/requests', data)
export const getMyRequests = (status) => api.get('/requests', { params: status ? { status } : {} })
export const respondToRequest = (id, data) => api.put(`/requests/${id}/respond`, data)