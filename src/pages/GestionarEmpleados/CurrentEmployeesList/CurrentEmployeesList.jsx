// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UserCard from '../../../components/UserCard/UserCard'
import EmployeeDetails from './EmployeeDetails/EmployeeDetails'
import { useNotification } from '../../../hooks/useNotification'
import axiosInstance from '../../../api/axiosConfig'
import { useAuth } from '../../../context/AuthContext'
import './CurrentEmployeesList.css'

const CurrentEmployeesList = ({ employees, setCurrentEmployees }) => {
  const { token } = useAuth()
  const showNotification = useNotification()
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [editedEmployeeData, setEditedEmployeeData] = useState(null)
  const allowedUpdates = [
    'activo',
    'permiso_crear',
    'permiso_editar',
    'permiso_eliminar',
    'permiso_descargar',
    'permiso_ver_archivos_privados'
  ]

  const handleEditClick = (employeeId) => {
    setEditingEmployeeId(employeeId)
    const employeeToEdit = employees.find(
      (employee) => employee.id === employeeId
    )
    setEditedEmployeeData({ ...employeeToEdit })
  }

  const handleCancelClick = () => {
    setEditingEmployeeId(null)
    setEditedEmployeeData(null)
  }

  const handleInputChange = (event) => {
    const { name, checked } = event.target
    setEditedEmployeeData({
      ...editedEmployeeData,
      [name]: checked
    })
  }

  const handleSaveChanges = async () => {
    try {
      const dataToUpdate = {}
      allowedUpdates.forEach((field) => {
        dataToUpdate[field] = editedEmployeeData[field]
      })

      await axiosInstance.put(
        `/admin/update-employee/${editingEmployeeId}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      showNotification('Empleado actualizado con éxito', 'success')
      setEditingEmployeeId(null)
      setEditedEmployeeData(null)

      const response = await axiosInstance.get('/admin/list-employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCurrentEmployees(response.data)
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      showNotification('Error al actualizar empleado', 'error')
    }
  }

  if (employees.length === 0) {
    return <div>No se encontraron empleados actuales.</div>
  }

  return (
    <div className="employee-list">
      {employees.map((employee) => (
        <div key={employee.id} className="employee-card-container">
          <UserCard user={employee} />
          {editingEmployeeId === employee.id ? (
            <>
              <EmployeeDetails
                employee={employee}
                isEditing={true}
                editedEmployeeData={editedEmployeeData}
                onChange={handleInputChange}
              />
              <div className="buttons-container">
                <button onClick={handleSaveChanges}>Guardar Cambios</button>
                <button onClick={handleCancelClick}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <EmployeeDetails employee={employee} isEditing={false} />
              <button onClick={() => handleEditClick(employee.id)}>
                Modificar Empleado
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

CurrentEmployeesList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired
}

export default CurrentEmployeesList
