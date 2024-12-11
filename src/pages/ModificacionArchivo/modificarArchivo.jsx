// src/pages/ModificacionArchivo/modificarArchivo.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner
} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import 'bootstrap/dist/css/bootstrap.min.css'

const ModificarArchivo = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState('success')
  const [formData, setFormData] = useState({
    legajoNumero: '',
    legajoEsBis: 0,
    expedienteNumero: '',
    expedienteEsBis: 0,
    tipoDocumento: 'Correspondencia',
    anio: '',
    mes: '',
    dia: '',
    caratulaAsuntoExtracto: '',
    tema: '',
    folios: '',
    esPublico: true,
    personaNombre: '',
    personaTipo: 'Persona Física',
    personaRol: 'Titular',
    lugar: '',
    propiedad: '',
    departamentoNombreActual: '',
    departamentoNombreAntiguo: '',
    registro: '',
    protocolo: ''
  })

  useEffect(() => {
    const fetchDocumentData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (!id) {
          throw new Error('No se proporcionó un ID de documento')
        }

        const response = await fetch(
          `http://localhost:3000/api/documentos/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Documento no encontrado')
          }
          throw new Error('Error al cargar el documento')
        }

        const data = await response.json()
        if (!data) {
          throw new Error('No se recibieron datos del documento')
        }

        setFormData({
          legajoNumero: data.legajo_numero || '',
          legajoEsBis: data.legajo_bis || 0,
          expedienteNumero: data.expediente_numero || '',
          expedienteEsBis: data.expediente_bis || 0,
          tipoDocumento: data.tipo_documento || 'Correspondencia',
          anio: data.anio || '',
          mes: data.mes || '',
          dia: data.dia || '',
          caratulaAsuntoExtracto: data.caratula_asunto_extracto || '',
          tema: data.tema || '',
          folios: data.folios || '',
          esPublico: true,
          personaNombre: data.persona_nombre || '',
          personaTipo: data.persona_tipo || 'Persona Física',
          personaRol: data.persona_rol || 'Titular',
          lugar: data.mensura_lugar || '',
          propiedad: data.mensura_propiedad || '',
          departamentoNombreActual: data.departamento_nombre || '',
          departamentoNombreAntiguo: '',
          registro: data.notarial_registro || '',
          protocolo: data.notarial_protocolo || ''
        })
      } catch (error) {
        console.error('Error fetching document:', error)
        setError(error.message)
        setAlertVariant('danger')
        setAlertMessage(error.message)
        setShowAlert(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchDocumentData()
    } else {
      setError('No se proporcionó un ID de documento')
      setIsLoading(false)
    }
  }, [id, user.token])

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '200px' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-danger"
              onClick={() => navigate('/buscador')}
            >
              Volver al buscador
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const campos = {
        legajo_numero: formData.legajoNumero,
        legajo_bis: formData.legajoEsBis,
        expediente_numero: formData.expedienteNumero,
        expediente_bis: formData.expedienteEsBis,
        tipo_documento: formData.tipoDocumento,
        anio: formData.anio,
        mes: formData.mes,
        dia: formData.dia,
        caratula_asunto_extracto: formData.caratulaAsuntoExtracto,
        tema: formData.tema,
        folios: formData.folios,
        persona_nombre: formData.personaNombre,
        persona_tipo: formData.personaTipo,
        persona_rol: formData.personaRol,
        mensura_lugar: formData.lugar,
        mensura_propiedad: formData.propiedad,
        departamento_nombre: formData.departamentoNombreActual,
        notarial_registro: formData.registro,
        notarial_protocolo: formData.protocolo
      }

      const response = await fetch(`http://localhost:3000/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          tabla: 'documentos',
          campos,
          tipoDocumento: formData.tipoDocumento
        })
      })

      if (response.ok) {
        setAlertVariant('success')
        setAlertMessage('Documento modificado correctamente')
        setTimeout(() => {
          navigate('/buscador')
        }, 2000)
      } else {
        setAlertVariant('danger')
        setAlertMessage('Error al modificar el documento')
      }
      setShowAlert(true)
    } catch (error) {
      console.error('Error:', error)
      setAlertVariant('danger')
      setAlertMessage('Error al procesar la solicitud')
      setShowAlert(true)
    }
  }

  return (
    <Container className={`my-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Legajo Número</Form.Label>
              <Form.Control
                type="text"
                value={formData.legajoNumero}
                onChange={(e) =>
                  setFormData({ ...formData, legajoNumero: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Expediente Número</Form.Label>
              <Form.Control
                type="text"
                value={formData.expedienteNumero}
                onChange={(e) =>
                  setFormData({ ...formData, expedienteNumero: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select
                value={formData.tipoDocumento}
                onChange={(e) =>
                  setFormData({ ...formData, tipoDocumento: e.target.value })
                }
              >
                <option value="Mensura">Mensura</option>
                <option value="Notarial">Notarial</option>
                <option value="Correspondencia">Correspondencia</option>
                <option value="Leyes_Decretos">Leyes y Decretos</option>
                <option value="Gobierno">Gobierno</option>
                <option value="Tierras_Fiscales">Tierras Fiscales</option>
                <option value="Tribunales">Tribunales</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="text"
                value={formData.anio}
                onChange={(e) =>
                  setFormData({ ...formData, anio: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Mes</Form.Label>
              <Form.Control
                type="text"
                value={formData.mes}
                onChange={(e) =>
                  setFormData({ ...formData, mes: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>
              <Form.Control
                type="text"
                value={formData.dia}
                onChange={(e) =>
                  setFormData({ ...formData, dia: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Carátula/Asunto/Extracto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.caratulaAsuntoExtracto}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    caratulaAsuntoExtracto: e.target.value
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tema</Form.Label>
              <Form.Control
                type="text"
                value={formData.tema}
                onChange={(e) =>
                  setFormData({ ...formData, tema: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Folios</Form.Label>
              <Form.Control
                type="text"
                value={formData.folios}
                onChange={(e) =>
                  setFormData({ ...formData, folios: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Persona</Form.Label>
              <Form.Control
                type="text"
                value={formData.personaNombre}
                onChange={(e) =>
                  setFormData({ ...formData, personaNombre: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Persona</Form.Label>
              <Form.Select
                value={formData.personaTipo}
                onChange={(e) =>
                  setFormData({ ...formData, personaTipo: e.target.value })
                }
              >
                <option value="Persona Física">Persona Física</option>
                <option value="Persona Jurídica">Persona Jurídica</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.personaRol}
                onChange={(e) =>
                  setFormData({ ...formData, personaRol: e.target.value })
                }
              >
                <option value="Titular">Titular</option>
                <option value="Iniciador">Iniciador</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">
          Guardar Modificaciones
        </Button>
      </Form>
    </Container>
  )
}

export default ModificarArchivo
