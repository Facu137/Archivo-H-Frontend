// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import PossibleEmployeesList from './PossibleEmployeesList/PossibleEmployeesList'
import CurrentEmployeesList from './CurrentEmployeesList/CurrentEmployeesList'
import { useNotification } from '../../hooks/useNotification'
import '../GestionarEmpleados/GestionarEmpleados.css'

export const GestionarEmpleados = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const [currentEmployees, setCurrentEmployees] = useState([])
  const [error, setError] = useState(null)
  const showNotification = useNotification()

  const handleError = useCallback(
    (error) => {
      // Simplificado: Mostrar solo una notificación genérica de error de red.
      if (error.message === 'Network Error' || error.response?.status >= 500) {
        // O error del servidor
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

      console.error('Detalles del error para depuración:', error) // Log para desarrollo.

      setError(
        'Hubo un error. Por favor, verifica tu conexión e inténtalo de nuevo.'
      )
    },
    [showNotification]
  )

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [possibleEmpResponse, currentEmpResponse] = await Promise.all([
        window.axiosInstance.get('/admin/list-possible-employees'),
        window.axiosInstance.get('/admin/list-employees')
      ])
      setPossibleEmployees(possibleEmpResponse.data)
      setCurrentEmployees(currentEmpResponse.data)
      setError(null) // Limpia cualquier error previo si las peticiones son exitosas.
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const fetchCurrentEmployees = useCallback(async () => {
    // Movida fuera de fetchData
    try {
      const response = await window.axiosInstance.get('/admin/list-employees')
      setCurrentEmployees(response.data)
      setError(null)
    } catch (error) {
      handleError(error)
    }
  }, [handleError])

  useEffect(() => {
    if (!authLoading && user && user.rol === 'administrador') {
      fetchData()
    } else if (!authLoading && user && user.rol !== 'administrador') {
      showNotification('No tienes permisos para acceder a esta página', 'error')
    }
  }, [user, authLoading, showNotification, fetchData])

  if (authLoading || isLoading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div> // Muestra un mensaje de error genérico.
  }

  if (!user || user.rol !== 'administrador') {
    return <div>No tienes permisos para acceder a esta página.</div>
  }

  const handleAcceptConversion = async (employeeId) => {
    try {
      await window.axiosInstance.post('/admin/convert-to-employee', {
        userId: employeeId
      })
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
      await window.axiosInstance.put('/admin/cancel-employee-conversion', {
        userId: employeeId
      })
      showNotification('Conversión rechazada con éxito', 'success')
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
    } catch (error) {
      console.error('Error al rechazar la conversión:', error)
      handleError(error)
    }
  }

  return (
    <div className="gestion-main-container">
      <div className="gestion-section-container">
        <h2>Gestionar Nuevos Empleados</h2>
        <PossibleEmployeesList
          possibleEmployees={possibleEmployees}
          onAccept={handleAcceptConversion}
          onReject={handleRejectConversion}
          onUpdateCurrentEmployees={fetchCurrentEmployees} // Pasa fetchCurrentEmployees como prop
        />
      </div>
      <div className="gestion-section-container">
        <h2>Gestionar Empleados Actuales</h2>
        <CurrentEmployeesList
          employees={currentEmployees}
          setCurrentEmployees={setCurrentEmployees}
          fetchCurrentEmployees={fetchCurrentEmployees} // Pasa fetchCurrentEmployees como prop
        />
      </div>
    </div>
  )
}
