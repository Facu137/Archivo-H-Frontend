// src/components/RequestEmployeeCard/RequestEmployeeCard.jsx
import React, { useState } from 'react'
import trabajo from '../../assets/topaz-CasaArchivo.avif'
import './RequestEmployeeCard.css'
import { useNotification } from '../../hooks/useNotification'
import { useAuth } from '../../context/AuthContext'

const RequestEmployeeCard = () => {
  const [claveConversion, setClaveConversion] = useState('')
  const showNotification = useNotification()
  const { user, token } = useAuth()

  const handleChange = (e) => {
    setClaveConversion(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await window.axiosInstance.post(
        '/auth/request-emp-role',
        {
          userId: user.id,
          claveConversion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification(response.data.message, 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          'Error al solicitar el rol de empleado',
        'error'
      )
    }
  }

  return (
    <div className="request-employee-card">
      <h3>¿Quieres ser parte de nuestro equipo?</h3>
      <img
        src={trabajo} // Ruta a la imagen motivadora
        alt="Motivational"
        className="motivational-image"
      />
      <p>
        Completa los datos de usuario y manda la solicitud para ser empleado.
        <br />
        Empieza una nueva aventura con nosotros.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="claveConversion">Clave de Convocatoria:</label>
          <input
            type="password"
            id="claveConversion"
            name="claveConversion"
            value={claveConversion}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="request-button">
          Solicitar ser empleado
        </button>
      </form>
    </div>
  )
}

export default RequestEmployeeCard
