// src/pages/ResetPassword/ResetPassword.jsx
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { z } from 'zod'
import archivoFire from '../../assets/1728590524186.avif'

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
    path: ['confirmPassword']
  })

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      resetPasswordSchema.parse({ token, password, confirmPassword })

      const response = await window.axiosInstance.post('/auth/reset-password', {
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className={`container px-4`}>
        <div className="row justify-content-center align-items-stretch g-4">
          <div className="col-12 col-lg-5">
            <div
              className={`card border-0 shadow h-100 ${
                isDarkMode ? 'bg-dark text-light' : 'bg-light'
              }`}
            >
              <div
                className={`card-header border-bottom py-3 ${
                  isDarkMode ? 'bg-dark' : 'bg-light'
                }`}
              >
                <h2 className="text-center m-0 h3">Restablecer Contraseña</h2>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      }`}
                      id="password"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Restablecer Contraseña
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div
              className={`card border-0 shadow h-100 ${
                isDarkMode ? 'bg-dark text-light' : 'bg-light'
              }`}
            >
              <div
                className={`card-header border-bottom py-3 ${
                  isDarkMode ? 'bg-dark' : 'bg-light'
                }`}
              >
                <h3 className="text-center m-0 h3">
                  Protege tu Información Digital
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div
                    className="position-relative"
                    style={{ maxWidth: '450px', margin: '0 auto' }}
                  >
                    <img
                      src={archivoFire}
                      alt="Incendio del Archivo Histórico"
                      className="img-fluid rounded shadow-sm"
                      style={{
                        aspectRatio: '1/1',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                    <div
                      className={`position-absolute bottom-0 start-0 w-100 p-3 text-white text-center ${
                        isDarkMode
                          ? 'bg-dark bg-opacity-75'
                          : 'bg-dark bg-opacity-50'
                      }`}
                      style={{ backdropFilter: 'blur(5px)' }}
                    >
                      <p className="mb-0 fw-bold">
                        El Santiagueñazo - Diciembre de 1993
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="h5 mb-3">
                    La importancia de proteger nuestra historia
                  </h4>
                  <p
                    className={`mb-4 ${
                      isDarkMode ? 'text-light text-opacity-75' : 'text-muted'
                    }`}
                  >
                    En diciembre de 1993, durante el Santiagueñazo, el Archivo
                    General sufrió graves daños por fuego y agua, perdiéndose
                    invaluables documentos históricos. Este evento nos recuerda
                    la importancia de proteger nuestra información.
                  </p>
                  <h5 className="h6 mb-3">
                    Consejos para una contraseña segura:
                  </h5>
                  <ul
                    className={`list-unstyled ${
                      isDarkMode ? 'text-light text-opacity-75' : 'text-muted'
                    }`}
                  >
                    <li className="mb-2">✓ Usa al menos 8 caracteres</li>
                    <li className="mb-2">
                      ✓ Combina letras mayúsculas y minúsculas
                    </li>
                    <li className="mb-2">✓ Incluye números y símbolos</li>
                    <li className="mb-2">
                      ✓ Evita información personal fácil de adivinar
                    </li>
                    <li className="mb-2">
                      ✓ Usa contraseñas diferentes para cada cuenta
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
