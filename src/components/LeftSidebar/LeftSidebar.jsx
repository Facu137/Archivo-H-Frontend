// src/components/LeftSidebar/LeftSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  FaEdit,
  FaFile,
  FaTrash,
  FaHistory,
  FaUserFriends,
  FaCog
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './LeftSidebar.css'

const LeftSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()

  if (!user || (user.rol !== 'empleado' && user.rol !== 'administrador')) {
    return null // No mostrar el sidebar si no es empleado ni administrador
  }

  const hasPermission = (permission) => {
    if (user.rol === 'administrador') return true
    if (!user.permisos) return false
    return user.permisos[permission]
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`left-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="left-close-button" onClick={onClose}>
          ×
        </button>
        <div className="left-sidebar-content">
          <div className="sidebar-section">
            <h3>Archivos</h3>
            <ul>
              {/* Agregar Archivo (permiso_crear) */}
              <li className={hasPermission('crear') ? '' : 'disabled'}>
                <FaFile /> <Link to="/agregar-archivo">Agregar Archivo</Link>
              </li>

              {/* Editar o Eliminar Archivo (permiso_editar O permiso_eliminar) */}
              <li
                className={
                  hasPermission('editar') || hasPermission('eliminar')
                    ? ''
                    : 'disabled'
                }
              >
                <FaEdit />{' '}
                <Link to="/editar-archivo">Editar o Eliminar Archivo</Link>
              </li>

              {/* Historial de Archivos Modificados (permiso_editar) */}
              <li className={hasPermission('editar') ? '' : 'disabled'}>
                <FaHistory />{' '}
                <Link to="/historial-archivos">
                  Historial de Archivos Modificados
                </Link>
              </li>

              {/* Archivos Eliminados (permiso_eliminar) */}
              <li className={hasPermission('eliminar') ? '' : 'disabled'}>
                <FaTrash />{' '}
                <Link to="/archivos-eliminados">Archivos Eliminados</Link>
              </li>
            </ul>
          </div>

          {/* Sección de Administración (solo para administradores) */}
          {user.rol === 'administrador' && (
            <div className="sidebar-section">
              <h3>Administración</h3>
              <ul>
                <li>
                  <FaUserFriends />{' '}
                  <Link to="/gestionar-empleados">Gestionar Empleados</Link>
                </li>
                <li>
                  <FaCog />{' '}
                  <Link to="/editar-portada">
                    Editar Portada e Institucional
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

LeftSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LeftSidebar
