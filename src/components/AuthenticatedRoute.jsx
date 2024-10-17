// src/components/AuthenticatedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthenticatedRoute = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace /> // Redirige al login si no hay usuario
  }

  return <Outlet /> // Renderiza la ruta si el usuario está autenticado
}

export default AuthenticatedRoute
