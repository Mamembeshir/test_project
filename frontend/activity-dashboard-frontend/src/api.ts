import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = sessionStorage.getItem("refresh_token")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE}/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          sessionStorage.setItem("access_token", access)

          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch {
        // Refresh failed, clear tokens and redirect to login
        sessionStorage.removeItem("access_token")
        sessionStorage.removeItem("refresh_token")
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  },
)

// Token management
export const getToken = () => sessionStorage.getItem("access_token")
export const getRefreshToken = () => sessionStorage.getItem("refresh_token")
export const setTokens = (access: string, refresh: string) => {
  sessionStorage.setItem("access_token", access)
  sessionStorage.setItem("refresh_token", refresh)
}
export const clearTokens = () => {
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")
}

// Types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface User {
  id: number
  username: string
  email: string
  is_superuser: boolean
  is_staff: boolean
  first_name?: string
  last_name?: string
}

export interface ProfileUpdateRequest {
  first_name?: string
  last_name?: string
  email?: string
}

export interface ActivityChartData {
  labels: string[]
  data: number[]
}

export interface LoginLogoutData {
  day: string
  activity_type: "login" | "logout"
  count: number
}

// Auth API
export const authAPI = {
  register: (data: RegisterRequest) => api.post("/register/", data),
  login: (data: LoginRequest) => api.post("/login/", data),
  logout: (refresh?: string) => refresh ? api.post("/logout/", { refresh }) : api.post("/logout/"),
  refresh: (data: { refresh: string }) => api.post("/token/refresh/", data),
}

// Profile API
export const profileAPI = {
  get: () => api.get("/profile/"),
  update: (data: ProfileUpdateRequest) => api.patch("/profile-update/", data),
}

// Activity API
export const activityAPI = {
  getChart: () => api.get("/activity-chart/"),
  getLoginLogoutStats: () => api.get("/login-logout-stats/"),
}

// Export the api instance for direct use if needed
export default api
