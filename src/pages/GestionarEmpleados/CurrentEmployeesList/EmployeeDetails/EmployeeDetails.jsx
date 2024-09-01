// src/pages/GestionarEmpleados/CurrentEmployeesList/EmployeeDetails/EmployeeDetails.jsx
import React from 'react'
import PropTypes from 'prop-types'
import './EmployeeDetails.css'

const permissionsMap = [
  { backend: 'permiso_crear', frontend: 'Crear Archivos' },
  { backend: 'permiso_editar', frontend: 'Editar Archivos' },
  { backend: 'permiso_eliminar', frontend: 'Eliminar Archivos' },
  { backend: 'permiso_descargar', frontend: 'Descargar Archivos' },
  { backend: 'permiso_ver_archivos_privados', frontend: 'Ver Archivos Ocultos' }
]

const EmployeeDetails = ({
  employee,
  isEditing,
  editedEmployeeData,
  onChange
}) => (
  <div className="employee-details">
    <div className="employee-info-item">
      <strong>Activo:</strong>
      {isEditing ? (
        <input
          type="checkbox"
          name="activo"
          checked={editedEmployeeData.activo}
          onChange={onChange}
        />
      ) : (
        <span>{employee.activo ? 'Sí' : 'No'}</span>
      )}
    </div>
    {permissionsMap.map(({ backend, frontend }) => (
      <div key={backend} className="employee-info-item">
        <strong>{frontend}:</strong>
        {isEditing ? (
          <input
            type="checkbox"
            name={backend}
            checked={editedEmployeeData[backend]}
            onChange={onChange}
          />
        ) : (
          <span>{employee[backend] ? 'Sí' : 'No'}</span>
        )}
      </div>
    ))}
  </div>
)

EmployeeDetails.propTypes = {
  employee: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editedEmployeeData: PropTypes.object,
  onChange: PropTypes.func
}

export default EmployeeDetails
