import axios from 'axios'
import { authService } from './auth.service'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

if (!BASE_URL) {
  console.error('VITE_BACKEND_URL no está definida en el archivo .env')
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

// Interceptor para manejar tokens y errores
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Silenciar errores 401 específicamente para /auth/me
    if (error.response?.status === 401 && originalRequest.url === '/auth/me') {
      return Promise.resolve({ data: null })
    }

    // Manejo de token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await authService.refreshToken()
        const newToken = response.data.accessToken
        localStorage.setItem('accessToken', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    // Manejo de errores comunes
    if (
      error.message === 'Network Error' ||
      error.message.includes('offline') ||
      error.message.includes('net::ERR_NETWORK_IO_SUSPENDED') ||
      error.message.includes('ERR_INTERNET_DISCONNECTED')
    ) {
      console.error('Network error:', error)
      return Promise.reject(new Error('Network Error'))
    }

    // Manejo de errores de permisos
    if (error.response?.status === 403) {
      console.error('Permission denied:', error)
      return Promise.reject(new Error('Forbidden Error'))
    }

    // Log detallado del error para debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message
    })

    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error)
  }
)

export default api
