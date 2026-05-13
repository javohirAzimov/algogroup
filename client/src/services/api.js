import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('algo-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Announcements
export const getAnnouncements       = () => api.get('/announcements')
export const getAnnouncementById    = (id) => api.get(`/announcements/${id}`)
export const createAnnouncement     = (data) => api.post('/announcements', data)
export const updateAnnouncement     = (id, data) => api.put(`/announcements/${id}`, data)
export const deleteAnnouncement     = (id) => api.delete(`/announcements/${id}`)

// Suggestions
export const submitSuggestion       = (data) => api.post('/suggestions', data)

// Knowledge base
export const getKnowledgeCategories = () => api.get('/knowledge')

// Spotlights
export const getSpotlights          = () => api.get('/spotlights')
export const upsertSpotlight        = (data) => api.post('/spotlights', data)
export const getSiteMedia           = () => api.get('/spotlights/media')
export const updateSiteMedia        = (data) => api.post('/spotlights/media', data)

// Users (admin)
export const getUsers               = () => api.get('/users')
export const toggleUserActive       = (id) => api.patch(`/users/${id}/toggle-active`)
export const promoteUser            = (id) => api.patch(`/users/${id}/promote`)
export const demoteUser             = (id) => api.patch(`/users/${id}/demote`)

// AI Assistant
export const sendAIMessage          = (messages) => api.post('/ai/chat', { messages })

// Upload
export const uploadFile             = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default api
