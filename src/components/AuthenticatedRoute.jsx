// src/components/AuthenticatedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types' // Importa PropTypes

const AuthenticatedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Solo mostrar el estado de carga si realmente estamos cargando el usuario por primera vez
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
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
