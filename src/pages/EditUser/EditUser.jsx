// src/pages/EditUser/EditUser.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { updateUserSchema } from '../../schemas/authSchema'
import { useNotification } from '../../hooks/useNotification' // Importa useNotification
import RequestEmployeeCard from '../../components/RequestEmployeeCard/RequestEmployeeCard'
import './EditUser.css'

export const EditUser = () => {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const showNotification = useNotification() // Usa useNotification
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        confirmPassword: '',
        nombre: user.name,
        apellido: user.lastName
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Previene el comportamiento por defecto del formulario
    try {
      const validatedData = updateUserSchema.parse({
        ...formData,
        password: formData.password || undefined, // Convierte '' a undefined
        confirmPassword: formData.confirmPassword || undefined // Convierte '' a undefined
      })
      await updateUser(validatedData)
      showNotification(
        'Cambios guardados correctamente. Por favor, vuelva a iniciar sesión para ver los cambios.',
        'success'
      )
      logout()
      navigate('/login')
    } catch (error) {
      if (error.issues) {
        setError(error.issues.map((issue) => issue.message).join(', '))
      } else {
        setError('Error updating user')
        console.error('Error updating user:', error)
      }
      showNotification('Error al guardar los cambios', 'error')
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
    return <div>Cargando...</div>
  }

  return (
    <div className="edit-user-container">
      <div className="edit-user-content">
        <RequestEmployeeCard />
        <div className="edit-user-form">
          <h2>Editar Usuario</h2>
          {error && <div className="error-message">{error}</div>}
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
