// src/components/RequestEmployeeCard/RequestEmployeeCard.jsx
import React, { useState } from 'react'
import trabajo from '../../../assets/topaz-CasaArchivo.avif'
import { useNotification } from '../../../hooks/useNotification'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { Card, Form, Button, Container } from 'react-bootstrap'

const RequestEmployeeCard = () => {
  const [claveConversion, setClaveConversion] = useState('')
  const showNotification = useNotification()
  const { user, token } = useAuth()
  const { isDarkMode } = useTheme()

  const handleChange = (e) => {
    setClaveConversion(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await window.axiosInstance.post(
        '/auth/request-emp-role',
        {
          userId: user.id,
          claveConversion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification(response.data.message, 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          'Error al solicitar el rol de empleado',
        'error'
      )
    }
  }

  return (
    <Container className="py-4">
      <Card
        className={`shadow ${isDarkMode ? 'bg-dark text-white' : 'bg-light'}`}
      >
        <Card.Header
          className={`${isDarkMode ? 'bg-dark' : 'bg-light'} border-bottom`}
        >
          <h2 className="mb-0">¿Quieres ser parte de nuestro equipo?</h2>
        </Card.Header>
        <Card.Body>
          <img
            src={trabajo}
            alt="Motivational"
            className="img-fluid rounded mb-4"
          />
          <p className="text-center mb-4">
            Completa los datos de usuario y manda la solicitud para ser
            empleado.
            <br />
            Empieza una nueva aventura con nosotros.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Clave de Convocatoria:</Form.Label>
              <Form.Control
                type="password"
                name="claveConversion"
                value={claveConversion}
                onChange={handleChange}
                required
                className={isDarkMode ? 'bg-dark text-white' : 'bg-light'}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" className="py-2">
                Solicitar ser empleado
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default RequestEmployeeCard
