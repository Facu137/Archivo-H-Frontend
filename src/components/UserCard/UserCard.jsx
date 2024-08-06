// src/components/UserCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaUserTie, FaUserShield } from 'react-icons/fa'
import './UserCard.css'

const UserCard = ({ user, className }) => {
  if (!user) {
    return null
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const getAvatarByRole = (role) => {
    switch (role) {
      case 'administrador':
        return <FaUserShield size={48} />
      case 'empleado':
        return <FaUserTie size={48} />
      default:
        return <FaUser size={48} />
    }
  }

  const getAvatarColorByRole = (role) => {
    switch (role) {
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

  const roleColor = getAvatarColorByRole(user.role)

  return (
    <div className={`user-card ${className}`}>
      <div className="user-card-content">
        <div
          className="user-avatar"
          style={{ backgroundColor: getAvatarColorByRole(user.role) }}
        >
          {getAvatarByRole(user.role)}
        </div>
        <div className="user-info">
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Rol:</strong>
            <span>{capitalizeFirstLetter(user.role)}</span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Nombre:</strong>
            <span>{truncateString(user.name, 15)}</span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Apellidos:</strong>
            <span>{truncateString(user.lastName, 15)}</span>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Email:</strong>
            <span>{truncateString(user.email, 15)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default UserCard
