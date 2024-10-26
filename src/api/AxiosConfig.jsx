// src/api/AxiosConfig.jsx
import { useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

const AxiosConfig = ({ notificationHandler }) => {
  useEffect(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true
    })

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    instance.interceptors.response.use(
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
            const response = await instance.post('/auth/refresh-token') // axiosInstance ya es una instancia configurada
            const newToken = response.data.accessToken
            localStorage.setItem('accessToken', newToken)
            instance.defaults.headers.common.Authorization = `Bearer ${newToken}`
            return instance(originalRequest)
          } catch (refreshError) {
            // Maneja el error de refresh token, por ejemplo, redirigiendo al login
            notificationHandler(
              'Error al actualizar el token. Por favor, inicia sesión de nuevo.',
              'error'
            )
            return Promise.reject(refreshError)
          }
        }

        // Manejo de errores comunes
        if (
          error.message === 'Network Error' ||
          error.message.includes('offline') ||
          error.message.includes('net::ERR_NETWORK_IO_SUSPENDED') ||
          error.message.includes('ERR_INTERNET_DISCONNECTED') ||
          error.message.includes('ERR_NETWORK_IO_SUSPENDED')
        ) {
          notificationHandler(
            'Error de red. Verifica tu conexión a internet.',
            'error'
          )
          return Promise.reject(new Error('Network Error'))
        }

        if (error.response?.status === 403) {
          notificationHandler(
            'No tienes permiso para acceder a esta sección.',
            'error'
          )
          return Promise.reject(new Error('Forbidden Error'))
        }

        // Manejo de errores genéricos (mantener el console.error para depuración)
        console.error('Error en la solicitud:', error)
        notificationHandler('Hubo un error en la solicitud.', 'error')

        return Promise.reject(error)
      }
    )

    window.axiosInstance = instance // Exponer la instancia configurada globalmente
  }, [notificationHandler])

  return null // Este componente no renderiza nada
}

AxiosConfig.propTypes = {
  notificationHandler: PropTypes.func.isRequired
}

export default AxiosConfig
