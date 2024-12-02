// src/pages/GestionarEmpleados/CurrentEmployeesList/SuccessorSection/SuccessorSection.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Alert } from 'react-bootstrap'
import { useTheme } from '../../../../context/ThemeContext'
import UserCard from '../../../../components/UserCard/UserCard'

const SuccessorSection = ({
  successor,
  setSuccessor,
  token,
  user,
  showNotification
}) => {
  const { isDarkMode } = useTheme()

  const handleRemoveSuccessor = async () => {
    try {
      await window.axiosInstance.delete(`/admin/remove-successor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      showNotification('Sucesor eliminado correctamente', 'success')
      setSuccessor(null)
    } catch (error) {
      console.error('Error al eliminar sucesor:', error)
      showNotification('Error al eliminar sucesor', 'error')
    }
  }

  return (
    <Card
      className={`border-0 shadow-sm ${
        isDarkMode ? 'bg-dark text-light' : 'bg-light'
      }`}
    >
      <Card.Header
        className={`border-bottom py-3 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
      >
        <h4 className="h5 mb-0">Sucesor del Administrador</h4>
      </Card.Header>
      <Card.Body className="p-4">
        {successor ? (
          <div className="d-flex flex-column gap-3">
            <div className="position-relative rounded-3 overflow-hidden">
              <UserCard
                user={successor}
                darkMode={isDarkMode}
                className="mb-0 border-0 shadow-sm"
              />
              <div className="mt-3 text-end">
                <Button
                  variant={isDarkMode ? 'light' : 'danger'}
                  size="sm"
                  className="px-3 py-2 rounded-3"
                  onClick={handleRemoveSuccessor}
                >
                  Quitar Sucesor
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Alert
            variant={isDarkMode ? 'dark' : 'info'}
            className="mb-0 border-0"
          >
            <span className={isDarkMode ? 'text-light' : ''}>
              No hay un sucesor asignado.
            </span>
          </Alert>
        )}
      </Card.Body>
    </Card>
  )
}

SuccessorSection.propTypes = {
  successor: PropTypes.object,
  setSuccessor: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default SuccessorSection
