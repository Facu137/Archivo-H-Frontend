// src/components/UserCard/UserCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaUserTie, FaUserShield } from 'react-icons/fa'
import './UserCard.css'

const UserCard = ({ user, darkMode, className }) => {
  if (!user || !user.rol) {
    return null
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const getAvatarByRole = (role) => {
    switch (role.toLowerCase()) {
      case 'administrador':
        return <FaUserShield size={32} />
      case 'empleado':
        return <FaUserTie size={32} />
      default:
        return <FaUser size={32} />
    }
  }

  const getAvatarColorByRole = (role) => {
    switch (role.toLowerCase()) {
      case 'administrador':
        return '#FF5733'
      case 'empleado':
        return '#33FF57'
      default:
        return '#3357FF'
    }
  }

  const truncateString = (str, maxLength) => {
    return str.length > maxLength
      ? str.substring(0, maxLength - 3) + '...'
      : str
  }

  const roleColor = getAvatarColorByRole(user.rol)

  return (
    <div
      className={`user-card ${darkMode ? 'dark-mode' : ''} ${className || ''}`}
    >
      <div className="user-card-content">
        <div className="user-avatar" style={{ backgroundColor: roleColor }}>
          {getAvatarByRole(user.rol)}
        </div>
        <div className="user-info">
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Nombres:</strong>
            <span title={user.nombre}>
              {truncateString(user.nombre || '', 20)}
            </span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Apellidos:</strong>
            <span title={user.apellido}>
              {truncateString(user.apellido || '', 20)}
            </span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Email:</strong>
            <span title={user.email}>
              {truncateString(user.email || '', 20)}
            </span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Rol:</strong>
            <span title={capitalizeFirstLetter(user.rol)}>
              {truncateString(capitalizeFirstLetter(user.rol), 20)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired
  }).isRequired,
  darkMode: PropTypes.bool,
  className: PropTypes.string
}

UserCard.defaultProps = {
  darkMode: false,
  className: ''
}

export default UserCard
