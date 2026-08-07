import api from './api'

export const updateProfile = (data) => api.put('/auth/profile', data)
export const changePassword = (data) => api.put('/auth/change-password', data)
export const deleteAccount = () => api.delete('/auth/account')