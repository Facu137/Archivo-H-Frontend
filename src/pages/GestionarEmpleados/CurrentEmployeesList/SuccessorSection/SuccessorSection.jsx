// src/pages/GestionarEmpleados/CurrentEmployeesList/SuccessorSection.jsx
import React, { useState } from 'react' // Importa useEffect
import PropTypes from 'prop-types' // Importa PropTypes
import UserCard from '../../../../components/UserCard/UserCard'
import axiosInstance from '../../../../api/axiosConfig'
import './SuccessorSection.css'

const SuccessorSection = ({
  successor,
  setSuccessor,
  token,
  user,
  showNotification
}) => {
  const [showSuccessor, setShowSuccessor] = useState(false)

  const handleRemoveSuccessor = async () => {
    try {
      await axiosInstance.delete(`/admin/remove-successor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      showNotification('Sucesor eliminado correctamente', 'success')
      setSuccessor(null) // Actualiza el estado del sucesor en el componente padre
    } catch (error) {
      console.error('Error al eliminar sucesor:', error)
      showNotification('Error al eliminar sucesor', 'error')
    }
  }

  return (
    <div className="successor-container">
      <h2>Sucesor del Administrador</h2>
      <button onClick={() => setShowSuccessor(!showSuccessor)}>
        {showSuccessor ? 'Ocultar Sucesor' : 'Mostrar Sucesor'}
      </button>
      {showSuccessor && successor && (
        <div className="employee-card-container">
          <UserCard user={successor} />
          <button onClick={handleRemoveSuccessor}>Quitar Sucesor</button>
        </div>
      )}
      {!successor && <p>No hay un sucesor asignado.</p>}
    </div>
  )
}

SuccessorSection.propTypes = {
  successor: PropTypes.object,
  setSuccessor: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default SuccessorSection
