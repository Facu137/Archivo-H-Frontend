// src/pages/GestionarEmpleados/PossibleEmployeesList/PossibleEmployeesList.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap'
import { useTheme } from '../../../context/ThemeContext'
import ConversionKeyManager from './ConversionKeyManager/ConversionKeyManager'
import UserCard from '../../../components/UserCard/UserCard'

const PossibleEmployeesList = ({
  possibleEmployees,
  onAccept,
  onReject,
  onUpdateCurrentEmployees
}) => {
  const { isDarkMode } = useTheme()

  if (possibleEmployees.length === 0) {
    return (
      <Container fluid className="p-0">
        <Alert
          variant={isDarkMode ? 'dark' : 'info'}
          className="m-0 border-0 rounded-3"
        >
          <span className={isDarkMode ? 'text-light' : ''}>
            No se encontraron posibles empleados.
          </span>
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="p-0">
      <Card
        className={`border-0 shadow-sm ${
          isDarkMode ? 'bg-dark text-light' : 'bg-light'
        }`}
      >
        <Card.Header
          className={`border-bottom py-3 ${
            isDarkMode ? 'bg-dark' : 'bg-light'
          }`}
        >
          <h3 className={`h4 mb-0 ${isDarkMode ? 'text-light' : ''}`}>
            Solicitudes de Nuevos Empleados
          </h3>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col>
              <p className={isDarkMode ? 'text-light' : 'text-muted'}>
                Aquí puedes aceptar o rechazar las solicitudes de nuevos
                empleados. En ambos casos, los usuarios serán notificados por
                correo electrónico.
              </p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <ConversionKeyManager />
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="d-flex flex-column gap-3">
                {possibleEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="position-relative rounded-3 overflow-hidden"
                  >
                    <UserCard
                      user={employee}
                      darkMode={isDarkMode}
                      className="mb-0 border-0 shadow-sm"
                    />
                    <div
                      className="position-absolute top-0 end-0 p-3 d-flex gap-2"
                      style={{ zIndex: 1 }}
                    >
                      <Button
                        variant={isDarkMode ? 'light' : 'success'}
                        size="sm"
                        className="px-3 py-2 rounded-3"
                        onClick={() => onAccept(employee.id)}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant={isDarkMode ? 'light' : 'danger'}
                        size="sm"
                        className="px-3 py-2 rounded-3"
                        onClick={() => onReject(employee.id)}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

PossibleEmployeesList.propTypes = {
  possibleEmployees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      rol: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  ).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onUpdateCurrentEmployees: PropTypes.func.isRequired
}

export default PossibleEmployeesList
