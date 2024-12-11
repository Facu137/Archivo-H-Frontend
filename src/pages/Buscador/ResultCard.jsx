// src/pages/Buscador/ResultCard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaEdit, FaTrash, FaFileImage, FaFilePdf } from 'react-icons/fa'
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

  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()

  const handleClick = () => {
    const fileUrl = imagen_url
      ? `http://localhost:3000/uploads/${imagen_url}`
      : ''
    const fileType = fileUrl.split('.').pop().toLowerCase()
    navigate(`/visor?file=${encodeURIComponent(fileUrl)}&type=${fileType}`)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    navigate(`/editar-archivo/${documento_id}`)
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

  // Construcción de la fecha
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
      style={{ cursor: imagen_url ? 'pointer' : 'default' }}
      onClick={imagen_url ? handleClick : undefined}
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
                <p className="mb-2">
                  <strong>Carátula/Asunto/Extracto:</strong>{' '}
                  {caratula_asunto_extracto}
                </p>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <p className="mb-2">
                  <strong>Tema:</strong> {tema}
                </p>
                <p className="mb-2">
                  <strong>Folios:</strong> {folios}
                </p>
                <p className="mb-2">
                  <strong>Departamento:</strong> {departamento_nombre}
                </p>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <p className="mb-2">
                  <strong>Persona:</strong> {persona_nombre} ({persona_tipo} -{' '}
                  {persona_rol})
                </p>
                <p className="mb-2">
                  <strong>Legajo:</strong> {legajo_numero}
                </p>
                <p className="mb-2">
                  <strong>Expediente:</strong> {expediente_numero}
                </p>
              </Col>
              {(mensura_lugar || mensura_propiedad) && (
                <Col xs={12}>
                  <p className="mb-2">
                    <strong>Mensura:</strong> {mensura_lugar} -{' '}
                    {mensura_propiedad}
                  </p>
                </Col>
              )}
              {(notarial_registro || notarial_protocolo) && (
                <Col xs={12}>
                  <p className="mb-2">
                    <strong>Notarial:</strong> Registro {notarial_registro} -
                    Protocolo {notarial_protocolo}
                  </p>
                </Col>
              )}
            </Row>
          </Col>
          {thumbnailIcon && (
            <Col
              xs={12}
              md={2}
              className="d-flex align-items-center justify-content-center mt-3 mt-md-0"
            >
              <div className="text-center">
                {thumbnailIcon}
                <div className="mt-2 small">Click para ver</div>
              </div>
            </Col>
          )}
        </Row>

        {isAdminOrEmployee && (
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <Button
              variant={isDarkMode ? 'outline-light' : 'outline-primary'}
              size="sm"
              onClick={handleEdit}
              title="Editar"
            >
              <FaEdit /> Editar
            </Button>
            <Button
              variant={isDarkMode ? 'outline-danger' : 'danger'}
              size="sm"
              onClick={handleDelete}
              title="Eliminar"
            >
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
    caratula_asunto_extracto: PropTypes.string.isRequired,
    tema: PropTypes.string,
    folios: PropTypes.number.isRequired,
    persona_rol: PropTypes.string.isRequired,
    persona_nombre: PropTypes.string.isRequired,
    persona_tipo: PropTypes.string.isRequired,
    departamento_nombre: PropTypes.string.isRequired,
    imagen_url: PropTypes.string,
    legajo_numero: PropTypes.string,
    expediente_numero: PropTypes.string,
    mensura_lugar: PropTypes.string,
    mensura_propiedad: PropTypes.string,
    notarial_registro: PropTypes.string,
    notarial_protocolo: PropTypes.string,
    isFavorite: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResultCard

