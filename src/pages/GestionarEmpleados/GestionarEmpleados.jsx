// src/pages/GestionarEmpleados/GestionarEmpleados.jsx
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../api/axiosConfig'
import UserCard from '../../components/UserCard/UserCard'
import { useAuth } from '../../context/AuthContext'
import './GestionarEmpleados.css'

const GestionarEmpleados = () => {
  const [possibleEmployees, setPossibleEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchPossibleEmployees = async () => {
      setIsLoading(true) // Mostrar mensaje de "Cargando..."
      try {
        const response = await axiosInstance.get(
          '/admin/list-possible-employees',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setPossibleEmployees(response.data)
      } catch (error) {
        console.error('Error fetching possible employees:', error)
      } finally {
        setIsLoading(false) // Ocultar mensaje de "Cargando..."
      }
    }

    fetchPossibleEmployees()
  }, [token])

  // Renderizado condicional
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
            user={{
              role: employee.rol,
              name: employee.nombre,
              lastName: employee.apellido,
              email: employee.email
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default GestionarEmpleados
