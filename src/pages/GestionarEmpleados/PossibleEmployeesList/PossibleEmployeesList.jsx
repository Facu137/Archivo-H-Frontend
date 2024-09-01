// src/pages/GestionarEmpleados/PossibleEmployeesList/PossibleEmployeesList.jsx
import PropTypes from 'prop-types'
import UserCard from '../../../components/UserCard/UserCard'
import './PossibleEmployeesList.css'

const PossibleEmployeesList = ({
  possibleEmployees,
  onAccept,
  onReject,
  onUpdateCurrentEmployees
}) => {
  if (possibleEmployees.length === 0) {
    return <div>No se encontraron posibles empleados.</div>
  }
  const handleAccept = async (employeeId) => {
    await onAccept(employeeId) // Llama a la función onAccept que viene del padre
    onUpdateCurrentEmployees() // Llama a la función para actualizar la lista de empleados actuales
  }

  return (
    <div className="employee-list">
      {possibleEmployees.map((employee) => (
        <div key={employee.id} className="employee-card-container">
          <UserCard user={employee} />
          <div className="buttons-container">
            <button onClick={() => handleAccept(employee.id)}>Aceptar</button>
            <button onClick={() => onReject(employee.id)}>Rechazar</button>
          </div>
        </div>
      ))}
    </div>
  )
}
PossibleEmployeesList.propTypes = {
  possibleEmployees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      rol: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  ).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onUpdateCurrentEmployees: PropTypes.func.isRequired
}

export default PossibleEmployeesList
