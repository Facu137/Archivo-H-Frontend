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
import { useTheme } from '../../context/ThemeContext'

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
  const { isDarkMode } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
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
    creadorId: user?.id || '',
    personaNombre: '',
    personaTipo: 'Persona Física',
    personaRol: 'Titular',
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
          tipoDocumento: 'Correspondencia',
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
          personaRol: 'Titular',
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
              <div
                className={`btn-group w-100 ${isMobile ? 'btn-group-vertical' : ''}`}
                role="group"
                aria-label="Tipo de documento toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-correspondencia"
                  value="Correspondencia"
                  checked={formData.tipoDocumento === 'Correspondencia'}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-correspondencia"
                >
                  Correspondencia
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-gobierno"
                  value="Gobierno"
                  checked={formData.tipoDocumento === 'Gobierno'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-gobierno"
                >
                  Gobierno
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-leyes"
                  value="Leyes_Decretos"
                  checked={formData.tipoDocumento === 'Leyes_Decretos'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-leyes"
                >
                  Leyes y Decretos
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-mensura"
                  value="Mensura"
                  checked={formData.tipoDocumento === 'Mensura'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-mensura"
                >
                  Mensura
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-notarial"
                  value="Notarial"
                  checked={formData.tipoDocumento === 'Notarial'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-notarial"
                >
                  Notarial
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-tierras"
                  value="Tierras_Fiscales"
                  checked={formData.tipoDocumento === 'Tierras_Fiscales'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-tierras"
                >
                  Tierras Fiscales
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tipoDocumento"
                  id="tipo-tribunales"
                  value="Tribunales"
                  checked={formData.tipoDocumento === 'Tribunales'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-tribunales"
                >
                  Tribunales
                </label>
              </div>
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
                placeholder="Ingrese la carátula, el asunto y el extracto del documento"
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
                required
                placeholder="Ingrese el nombre de la persona"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tipo de Persona</Form.Label>
              <div
                className={`btn-group w-100 ${isMobile ? 'btn-group-vertical' : ''}`}
                role="group"
                aria-label="Tipo de persona toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="personaTipo"
                  id="tipo-fisica"
                  value="Persona Física"
                  checked={formData.personaTipo === 'Persona Física'}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-fisica"
                >
                  Persona Física
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="personaTipo"
                  id="tipo-juridica"
                  value="Persona Jurídica"
                  checked={formData.personaTipo === 'Persona Jurídica'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="tipo-juridica"
                >
                  Persona Jurídica
                </label>
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Rol de Persona</Form.Label>
              <div
                className={`btn-group w-100 ${isMobile ? 'btn-group-vertical' : ''}`}
                role="group"
                aria-label="Rol de persona toggle button group"
              >
                <input
                  type="radio"
                  className="btn-check"
                  name="personaRol"
                  id="rol-iniciador"
                  value="Iniciador"
                  checked={formData.personaRol === 'Iniciador'}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="rol-iniciador"
                >
                  Iniciador
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="personaRol"
                  id="rol-titular"
                  value="Titular"
                  checked={formData.personaRol === 'Titular'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="rol-titular"
                >
                  Titular
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="personaRol"
                  id="rol-escribano"
                  value="Escribano"
                  checked={formData.personaRol === 'Escribano'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="rol-escribano"
                >
                  Escribano
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="personaRol"
                  id="rol-emisor"
                  value="Emisor"
                  checked={formData.personaRol === 'Emisor'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="rol-emisor"
                >
                  Emisor
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="personaRol"
                  id="rol-destinatario"
                  value="Destinatario"
                  checked={formData.personaRol === 'Destinatario'}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <label
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  htmlFor="rol-destinatario"
                >
                  Destinatario
                </label>
              </div>
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
                placeholder="Ingrese el tema del documento"
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
