// src/pages/GestionarEmpleados/CurrentEmployeesList/SuccessorSection/SuccessorSection.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Alert } from 'react-bootstrap'
import { useTheme } from '../../../../context/ThemeContext'
import UserCard from '../../../../components/UserCard/UserCard'
import { empleadosService } from '../../../../services/empleados.service'

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
      await empleadosService.eliminarSucesor(user.id)
      showNotification('Sucesor eliminado con éxito', 'success')
      setSuccessor(null)
    } catch (error) {
      console.error('Error al eliminar sucesor:', error)
      showNotification('Error al eliminar sucesor', 'error')
    }
  }

  return (
    <Card
      className={`border-0 shadow-sm ${
        isDarkMode ? 'bg-dark text-light' : 'bg-white'
      }`}
    >
      <Card.Header
        className={`border-bottom py-3 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
      >
        <h4 className="text-center m-0 h3">Sucesor Actual</h4>
      </Card.Header>
      <Card.Body className="p-4">
        {successor ? (
          <UserCard
            user={successor}
            darkMode={isDarkMode}
            className="border-0 mb-0"
          />
        ) : (
          <Alert variant="warning">No hay sucesor asignado.</Alert>
        )}
        {successor && (
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant={isDarkMode ? 'outline-light' : 'outline-danger'}
              onClick={handleRemoveSuccessor}
            >
              Eliminar Sucesor
            </Button>
          </div>
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
