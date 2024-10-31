// src/components/AuthenticatedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types' // Importa PropTypes

const AuthenticatedRoute = ({ allowedRoles }) => {
  // Agregar allowedRoles como prop
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar roles si se proporciona allowedRoles
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace /> // Redirigir a la página principal si no tiene el rol permitido
  }

  return <Outlet />
}

// Agrega la validación de tipos para allowedRoles
AuthenticatedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string) // Asegúrate de que allowedRoles sea un array de strings
}

export default AuthenticatedRoute
