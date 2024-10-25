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
        // NO llames a logout ni setToken aquí.  Eso se manejará en el componente.
        return axiosInstance(originalRequest) // Reintenta la solicitud
      } catch (refreshError) {
        // Maneja el error de actualización del token (redireccionar al login, etc.)
        return Promise.reject(refreshError) // Rechaza la promesa para que el componente sepa que hubo un error
      }
    }
    if (error.response?.status === 403) {
      console.error('Permiso denegado:', error.response.data.message)
    } else if (error.message === 'Network Error') {
      console.error(
        'Error de red. La aplicación no se encuentra conectada a internet.'
      )
    } else if (error.message.includes('offline')) {
      console.error('Estás trabajando sin conexión')
    }

    return Promise.reject(error) // Rechaza la promesa para otros errores
  }
)

export default axiosInstance
