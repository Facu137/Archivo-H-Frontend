// src/pages/GestionarEmpleados/PossibleEmployeesList/PossibleEmployeesList.jsx
import PropTypes from 'prop-types'
import ScrollableCardList from '../../../components/ScrollableCardList/ScrollableCardList'
import ConversionKeyManager from './ConversionKeyManager/ConversionKeyManager'
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

  return (
    <div className="possible-employees-section-container">
      <ConversionKeyManager />
      <ScrollableCardList
        title="Solicitudes de Nuevos Empleados"
        description="Aquí puedes aceptar o rechazar las solicitudes de nuevos empleados. En ambos casos, los usuarios serán notificados por correo electrónico."
        items={possibleEmployees}
        cardClassName="possible-employees-list-card"
        listClassName="possible-employee-list"
        itemClassName="possible-employee-listcard-container"
        onAccept={onAccept} // Pasa la función onAccept como prop
        onReject={onReject} // Pasa la función onReject como prop
        onUpdateCurrentEmployees={onUpdateCurrentEmployees} // Pasa onUpdateCurrentEmployees como prop
      >
        {(
          item // Pasa una función como children
        ) => (
          <div className="buttons-container">
            <button onClick={() => onAccept(item.id)}>Aceptar</button>
            <button onClick={() => onReject(item.id)}>Rechazar</button>
          </div>
        )}
      </ScrollableCardList>
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
