// src/pages/EditUser/EditUser.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { updateUserSchema } from '../../schemas/authSchema'
import { useNotification } from '../../hooks/useNotification'
import RequestEmployeeCard from '../../components/RequestEmployeeCard/RequestEmployeeCard'
import './EditUser.css'

export const EditUser = () => {
  const { user, logout } = useAuth() // Accede a user desde el contexto
  const navigate = useNavigate()
  const showNotification = useNotification()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  })
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('') // Nuevo estado para errores del servidor

  // useCallback para evitar dependencias innecesarias en useEffect
  const fetchUserData = useCallback(() => {
    setFormData({
      email: user.email,
      password: '',
      confirmPassword: '',
      nombre: user.nombre,
      apellido: user.apellido
    })
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserData() // Llama a la función para establecer los datos del formulario
    }
  }, [user, fetchUserData]) // Incluye fetchUserData en el array de dependencias

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const validatedData = updateUserSchema.parse({
        ...formData,
        password: formData.password || undefined, // Convierte '' a undefined
        confirmPassword: formData.confirmPassword || undefined // Convierte '' a undefined
      })

      await axiosInstance.put('/auth/edit-user', validatedData) // Elimina la asignación a 'response'

      // Muestra la notificación de éxito y redirige
      showNotification(
        'Cambios guardados correctamente. Por favor, vuelva a iniciar sesión para ver los cambios.',
        'success'
      )
      logout() // Cerrar sesión después de actualizar los datos
      navigate('/login', { replace: true }) // Redirigir al login después de cerrar sesión
    } catch (error) {
      // Maneja los errores de validación como antes
      if (error.issues) {
        setError(error.issues.map((issue) => issue.message).join(', '))
      } else if (error.response) {
        // Maneja los errores del servidor
        setServerError(error.response.data.message)
        showNotification(
          'Error del servidor: ' + error.response.data.message,
          'error'
        )
      } else {
        // Otros tipos de errores
        setError('Error updating user')
        showNotification('Hubo un error inesperado', 'error')
        console.error('Error updating user:', error)
      }
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.post('/auth/init-acc-deletion', { email: user.email })
      showNotification(
        'Se ha enviado un correo para confirmar la eliminación de la cuenta.',
        'info'
      ) // Muestra la notificación
    } catch (error) {
      setError('Error al iniciar el proceso de eliminación de cuenta')
      console.error('Error deleting account:', error)
    }
  }

  if (!user) {
    return <div>Cargando...</div> // o un spinner
  }

  return (
    <div className="edit-user-container">
      <div className="edit-user-content">
        <RequestEmployeeCard />
        <div className="edit-user-form">
          <h2>Editar Usuario</h2>
          {error && <div className="error-message">{error}</div>}
          {serverError && <p className="error-message">{serverError}</p>}{' '}
          {/* Mostrar el error del servidor si existe */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña (opcional):</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmar Nueva Contraseña:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={handleDeleteAccount}
            >
              Eliminar Cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
