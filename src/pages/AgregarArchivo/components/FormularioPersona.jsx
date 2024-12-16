import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

const FormularioPersona = ({
  formData,
  handleInputChange,
  isMobile,
  isDarkMode
}) => {
  return (
    <div className={`mb-4`}>
      <h4 className="mb-3">Información de la Persona</h4>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nombre de Persona</Form.Label>
            <Form.Control
              type="text"
              name="personaNombre"
              value={formData.personaNombre}
              onChange={handleInputChange}
              required
              placeholder="Ingrese el nombre de la persona"
              autoComplete="off"
              isValid={
                formData.personaNombre.length <= 100 &&
                formData.personaNombre !== ''
              }
              isInvalid={
                formData.personaNombre.length > 100 &&
                formData.personaNombre !== ''
              }
            />
            <Form.Control.Feedback type="invalid">
              El nombre no puede tener más de 100 caracteres
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
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
      </Row>

      <Row>
        <Col md={12}>
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
    </div>
  )
}

FormularioPersona.propTypes = {
  formData: PropTypes.shape({
    personaNombre: PropTypes.string,
    personaTipo: PropTypes.string,
    personaRol: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}

export default FormularioPersona
