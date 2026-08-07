import api from './api'

export const getMyNotifications = () => api.get('/notifications')
export const markAsRead = (id) => api.put(`/notifications/${id}/read`)