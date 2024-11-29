import React, { useState } from 'react'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data' // Importante para subida de archivos
  }
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const AgregarArchivo = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    legajoNumero: '',
    legajoEsBis: 0,
    expedienteNumero: '',
    expedienteEsBis: 0,
    tipoDocumento: '',
    anio: '',
    mes: '',
    dia: '',
    caratulaAsuntoExtracto: '',
    tema: '',
    folios: '',
    esPublico: true,
    creadorId: user?.id || '',
    personaNombre: '',
    personaTipo: 'Persona Física',
    personaRol: '',
    lugar: '',
    propiedad: '',
    departamentoNombreActual: '',
    departamentoNombreAntiguo: '',
    departamentoEsActual: true
  })

  const [archivos, setArchivos] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    let finalValue = value

    if (name === 'legajoEsBis' || name === 'expedienteEsBis') {
      const numValue = parseInt(value)
      if (numValue < 0) finalValue = '0'
      else if (numValue > 100) finalValue = '100'
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }))
  }

  const handleFileChange = (e) => {
    setArchivos(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formDataToSend = new FormData()

    // Agregar todos los archivos
    archivos.forEach((archivo) => {
      formDataToSend.append('archivo', archivo)
    })

    // Agregar el resto de los campos
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    try {
      const endpoint =
        formData.tipoDocumento === 'Mensura'
          ? '/api/documents/upload/mensura'
          : '/api/documents/upload/general'

      const response = await instance.post(endpoint, formDataToSend)

      if (response.data.success || response.data.message) {
        setSuccess(response.data.message || 'Documento subido exitosamente')
        // Limpiar el formulario
        setFormData({
          legajoNumero: '',
          legajoEsBis: 0,
          expedienteNumero: '',
          expedienteEsBis: 0,
          tipoDocumento: '',
          anio: '',
          mes: '',
          dia: '',
          caratulaAsuntoExtracto: '',
          tema: '',
          folios: '',
          esPublico: true,
          creadorId: user?.id || '',
          personaNombre: '',
          personaTipo: 'Persona Física',
          personaRol: '',
          lugar: '',
          propiedad: '',
          departamentoNombreActual: '',
          departamentoNombreAntiguo: '',
          departamentoEsActual: true
        })
        setArchivos([])
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Error al subir el documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Agregar Nuevo Documento</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Legajo</Form.Label>

              <Form.Control
                type="text"
                name="legajoNumero"
                value={formData.legajoNumero}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Legajo Es Bis (0-100)</Form.Label>

              <Form.Control
                type="number"
                name="legajoEsBis"
                min="0"
                max="100"
                value={formData.legajoEsBis}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Expediente</Form.Label>

              <Form.Control
                type="text"
                name="expedienteNumero"
                value={formData.expedienteNumero}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Expediente Es Bis (0-100)</Form.Label>

              <Form.Control
                type="number"
                name="expedienteEsBis"
                min="0"
                max="100"
                value={formData.expedienteEsBis}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>

              <Form.Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>

                <option value="Gobierno">Gobierno</option>

                <option value="Mensura">Mensura</option>

                <option value="Notarial">Notarial</option>

                <option value="Correspondencia">Correspondencia</option>

                <option value="Tierras_Fiscales">Tierras Fiscales</option>

                <option value="Tribunales">Tribunales</option>

                <option value="Leyes_Decretos">Leyes y Decretos</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tema</Form.Label>

              <Form.Control
                type="text"
                name="tema"
                value={formData.tema}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>

              <Form.Control
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Mes</Form.Label>

              <Form.Control
                type="number"
                name="mes"
                min="1"
                max="12"
                value={formData.mes}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>

              <Form.Control
                type="number"
                name="dia"
                min="1"
                max="31"
                value={formData.dia}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Carátula/Asunto/Extracto</Form.Label>

          <Form.Control
            as="textarea"
            rows={3}
            name="caratulaAsuntoExtracto"
            value={formData.caratulaAsuntoExtracto}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Folios</Form.Label>

              <Form.Control
                type="number"
                name="folios"
                value={formData.folios}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Es Público"
                name="esPublico"
                checked={formData.esPublico}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Persona</Form.Label>

              <Form.Control
                type="text"
                name="personaNombre"
                value={formData.personaNombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Persona</Form.Label>

              <Form.Select
                name="personaTipo"
                value={formData.personaTipo}
                onChange={handleInputChange}
                required
              >
                <option value="Persona Física">Persona Física</option>

                <option value="Persona Jurídica">Persona Jurídica</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Rol de Persona</Form.Label>

              <Form.Select
                name="personaRol"
                value={formData.personaRol}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un rol</option>

                <option value="Iniciador">Iniciador</option>

                <option value="Titular">Titular</option>

                <option value="Escribano">Escribano</option>

                <option value="Emisor">Emisor</option>

                <option value="Destinatario">Destinatario</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {formData.tipoDocumento === 'Mensura' && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lugar</Form.Label>

                <Form.Control
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Propiedad</Form.Label>

                <Form.Control
                  type="text"
                  name="propiedad"
                  value={formData.propiedad}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {formData.tipoDocumento === 'Mensura' && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Departamento Actual</Form.Label>

                <Form.Control
                  type="text"
                  name="departamentoNombreActual"
                  value={formData.departamentoNombreActual}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Departamento Histórico</Form.Label>

                <Form.Control
                  type="text"
                  name="departamentoNombreAntiguo"
                  value={formData.departamentoNombreAntiguo}
                  onChange={handleInputChange}
                />
                <Form.Text className="text-muted">
                  Nombre histórico del departamento (si aplica)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Archivos</Form.Label>

          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
            required
          />

          <Form.Text className="text-muted">
            Puede seleccionar múltiples archivos
          </Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="mt-3"
        >
          {loading ? 'Subiendo...' : 'Subir Documento'}
        </Button>
      </Form>
    </Container>
  )
}

export default AgregarArchivo
