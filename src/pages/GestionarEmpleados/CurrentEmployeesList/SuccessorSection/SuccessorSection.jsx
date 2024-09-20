// src/pages/GestionarEmpleados/CurrentEmployeesList/SuccessorSection/SuccessorSection.jsx
import React from 'react'
import PropTypes from 'prop-types'
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
  const handleRemoveSuccessor = async () => {
    try {
      await axiosInstance.delete(`/admin/remove-successor/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      showNotification('Sucesor eliminado correctamente', 'success')
      setSuccessor(null)
    } catch (error) {
      console.error('Error al eliminar sucesor:', error)
      showNotification('Error al eliminar sucesor', 'error')
    }
  }

  return (
    <div className="successor-section-card-config">
      {' '}
      {/* Nueva clase para la tarjeta */}
      <h3>Sucesor del Administrador</h3>
      {successor ? (
        <div className="successor-card-container">
          <UserCard user={successor} />
          <button onClick={handleRemoveSuccessor}>Quitar Sucesor</button>
        </div>
      ) : (
        <div className="successor-card-container no-successor">
          {' '}
          {/* Nueva clase para la tarjeta sin sucesor */}
          <p>No hay un sucesor asignado.</p>
        </div>
      )}
      <p className="successor-description">
        Es importante asignar un sucesor, ya que este empleado será quien
        reemplace al administrador en caso de que este elimine su cuenta.
      </p>
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
