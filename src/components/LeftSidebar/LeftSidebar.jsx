// src/components/LeftSidebar/LeftSidebar.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  FaEdit,
  FaFile,
  FaTrash,
  FaHistory,
  FaUserFriends,
  FaTimes,
  FaLock,
  FaUserShield,
  FaFileAlt,
  FaDatabase
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { Offcanvas, Button, ListGroup, Card, Badge } from 'react-bootstrap'

const LeftSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const isDarkMode = document.body.className.includes('bg-dark')

  if (!user || (user.rol !== 'empleado' && user.rol !== 'administrador')) {
    return null
  }

  const hasPermission = (permission) => {
    if (user.rol === 'administrador') return true
    if (!user.permisos) return false
    return user.permisos[permission]
  }

  const renderListItem = (
    to,
    icon,
    text,
    permission = null,
    isAdmin = false
  ) => {
    const hasAccess = permission
      ? hasPermission(permission)
      : isAdmin && user.rol === 'administrador'
    const Icon = icon

    return (
      <ListGroup.Item
        as={Link}
        to={to}
        action
        onClick={onClose}
        disabled={!hasAccess}
        className={`
          ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}
          d-flex align-items-center justify-content-between py-3
          ${!hasAccess ? 'opacity-50' : ''}
        `}
      >
        <div className="d-flex align-items-center">
          <Icon className="me-3" />
          <span>{text}</span>
        </div>
        {!hasAccess && (
          <Badge bg="secondary" className="ms-2">
            <FaLock size={12} />
          </Badge>
        )}
      </ListGroup.Item>
    )
  }

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="start"
      className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
    >
      <Offcanvas.Header className="border-bottom border-secondary">
        <Offcanvas.Title className="d-flex align-items-center">
          <FaDatabase className="me-2" />
          <span>Menú de Administración</span>
        </Offcanvas.Title>
        <Button
          variant="link"
          onClick={onClose}
          className={`p-0 ms-auto ${isDarkMode ? 'text-white' : 'text-dark'}`}
        >
          <FaTimes size={24} />
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Card
          className={`mb-4 col-12 ${isDarkMode ? 'bg-dark text-white border-secondary' : 'bg-light'}`}
        >
          <Card.Header className="border-bottom border-secondary py-3">
            <h5 className="mb-0 d-flex align-items-center fw-bold text-primary">
              <FaFileAlt className="me-2" />
              Gestión de Archivos
            </h5>
          </Card.Header>
          <ListGroup
            variant={isDarkMode ? 'dark' : 'light'}
            className="list-group-flush"
          >
            {renderListItem(
              '/agregar-archivo',
              FaFile,
              'Agregar Archivo',
              'crear'
            )}
            {renderListItem(
              '/editar-archivo',
              FaEdit,
              'Editar o Eliminar Archivo',
              'editar'
            )}
            {renderListItem(
              '/historial-archivos',
              FaHistory,
              'Historial de Archivos',
              'editar'
            )}
            {renderListItem(
              '/archivos-eliminados',
              FaTrash,
              'Archivos Eliminados',
              'eliminar'
            )}
          </ListGroup>
        </Card>

        {user.rol === 'administrador' && (
          <Card
            className={`mb-4 col-12 ${isDarkMode ? 'bg-dark text-white border-secondary' : 'bg-light'}`}
          >
            <Card.Header className="border-bottom border-secondary py-3">
              <h5 className="mb-0 d-flex align-items-center fw-bold text-primary">
                <FaUserShield className="me-2" />
                Administración
              </h5>
            </Card.Header>
            <ListGroup
              variant={isDarkMode ? 'dark' : 'light'}
              className="list-group-flush"
            >
              {renderListItem(
                '/gestionar-empleados',
                FaUserFriends,
                'Gestionar Empleados',
                null,
                true
              )}
            </ListGroup>
          </Card>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

LeftSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LeftSidebar
