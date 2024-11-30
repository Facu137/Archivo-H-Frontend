// src/components/RightSidebar/RightSidebar.jsx
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FaSignOutAlt, FaEdit, FaTimes, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import UserCard from '../UserCard/UserCard'
import { Offcanvas, Button, ListGroup, Badge, Card } from 'react-bootstrap'
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
      <Offcanvas.Header className="border-bottom border-secondary">
        <Offcanvas.Title className="d-flex align-items-center">
          <FaUser className="me-2" />
          <span>Mi Cuenta</span>
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
        <div className="d-flex flex-column align-items-center">
          <UserCard user={displayUser} darkMode={isDarkMode} className="mb-3" />

          {displayUser.rol === 'empleado' && (
            <Card
              className={`mb-3  ${isDarkMode ? 'bg-dark text-white border-secondary' : 'bg-light'}`}
            >
              <Card.Body className="p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Estado</h6>
                  <Badge
                    bg={displayUser.activo ? 'success' : 'danger'}
                    className="px-3 py-2"
                  >
                    {displayUser.activo
                      ? 'Empleado Habilitado'
                      : 'Empleado Sin Habilitar'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          )}

          {permisosHabilitados.length > 0 && (
            <Card
              className={`mb-4 ${isDarkMode ? 'bg-dark text-white border-secondary' : 'bg-light'}`}
            >
              <Card.Header className="border-bottom border-secondary py-3">
                <h5 className="mb-0 d-flex align-items-center fw-bold text-primary">
                  <FaEdit className="me-2" />
                  Permisos
                </h5>
              </Card.Header>
              <ListGroup
                variant={isDarkMode ? 'dark' : 'light'}
                className="list-group-flush"
              >
                {permisosHabilitados.map((permiso) => (
                  <ListGroup.Item
                    key={permiso}
                    className={` 
                      ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}
                      d-flex align-items-center justify-content-between py-3
                    `}
                  >
                    <span>{permissionNames[permiso] || permiso}</span>
                    <Badge bg="success" className="px-3">
                      Habilitado
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}

          <div className="d-flex flex-column">
            <Link to="/editar-perfil" className="text-decoration-none">
              <Button
                variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                className="w-100 mb-2 d-flex align-items-center justify-content-center py-2"
                onClick={onClose}
              >
                <FaEdit className="me-2" />
                <span>Editar Perfil</span>
              </Button>
            </Link>
            <Button
              variant={isDarkMode ? 'danger' : 'outline-danger'}
              onClick={handleLogout}
              className="w-100 d-flex align-items-center justify-content-center py-2"
            >
              <FaSignOutAlt className="me-2" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
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
