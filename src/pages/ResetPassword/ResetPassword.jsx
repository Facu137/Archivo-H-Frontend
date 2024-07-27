// src/pages/ResetPassword/ResetPassword.jsx
import React, { useState } from 'react'
import './ResetPassword.css'
import axiosInstance from '../../api/axiosConfig'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: 'El token es requerido' }),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: z
      .string({ required_error: 'La confirmación de contraseña es requerida' })
      .min(6, {
        message:
          'La confirmación de contraseña debe tener al menos 6 caracteres'
      })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'] // Indica que el error es en la confirmación de contraseña
  })

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      resetPasswordSchema.parse({ token, password, confirmPassword })

      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        password
      })
      if (response.status === 200) {
        setSuccess(
          'Contraseña restablecida con éxito. Ahora puedes iniciar sesión.'
        )
        setError('')
        setTimeout(() => navigate('/login'), 3000)
      }
    } catch (error) {
      if (error.issues) {
        setError(error.issues.map((issue) => issue.message).join(', '))
      } else {
        setError(
          'Hubo un error al restablecer la contraseña. Por favor, inténtalo de nuevo.'
        )
      }
      setSuccess('')
    }
  }

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>Restablecer Contraseña</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  )
}
