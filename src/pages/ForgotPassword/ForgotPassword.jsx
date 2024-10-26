// src/pages/ForgotPassword/ForgotPassword.jsx
import React, { useState } from 'react'
import './ForgotPassword.css'
export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await window.axiosInstance.post(
        '/auth/forgot-password',
        {
          email
        }
      )
      if (response.status === 200) {
        setSuccess(
          'Correo de recuperación de contraseña enviado con éxito. Por favor, verifica tu correo electrónico.'
        )
        setError('')
      }
    } catch (error) {
      setError(
        'Hubo un error al enviar el correo de recuperación de contraseña. Por favor, inténtalo de nuevo.'
      )
      setSuccess('')
    }
  }

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Recuperar Contraseña</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Enviar Correo de Recuperación</button>
      </form>
    </div>
  )
}
