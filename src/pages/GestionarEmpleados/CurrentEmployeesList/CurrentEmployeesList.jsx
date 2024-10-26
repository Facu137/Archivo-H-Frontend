// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useNotification } from '../../../hooks/useNotification'
import { useAuth } from '../../../context/AuthContext'
import EmployeeList from './EmployeeList/EmployeeList'
import SuccessorSection from './SuccessorSection/SuccessorSection'
import manageEmployeesImage from '../../../assets/topaz-museo_historico_4.avif'
import './CurrentEmployeesList.css'

const CurrentEmployeesList = ({
  employees,
  setCurrentEmployees,
  fetchCurrentEmployees
}) => {
  const { token, user } = useAuth()
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
      fetchCurrentEmployees() // Llama a fetchCurrentEmployees directamente (usando la prop)
      fetchSuccessor().catch((error) => {
        setSuccessorError(error)
        showNotification(
          'Hubo un error al obtener el sucesor del administrador.',
          'error'
        )
      })
    }
  }, [fetchSuccessor, fetchCurrentEmployees, user, showNotification]) // fetchCurrentEmployees como dependencia.

  if (successorError) {
    return <div className="error-message">Error: {successorError.message}</div> // Manejo de error del sucesor.
  }

  // Si no hay error del sucesor, renderiza el componente normal. No necesitas verificar fetchError.
  return (
    <div className="employees-section-container">
      <div className="cards-container">
        <div className="card-config description-card">
          <h3>Gestionar Empleados Actuales</h3>
          <img
            src={manageEmployeesImage}
            alt="Gestionar Empleados"
            className="manage-employees-image"
          />
          <p>
            En esta sección puedes administrar los empleados actuales del
            sistema.
          </p>
          <ul>
            <li>Visualizar el sucesor del administrador.</li>
            <li>Modificar los estados y permisos de los empleados.</li>
            <li>Eliminar empleados.</li>
            <li>Establecer un nuevo sucesor para el administrador.</li>
          </ul>
        </div>
        <div className="card-config successor-data">
          <h3>Sucesor del Administrador</h3>
          <SuccessorSection
            successor={successor}
            setSuccessor={setSuccessor}
            token={token}
            user={user}
            showNotification={showNotification}
          />
          <p>
            Es importante asignar un sucesor, ya que este empleado será quien
            reemplace al administrador en caso de que este elimine su cuenta.
          </p>
        </div>
      </div>
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
    </div>
  )
}

CurrentEmployeesList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired,
  fetchCurrentEmployees: PropTypes.func.isRequired
}

export default CurrentEmployeesList
