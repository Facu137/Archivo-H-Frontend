// src/components/LeftSidebar/LeftSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom' // Importa Link
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
    return null
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
              <li>
                <FaFile /> <Link to="/agregar-archivo">Agregar Archivo</Link>{' '}
                {/* Usa Link aquí */}
              </li>
              <li>
                <FaEdit />{' '}
                <Link to="/editar-archivo">Editar o Eliminar Archivo</Link>{' '}
                {/* Usa Link aquí */}
              </li>
              <li>
                <FaHistory />{' '}
                <Link to="/historial-archivos">
                  Historial de Archivos Modificados
                </Link>{' '}
                {/* Usa Link aquí */}
              </li>
              <li>
                <FaTrash />{' '}
                <Link to="/archivos-eliminados">Archivos Eliminados</Link>{' '}
                {/* Usa Link aquí */}
              </li>
            </ul>
          </div>
          {user.rol === 'administrador' && (
            <div className="sidebar-section">
              <h3>Administración</h3>
              <ul>
                <li>
                  <FaUserFriends />{' '}
                  <Link to="/gestionar-empleados">Gestionar Empleados</Link>{' '}
                  {/* Usa Link aquí */}
                </li>
                <li>
                  <FaCog />{' '}
                  <Link to="/editar-portada">
                    Editar Portada e Institucional
                  </Link>{' '}
                  {/* Usa Link aquí */}
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
