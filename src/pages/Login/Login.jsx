// src/pages/Login/Login.jsx
import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

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
      if (error.response && error.response.status === 401) {
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
        <div className="login-register-link">
          ¿No tienes una cuenta? <a href="/registrar">Regístrate aquí</a>
        </div>
      </form>
    </div>
  )
}
