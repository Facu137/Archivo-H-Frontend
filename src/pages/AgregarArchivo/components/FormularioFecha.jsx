import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

const FormularioFecha = ({ formData, handleInputChange }) => {
  const [validaciones, setValidaciones] = useState({
    dia: true,
    mes: true,
    anio: true
  })

  const validarFecha = useCallback(
    (nombre, valor) => {
      if (valor === '') return true // Fechas vacías son válidas

      const numValue = parseInt(valor)

      switch (nombre) {
        case 'dia': {
          if (isNaN(numValue)) return false
          if (numValue < 1 || numValue > 31) return false

          // Validar días según el mes
          const mes = parseInt(formData.mes)
          if (!isNaN(mes)) {
            if (mes === 2) {
              // Febrero
              const anio = parseInt(formData.anio)
              const esBisiesto = anio
                ? anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0)
                : false
              if (esBisiesto && numValue > 29) return false
              if (!esBisiesto && numValue > 28) return false
            } else if ([4, 6, 9, 11].includes(mes) && numValue > 30) {
              // Meses con 30 días
              return false
            }
          }
          return true
        }

        case 'mes': {
          if (isNaN(numValue)) return false
          return numValue >= 1 && numValue <= 12
        }

        case 'anio': {
          if (isNaN(numValue)) return false
          return numValue >= 1800 && numValue <= new Date().getFullYear()
        }

        default:
          return true
      }
    },
    [formData.mes, formData.anio]
  ) // Add dependencies used inside the callback

  const handleFechaChange = (e) => {
    const { name, value } = e.target
    const esValido = validarFecha(name, value)

    setValidaciones((prev) => ({
      ...prev,
      [name]: esValido
    }))

    handleInputChange(e)
  }

  // Validar cuando cambian los valores relacionados
  useEffect(() => {
    const diaValido = validarFecha('dia', formData.dia)
    setValidaciones((prev) => ({
      ...prev,
      dia: diaValido
    }))
  }, [formData.mes, formData.anio, formData.dia, validarFecha])

  return (
    <div className="mb-4">
      <h4 className="mb-3">Fecha del Documento</h4>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Día</Form.Label>
            <Form.Control
              type="number"
              name="dia"
              value={formData.dia}
              onChange={handleFechaChange}
              isInvalid={!validaciones.dia}
              min="1"
              max="31"
            />
            <Form.Control.Feedback type="invalid">
              {formData.dia && 'Día inválido para el mes seleccionado'}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Mes</Form.Label>
            <Form.Control
              type="number"
              name="mes"
              value={formData.mes}
              onChange={handleFechaChange}
              isInvalid={!validaciones.mes}
              min="1"
              max="12"
            />
            <Form.Control.Feedback type="invalid">
              {formData.mes && 'El mes debe estar entre 1 y 12'}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleFechaChange}
              isInvalid={!validaciones.anio}
              min="1800"
              max={new Date().getFullYear()}
            />
            <Form.Control.Feedback type="invalid">
              {formData.anio &&
                `El año debe estar entre 1800 y ${new Date().getFullYear()}`}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}

FormularioFecha.propTypes = {
  formData: PropTypes.shape({
    dia: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    anio: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
}

export default FormularioFecha
