// src/pages/GestionarEmpleados/CurrentEmployeesList/CurrentEmployeesList.jsx
import React from 'react'
import PropTypes from 'prop-types'
import UserCard from '../../../components/UserCard/UserCard'
import './CurrentEmployeesList.css' // Asegúrate de crear este archivo CSS

const CurrentEmployeesList = ({ employees }) => {
  if (employees.length === 0) {
    return <div>No se encontraron empleados actuales.</div>
  }

  return (
    <div className="employee-list">
      {employees.map((employee) => (
        <div key={employee.id} className="employee-card-container">
          <UserCard user={employee} />
          {/* ... (Aquí irán los botones para las acciones de la nueva sección) ... */}
        </div>
      ))}
    </div>
  )
}

CurrentEmployeesList.propTypes = {
  employees: PropTypes.array.isRequired
}

export default CurrentEmployeesList
