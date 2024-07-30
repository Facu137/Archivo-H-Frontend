// src/pages/EditUser/EditUser.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { updateUserSchema } from '../../schemas/authSchema'
import axiosInstance from '../../api/axiosConfig'
import './EditUser.css'

export const EditUser = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
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
    e.preventDefault()
    try {
      const validatedData = updateUserSchema.parse({
        ...formData,
        password: formData.password || undefined, // Convierte '' a undefined
        confirmPassword: formData.confirmPassword || undefined // Convierte '' a undefined
      })
      await updateUser(validatedData)
      navigate('/')
    } catch (error) {
      if (error.issues) {
        setError(error.issues.map((issue) => issue.message).join(', '))
      } else {
        setError('Error updating user')
        console.error('Error updating user:', error)
      }
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.post('/auth/init-acc-deletion', { email: user.email })
      alert(
        'Se ha enviado un correo para confirmar la eliminación de la cuenta.'
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
    <div className="edit-user-container">
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
          <label htmlFor="password">Nueva Contraseña:</label>
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
        <button type="submit" className="submit-button">
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
