// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import ConversionKeyManager from './ConversionKeyManager/ConversionKeyManager'
import PossibleEmployeesList from './PossibleEmployeesList/PossibleEmployeesList'
import CurrentEmployeesList from './CurrentEmployeesList/CurrentEmployeesList'
import { useNotification } from '../../hooks/useNotification'
import '../GestionarEmpleados/GestionarEmpleados.css'

export const GestionarEmpleados = () => {
  const { user, token } = useAuth()
  // Estado para el indicador de carga
  const [isLoading, setIsLoading] = useState(true)
  // Estado para la lista de posibles empleados
  const [possibleEmployees, setPossibleEmployees] = useState([])
  // Estado para la lista de empleados actuales
  const [currentEmployees, setCurrentEmployees] = useState([])
  // Estado para el indicador de notificación
  const showNotification = useNotification()

  // Obtener la lista de empleados actuales
  const fetchCurrentEmployees = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/admin/list-employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCurrentEmployees(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de empleados actuales:', error)
      showNotification(
        'Error al obtener la lista de empleados actuales',
        'error'
      )
    }
  }, [token, showNotification])

  useEffect(() => {
    // Obtener la lista de posibles empleados
    const fetchPossibleEmployees = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(
          '/admin/list-possible-employees',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        console.log('GestionarEmpleados: respuesta del backend:', response.data)
        setPossibleEmployees(response.data)
      } catch (error) {
        console.error(
          'GestionarEmpleados: Error al obtener la lista de empleados:',
          error
        )
        if (error.response && error.response.status === 403) {
          showNotification(
            'No tienes permiso para acceder a esta sección.',
            'error'
          )
        } else {
          showNotification('Error al obtener la lista de empleados.', 'error')
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Verifica el rol del usuario DESPUÉS de que se haya cargado la información
    if (user && user.rol === 'administrador') {
      fetchPossibleEmployees()
      fetchCurrentEmployees()
    } else if (user) {
      // Si el usuario está cargado pero no es administrador
      showNotification(
        'No tienes permiso para acceder a esta sección.',
        'error'
      )
      setIsLoading(false)
    }
  }, [token, user, showNotification, fetchCurrentEmployees])

  if (isLoading) {
    return <div>Cargando empleados...</div>
  }
  const handleAcceptConversion = async (employeeId) => {
    try {
      await axiosInstance.post(
        '/admin/convert-to-employee',
        { userId: employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification('Empleado aceptado con éxito', 'success')

      // Actualizar la lista de posibles empleados
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )

      // Actualizar la lista de empleados actuales
      fetchCurrentEmployees()
    } catch (error) {
      showNotification('Error al aceptar la conversión', 'error')
    }
  }

  const handleRejectConversion = async (employeeId) => {
    try {
      await axiosInstance.put(
        '/admin/cancel-employee-conversion',
        { userId: employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification('Conversión rechazada con éxito', 'success')
      // Actualizar la lista de posibles empleados
      setPossibleEmployees(
        possibleEmployees.filter((employee) => employee.id !== employeeId)
      )
    } catch (error) {
      console.error('Error al rechazar la conversión:', error)
      showNotification('Error al rechazar la conversión', 'error')
    }
  }
  return (
    <>
      <h2>Gestionar Nuevos Empleados</h2>
      <div className="gestionar-nuevos-empleados-container">
        <ConversionKeyManager />
        <PossibleEmployeesList
          possibleEmployees={possibleEmployees}
          onAccept={handleAcceptConversion}
          onReject={handleRejectConversion}
          onUpdateCurrentEmployees={fetchCurrentEmployees}
        />
      </div>
      <div className="gestionar-empleados-actuales-container">
        <h2>Gestionar Empleados Actuales</h2>
        <CurrentEmployeesList
          employees={currentEmployees}
          setCurrentEmployees={setCurrentEmployees}
        />
      </div>
    </>
  )
}
