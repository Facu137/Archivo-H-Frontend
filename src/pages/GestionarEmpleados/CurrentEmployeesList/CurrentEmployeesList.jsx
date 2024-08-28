// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UserCard from '../../../components/UserCard/UserCard'
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
      // Construir dataToUpdate solo con los campos permitidos
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

      // Actualizar la lista de empleados
      // Opción 1: Volver a obtener la lista del backend
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
          {/* Información y controles del empleado */}
          {editingEmployeeId === employee.id ? ( // Mostrar formulario de edición
            <div className="employee-details">
              <div className="employee-info-item">
                <strong>Activo:</strong>
                <input
                  type="checkbox"
                  name="activo"
                  checked={editedEmployeeData.activo}
                  onChange={handleInputChange}
                />
              </div>
              {/* Mapeo de nombres de permisos */}
              {[
                { backend: 'permiso_crear', frontend: 'Crear Archivos' },
                { backend: 'permiso_editar', frontend: 'Editar Archivos' },
                { backend: 'permiso_eliminar', frontend: 'Eliminar Archivos' },
                {
                  backend: 'permiso_descargar',
                  frontend: 'Descargar Archivos'
                },
                {
                  backend: 'permiso_ver_archivos_privados',
                  frontend: 'Ver Archivos Ocultos'
                }
              ].map(({ backend, frontend }) => (
                <div key={backend} className="employee-info-item">
                  <strong>{frontend}:</strong>
                  <input
                    type="checkbox"
                    name={backend}
                    checked={editedEmployeeData[backend]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="buttons-container">
                <button onClick={handleSaveChanges}>Guardar Cambios</button>
                <button onClick={handleCancelClick}>Cancelar</button>
              </div>
            </div>
          ) : (
            // Mostrar información del empleado
            <div className="employee-details">
              <div className="employee-info-item">
                <strong>Activo:</strong>
                <span>{employee.activo ? 'Sí' : 'No'}</span>
              </div>
              {/* Mapeo de nombres de permisos */}
              {[
                { backend: 'permiso_crear', frontend: 'Crear Archivos' },
                { backend: 'permiso_editar', frontend: 'Editar Archivos' },
                { backend: 'permiso_eliminar', frontend: 'Eliminar Archivos' },
                {
                  backend: 'permiso_descargar',
                  frontend: 'Descargar Archivos'
                },
                {
                  backend: 'permiso_ver_archivos_privados',
                  frontend: 'Ver Archivos Ocultos'
                }
              ].map(({ backend, frontend }) => (
                <div key={backend} className="employee-info-item">
                  <strong>{frontend}:</strong>
                  {/* Mostrar 'Sí' o 'No' según el estado del permiso */}
                  <span>{employee[backend] ? 'Sí' : 'No'}</span>
                </div>
              ))}
              <button onClick={() => handleEditClick(employee.id)}>
                Modificar Empleado
              </button>
            </div>
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
