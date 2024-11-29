import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { updateUserSchema } from '../../../schemas/authSchema'
import { useNotification } from '../../../hooks/useNotification'
import './ProfileForm.css'

const ProfileForm = () => {
  const { user, logout } = useAuth()
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
  const [serverError, setServerError] = useState('')

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
      fetchUserData()
    }
  }, [user, fetchUserData])

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
        password: formData.password || undefined,
        confirmPassword: formData.confirmPassword || undefined
      })

      await window.axiosInstance.put('/auth/edit-user', validatedData)

      showNotification(
        'Cambios guardados correctamente. Por favor, vuelva a iniciar sesión para ver los cambios.',
        'success'
      )
      logout()
      navigate('/login', { replace: true })
    } catch (error) {
      if (error.issues) {
        setError(error.issues.map((issue) => issue.message).join(', '))
      } else if (error.response) {
        setServerError(error.response.data.message)
        showNotification(
          'Error del servidor: ' + error.response.data.message,
          'error'
        )
      } else {
        setError('Error updating user')
        showNotification('Hubo un error inesperado', 'error')
        console.error('Error updating user:', error)
      }
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await window.axiosInstance.post('/auth/init-acc-deletion', {
        email: user.email
      })
      showNotification(
        'Se ha enviado un correo para confirmar la eliminación de la cuenta.',
        'info'
      )
    } catch (error) {
      setError('Error al iniciar el proceso de eliminación de cuenta')
      console.error('Error deleting account:', error)
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="edit-user-form">
      <h2>Editar Usuario</h2>
      {error && <div className="error-message">{error}</div>}
      {serverError && <p className="error-message">{serverError}</p>}
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
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
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
        <button type="button" className="submit-button" onClick={handleSubmit}>
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
  )
}

export default ProfileForm
