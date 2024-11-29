// src/components/RightSidebar/RightSidebar.jsx
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FaSignOutAlt, FaEdit, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import UserCard from '../UserCard/UserCard'
import { Offcanvas, Button, ListGroup, Badge } from 'react-bootstrap'
import localforage from 'localforage'

const permissionNames = {
  crear: 'Crear Archivos',
  editar: 'Editar Archivos',
  eliminar: 'Eliminar Archivos',
  descargar: 'Descargar Archivos',
  verArchivosPrivados: 'Ver Archivos Ocultos'
}

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [localUser, setLocalUser] = useState(null)
  const isDarkMode = document.body.className.includes('bg-dark')

  useEffect(() => {
    const getLocalUser = async () => {
      const storedUser = await localforage.getItem('user')
      setLocalUser(storedUser)
    }

    getLocalUser()
  }, [])

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  if (!user && !localUser) {
    return null
  }

  const displayUser = user || localUser

  const permisosHabilitados =
    displayUser.rol === 'empleado'
      ? Object.keys(displayUser.permisos).filter(
          (permiso) => displayUser.permisos[permiso]
        )
      : []

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
    >
      <Offcanvas.Header>
        <Offcanvas.Title>Mi Cuenta</Offcanvas.Title>
        <Button
          variant="link"
          onClick={onClose}
          className={`p-0 ms-auto ${isDarkMode ? 'text-white' : 'text-dark'}`}
        >
          <FaTimes size={24} />
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="mb-4">
          <UserCard user={displayUser} darkMode={isDarkMode} />
        </div>

        {displayUser.rol === 'empleado' && (
          <div className="mb-3">
            <h6 className={isDarkMode ? 'text-light' : 'text-dark'}>
              Estado:{' '}
              <Badge bg={displayUser.activo ? 'success' : 'danger'}>
                {displayUser.activo
                  ? 'Empleado Habilitado'
                  : 'Empleado Sin Habilitar'}
              </Badge>
            </h6>
          </div>
        )}

        {permisosHabilitados.length > 0 && (
          <div className="mb-4">
            <h6 className={isDarkMode ? 'text-light' : 'text-dark'}>
              Permisos Habilitados
            </h6>
            <ListGroup variant={isDarkMode ? 'dark' : 'light'}>
              {permisosHabilitados.map((permiso) => (
                <ListGroup.Item
                  key={permiso}
                  className={
                    isDarkMode ? 'bg-dark text-white border-secondary' : ''
                  }
                >
                  <strong>{permissionNames[permiso] || permiso}</strong>
                  <Badge bg="success" className="ms-2">
                    Habilitado
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <div className="d-grid gap-2">
          <Link to="/profile" className="text-decoration-none">
            <Button
              variant={isDarkMode ? 'outline-light' : 'outline-dark'}
              className="w-100 mb-2"
              onClick={onClose}
            >
              <FaEdit className="me-2" />
              Editar Perfil
            </Button>
          </Link>
          <Button
            variant={isDarkMode ? 'danger' : 'outline-danger'}
            onClick={handleLogout}
            className="w-100"
          >
            <FaSignOutAlt className="me-2" />
            Cerrar Sesión
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar
