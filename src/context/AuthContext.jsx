// src/context/AuthContext.jsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react'
import axiosInstance from '../api/axiosConfig'
import PropTypes from 'prop-types'
import localforage from 'localforage' // Importa localforage

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout') // Realizar logout en backend también
      localStorage.removeItem('accessToken')
      setToken(null)
      setUser(null)
      await localforage.removeItem('user') // Eliminar usuario de localforage
    } catch (error) {
      console.error('Logout error:', error)
      // Manejar el error, por ejemplo, mostrando una notificación al usuario.
    }
  }, [])

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/auth/me')
      setUser(response.data)
      await localforage.setItem('user', response.data) // Guardar usuario en localforage
    } catch (error) {
      console.error('Error fetching user:', error)
      logout() // Cerrar sesión si hay un error al obtener la información del usuario
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  const login = useCallback(
    async (userData) => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.post('/auth/login', userData)
        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        setToken(accessToken) // Guardar el token en el estado
        await fetchUser() // Obtener la información del usuario después del login
      } catch (error) {
        console.error('Login error:', error)
        // Mostrar un mensaje de error al usuario, por ejemplo, usando useNotification
        throw error // Propagar el error para que el componente lo maneje
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUser]
  )

  useEffect(() => {
    const initializeAuth = async () => {
      // Función asíncrona para usar await
      const storedToken = localStorage.getItem('accessToken')
      const localUser = await localforage.getItem('user') // Recuperar de localforage
      if (storedToken) {
        setToken(storedToken)
        if (localUser) {
          setUser(localUser) // Si hay un usuario en localforage, úsalo
          setIsLoading(false)
        } else {
          fetchUser() // Si no hay usuario en localforage, obtenerlo del servidor
        }
      } else {
        setIsLoading(false)
      }
    }

    initializeAuth() // Llamar a la función asíncrona
  }, [fetchUser])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthProvider
