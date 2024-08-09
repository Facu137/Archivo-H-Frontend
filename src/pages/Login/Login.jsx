// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react'
import './Login.css'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNotification } from '../../hooks/useNotification'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const showNotification = useNotification()

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
        logout()
      }
    }
  }, [location, logout, showNotification])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login({ email, password }) // Utiliza la función login del contexto
      showNotification('Inicio de sesión exitoso', 'success')
      navigate('/')
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showNotification(
          'Por favor, verifica tu correo electrónico antes de iniciar sesión',
          'warning'
        )
      } else if (error.response && error.response.status === 401) {
        showNotification('Correo o contraseña incorrectos', 'error')
      } else {
        showNotification('Hubo un error al intentar iniciar sesión', 'error')
      }
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="login-form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
        <div className="login-links">
          <button
            type="button"
            className="forgot-password-button"
            onClick={() => navigate('/forgot-password')}
          >
            Recuperar Contraseña
          </button>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/registrar')}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
