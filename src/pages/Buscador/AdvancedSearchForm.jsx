// src/pages/Buscador/AdvancedSearchForm.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

const AdvancedSearchForm = ({ onSearch }) => {
  const [categoria, setCategoria] = useState('mensura')
  const [camposBusqueda, setCamposBusqueda] = useState({})
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
      case 'leyesdecretos': // Mismos campos para correspondencia y leyesdecretos
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
      case 'tierrasfiscales': // Mismos campos para gobierno y tierrasfiscales
      case 'tribunales': // Mismos campos para tribunales
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

    try {
      // Construir los parámetros de la consulta
      const params = { tipo_documento: categoria }

      // Agregar los campos de búsqueda específicos de la categoría
      switch (categoria) {
        case 'mensura':
          params.legajo = camposBusqueda.Legajo
          params.legajoBis = camposBusqueda['Legajo bis']
          params.expediente = camposBusqueda.Expediente
          params.expedienteBis = camposBusqueda['Expediente bis']
          params.departamento = camposBusqueda['Dpto. Antiguo'] // O 'Dpto. Actual' según corresponda
          params.lugar = camposBusqueda.Lugar
          params.dia = camposBusqueda.Dia
          params.mes = camposBusqueda.Mes
          params.anio = camposBusqueda.Año
          params.titular = camposBusqueda.Titular
          params.caratula = camposBusqueda.Caratula
          params.propiedad = camposBusqueda.Propiedad
          params.folios = camposBusqueda.Fojas
          break
        case 'notarial':
          params.escribano = camposBusqueda.Escribano
          params.registro = camposBusqueda.Registro
          params.protocolo = camposBusqueda.Protocolo
          params.mes_inicio = camposBusqueda['Mes inicio']
          params.mes_fin = camposBusqueda['Mes fin']
          params.dia = camposBusqueda.Dia
          params.mes = camposBusqueda.Mes
          params.anio = camposBusqueda.Año
          params.escritura_nro = camposBusqueda['Escritura N°']
          params.iniciador = camposBusqueda.Iniciador
          params.extracto = camposBusqueda.Extracto // Ajusta el nombre del campo si es necesario
          params.negocio_juridico = camposBusqueda['Negocio juridico']
          params.folio = camposBusqueda.Folio
          break
        case 'correspondencia':
        case 'leyesdecretos':
          params.legajo = camposBusqueda.Legajo
          params.legajoBis = camposBusqueda['Legajo bis']
          params.expediente = camposBusqueda.Expediente
          params.expedienteBis = camposBusqueda['Expediente bis']
          params.dia = camposBusqueda.Dia
          params.mes = camposBusqueda.Mes
          params.anio = camposBusqueda.Año
          params.emisor = camposBusqueda.Emisor
          params.destinatario = camposBusqueda.Destinatario
          params.asunto = camposBusqueda.Asunto // Ajusta el nombre del campo si es necesario
          params.folios = camposBusqueda.Fojas
          break
        case 'gobierno':
        case 'tierrasfiscales':
        case 'tribunales':
          params.legajo = camposBusqueda.Legajo
          params.legajoBis = camposBusqueda['Legajo bis']
          params.expediente = camposBusqueda.Expediente
          params.expedienteBis = camposBusqueda['Expediente bis']
          params.dia = camposBusqueda.Dia
          params.mes = camposBusqueda.Mes
          params.anio = camposBusqueda.Año
          params.iniciador = camposBusqueda.Iniciador
          params.caratula = camposBusqueda.Caratula
          params.tema = camposBusqueda.Tema
          params.folios = camposBusqueda.Folios
          break
      }

      const response = await axios.get(
        'http://localhost:3000/api/documents/advanced-search',
        { params }
      )
      onSearch(response.data)
    } catch (error) {
      console.error('Error al hacer la búsqueda:', error)
    }
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

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              variant={isDarkMode ? 'outline-light' : 'primary'}
            >
              Buscar
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
