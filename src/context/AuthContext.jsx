// src/context/AuthContext.jsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import localforage from 'localforage'
import { useNetwork } from './NetworkContext'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000 // 4 minutos
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 horas

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const { isOnline } = useNetwork()

  // Actualizar última actividad
  const updateLastActivity = useCallback(() => {
    const currentTime = Date.now()
    setLastActivity(currentTime)
    localforage.setItem('lastActivity', currentTime)
  }, [])

  // Verificar si la sesión ha expirado
  const checkSessionExpiration = useCallback(() => {
    const currentTime = Date.now()
    return currentTime - lastActivity > SESSION_TIMEOUT
  }, [lastActivity])

  const logout = useCallback(async () => {
    try {
      if (isOnline) {
        const currentToken = localStorage.getItem('accessToken')
        if (currentToken) {
          window.axiosInstance.defaults.headers.common.Authorization = `Bearer ${currentToken}`
          await window.axiosInstance.post('/auth/logout')
        }
      }

      // Limpiar todos los datos almacenados
      localStorage.removeItem('accessToken')
      delete window.axiosInstance.defaults.headers.common.Authorization
      await Promise.all([
        localforage.removeItem('user'),
        localforage.removeItem('lastActivity')
      ])

      // Actualizar el estado
      setToken(null)
      setUser(null)
      setLastActivity(Date.now())
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [isOnline])

  const fetchUser = useCallback(async () => {
    if (!isOnline) {
      const cachedUser = await localforage.getItem('user')
      if (cachedUser) {
        setUser(cachedUser)
        setIsLoading(false)
        return
      }
    }

    try {
      const response = await window.axiosInstance.get('/auth/me')
      const userData = response.data

      // Solo actualizar si los datos del usuario han cambiado
      if (JSON.stringify(userData) !== JSON.stringify(user)) {
        setUser(userData)
        await localforage.setItem('user', userData)
      }

      updateLastActivity()
    } catch (error) {
      console.error('Error fetching user:', error)
      if (error.response?.status === 401) {
        await logout()
      }
    } finally {
      setIsLoading(false)
    }
  }, [isOnline, logout, updateLastActivity, user])

  const login = useCallback(
    async (userData) => {
      if (!isOnline) {
        throw new Error('No hay conexión a internet')
      }

      setIsLoading(true)
      try {
        const response = await window.axiosInstance.post(
          '/auth/login',
          userData
        )
        const { accessToken } = response.data

        localStorage.setItem('accessToken', accessToken)
        setToken(accessToken)
        window.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        updateLastActivity()
        await fetchUser()

        return response.data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUser, isOnline, updateLastActivity]
  )

  const refreshToken = useCallback(async () => {
    if (!isOnline || !token) return

    try {
      const response = await window.axiosInstance.post('/auth/refresh')
      const { accessToken } = response.data

      // Solo actualizar si el token es diferente
      if (accessToken !== token) {
        localStorage.setItem('accessToken', accessToken)
        setToken(accessToken)
        window.axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      }

      updateLastActivity()
    } catch (error) {
      console.error('Error refreshing token:', error)
      if (error.response?.status === 401) {
        await logout()
      }
    }
  }, [token, isOnline, logout, updateLastActivity])

  // Inicialización
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        setToken(storedToken)
        window.axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`
        await fetchUser()
      } else {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [fetchUser])

  // Refrescar token periódicamente
  useEffect(() => {
    let refreshInterval

    if (token && isOnline) {
      refreshInterval = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL)
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [token, isOnline, refreshToken])

  // Verificar expiración de sesión
  useEffect(() => {
    const checkSession = () => {
      if (checkSessionExpiration()) {
        logout()
      }
    }

    const activityInterval = setInterval(checkSession, 60000) // Verificar cada minuto

    return () => clearInterval(activityInterval)
  }, [checkSessionExpiration, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        token,
        lastActivity,
        updateLastActivity
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthProvider
