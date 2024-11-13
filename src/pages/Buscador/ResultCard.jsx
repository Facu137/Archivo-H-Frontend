// src/pages/Buscador/ResultCard.jsx
import React from 'react'
import './ResultCard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaStar, FaEdit, FaTrash, FaFileImage, FaFilePdf } from 'react-icons/fa'
import PropTypes from 'prop-types'

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
    notarial_protocolo,
    isFavorite
  } = result

  const navigate = useNavigate()
  const { user, addFavorite, removeFavorite } = useAuth()

  const handleClick = () => {
    const fileUrl = imagen_url
      ? `http://localhost:3000/uploads/${imagen_url}`
      : ''
    const fileType = fileUrl.split('.').pop().toLowerCase()
    navigate(`/visor?file=${encodeURIComponent(fileUrl)}&type=${fileType}`)
  }

  const handleFavorite = () => {
    if (result.isFavorite) {
      removeFavorite(documento_id)
    } else {
      addFavorite(documento_id)
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation() // Evita que el clic se propague al padre
    onEdit(documento_id)
  }

  const handleDelete = (e) => {
    e.stopPropagation() // Evita que el clic se propague al padre
    onDelete(documento_id)
  }

  const isAdminOrEmployee =
    user && (user.rol === 'administrador' || user.rol === 'empleado')

  let thumbnailIcon = null
  if (imagen_url) {
    if (imagen_url.endsWith('.pdf')) {
      thumbnailIcon = <FaFilePdf />
    } else {
      thumbnailIcon = <FaFileImage />
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
        fecha += ' - Sin día' // Agrega "Sin día" si no hay día
      }
    } else {
      fecha += ' - Sin mes' // Agrega "Sin mes" si no hay mes
    }
  } else {
    fecha = 'Sin año' // Muestra "Sin año" si no hay año
  }

  return (
    <div className="result-card">
      <div className="card-content">
        <p>
          <strong>Tipo de Documento:</strong> {tipo_documento}
        </p>
        <p>
          <strong>Fecha:</strong> {fecha}
        </p>
        <p>
          <strong>Carátula/Asunto/Extracto:</strong> {caratula_asunto_extracto}
        </p>
        <p>
          <strong>Tema:</strong> {tema}
        </p>
        <p>
          <strong>Folios:</strong> {folios}
        </p>
        <p>
          <strong>Rol de Persona:</strong> {persona_rol}
        </p>
        <p>
          <strong>Nombre de Persona:</strong> {persona_nombre}
        </p>
        <p>
          <strong>Tipo de Persona:</strong> {persona_tipo}
        </p>
        <p>
          <strong>Departamento:</strong> {departamento_nombre}
        </p>
        <p>
          <strong>Legajo Número:</strong> {legajo_numero}
        </p>
        <p>
          <strong>Expediente Número:</strong> {expediente_numero}
        </p>
        <p>
          <strong>Lugar de Mensura:</strong> {mensura_lugar}
        </p>
        <p>
          <strong>Propiedad de Mensura:</strong> {mensura_propiedad}
        </p>
        <p>
          <strong>Registro Notarial:</strong> {notarial_registro}
        </p>
        <p>
          <strong>Protocolo Notarial:</strong> {notarial_protocolo}
        </p>
      </div>

      {/* Miniatura con ícono */}
      {thumbnailIcon && (
        <div className="miniatura" onClick={handleClick}>
          {thumbnailIcon}
          {/* Elemento vacío para el title */}
        </div>
      )}

      {/* Mostrar botón de favorito solo para usuarios autenticados que NO son admin ni empleado */}
      {user && !isAdminOrEmployee && (
        <button
          className="favorite-button"
          onClick={handleFavorite}
          title="Agregar a favoritos"
        >
          <FaStar color={result.isFavorite ? 'gold' : 'gray'} />
        </button>
      )}

      {/* Mostrar botones de editar y eliminar solo para admin y empleados */}
      {isAdminOrEmployee && (
        <div className="admin-actions">
          {' '}
          {/* Volvemos a agregar el div admin-actions */}
          <button className="edit-button" onClick={handleEdit} title="Editar">
            <FaEdit className="edit-icon" />{' '}
            {/* Agrega la clase "edit-icon" al icono de FaEdit */}
          </button>
          <button
            className="delete-button"
            onClick={handleDelete}
            title="Eliminar"
          >
            <FaTrash />
          </button>
          <button
            className="favorite-button"
            onClick={handleFavorite}
            title="Agregar a favoritos"
          >
            <FaStar color={result.isFavorite ? 'gold' : 'gray'} />
          </button>
        </div>
      )}
    </div>
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
    departamento_nombre: PropTypes.string,
    imagen_url: PropTypes.string,
    legajo_numero: PropTypes.string,
    expediente_numero: PropTypes.string,
    mensura_lugar: PropTypes.string,
    mensura_propiedad: PropTypes.string,
    notarial_registro: PropTypes.string,
    notarial_protocolo: PropTypes.string,
    isFavorite: PropTypes.bool.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResultCard
