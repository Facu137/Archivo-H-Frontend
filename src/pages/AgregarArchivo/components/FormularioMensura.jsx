import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

const FormularioMensura = ({ formData, handleInputChange, show }) => {
  if (!show) return null

  return (
    <div className="mb-4">
      <h4 className="mb-3">Información de Mensura</h4>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Propiedad</Form.Label>
            <Form.Control
              type="text"
              name="propiedad"
              value={formData.propiedad}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Departamento (Nombre Actual)</Form.Label>
            <Form.Control
              type="text"
              name="departamentoNombreActual"
              value={formData.departamentoNombreActual}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Departamento (Nombre Antiguo)</Form.Label>
            <Form.Control
              type="text"
              name="departamentoNombreAntiguo"
              value={formData.departamentoNombreAntiguo}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Departamento es Actual"
              name="departamentoEsActual"
              checked={formData.departamentoEsActual}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}

FormularioMensura.propTypes = {
  formData: PropTypes.shape({
    lugar: PropTypes.string,
    propiedad: PropTypes.string,
    departamentoNombreActual: PropTypes.string,
    departamentoNombreAntiguo: PropTypes.string,
    departamentoEsActual: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default FormularioMensura
