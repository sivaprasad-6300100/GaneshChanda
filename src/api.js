import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gc_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let pendingQueue = []

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const hasRefresh = !!localStorage.getItem('gc_refresh')

    if (error.response?.status === 401 && !originalRequest._retry && hasRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const refresh = localStorage.getItem('gc_refresh')
        const res = await axios.post(`${API_BASE}/auth/refresh/`, { refresh })
        const newAccess = res.data.access
        localStorage.setItem('gc_access', newAccess)
        processQueue(null, newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('gc_access')
        localStorage.removeItem('gc_refresh')
        localStorage.removeItem('gc_committee_name')
        localStorage.removeItem('gc_member_name')
        localStorage.removeItem('gc_committee_code')
        localStorage.removeItem('gc_is_admin')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
export { API_BASE }
