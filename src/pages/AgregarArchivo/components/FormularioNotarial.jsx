import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

const FormularioNotarial = ({ formData, handleInputChange, show }) => {
  if (!show) return null

  return (
    <div className="mb-4">
      <h4 className="mb-3">Información Notarial</h4>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
            <Form.Label>Protocolo</Form.Label>
            <Form.Control
              type="text"
              name="protocolo"
              value={formData.protocolo}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Mes Inicio</Form.Label>
            <Form.Control
              type="number"
              name="mesInicio"
              value={formData.mesInicio}
              onChange={handleInputChange}
              min="1"
              max="12"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Mes Fin</Form.Label>
            <Form.Control
              type="number"
              name="mesFin"
              value={formData.mesFin}
              onChange={handleInputChange}
              min="1"
              max="12"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Número de Escritura</Form.Label>
            <Form.Control
              type="text"
              name="escrituraNro"
              value={formData.escrituraNro}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
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
    </div>
  )
}

FormularioNotarial.propTypes = {
  formData: PropTypes.shape({
    registro: PropTypes.string,
    protocolo: PropTypes.string,
    mesInicio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mesFin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    escrituraNro: PropTypes.string,
    negocioJuridico: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default FormularioNotarial
