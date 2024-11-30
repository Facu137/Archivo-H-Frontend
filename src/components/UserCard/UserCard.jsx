// src/components/UserCard/UserCard.jsx
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  FaUser,
  FaUserTie,
  FaUserShield,
  FaEnvelope,
  FaCopy
} from 'react-icons/fa'
import {
  Card,
  Badge,
  Button,
  Overlay,
  Tooltip,
  Row,
  Col
} from 'react-bootstrap'

const UserCard = ({ user, darkMode, className }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const emailRef = useRef(null)
  const copyButtonRef = useRef(null)

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email).then(() => {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 1500)
    })
  }

  return (
    <Card
      className={`border ${
        darkMode
          ? 'bg-dark text-white border-secondary'
          : 'bg-white border-secondary border-opacity-50'
      } ${className || ''}`}
      style={{ minHeight: '120px' }}
    >
      <Card.Body className="p-3">
        <Row className="g-0">
          <Col xs="auto" className="me-3">
            <div
              className={`rounded-circle p-2 ${
                darkMode ? 'bg-dark bg-opacity-50' : 'bg-light'
              }`}
              style={{
                border: `2px solid var(--bs-${getRoleBadgeVariant(user.rol)})`,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? 'var(--bs-light)' : 'var(--bs-dark)',
                flexShrink: 0
              }}
            >
              {getAvatarByRole(user.rol)}
            </div>
          </Col>
          <Col className="min-width-0">
            <div className="d-flex flex-column h-100">
              <h6
                className={`mb-1 text-truncate fw-bold ${
                  darkMode ? 'text-white' : 'text-dark'
                }`}
                title={`${user.nombre} ${user.apellido}`}
                style={{ fontSize: '0.95rem', lineHeight: '1.2' }}
              >
                {truncateString(user.nombre, 15)}{' '}
                {truncateString(user.apellido, 15)}
              </h6>
              <div
                className={`d-flex align-items-center small mb-2 ${
                  darkMode ? 'text-light' : 'text-secondary'
                }`}
                style={{ minHeight: '24px' }}
              >
                <FaEnvelope className="me-2 flex-shrink-0" size={12} />
                <div className="d-flex align-items-center flex-grow-1 min-width-0">
                  <span
                    ref={emailRef}
                    title={user.email}
                    className="text-truncate me-2"
                  >
                    {user.email}
                  </span>
                  <Button
                    ref={copyButtonRef}
                    variant={darkMode ? 'outline-light' : 'outline-secondary'}
                    size="sm"
                    className="py-0 px-2 flex-shrink-0"
                    style={{ height: '20px' }}
                    onClick={handleCopyEmail}
                  >
                    <FaCopy size={12} />
                  </Button>
                </div>
                <Overlay
                  target={copyButtonRef.current}
                  show={showTooltip}
                  placement="top"
                >
                  {(props) => <Tooltip {...props}>¡Correo copiado!</Tooltip>}
                </Overlay>
              </div>
              <Badge
                bg={getRoleBadgeVariant(user.rol)}
                className="align-self-start px-2 py-1 text-white"
                style={{ fontSize: '0.75rem' }}
              >
                {capitalizeFirstLetter(user.rol)}
              </Badge>
            </div>
          </Col>
        </Row>
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
