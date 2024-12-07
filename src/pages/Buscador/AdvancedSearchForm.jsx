// src/pages/Buscador/AdvancedSearchForm.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'
import { archivoService } from '../../services/archivo.service'

const AdvancedSearchForm = ({ onSearch }) => {
  const [categoria, setCategoria] = useState('mensura')
  const [camposBusqueda, setCamposBusqueda] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    mostrarCamposBusqueda(categoria)
  }, [categoria])

  const mostrarCamposBusqueda = (categoria) => {
    let campos = []
    switch (categoria) {
      case 'mensura':
        campos = [
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Departamento Antiguo', id: 'Dpto. Antiguo' },
          { label: 'Departamento Actual', id: 'Dpto. Actual' },
          { label: 'Lugar', id: 'Lugar' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Titular', id: 'Titular' },
          { label: 'Carátula', id: 'Caratula' },
          { label: 'Propiedad', id: 'Propiedad' },
          { label: 'Fojas', id: 'Fojas' }
        ]
        break
      case 'notarial':
        campos = [
          { label: 'Escribano', id: 'Escribano' },
          { label: 'Registro', id: 'Registro' },
          { label: 'Protocolo', id: 'Protocolo' },
          { label: 'Mes inicio', id: 'Mes inicio' },
          { label: 'Mes fin', id: 'Mes fin' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Escritura Nº', id: 'Escritura N°' },
          { label: 'Iniciador', id: 'Iniciador' },
          { label: 'Extracto', id: 'Extracto' },
          { label: 'Negocio Jurídico', id: 'Negocio juridico' },
          { label: 'Folio', id: 'Folio' }
        ]
        break
      case 'correspondencia':
      case 'leyesdecretos':
        campos = [
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Emisor', id: 'Emisor' },
          { label: 'Destinatario', id: 'Destinatario' },
          { label: 'Asunto', id: 'Asunto' },
          { label: 'Fojas', id: 'Fojas' }
        ]
        break
      case 'gobierno':
      case 'tierrasfiscales':
      case 'tribunales':
        campos = [
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Iniciador', id: 'Iniciador' },
          { label: 'Carátula', id: 'Caratula' },
          { label: 'Tema', id: 'Tema' },
          { label: 'Folios', id: 'Folios' }
        ]
        break
      default:
        campos = []
    }

    const nuevosCampos = {}
    campos.forEach((campo) => {
      nuevosCampos[campo.id] = ''
    })
    setCamposBusqueda(nuevosCampos)
  }

  const handleChange = (e) => {
    setCamposBusqueda({
      ...camposBusqueda,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Construir los parámetros de la consulta
      const params = { tipo_documento: categoria }

      // Agregar los campos de búsqueda específicos de la categoría
      Object.entries(camposBusqueda).forEach(([key, value]) => {
        if (value) {
          // Convertir las claves al formato esperado por el backend
          const apiKey = key
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[.°]/g, '')
          params[apiKey] = value
        }
      })

      const response = await archivoService.busquedaAvanzada(params)
      onSearch(response.data)
    } catch (error) {
      console.error('Error en la búsqueda avanzada:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    mostrarCamposBusqueda(categoria)
  }

  return (
    <Card className={`mb-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6} lg={12}>
              <Form.Group controlId="categoria">
                <Form.Label>Categoría:</Form.Label>
                <Form.Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value.toLowerCase())}
                  className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}
                >
                  <option value="mensura">Mensura</option>
                  <option value="notarial">Notarial</option>
                  <option value="correspondencia">Correspondencia</option>
                  <option value="leyesdecretos">Leyes Decretos</option>
                  <option value="gobierno">Gobierno</option>
                  <option value="tierrasfiscales">Tierras Fiscales</option>
                  <option value="tribunales">Tribunales</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3">
            {Object.keys(camposBusqueda).map((key) => (
              <Col key={key} xs={12} sm={6} md={4} lg={3}>
                <Form.Group controlId={key}>
                  <Form.Label>{key}</Form.Label>
                  <Form.Control
                    type="text"
                    value={camposBusqueda[key]}
                    onChange={handleChange}
                    placeholder={`Ingrese ${key.toLowerCase()}`}
                    className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              variant={isDarkMode ? 'outline-light' : 'outline-secondary'}
              onClick={handleReset}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant={isDarkMode ? 'outline-light' : 'primary'}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Buscar'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

AdvancedSearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
}

export default AdvancedSearchForm
