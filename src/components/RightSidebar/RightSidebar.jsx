// src/components/RightSidebar/RightSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaEnvelope, FaSignOutAlt, FaEdit, FaFile, FaTrash, FaHistory, FaUserFriends, FaHome } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  // Función para capitalizar la primera letra de una palabra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  if (!user) {
    return null
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="user-card">
          <div className="user-avatar">
            <FaUser size={48} />
          </div>
          <h3>Detalles de la Cuenta</h3>
          <div className="user-info">
            <p>Rol: {capitalizeFirstLetter(user.role)}</p>
            <p>Nombre: {user.name}</p>
            <p>Apellido: {user.lastName}</p>
          </div>
          <button
            onClick={() => (window.location.href = '/editar-usuario')}
            className="edit-button"
          >
            <FaEdit /> Editar Detalles
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
        <div className="sidebar-section">
          <h3>Archivos</h3>
          <ul>
            <li>
              <FaFile /> <a href="/agregar-archivo">Agregar Archivo</a>
            </li>
            <li>
              <FaEdit /> <a href="/editar-archivo">Editar o Eliminar Archivo</a>
            </li>
            <li>
              <FaHistory /> <a href="/historial-archivos">Historial de Archivos Modificados</a>
            </li>
            <li>
              <FaTrash /> <a href="/archivos-eliminados">Archivos Eliminados</a>
            </li>
          </ul>
        </div>
        {user.role === 'admin' && (
          <div className="sidebar-section">
            <h3>Administración</h3>
            <ul>
              <li>
                <FaUserFriends /> <a href="/gestionar-empleados">Gestionar Empleados</a>
              </li>
              <li>
                <FaHome /> <a href="/editar-portada">Editar Portada e Institucional</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar