// src/pages/Registrar/Registrar.jsx
import React, { useState } from 'react'
import { useNotification } from '../../hooks/useNotification'
import { updateUserSchema } from '../../schemas/authSchema'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { authService } from '../../services/auth.service'
import topazImage from '../../assets/topaz-museo_historico_4.avif'

export const Registrar = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  })

  const [errors, setErrors] = useState({})
  const showNotification = useNotification()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      updateUserSchema.parse(formData)

      const response = await authService.register({
        ...formData,
        rol: 'usuario'
      })

      if (response.status === 201) {
        showNotification(
          'Usuario registrado con éxito. Por favor, verifica tu correo electrónico.',
          'success'
        )
        navigate('/login')
      }
    } catch (error) {
      if (error.name === 'ZodError') {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, 'error')
      } else {
        showNotification(
          'Error al registrar usuario. Por favor, inténtalo de nuevo.',
          'error'
        )
      }
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
                <h2 className="text-center m-0 h3">Registrar Usuario</h2>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      } ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="username"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      } ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      } ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      } ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      autoComplete="given-name"
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="apellido" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        isDarkMode ? 'bg-dark text-light border-secondary' : ''
                      } ${errors.apellido ? 'is-invalid' : ''}`}
                      id="apellido"
                      name="apellido"
                      required
                      value={formData.apellido}
                      onChange={handleChange}
                      autoComplete="family-name"
                    />
                    {errors.apellido && (
                      <div className="invalid-feedback">{errors.apellido}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 py-2"
                  >
                    Registrar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn btn-outline-secondary w-100"
                  >
                    Ya tengo una cuenta
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
                  ¡Únete a nuestra comunidad!
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div
                    className="position-relative"
                    style={{ maxWidth: '450px', margin: '0 auto' }}
                  >
                    <img
                      src={topazImage}
                      alt="Museo Archivo Histórico"
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
                        Escritorio de Andres Chazarreta
                      </p>
                    </div>
                  </div>
                </div>
                <div className="benefits-list mb-4 px-lg-4">
                  <h4 className="h5 mb-4 text-center">
                    Descubre todas las ventajas que tenemos para ti
                  </h4>
                  <div className="row row-cols-1 row-cols-sm-2 g-4">
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-star-fill text-warning me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Contenido Favorito</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Guarda y organiza tus archivos favoritos para acceso
                            rápido
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-clock-history text-info me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Historial Personal</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Mantén un registro de todos los archivos que has
                            consultado
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-file-lock text-success me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Acceso Exclusivo</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Solicita permisos para ver documentos privados del
                            museo
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-bell text-primary me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Notificaciones</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Mantente informado sobre nuevas adiciones a la
                            colección
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-download text-secondary me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Descargas HD</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Accede a versiones en alta resolución de los
                            documentos
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-people text-danger me-3 fs-4"></i>
                        <div>
                          <h5 className="h6 mb-1">Comunidad Activa</h5>
                          <p
                            className={`mb-0 ${
                              isDarkMode
                                ? 'text-light text-opacity-75'
                                : 'text-muted'
                            }`}
                          >
                            Interactúa con otros apasionados de la historia
                          </p>
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
    </div>
  )
}
