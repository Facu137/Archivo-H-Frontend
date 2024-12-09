// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { empleadosService } from '../../services/empleados.service'
import PossibleEmployeesList from './PossibleEmployeesList/PossibleEmployeesList'
import CurrentEmployeesList from './CurrentEmployeesList/CurrentEmployeesList'
import { useNetwork } from '../../context/NetworkContext'
import { useNotification } from '../../hooks/useNotification'
import topazImage from '../../assets/topaz-museo_historico_4.avif'

const GestionarEmpleados = () => {
  const { user, isLoading: authLoading } = useAuth()
  const { isDarkMode } = useTheme()
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const [currentEmployees, setCurrentEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const showNotification = useNotification()
  const { isOnline } = useNetwork()
  const [lastUpdate, setLastUpdate] = useState(null)

  const handleError = useCallback(
    (error) => {
      if (error.message === 'Network Error' || error.response?.status >= 500) {
        showNotification(
          'Error de red o servidor. Por favor, inténtalo de nuevo más tarde.',
          'error'
        )
      } else if (error.response?.status === 403) {
        showNotification(
          'No tienes permiso para acceder a esta sección.',
          'error'
        )
      } else {
        showNotification(
          'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
          'error'
        )
      }
      console.error('Detalles del error para depuración:', error)
      setError(
        'Hubo un error. Por favor, verifica tu conexión e inténtalo de nuevo.'
      )
    },
    [showNotification]
  )

  const fetchData = useCallback(async () => {
    // No hacer fetch si no hay conexión o si ya hay datos y no ha pasado suficiente tiempo
    if (!isOnline) {
      setError(
        'No hay conexión a internet. Se muestran los últimos datos disponibles.'
      )
      setIsLoading(false)
      return
    }

    // Evitar múltiples solicitudes en un corto período
    const now = Date.now()
    if (lastUpdate && now - lastUpdate < 5000) {
      return
    }

    setIsLoading(true)
    try {
      const [possibleEmpResponse, currentEmpResponse] = await Promise.all([
        empleadosService.listarPosiblesEmpleados(),
        empleadosService.listarEmpleados()
      ])
      setPossibleEmployees(possibleEmpResponse.data)
      setCurrentEmployees(currentEmpResponse.data)
      setError(null)
      setLastUpdate(now)
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleError, isOnline, lastUpdate])

  const fetchCurrentEmployees = useCallback(async () => {
    if (!isOnline) {
      showNotification(
        'No hay conexión a internet. No se pueden actualizar los datos.',
        'warning'
      )
      return
    }

    try {
      const response = await empleadosService.listarEmpleados()
      setCurrentEmployees(response.data)
      setError(null)
      setLastUpdate(Date.now())
    } catch (error) {
      handleError(error)
    }
  }, [handleError, isOnline, showNotification])

  useEffect(() => {
    if (!authLoading && user && user.rol === 'administrador') {
      fetchData()
    } else if (!authLoading && user && user.rol !== 'administrador') {
      showNotification('No tienes permisos para acceder a esta página', 'error')
    }
  }, [user, authLoading, showNotification, fetchData])

  // Solo mostrar el spinner en la carga inicial cuando hay conexión
  if (authLoading || (isLoading && isOnline && !lastUpdate)) {
    return (
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant={isDarkMode ? 'light' : 'dark'} />
      </Container>
    )
  }

  if (!isOnline && !currentEmployees.length) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No hay conexión a internet y no hay datos disponibles para mostrar.
        </Alert>
      </Container>
    )
  }

  if (error && !currentEmployees.length) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  if (!user || user.rol !== 'administrador') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No tienes permisos para acceder a esta página.
        </Alert>
      </Container>
    )
  }

  const handleAcceptConversion = async (employeeId) => {
    try {
      await empleadosService.convertirAEmpleado(employeeId)
      showNotification('Empleado aceptado con éxito', 'success')
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
      fetchCurrentEmployees()
    } catch (error) {
      handleError(error)
    }
  }

  const handleRejectConversion = async (employeeId) => {
    try {
      await empleadosService.cancelarConversionEmpleado(employeeId)
      showNotification('Conversión rechazada con éxito', 'success')
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className="min-vh-100 py-5">
      <Container fluid className="px-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={11} xxl={10}>
            <Card
              className={`border-0 shadow-sm overflow-hidden ${
                isDarkMode ? 'bg-dark text-light' : 'bg-light'
              }`}
            >
              <div
                className="position-relative"
                style={{ height: '200px', overflow: 'hidden' }}
              >
                <img
                  src={topazImage}
                  alt="Banner"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  className="position-absolute w-100 h-100 top-0 start-0"
                  style={{
                    background:
                      'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
                  }}
                />
                <h1 className="position-absolute bottom-0 start-0 text-white p-4 m-0">
                  Gestión de Empleados
                </h1>
              </div>
              <Card.Body className="p-4">
                <Row className="g-4">
                  <Col xs={12} xl={6}>
                    <PossibleEmployeesList
                      possibleEmployees={possibleEmployees}
                      onAccept={handleAcceptConversion}
                      onReject={handleRejectConversion}
                      onUpdateCurrentEmployees={fetchCurrentEmployees}
                    />
                  </Col>
                  <Col xs={12} xl={6}>
                    <CurrentEmployeesList
                      employees={currentEmployees}
                      setCurrentEmployees={setCurrentEmployees}
                      fetchCurrentEmployees={fetchCurrentEmployees}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default GestionarEmpleados
