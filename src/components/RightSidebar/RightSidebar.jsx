// src/components/RightSidebar/RightSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaSignOutAlt, FaEdit } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import UserCard from '../UserCard/UserCard'
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth() // Usar el contexto directamente
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  if (!user) {
    return null // No mostrar nada si no hay usuario
  }

  // Filtrar los permisos para mostrar solo los habilitados (valor 1)
  const permisosHabilitados =
    user.rol === 'empleado'
      ? Object.keys(user.permisos).filter((permiso) => user.permisos[permiso])
      : [] // Array vacío si no es empleado

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="user-card-container">
          {' '}
          {/* Agregar un contenedor para la tarjeta */}
          <UserCard user={user} className="user-card" />{' '}
          {/* Usar UserCard para mostrar la información del usuario */}
        </div>

        {user.rol === 'empleado' && (
          <div className="employee-card">
            <div className="employee-card-content">
              <div className="employee-info-item">
                <strong>Estado:</strong>
                <span>
                  {user.activo
                    ? 'Empleado Habilitado'
                    : 'Empleado Sin Habilitar'}
                </span>
              </div>

              {/* Mostrar la lista de permisos habilitados */}
              {permisosHabilitados.length > 0 && (
                <div className="employee-info">
                  {/* Mapeo de nombres de permisos */}
                  {permisosHabilitados.map((permiso) => {
                    const frontendName =
                      {
                        crear: 'Crear Archivos',
                        editar: 'Editar Archivos',
                        eliminar: 'Eliminar Archivos',
                        descargar: 'Descargar Archivos',
                        verArchivosPrivados: 'Ver Archivos Ocultos'
                      }[permiso] || permiso
                    return (
                      <div key={permiso} className="employee-info-item">
                        <strong>{frontendName}</strong> <span>Habilitado</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <Link to="/editar-usuario" className="nav-button">
          <FaEdit /> <span className="nav-text">Editar Detalles</span>
        </Link>

        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar
