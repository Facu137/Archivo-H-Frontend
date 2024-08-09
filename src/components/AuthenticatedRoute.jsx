// src/components/AuthenticatedRoute.jsx
import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosConfig'

const AuthenticatedRoute = ({ element: Element, ...rest }) => {
  const { user, isLoading, token, logout, refreshAccessToken } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const setAuthToken = (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }

    const handleUnauthorizedResponse = async (error) => {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          await refreshAccessToken()
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          logout()
          return Promise.reject(refreshError)
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
  }, [token, logout, refreshAccessToken])

  return isLoading ? (
    <div>Cargando...</div>
  ) : user ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

AuthenticatedRoute.propTypes = {
  element: PropTypes.elementType.isRequired
}

export default AuthenticatedRoute
