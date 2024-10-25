// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import PossibleEmployeesList from './PossibleEmployeesList/PossibleEmployeesList'
import CurrentEmployeesList from './CurrentEmployeesList/CurrentEmployeesList'
import { useNotification } from '../../hooks/useNotification'
import '../GestionarEmpleados/GestionarEmpleados.css'

export const GestionarEmpleados = () => {
  const { user, isLoading: authLoading } = useAuth() // Obtener user, token e isLoading del contexto
  const [isLoading, setIsLoading] = useState(true) // Estado de carga para las peticiones
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const [currentEmployees, setCurrentEmployees] = useState([])
  const showNotification = useNotification()

  const handleError = useCallback((error, showNotification) => {
    if (error.code === 'NETWORK_ERROR') {
      showNotification(
        'Error de red. Verifica tu conexión a internet.',
        'error'
      )
    } else if (error.code === 'FORBIDDEN_ERROR') {
      showNotification(
        'No tienes permiso para acceder a esta sección.',
        'error'
      )
    } else {
      showNotification('Error al obtener la lista de empleados.', 'error')
    }
  }, []) // handleError ya no tiene dependencias

  const fetchPossibleEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/admin/list-possible-employees')
      setPossibleEmployees(response.data)
    } catch (error) {
      console.error('Error fetching possible employees:', error)
      handleError(error, showNotification) // Pasa showNotification a handleError
    } finally {
      setIsLoading(false)
    }
  }, [showNotification, handleError]) // showNotification ya no es una dependencia

  const fetchCurrentEmployees = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/admin/list-employees')
      setCurrentEmployees(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de empleados actuales:', error)
      handleError(error, showNotification) // Pasa showNotification a handleError
    }
  }, [showNotification, handleError]) // showNotification ya no es una dependencia

  useEffect(() => {
    if (!authLoading && user && user.rol === 'administrador') {
      fetchPossibleEmployees()
      fetchCurrentEmployees()
    } else if (!authLoading && user && user.rol !== 'administrador') {
      showNotification('No tienes permisos para acceder a esta página', 'error')
    }
  }, [
    user,
    authLoading,
    showNotification,
    fetchPossibleEmployees,
    fetchCurrentEmployees
  ])

  if (authLoading || isLoading) {
    return <div>Cargando...</div>
  }

  if (!user || user.rol !== 'administrador') {
    return <div>No tienes permisos para acceder a esta página.</div>
  }

  const handleAcceptConversion = async (employeeId) => {
    try {
      await axiosInstance.post('/admin/convert-to-employee', {
        userId: employeeId
      })
      showNotification('Empleado aceptado con éxito', 'success')
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
      fetchCurrentEmployees()
    } catch (error) {
      handleError(error, showNotification) // Pasa showNotification a handleError
    }
  }

  const handleRejectConversion = async (employeeId) => {
    try {
      await axiosInstance.put('/admin/cancel-employee-conversion', {
        userId: employeeId
      })
      showNotification('Conversión rechazada con éxito', 'success')
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
    } catch (error) {
      console.error('Error al rechazar la conversión:', error)
      handleError(error, showNotification) // Pasa showNotification a handleError
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
