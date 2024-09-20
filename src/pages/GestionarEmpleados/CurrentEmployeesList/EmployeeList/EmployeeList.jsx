// src/pages/GestionarEmpleados/CurrentEmployeesList/EmployeeList.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../../../../components/Tooltip/Tooltip'
import UserCard from '../../../../components/UserCard/UserCard'
import EmployeeDetails from '../EmployeeDetails/EmployeeDetails'
import axiosInstance from '../../../../api/axiosConfig'
import './EmployeeList.css'

const EmployeeList = ({
  employees,
  token,
  user,
  showNotification,
  fetchCurrentEmployees,
  successor,
  fetchSuccessor
}) => {
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
    const { name, checked } = event.target // Extraemos name y checked del evento
    console.log(`Campo actualizado: ${name}, Valor: ${checked}`)
    // Actualiza el estado de manera inmutable
    setEditedEmployeeData((prevData) => ({
      ...prevData,
      [name]: checked // Solo se actualiza el campo del toggle switch
    }))
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
      fetchCurrentEmployees()
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      showNotification('Error al actualizar empleado', 'error')
    }
  }

  const handleSetSuccessor = async (employeeId) => {
    try {
      await axiosInstance.post(
        '/admin/set-successor',
        {
          adminId: user.id,
          employeeId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification('Sucesor establecido correctamente', 'success')
      fetchSuccessor()
    } catch (error) {
      console.error('Error al establecer sucesor:', error)
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 404)
      ) {
        showNotification(error.response.data.message, 'error')
      } else {
        showNotification('Error al establecer sucesor', 'error')
      }
    }
  }

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axiosInstance.delete(`/admin/remove-employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      showNotification('Empleado eliminado correctamente', 'success')
      fetchCurrentEmployees()
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
      if (error.response) {
        if (error.response.status === 400) {
          showNotification(error.response.data.message, 'error')
        } else if (error.response.status === 404) {
          showNotification('Empleado no encontrado', 'error')
        } else {
          showNotification('Error al eliminar empleado', 'error')
        }
      } else {
        showNotification('Error al eliminar empleado', 'error')
      }
    }
  }

  const isRemovable = (employee) => {
    return !employee.activo && (!successor || successor.id !== employee.id)
  }

  if (employees.length === 0) {
    return <div>No se encontraron empleados actuales.</div>
  }

  return (
    <div className="current-employee-list-container">
      {' '}
      {/* Nuevo contenedor para la tarjeta */}
      <div className="current-employee-card-config">
        <h3>Lista de Empleados Actuales</h3> {/* Título de la sección */}
        <p>
          Gestiona los permisos y el estado de los empleados actuales. Puedes
          establecer un sucesor para el administrador, modificar permisos,
          desactivar empleados o eliminarlos del sistema.
        </p>
        <div className="current-employee-list">
          {employees.map((employee) => (
            <div key={employee.id} className="current-employee-card-container">
              <UserCard user={employee} />
              {editingEmployeeId === employee.id ? (
                <>
                  <EmployeeDetails
                    employee={employee}
                    isEditing={true}
                    editedEmployeeData={editedEmployeeData}
                    onChange={handleInputChange}
                  />
                  <div className="current-employee-buttons-container">
                    <button onClick={handleSaveChanges}>Guardar Cambios</button>
                    <button onClick={() => handleSetSuccessor(employee.id)}>
                      Establecer Sucesor
                    </button>
                    <Tooltip content="No se puede eliminar un empleado que está activo o es sucesor.">
                      <span>
                        <button
                          onClick={() => handleRemoveEmployee(employee.id)}
                          disabled={!isRemovable(employee)}
                        >
                          Eliminar Empleado
                        </button>
                      </span>
                    </Tooltip>
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
        <p className="scroll-hint">Desplázate horizontalmente para ver más.</p>{' '}
        {/* Instrucciones de desplazamiento */}
      </div>
    </div>
  )
}

EmployeeList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  fetchCurrentEmployees: PropTypes.func.isRequired,
  successor: PropTypes.object, // Agrega successor como prop
  fetchSuccessor: PropTypes.func.isRequired // Agrega fetchSuccessor como prop
}

export default EmployeeList
