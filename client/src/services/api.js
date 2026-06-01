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
export const getSuggestionStats     = () => api.get('/suggestions/stats')
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

// News / Hot Topics
export const getNews                = () => api.get('/news')
export const createNews             = (data) => api.post('/news', data)
export const toggleNewsPin          = (id) => api.patch(`/news/${id}/pin`)
export const deleteNews             = (id) => api.delete(`/news/${id}`)

// Startups
export const getStartups    = () => api.get('/startups')
export const createStartup  = (data) => api.post('/startups', data)
export const updateStartup  = (id, data) => api.put(`/startups/${id}`, data)
export const deleteStartup  = (id) => api.delete(`/startups/${id}`)

// Typing / AG Type
export const submitTypingScore      = (data) => api.post('/typing/scores', data)
export const getTypingLeaderboard   = ()     => api.get('/typing/leaderboard')
export const getMyTypingStats       = ()     => api.get('/typing/me')

// Profile
export const updateProfile          = (data) => api.patch('/profile/me', data)
export const getUpcomingBirthdays   = ()     => api.get('/profile/upcoming-birthdays')

// Birthday Wall
export const getBirthdayMessages    = (userId) => api.get(`/birthdays/${userId}/messages`)
export const postBirthdayMessage    = (userId, message) => api.post(`/birthdays/${userId}/messages`, { message })

// Shoutouts
export const getShoutouts           = ()     => api.get('/shoutouts')
export const postShoutout           = (data) => api.post('/shoutouts', data)

// Gamification
export const getMyGamification      = ()     => api.get('/gamification/me')

// Tournaments
export const getTournaments         = ()     => api.get('/tournaments')
export const joinTournament         = (id)   => api.post(`/tournaments/${id}/join`)
export const createTournament       = (data) => api.post('/tournaments', data)
export const deleteTournament       = (id)   => api.delete(`/tournaments/${id}`)

// Chat
export const clearChatMessages      = () => api.delete('/chat/messages')

// Upload
export const uploadFile             = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default api
