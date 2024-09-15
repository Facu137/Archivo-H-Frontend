// src/components/AuthenticatedRoute.jsx
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosConfig'

const AuthenticatedRoute = ({ element: Element, ...rest }) => {
  const { user, isLoading, token, logout, refreshAccessToken } = useAuth()
  const location = useLocation() // Obtén la ruta actual con useLocation
  const [isRefreshing, setIsRefreshing] = useState(false) // Estado para controlar la renovación del token
  useEffect(() => {
    const setAuthToken = (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }

    const handleUnauthorizedResponse = async (error) => {
      const originalRequest = error.config

      // Manejar el caso en que error.response sea undefined
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        if (!isRefreshing) {
          // Verificar si ya se está renovando el token
          setIsRefreshing(true)

          try {
            await refreshAccessToken()
            setIsRefreshing(false)
            return axiosInstance(originalRequest)
          } catch (refreshError) {
            setIsRefreshing(false)
            logout()
            // Eliminar la cookie refreshToken si es inválida
            document.cookie =
              'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            return Promise.reject(refreshError)
          }
        } else {
          // Esperar a que la renovación del token actual se complete
          return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(interval)
                resolve(axiosInstance(originalRequest))
              }
            }, 100) // Verificar cada 100ms
          })
        }
      }

      return Promise.reject(error)
    }

    axiosInstance.interceptors.request.use(setAuthToken)
    axiosInstance.interceptors.response.use(
      undefined,
      handleUnauthorizedResponse
    )

    return () => {
      axiosInstance.interceptors.request.eject(setAuthToken)
      axiosInstance.interceptors.response.eject(handleUnauthorizedResponse)
    }
  }, [token, logout, refreshAccessToken, isRefreshing])

  console.log('AuthenticatedRoute: user:', user) // Log del usuario en AuthenticatedRoute
  console.log('AuthenticatedRoute: isLoading:', isLoading) // Log del estado isLoading
  console.log('AuthenticatedRoute: location.pathname:', location.pathname) // Log de la ruta actual con location.pathname
  console.log('AuthenticatedRoute: renderizando componente', user, isLoading) // Log al renderizar
  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  // Redirige al login solo si el usuario NO está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Renderiza el componente si el usuario está autenticado
  // La verificación del rol se hará en el propio componente
  return <Element {...rest} />
}

AuthenticatedRoute.propTypes = {
  element: PropTypes.elementType.isRequired
}

export default AuthenticatedRoute
