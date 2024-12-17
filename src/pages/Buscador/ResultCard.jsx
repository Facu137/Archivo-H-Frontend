// src/pages/Buscador/ResultCard.jsx
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  FaEdit,
  FaTrash,
  FaFileImage,
  FaFilePdf,
  FaExternalLinkAlt
} from 'react-icons/fa'
import PropTypes from 'prop-types'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

const ResultCard = ({ result, onEdit, onDelete }) => {
  const {
    documento_id,
    tipo_documento,
    anio = null,
    mes = null,
    dia = null,
    caratula_asunto_extracto,
    tema,
    folios,
    persona_rol,
    persona_nombre,
    persona_tipo,
    departamento_nombre,
    imagen_url,
    legajo_numero,
    expediente_numero,
    mensura_lugar,
    mensura_propiedad,
    notarial_registro,
    notarial_protocolo
  } = result

  const { user } = useAuth()
  const { isDarkMode } = useTheme()

  const handleClick = (e) => {
    e.stopPropagation() // Prevent card click
    const fileUrl = imagen_url
      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${imagen_url}`
      : ''
    const fileType = fileUrl.split('.').pop().toLowerCase()
    const visorUrl = `/visor?file=${encodeURIComponent(fileUrl)}&type=${fileType}`
    window.open(visorUrl, '_blank')
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(documento_id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(documento_id)
  }

  const isAdminOrEmployee =
    user && (user.rol === 'administrador' || user.rol === 'empleado')

  let thumbnailIcon = null
  if (imagen_url) {
    if (imagen_url.endsWith('.pdf')) {
      thumbnailIcon = <FaFilePdf size={24} />
    } else {
      thumbnailIcon = <FaFileImage size={24} />
    }
  }

  let fecha = ''
  if (anio) {
    fecha += anio
    if (mes) {
      fecha += `-${mes}`
      if (dia) {
        fecha += `-${dia}`
      } else {
        fecha += ' - Sin día'
      }
    } else {
      fecha += ' - Sin mes'
    }
  } else {
    fecha = 'Sin año'
  }

  return (
    <Card
      className={`mb-3 ${isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
    >
      <Card.Body>
        <Row>
          <Col xs={12} md={thumbnailIcon ? 10 : 12}>
            <Row className="g-3">
              <Col xs={12} sm={6} md={4}>
                <p className="mb-2">
                  <strong>Tipo de Documento:</strong> {tipo_documento}
                </p>
                <p className="mb-2">
                  <strong>Fecha:</strong> {fecha}
                </p>
                {expediente_numero && (
                  <p className="mb-2">
                    <strong>Expediente N°:</strong> {expediente_numero}
                  </p>
                )}
                {legajo_numero && (
                  <p className="mb-2">
                    <strong>Legajo N°:</strong> {legajo_numero}
                  </p>
                )}
              </Col>
              <Col xs={12} sm={6} md={4}>
                {caratula_asunto_extracto && (
                  <p className="mb-2">
                    <strong>Carátula/Asunto:</strong> {caratula_asunto_extracto}
                  </p>
                )}
                {tema && (
                  <p className="mb-2">
                    <strong>Tema:</strong> {tema}
                  </p>
                )}
                {folios && (
                  <p className="mb-2">
                    <strong>Folios:</strong> {folios}
                  </p>
                )}
              </Col>
              <Col xs={12} sm={6} md={4}>
                {persona_nombre && (
                  <p className="mb-2">
                    <strong>Persona:</strong> {persona_nombre}
                  </p>
                )}
                {persona_rol && (
                  <p className="mb-2">
                    <strong>Rol:</strong> {persona_rol}
                  </p>
                )}
                {persona_tipo && (
                  <p className="mb-2">
                    <strong>Tipo:</strong> {persona_tipo}
                  </p>
                )}
                {departamento_nombre && (
                  <p className="mb-2">
                    <strong>Departamento:</strong> {departamento_nombre}
                  </p>
                )}
              </Col>
            </Row>
          </Col>
          {thumbnailIcon && (
            <Col
              xs={12}
              md={2}
              className="mt-3 mt-md-0 d-flex justify-content-center align-items-start"
            >
              <Button
                variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: '100px' }}
                onClick={handleClick}
              >
                {thumbnailIcon}
                <div className="mt-2 text-center">
                  <small>Click para ver</small>
                  <FaExternalLinkAlt size={12} className="ms-1" />
                </div>
              </Button>
            </Col>
          )}
        </Row>
        {isAdminOrEmployee && (
          <div className="mt-3 d-flex justify-content-end gap-2">
            <Button variant="outline-primary" size="sm" onClick={handleEdit}>
              <FaEdit /> Editar
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              <FaTrash /> Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

ResultCard.propTypes = {
  result: PropTypes.shape({
    documento_id: PropTypes.number.isRequired,
    tipo_documento: PropTypes.string.isRequired,
    anio: PropTypes.number,
    mes: PropTypes.number,
    dia: PropTypes.number,
    caratula_asunto_extracto: PropTypes.string,
    tema: PropTypes.string,
    folios: PropTypes.number,
    persona_rol: PropTypes.string,
    persona_nombre: PropTypes.string,
    persona_tipo: PropTypes.string,
    departamento_nombre: PropTypes.string,
    imagen_url: PropTypes.string,
    legajo_numero: PropTypes.string,
    expediente_numero: PropTypes.string,
    mensura_lugar: PropTypes.string,
    mensura_propiedad: PropTypes.string,
    notarial_registro: PropTypes.string,
    notarial_protocolo: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResultCard
