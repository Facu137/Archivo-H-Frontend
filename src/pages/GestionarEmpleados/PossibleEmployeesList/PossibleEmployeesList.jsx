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
    await onAccept(employeeId)
    onUpdateCurrentEmployees()
  }

  return (
    <div className="possible-employee-list-container">
      <div className="possible-employees-card-config">
        <h3>Solicitudes de Nuevos Empleados</h3>
        <p>
          Aquí puedes aceptar o rechazar las solicitudes de nuevos empleados. En
          ambos casos, los usuarios serán notificados por correo electrónico.
        </p>
        <div className="possible-employee-list">
          {possibleEmployees.map((employee) => (
            <div
              key={employee.id}
              className="possible-employee-listcard-container"
            >
              <UserCard user={employee} />
              <div className="buttons-container">
                <button onClick={() => handleAccept(employee.id)}>
                  Aceptar
                </button>
                <button onClick={() => onReject(employee.id)}>Rechazar</button>
              </div>
            </div>
          ))}
        </div>
        <p>Desplázate horizontalmente para ver más.</p>
      </div>
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
