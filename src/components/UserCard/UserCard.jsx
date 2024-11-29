// src/components/UserCard/UserCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaUser, FaUserTie, FaUserShield, FaEnvelope } from 'react-icons/fa'
import { Card, Badge } from 'react-bootstrap'

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

  const getRoleBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case 'administrador':
        return 'danger'
      case 'empleado':
        return 'success'
      default:
        return 'primary'
    }
  }

  const truncateString = (str, maxLength) => {
    if (!str) return ''
    return str.length > maxLength
      ? str.substring(0, maxLength - 3) + '...'
      : str
  }

  return (
    <Card
      className={`border shadow-sm ${
        darkMode
          ? 'bg-dark text-white border-secondary'
          : 'bg-white border-light'
      } ${className || ''}`}
    >
      <Card.Body className="p-3">
        <div className="d-flex align-items-start">
          <div
            className={`rounded-circle p-2 me-3 ${
              darkMode ? 'bg-dark bg-opacity-50' : 'bg-light'
            }`}
            style={{
              border: `2px solid var(--bs-${getRoleBadgeVariant(user.rol)})`,
              minWidth: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: darkMode ? 'var(--bs-light)' : 'var(--bs-dark)'
            }}
          >
            {getAvatarByRole(user.rol)}
          </div>
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex flex-column">
              <h6
                className={`mb-1 text-truncate fw-bold ${
                  darkMode ? 'text-white' : 'text-dark'
                }`}
                title={`${user.nombre} ${user.apellido}`}
              >
                {truncateString(user.nombre, 15)}{' '}
                {truncateString(user.apellido, 15)}
              </h6>
              <div
                className={`d-flex align-items-center small mb-2 ${
                  darkMode ? 'text-light' : 'text-secondary'
                }`}
              >
                <FaEnvelope className="me-2" size={12} />
                <span title={user.email} className="text-truncate">
                  {user.email}
                </span>
              </div>
              <Badge
                bg={getRoleBadgeVariant(user.rol)}
                className="align-self-start px-2 py-1 text-white"
              >
                {capitalizeFirstLetter(user.rol)}
              </Badge>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
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
