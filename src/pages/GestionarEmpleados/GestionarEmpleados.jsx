// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import PossibleEmployeesList from './PossibleEmployeesList/PossibleEmployeesList'
import CurrentEmployeesList from './CurrentEmployeesList/CurrentEmployeesList'
import { useNotification } from '../../hooks/useNotification'
import '../GestionarEmpleados/GestionarEmpleados.css'

export const GestionarEmpleados = () => {
  const { user, isLoading: authLoading } = useAuth() // Obtener user, token e isLoading del contexto
  const [isLoading, setIsLoading] = useState(true) // Estado de carga para las peticiones
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const [currentEmployees, setCurrentEmployees] = useState([])
  const [error, setError] = useState(null) // Estado para el mensaje de error
  const showNotification = useNotification()

  const handleError = useCallback(
    (error) => {
      if (error.message === 'Network Error') {
        setError('Error de red. Verifica tu conexión a internet.')
        showNotification(
          'Error de red. Verifica tu conexión a internet.',
          'error'
        )
      } else if (error.response?.status === 403) {
        setError('No tienes permiso para acceder a esta sección.')
        showNotification(
          'No tienes permiso para acceder a esta sección.',
          'error'
        )
      } else {
        setError('Error al obtener la lista de empleados.')
        showNotification('Error al obtener la lista de empleados.', 'error')
      }
    },
    [showNotification]
  )

  const fetchPossibleEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await window.axiosInstance.get(
        '/admin/list-possible-employees'
      ) // Usa window.axiosInstance
      setPossibleEmployees(response.data)
    } catch (error) {
      console.error('Error fetching possible employees:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const fetchCurrentEmployees = useCallback(async () => {
    try {
      const response = await window.axiosInstance.get('/admin/list-employees') // Usa window.axiosInstance
      setCurrentEmployees(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de empleados actuales:', error)
      handleError(error)
    }
  }, [handleError])

  useEffect(() => {
    if (!authLoading && user && user.rol === 'administrador') {
      setIsLoading(true) // Activar el indicador de carga
      Promise.all([fetchPossibleEmployees(), fetchCurrentEmployees()])
        .catch((err) => {
          handleError(err)
        })
        .finally(() => setIsLoading(false)) // Desactivar el indicador de carga, independientemente del resultado
    } else if (!authLoading && user && user.rol !== 'administrador') {
      showNotification('No tienes permisos para acceder a esta página', 'error')
    }
  }, [
    user,
    authLoading,
    showNotification,
    fetchPossibleEmployees,
    fetchCurrentEmployees,
    handleError
  ])

  if (authLoading || isLoading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!user || user.rol !== 'administrador') {
    return <div>No tienes permisos para acceder a esta página.</div>
  }

  const handleAcceptConversion = async (employeeId) => {
    try {
      await window.axiosInstance.post('/admin/convert-to-employee', {
        // Usa window.axiosInstance
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
        // Usa window.axiosInstance
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
          onUpdateCurrentEmployees={fetchCurrentEmployees}
        />
      </div>
      <div className="gestion-section-container">
        <h2>Gestionar Empleados Actuales</h2>
        <CurrentEmployeesList
          employees={currentEmployees}
          setCurrentEmployees={setCurrentEmployees}
        />
      </div>
    </div>
  )
}
