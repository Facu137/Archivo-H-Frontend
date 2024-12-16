// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNotification } from '../../hooks/useNotification'
import { useTheme } from '../../context/ThemeContext'
import topazImage from '../../assets/topaz-zamora_museo.avif'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const showNotification = useNotification()
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('verified') === 'true') {
      showNotification(
        'Correo verificado con éxito. Ahora puedes iniciar sesión.',
        'success'
      )
    } else if (searchParams.get('error')) {
      const errorType = searchParams.get('error')
      let errorMessage = ''
      switch (errorType) {
        case 'no_token':
          errorMessage = 'Token de verificación no proporcionado.'
          break
        case 'user_not_found':
          errorMessage = 'Usuario no encontrado.'
          break
        case 'already_verified':
          errorMessage = 'El correo electrónico ya ha sido verificado.'
          break
        case 'invalid_token':
          errorMessage = 'Token inválido.'
          break
        case 'token_expired':
          errorMessage = 'Token expirado.'
          break
        default:
          errorMessage = 'Hubo un error al verificar el correo electrónico.'
      }
      showNotification(errorMessage, 'error')
    } else if (searchParams.get('accountDeleted') === 'true') {
      showNotification('Tu cuenta ha sido eliminada con éxito.', 'success')
      if (searchParams.get('logout') === 'true') {
        // Removed logout() call
        navigate('/', { replace: true })
      }
    }
  }, [location, showNotification, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate email and password
    if (!email || !password) {
      showNotification(
        'Por favor, ingrese su correo electrónico y contraseña.',
        'error'
      )
      return
    }

    try {
      console.log('Login form data:', { email, password })
      await login({ email, password })
      navigate(location.state?.from || '/', { replace: true })
    } catch (error) {
      console.error('Login error details:', {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        requestData: { email, password }
      })
      if (error.response && error.response.data) {
        showNotification(
          error.response.data.message || error.response.data.errors?.[0],
          'error'
        )
      } else {
        showNotification(
          'Hubo un error al iniciar sesión, inténtelo de nuevo más tarde.',
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
                <h2 className="text-center m-0 h3">Iniciar Sesión</h2>
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
                      }`}
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Contraseña
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
                      autoComplete="current-password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 py-2"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="btn btn-outline-secondary w-100"
                  >
                    Olvidé mi contraseña
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
                        Archivo Histórico de Santiago del Estero
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h4 className="h5 mb-3">
                    Únete a nuestra comunidad y descubre todas las ventajas
                  </h4>
                  <p
                    className={`mb-4 ${
                      isDarkMode ? 'text-light text-opacity-75' : 'text-muted'
                    }`}
                  >
                    Accede a contenido exclusivo, guarda tus favoritos y
                    mantente al día con las últimas actualizaciones del museo.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/registrar')}
                    className="btn btn-primary btn-lg px-5 py-2"
                  >
                    Crear una cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
