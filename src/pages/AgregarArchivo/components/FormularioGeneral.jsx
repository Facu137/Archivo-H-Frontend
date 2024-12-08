import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'
import FormularioFecha from './FormularioFecha'
import FormularioPersona from './FormularioPersona'
import FormularioMensura from './FormularioMensura'
import FormularioNotarial from './FormularioNotarial'

const FormularioGeneral = ({
  formData,
  handleInputChange,
  isMobile,
  isDarkMode
}) => {
  return (
    <div className="mb-4">
      <h4 className="mb-3">Información General del Documento</h4>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
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

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Número de Legajo</Form.Label>
            <Form.Control
              type="number"
              name="legajoNumero"
              value={formData.legajoNumero}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Legajo Es Bis (0-100)</Form.Label>
            <Form.Control
              type="number"
              name="legajoEsBis"
              value={formData.legajoEsBis}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Número de Expediente</Form.Label>
            <Form.Control
              type="number"
              name="expedienteNumero"
              value={formData.expedienteNumero}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expediente Es Bis (0-100)</Form.Label>
            <Form.Control
              type="number"
              name="expedienteEsBis"
              value={formData.expedienteEsBis}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <FormularioFecha
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Carátula/Asunto/Extracto</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="caratulaAsuntoExtracto"
              value={formData.caratulaAsuntoExtracto}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <FormularioPersona
          formData={formData}
          handleInputChange={handleInputChange}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
      </Row>

      {formData.tipoDocumento === 'Mensura' && (
        <FormularioMensura
          formData={formData}
          handleInputChange={handleInputChange}
          show={true}
        />
      )}

      {formData.tipoDocumento === 'Notarial' && (
        <FormularioNotarial
          formData={formData}
          handleInputChange={handleInputChange}
          show={true}
        />
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
              autoComplete="off"
              isValid={
                formData.tema.length <= 100 &&
                formData.tema.length >= 3 &&
                formData.tema !== ''
              }
              isInvalid={
                formData.tema.length > 100 &&
                formData.tema.length < 3 &&
                formData.tema === ''
              }
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Folios/Fojas</Form.Label>
            <Form.Control
              type="number"
              name="folios"
              value={formData.folios}
              onChange={handleInputChange}
              min="1"
              max="9999999999"
              placeholder="Ingrese el número de folios"
              autoComplete="off"
              isValid={formData.folios >= 1 && formData.folios <= 9999999999}
              isInvalid={formData.folios === '0'}
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
    </div>
  )
}

FormularioGeneral.propTypes = {
  formData: PropTypes.shape({
    tipoDocumento: PropTypes.string.isRequired,
    legajoNumero: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    legajoEsBis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expedienteNumero: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expedienteEsBis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    caratulaAsuntoExtracto: PropTypes.string,
    tema: PropTypes.string,
    folios: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    esPublico: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}

export default FormularioGeneral
