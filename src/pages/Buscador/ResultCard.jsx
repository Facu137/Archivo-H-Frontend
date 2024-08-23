import React from 'react'
import './ResultCard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa'

const ResultCard = ({ result, onEdit, onDelete }) => {
  const {
    documento_id,
    tipo_documento,
    anio,
    mes,
    dia,
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

  const fecha = `${anio}-${mes}-${dia}`
  const navigate = useNavigate()
  const { user, addFavorite, removeFavorite } = useAuth()

  const handleClick = () => {
    // Construye la URL completa de la imagen
    const fileUrl = imagen_url
      ? `http://localhost:3000/uploads/${imagen_url}`
      : '' // Ajusta la URL base si es necesario
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

  const handleEdit = () => {
    onEdit(documento_id)
  }

  const handleDelete = () => {
    onDelete(documento_id)
  }

  const isAdminOrEmployee =
    user && (user.role === 'administrador' || user.role === 'empleado')

  return (
    <div className="result-card" onClick={handleClick}>
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
      {imagen_url && (
        <div className="miniatura">
          <img src={`http://localhost:3000/${imagen_url}`} alt="Miniatura" />{' '}
          {/* URL completa */}
        </div>
      )}
      {user && (
        <button className="favorite-button" onClick={handleFavorite}>
          <FaStar color={result.isFavorite ? 'gold' : 'gray'} />
        </button>
      )}
      {isAdminOrEmployee && (
        <div className="admin-actions">
          <button className="edit-button" onClick={handleEdit}>
            <FaEdit />
          </button>
          <button className="delete-button" onClick={handleDelete}>
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ResultCard
