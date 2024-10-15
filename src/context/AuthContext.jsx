// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import axiosInstance from '../api/axiosConfig'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // Estado de carga

  // Eliminar el token de localStorage al cerrar sesión
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('accessToken')
    }
  }, [])

  // Obtener la información del usuario al iniciar o refrescar el token
  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simula un retraso de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      
    } catch (error) {
      console.error('Fetch user error:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [token, logout])

  // Actualizar el token en localStorage al refrescarlo
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token')
      const { accessToken } = response.data
      setToken(accessToken)
      localStorage.setItem('accessToken', accessToken)
    } catch (error) {
      console.error('Refresh token error:', error)
      logout()
    }
  }, [logout])

  // Cargar el token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      setToken(storedToken)
    }

    const refreshToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('refreshToken='))
    if (refreshToken) {
      refreshAccessToken()
    }
  }, [refreshAccessToken])

  // Guardar el token en localStorage al iniciar sesión
  const login = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/login', userData)
      const { accessToken } = response.data
      setToken(accessToken)
      localStorage.setItem('accessToken', accessToken)

      // Obtener la información del usuario después de iniciar sesión
      await fetchUser()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const addFavorite = async (documentoId) => {
    try {
      await axiosInstance.post(
        '/favorites',
        { documentoId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      // Actualizar el estado del usuario si es necesario
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  const removeFavorite = async (documentoId) => {
    try {
      await axiosInstance.delete(`/favorites/${documentoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Actualizar el estado del usuario si es necesario
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token, fetchUser])

  // Configurar el token en los headers de las solicitudes de axios
  const setAuthToken = useCallback(
    (config) => {
      // Envolviendo setAuthToken en useCallback
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    [token]
  )

  useEffect(() => {
    axiosInstance.interceptors.request.use(setAuthToken)
  }, [setAuthToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshAccessToken, // Exportar refreshAccessToken
        isLoading,
        updateUser: fetchUser,
        addFavorite,
        removeFavorite
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
