import api from './api'

export const uploadDocument = (formData) =>
  api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getProjectDocuments = (projectId) => api.get(`/documents/${projectId}`)
export const deleteDocument = (id) => api.delete(`/documents/${id}`)