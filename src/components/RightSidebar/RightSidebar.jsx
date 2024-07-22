// src/components/RightSidebar/RightSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

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
            <p>
              <strong>Rol:</strong> {user.role}
            </p>
            <p>
              <strong>Nombre:</strong> {user.name}
            </p>
            <p>
              <strong>Apellido:</strong> {user.lastName}
            </p>
            <p>
              <FaEnvelope /> {user.email}
            </p>
          </div>
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
