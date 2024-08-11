// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import UserCard from '../../components/UserCard/UserCard'
import './GestionarEmpleados.css'
import { useNotification } from '../../hooks/useNotification'

export const GestionarEmpleados = () => {
  const { user, token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const showNotification = useNotification()

  useEffect(() => {
    console.log('GestionarEmpleados: useEffect se ejecutó')

    const fetchPossibleEmployees = async () => {
      console.log('GestionarEmpleados: fetchPossibleEmployees se ejecutó')
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
      console.log('GestionarEmpleados: el usuario es administrador')
      fetchPossibleEmployees()
    } else if (user) {
      // Si el usuario está cargado pero no es administrador
      console.log('GestionarEmpleados: el usuario no es administrador')
      showNotification(
        'No tienes permiso para acceder a esta sección.',
        'error'
      )
      setIsLoading(false)
    }
  }, [token, user, showNotification])

  console.log('GestionarEmpleados: renderizando componente') // Log para el renderizado del componente
  console.log('GestionarEmpleados: isLoading:', isLoading) // Log para el estado isLoading
  console.log('GestionarEmpleados: possibleEmployees:', possibleEmployees) // Log para el estado possibleEmployees

  if (isLoading) {
    return <div>Cargando empleados...</div>
  }

  if (possibleEmployees.length === 0) {
    return <div>No se encontraron posibles empleados.</div>
  }

  return (
    <div className="gestionar-empleados-container">
      <h2>Gestionar Empleados</h2>
      <div className="employee-list">
        {possibleEmployees.map((employee) => (
          <UserCard
            key={employee.email}
            user={{ ...employee, name: employee.nombre || '' }}
          />
        ))}
      </div>
    </div>
  )
}
