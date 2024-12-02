// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col, Image, Alert, Container } from 'react-bootstrap'
import { useTheme } from '../../../context/ThemeContext'
import { useNotification } from '../../../hooks/useNotification'
import { useAuth } from '../../../context/AuthContext'
import EmployeeList from './EmployeeList/EmployeeList'
import SuccessorSection from './SuccessorSection/SuccessorSection'
import manageEmployeesImage from '../../../assets/topaz-museo_historico_4.avif'

const CurrentEmployeesList = ({
  employees,
  setCurrentEmployees,
  fetchCurrentEmployees
}) => {
  const { token, user } = useAuth()
  const { isDarkMode } = useTheme()
  const showNotification = useNotification()
  const [successor, setSuccessor] = useState(null)
  const [successorError, setSuccessorError] = useState(null)

  const fetchSuccessor = useCallback(async () => {
    try {
      const response = await window.axiosInstance.get(
        `/admin/get-successor/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setSuccessor(response.data.sucesor)
    } catch (error) {
      console.error('Error al obtener el sucesor:', error)
      throw error
    }
  }, [token, user])

  useEffect(() => {
    if (user && user.rol === 'administrador') {
      fetchCurrentEmployees()
      fetchSuccessor().catch((error) => {
        setSuccessorError(error)
        showNotification(
          'Hubo un error al obtener el sucesor del administrador.',
          'error'
        )
      })
    }
  }, [fetchSuccessor, fetchCurrentEmployees, user, showNotification])

  if (successorError) {
    return (
      <Alert variant="danger" className="m-3">
        Error: {successorError.message}
      </Alert>
    )
  }

  return (
    <Container fluid className="px-4 py-4">
      <div className="d-flex flex-column gap-4">
        {/* Primera fila: Gestionar Empleados y Sucesor */}
        <Row className="g-4">
          <Col xs={12} lg={6}>
            <Card
              className={`h-100 border-0 shadow-sm ${
                isDarkMode ? 'bg-dark text-light' : 'bg-white'
              }`}
            >
              <Card.Body>
                <Card.Title as="h4" className="mb-4">
                  Gestionar Empleados Actuales
                </Card.Title>
                <Image
                  src={manageEmployeesImage}
                  alt="Gestionar Empleados"
                  className="w-100 rounded-3 mb-4"
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <Card.Text className="mb-4">
                  En esta sección puedes administrar los empleados actuales del
                  sistema. Gestiona sus permisos y accesos de manera eficiente.
                </Card.Text>
                <div
                  className={`rounded-3 p-3 ${isDarkMode ? 'bg-dark-subtle' : 'bg-light'}`}
                >
                  <h5 className="h6 mb-3">Funciones Disponibles:</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-person-check text-success"></i>
                      <span>Visualizar el sucesor del administrador</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-shield-check text-primary"></i>
                      <span>Modificar estados y permisos</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-person-x text-danger"></i>
                      <span>Eliminar empleados</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <i className="bi bi-person-plus text-success"></i>
                      <span>Establecer nuevo sucesor</span>
                    </li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <SuccessorSection
              successor={successor}
              setSuccessor={setSuccessor}
              token={token}
              user={user}
              showNotification={showNotification}
            />
          </Col>
        </Row>

        {/* Segunda fila: Lista de Empleados */}
        <Row>
          <Col xs={12}>
            <EmployeeList
              employees={employees}
              setCurrentEmployees={setCurrentEmployees}
              token={token}
              user={user}
              showNotification={showNotification}
              fetchCurrentEmployees={fetchCurrentEmployees}
              successor={successor}
              fetchSuccessor={fetchSuccessor}
            />
          </Col>
        </Row>
      </div>
    </Container>
  )
}

CurrentEmployeesList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired,
  fetchCurrentEmployees: PropTypes.func.isRequired
}

export default CurrentEmployeesList
