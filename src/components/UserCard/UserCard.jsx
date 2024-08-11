// src/components/UserCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaUserTie, FaUserShield } from 'react-icons/fa'
import Tooltip from '../Tooltip/Tooltip'
import './UserCard.css'

const UserCard = ({ user, className }) => {
  if (!user || !user.rol) {
    // Corrección: user.rol en lugar de user.role
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

  const roleColor = getAvatarColorByRole(user.rol?.toLowerCase()) // Corrección: user.rol
  return (
    <div className={`user-card ${className}`}>
      <div className="user-card-content">
        <div
          className="user-avatar"
          style={{ backgroundColor: getAvatarColorByRole(user.rol) }} // Corrección: user.rol
        >
          {getAvatarByRole(user.rol)} {/* Corrección: user.rol */}
        </div>
        <div className="user-info">
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Rol:</strong>
            <Tooltip content={capitalizeFirstLetter(user.rol)}>
              {' '}
              {/* Corrección: user.rol */}
              <span>
                {truncateString(capitalizeFirstLetter(user.rol), 15)}{' '}
                {/* Corrección: user.rol */}
              </span>
            </Tooltip>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Nombres:</strong>
            <Tooltip content={user.nombre}>
              <span>{truncateString(user.nombre || '', 15)}</span>
            </Tooltip>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Apellidos:</strong>
            <Tooltip content={user.apellido}>
              <span>{truncateString(user.apellido || '', 15)}</span>
            </Tooltip>
          </div>
          <div className="user-info-item">
            <strong style={{ color: roleColor }}>Email:</strong>
            <Tooltip content={user.email}>
              <span>{truncateString(user.email || '', 15)}</span>
            </Tooltip>
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
