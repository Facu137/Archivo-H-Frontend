// src/components/RightSidebar/RightSidebar.jsx
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaSignOutAlt, FaEdit } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserCard from '../UserCard/UserCard'
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }
  useEffect(() => {
    // Puedes agregar lógica aquí si es necesario,
    // o dejar el cuerpo del useEffect vacío para solo re-renderizar
  }, [user])

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
        <UserCard user={user} className="user-card" />
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
    </>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar
