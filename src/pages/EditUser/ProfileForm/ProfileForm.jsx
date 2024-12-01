import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { updateUserSchema } from '../../../schemas/authSchema'
import { useNotification } from '../../../hooks/useNotification'
import { useTheme } from '../../../context/ThemeContext'
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap'

const ProfileForm = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const showNotification = useNotification()
  const { isDarkMode } = useTheme()
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
    <Container className="py-4">
      <Card
        className={`shadow ${isDarkMode ? 'bg-dark text-white' : 'bg-light'}`}
      >
        <Card.Header
          className={`${isDarkMode ? 'bg-dark' : 'bg-light'} border-bottom`}
        >
          <h2 className="mb-0">Editar Usuario</h2>
        </Card.Header>
        <Card.Body>
          {(error || serverError) && (
            <Alert variant="danger">{error || serverError}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña (opcional)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
              />
            </Form.Group>

            <Row className="mt-4">
              <Col xs={12} className="d-grid gap-3">
                <Button variant="primary" type="submit" className={`py-2`}>
                  Guardar Cambios
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleDeleteAccount}
                  className={`py-2`}
                >
                  Eliminar Cuenta
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProfileForm
