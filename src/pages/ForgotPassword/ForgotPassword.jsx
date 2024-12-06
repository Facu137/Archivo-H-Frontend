// src/pages/ForgotPassword/ForgotPassword.jsx
import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { authService } from '../../services/auth.service'
import damagedFiles from '../../assets/img48.avif'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { isDarkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await authService.forgotPassword(email)

      if (response.status === 200) {
        setSuccess(
          'Correo de recuperación de contraseña enviado con éxito. Por favor, verifica tu correo electrónico.'
        )
        setError('')
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError(
          'Hubo un error al enviar el correo de recuperación de contraseña. Por favor, inténtalo de nuevo.'
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
                <h2 className="text-center m-0 h3">Recuperar Contraseña</h2>
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
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      }`}
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa tu correo electrónico"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Enviar Correo de Recuperación
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
                  No Permitas que tu Información se Pierda
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div
                    className="position-relative"
                    style={{ maxWidth: '450px', margin: '0 auto' }}
                  >
                    <img
                      src={damagedFiles}
                      alt="Documentos dañados por el incendio"
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
                        Documentos Históricos Dañados - Santiagueñazo 1993
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="h5 mb-3">
                    Protege tus Credenciales Digitales
                  </h4>
                  <p
                    className={`mb-4 ${
                      isDarkMode ? 'text-light text-opacity-75' : 'text-muted'
                    }`}
                  >
                    Así como el incendio de 1993 nos privó de valiosos
                    documentos históricos, perder el acceso a tu cuenta puede
                    significar la pérdida de información importante. Aquí hay
                    algunos consejos para mantener segura tu contraseña:
                  </p>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className={`p-3 rounded ${
                          isDarkMode
                            ? 'bg-dark bg-opacity-50'
                            : 'bg-light bg-opacity-75'
                        }`}
                      >
                        <h5 className="h6 mb-3">Prevención</h5>
                        <ul
                          className={`list-unstyled text-start ${
                            isDarkMode
                              ? 'text-light text-opacity-75'
                              : 'text-muted'
                          }`}
                        >
                          <li className="mb-2">
                            ✓ Usa un gestor de contraseñas seguro
                          </li>
                          <li className="mb-2">
                            ✓ Activa la autenticación de dos factores
                          </li>
                          <li className="mb-2">
                            ✓ Guarda tus credenciales en un lugar seguro
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`p-3 rounded ${
                          isDarkMode
                            ? 'bg-dark bg-opacity-50'
                            : 'bg-light bg-opacity-75'
                        }`}
                      >
                        <h5 className="h6 mb-3">Recuperación</h5>
                        <ul
                          className={`list-unstyled text-start ${
                            isDarkMode
                              ? 'text-light text-opacity-75'
                              : 'text-muted'
                          }`}
                        >
                          <li className="mb-2">
                            ✓ Mantén actualizado tu email de recuperación
                          </li>
                          <li className="mb-2">
                            ✓ Configura preguntas de seguridad
                          </li>
                          <li className="mb-2">
                            ✓ Guarda códigos de respaldo seguros
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
