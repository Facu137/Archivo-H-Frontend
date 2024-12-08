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
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { archivoService } from '../../services/archivo.service'
import FormularioGeneral from './components/FormularioGeneral'

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

    // Si se está cambiando el tipo de documento, limpiar los campos específicos
    if (name === 'tipoDocumento') {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: finalValue,
          // Limpiar campos de Mensura
          lugar: '',
          propiedad: '',
          departamentoNombreActual: '',
          departamentoNombreAntiguo: '',
          departamentoEsActual: true,
          // Limpiar campos de Notarial
          registro: '',
          protocolo: '',
          mesInicio: '',
          mesFin: '',
          escrituraNro: '',
          negocioJuridico: ''
        }
        return newFormData
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : finalValue
      }))
    }
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
      const response = await archivoService.agregarArchivo(formDataToSend)

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
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Error al subir el documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Agregar Nuevo Documento</h2>

      <Form onSubmit={handleSubmit}>
        <FormularioGeneral
          formData={formData}
          handleInputChange={handleInputChange}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Imagenes</Form.Label>
              <Form.Control
                type="file"
                accept="image/*, application/pdf" // Aceptar solo archivos de imagen y pdf
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

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
        <Modal.Header
          closeButton
          className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
        >
          <Modal.Title>¡Éxito!</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
          {success}
        </Modal.Body>
        <Modal.Footer
          className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
        >
          <Button
            variant={isDarkMode ? 'outline-light' : 'primary'}
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AgregarArchivo
