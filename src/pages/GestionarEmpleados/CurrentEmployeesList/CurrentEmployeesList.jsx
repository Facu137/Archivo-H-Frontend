// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useNotification } from '../../../hooks/useNotification'
import { useAuth } from '../../../context/AuthContext'
import axiosInstance from '../../../api/axiosConfig'
import EmployeeList from './EmployeeList/EmployeeList'
import SuccessorSection from './SuccessorSection/SuccessorSection'
import './CurrentEmployeesList.css'

const CurrentEmployeesList = ({ employees, setCurrentEmployees }) => {
  const { token, user } = useAuth()
  const showNotification = useNotification()
  const [successor, setSuccessor] = useState(null)
  const fetchSuccessor = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
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
      showNotification('Error al obtener el sucesor', 'error')
    }
  }, [token, user, showNotification])

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
  }, [token, showNotification, setCurrentEmployees])

  useEffect(() => {
    if (user && user.rol === 'administrador') {
      fetchSuccessor()
    }
  }, [fetchSuccessor, user])

  return (
    <>
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
      <SuccessorSection
        successor={successor} // Pasa el estado como prop
        setSuccessor={setSuccessor} // Pasa la función para actualizar el estado
        token={token}
        user={user}
        showNotification={showNotification}
      />
    </>
  )
}

CurrentEmployeesList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired
}

export default CurrentEmployeesList
