// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react'
import './Login.css'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('verified') === 'true') {
      setSuccess('Correo verificado con éxito. Ahora puedes iniciar sesión.')
    } else if (searchParams.get('error')) {
      const errorType = searchParams.get('error')
      switch (errorType) {
        case 'no_token':
          setError('Token de verificación no proporcionado.')
          break
        case 'user_not_found':
          setError('Usuario no encontrado.')
          break
        case 'already_verified':
          setError('El correo electrónico ya ha sido verificado.')
          break
        case 'invalid_token':
          setError('Token inválido.')
          break
        case 'token_expired':
          setError('Token expirado.')
          break
        default:
          setError('Hubo un error al verificar el correo electrónico.')
      }
    } else if (searchParams.get('accountDeleted') === 'true') {
      setSuccess('Tu cuenta ha sido eliminada con éxito.')
      if (searchParams.get('logout') === 'true') {
        logout()
      }
    }
  }, [location, logout])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      })

      if (response.status === 200) {
        const { accessToken, user } = response.data
        login(user, accessToken)
        navigate('/')
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError(
          'Por favor, verifica tu correo electrónico antes de iniciar sesión'
        )
      } else if (error.response && error.response.status === 401) {
        setError('Correo o contraseña incorrectos')
      } else {
        setError('Hubo un error al intentar iniciar sesión')
      }
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
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
