// src/components/RightSidebar/RightSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaSignOutAlt, FaEdit } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom' // Importa useNavigate
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate() // Usa useNavigate

  // Función para capitalizar la primera letra de una palabra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/') // Navega a la página principal después de cerrar sesión
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

          <div className="user-info">
            <div className="user-info-item">
              <strong>Rol:</strong> {capitalizeFirstLetter(user.role)}
            </div>
            <div className="user-info-item">
              <strong>Nombre:</strong> {user.name}
            </div>
            <div className="user-info-item">
              <strong>Apellidos:</strong> {user.lastName}
            </div>
            <div className="user-info-item">
              <strong>Email:</strong> {user.email}
            </div>
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
      </div>
    </>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar
