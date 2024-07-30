// src/pages/Registrar/Registrar.jsx
import React, { useState } from 'react'
import './Registrar.css'
import axios from 'axios'
import { useNotification } from '../../hooks/useNotification'
import { updateUserSchema } from '../../schemas/authSchema'
import { useNavigate } from 'react-router-dom'

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    // Limpiar el error del campo cuando el usuario empieza a escribir
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Validar el formulario con Zod
      updateUserSchema.parse(formData)

      // Si la validación pasa, intentar registrar al usuario
      const response = await axios.post('http://localhost:3000/auth/register', {
        ...formData,
        rol: 'usuario'
      })

      if (response.status === 201) {
        showNotification(
          'Usuario registrado con éxito. Por favor, verifica tu correo electrónico.',
          'success'
        )
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login')
      }
    } catch (error) {
      if (error.errors) {
        // Errores de validación de Zod
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      } else if (error.response && error.response.status === 400) {
        // Error de la API
        showNotification(
          error.response.data.message ||
            'Hubo un error al registrar el usuario',
          'error'
        )
      } else {
        // Otros errores
        showNotification('Hubo un error al registrar el usuario', 'error')
      }
      console.error('Error al registrar el usuario', error)
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registrar Usuario</h2>
        <div className="register-form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <div className="register-form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <div className="register-form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>
        <div className="register-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </div>
        <div className="register-form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            required
            value={formData.apellido}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.apellido && (
            <span className="error-message">{errors.apellido}</span>
          )}
        </div>
        <button type="submit">Registrar</button>
        <div className="register-login-link">
          <button
            type="button"
            className="login-button"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  )
}
