// src/api/axiosConfig.js
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL del backend
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
    const { logout, setToken } = useAuth() // Accede a la función logout y setToken del contexto

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const response = await axiosInstance.post('/auth/refresh-token')
        const newToken = response.data.accessToken
        localStorage.setItem('accessToken', newToken) // Guarda el nuevo token
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`
        setToken(newToken) // Actualiza el token en el contexto AuthContext
        // Vuelve a intentar la solicitud original
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError)
        logout()
        // Redirige al login o muestra un mensaje de error
        return Promise.reject(refreshError) // Importante: rechazar la promesa para indicar el fallo
      }
    } else if (error.response && error.response.status === 403) {
      console.error('Permiso denegado:', error.response.data.message)
      // Puedes manejar el error 403 aquí, por ejemplo, mostrando un mensaje al usuario
      // O redirigiendo a una página de "Acceso Denegado".
    }

    return Promise.reject(error) // Rechaza la promesa para otros errores
  }
)

export default axiosInstance
