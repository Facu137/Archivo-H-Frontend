import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal
} from 'react-bootstrap'
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
  const [showModal, setShowModal] = useState(false)
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
    departamentoEsActual: true,
    registro: '',
    protocolo: '',
    mesInicio: '',
    mesFin: '',
    escrituraNro: '',
    negocioJuridico: ''
  })

  const [archivos, setArchivos] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
      let endpoint = '/api/documents/upload/general'

      if (formData.tipoDocumento === 'Mensura') {
        endpoint = '/api/documents/upload/mensura'
      } else if (formData.tipoDocumento === 'Notarial') {
        endpoint = '/api/documents/upload/notarial'
      }

      const response = await instance.post(endpoint, formDataToSend)

      if (response.data.success || response.data.message) {
        setSuccess(response.data.message || 'Documento subido exitosamente')
        setShowModal(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
          departamentoEsActual: true,
          registro: '',
          protocolo: '',
          mesInicio: '',
          mesFin: '',
          escrituraNro: '',
          negocioJuridico: ''
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
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Control
                as="select"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo...</option>
                <option value="Gobierno">Gobierno</option>
                <option value="Mensura">Mensura</option>
                <option value="Notarial">Notarial</option>
                <option value="Correspondencia">Correspondencia</option>
                <option value="Tierras_Fiscales">Tierras Fiscales</option>
                <option value="Tribunales">Tribunales</option>
                <option value="Leyes_Decretos">Leyes y Decretos</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Número de Legajo</Form.Label>
              <Form.Control
                type="number"
                name="legajoNumero"
                value={formData.legajoNumero}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
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

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Número de Expediente</Form.Label>
              <Form.Control
                type="number"
                name="expedienteNumero"
                value={formData.expedienteNumero}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
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

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Día</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="31"
                name="dia"
                value={formData.dia}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Mes</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="12"
                name="mes"
                value={formData.mes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                min="1400"
                max="2099"
                name="anio"
                value={formData.anio}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
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
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Nombre de Persona</Form.Label>
              <Form.Control
                type="text"
                name="personaNombre"
                value={formData.personaNombre}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tipo de Persona</Form.Label>
              <Form.Control
                as="select"
                name="personaTipo"
                value={formData.personaTipo}
                onChange={handleInputChange}
              >
                <option value="Persona Física">Persona Física</option>
                <option value="Persona Jurídica">Persona Jurídica</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
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
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lugar</Form.Label>
                  <Form.Control
                    type="text"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Propiedad</Form.Label>
                  <Form.Control
                    type="text"
                    name="propiedad"
                    value={formData.propiedad}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Departamento Actual</Form.Label>
                  <Form.Control
                    type="text"
                    name="departamentoNombreActual"
                    value={formData.departamentoNombreActual}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Departamento Histórico</Form.Label>
                  <Form.Control
                    type="text"
                    name="departamentoNombreAntiguo"
                    value={formData.departamentoNombreAntiguo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        {formData.tipoDocumento === 'Notarial' && (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Registro</Form.Label>
                  <Form.Control
                    type="text"
                    name="registro"
                    value={formData.registro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Protocolo</Form.Label>
                  <Form.Control
                    type="text"
                    name="protocolo"
                    value={formData.protocolo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mes Inicio</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="12"
                    name="mesInicio"
                    value={formData.mesInicio}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mes Fin</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="12"
                    name="mesFin"
                    value={formData.mesFin}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Número de Escritura</Form.Label>
                  <Form.Control
                    type="number"
                    name="escrituraNro"
                    value={formData.escrituraNro}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Negocio Jurídico</Form.Label>
                  <Form.Control
                    type="text"
                    name="negocioJuridico"
                    value={formData.negocioJuridico}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tema</Form.Label>
              <Form.Control
                type="text"
                name="tema"
                value={formData.tema}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Folios</Form.Label>
              <Form.Control
                type="number"
                name="folios"
                value={formData.folios}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Visibilidad</Form.Label>
              <Form.Check
                type="switch"
                id="esPublico-switch"
                name="esPublico"
                label="Es Público"
                checked={formData.esPublico}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Archivos</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100"
        >
          {loading ? 'Cargando...' : 'Guardar Documento'}
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Éxito!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{success}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AgregarArchivo
