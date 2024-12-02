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
              <Card.Header
                className={`border-bottom py-3 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
              >
                <h4 className="text-center m-0 h3">
                  Gestionar Empleados Actuales
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <Image
                    src={manageEmployeesImage}
                    alt="Gestionar Empleados"
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
                <p className="lead mb-4">
                  En esta sección puedes administrar los empleados actuales del
                  sistema. Gestiona sus permisos y accesos de manera eficiente.
                </p>
                <div
                  className={`rounded-3 p-4 ${isDarkMode ? 'bg-dark border border-secondary' : 'bg-white border'}`}
                >
                  <h5 className="h6 mb-3 fw-bold">Funciones Disponibles:</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3 d-flex align-items-center gap-3">
                      <div
                        className={`p-2 rounded-circle ${isDarkMode ? 'bg-success bg-opacity-10' : 'bg-success bg-opacity-10'}`}
                      >
                        <i className="bi bi-person-check text-success"></i>
                      </div>
                      <span className={isDarkMode ? 'text-light' : 'text-dark'}>
                        Visualizar el sucesor del administrador
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-3">
                      <div
                        className={`p-2 rounded-circle ${isDarkMode ? 'bg-primary bg-opacity-10' : 'bg-primary bg-opacity-10'}`}
                      >
                        <i className="bi bi-shield-check text-primary"></i>
                      </div>
                      <span className={isDarkMode ? 'text-light' : 'text-dark'}>
                        Modificar estados y permisos
                      </span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-3">
                      <div
                        className={`p-2 rounded-circle ${isDarkMode ? 'bg-danger bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                      >
                        <i className="bi bi-person-x text-danger"></i>
                      </div>
                      <span className={isDarkMode ? 'text-light' : 'text-dark'}>
                        Eliminar empleados
                      </span>
                    </li>
                    <li className="d-flex align-items-center gap-3">
                      <div
                        className={`p-2 rounded-circle ${isDarkMode ? 'bg-success bg-opacity-10' : 'bg-success bg-opacity-10'}`}
                      >
                        <i className="bi bi-person-plus text-success"></i>
                      </div>
                      <span className={isDarkMode ? 'text-light' : 'text-dark'}>
                        Establecer nuevo sucesor
                      </span>
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
