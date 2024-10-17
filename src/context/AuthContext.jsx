// src/context/AuthContext.jsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react'
import axiosInstance from '../api/axiosConfig'
import PropTypes from 'prop-types' // Asegúrate de importar PropTypes

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
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      setToken(storedToken) // Guardar el token en el estado
      fetchUser() // Obtener la información del usuario si hay un token
    } else {
      setIsLoading(false)
    }
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
