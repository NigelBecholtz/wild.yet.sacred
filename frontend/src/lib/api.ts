import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ce_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// Auth
export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/register', data)
export const login = (data: { email: string; password: string }) =>
  api.post('/login', data)
export const logout = () => api.post('/logout')
export const getUser = () => api.get('/user')

// Public
export const getAvailabilities = () => api.get('/availabilities')
export const getContent = (locale = 'en') => api.get(`/content?locale=${locale}`)

// Bookings (user)
export const getMyBookings = () => api.get('/bookings')
export const createBooking = (data: {
  availabilityId: number
  clientName: string
  clientAge?: number
  notes?: string
}) => api.post('/bookings', data)
export const cancelBooking = (id: number) => api.delete(`/bookings/${id}`)

// Admin stats
export const getAdminStats = () => api.get('/admin/stats')

// Admin bookings
export const getAdminBookings = (status?: string) =>
  api.get('/admin/bookings', { params: status ? { status } : {} })
export const updateBookingStatus = (id: number, status: string) =>
  api.patch(`/admin/bookings/${id}/status`, { status })

// Admin availability
export const getAdminAvailabilities = () => api.get('/admin/availabilities')
export const createAvailability = (data: { date: string; startTime: string; endTime: string }) =>
  api.post('/admin/availabilities', data)
export const deleteAvailability = (id: number) => api.delete(`/admin/availabilities/${id}`)

// Admin content
export const getAdminContent = () => api.get('/admin/content')
export const updateContent = (updates: { page: string; key: string; locale: string; value: string }[]) =>
  api.put('/admin/content', { updates })
export const uploadImage = (file: File) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/admin/content/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
