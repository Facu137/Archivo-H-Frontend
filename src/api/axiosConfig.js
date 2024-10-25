// src/api/axiosConfig.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const response = await axiosInstance.post('/auth/refresh-token')
        const newToken = response.data.accessToken
        localStorage.setItem('accessToken', newToken)
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest) // Reintenta la solicitud
      } catch (refreshError) {
        return Promise.reject(refreshError) // Rechaza la promesa para que el componente sepa que hubo un error
      }
    }

    // Manejo de errores comunes
    if (
      error.message === 'Network Error' ||
      error.message.includes('offline')
    ) {
      const networkError = new Error('Network Error')
      networkError.code = 'NETWORK_ERROR'
      return Promise.reject(networkError)
    }

    if (error.response?.status === 403) {
      const forbiddenError = new Error('Forbidden Error')
      forbiddenError.code = 'FORBIDDEN_ERROR'
      return Promise.reject(forbiddenError)
    }

    return Promise.reject(error) // Rechaza otros errores normalmente
  }
)

export default axiosInstance
