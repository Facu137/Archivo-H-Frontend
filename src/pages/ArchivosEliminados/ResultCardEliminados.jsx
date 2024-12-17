import React from 'react'
import './ResultCardEliminados.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaTrash, FaFileImage, FaFilePdf, FaUndo } from 'react-icons/fa'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import api from '../../services/api.config'

const ResultCardEliminados = ({ result, onDeletePermanently, onRestore }) => {
  const {
    documento_id,
    tipo_documento,
    fecha_documento,
    caratula_asunto_extracto,
    tema,
    folios,
    personas,
    departamentos,
    imagenes_url,
    legajo,
    expediente,
    mensura,
    notarial,
    eliminacion
  } = result

  const navigate = useNavigate()
  const { user, token } = useAuth() // Obtén el token del contexto

  // Lógica para abrir el visor de archivos (si es necesario)
  const handleClick = () => {
    // ... (implementa la lógica para abrir el visor) ...
  }

  const handleDeletePermanently = async (e) => {
    e.stopPropagation()

    const confirmDelete = await Swal.fire({
      title: '¿Desea eliminar permanentemente este archivo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    })

    if (confirmDelete.isConfirmed) {
      // Solicitar contraseña de administrador
      const { value: adminPassword, isConfirmed: passwordProvided } =
        await Swal.fire({
          title: 'Contraseña de Administrador',
          input: 'password',
          inputLabel: 'Por favor, ingrese la contraseña de administrador',
          inputPlaceholder: 'Contraseña',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value) {
              return 'Debe ingresar una contraseña'
            }
          }
        })

      if (passwordProvided) {
        try {
          await api.delete(`/deleted/documents/${documento_id}/permanente`, {
            data: {
              contraseniaAdmin: adminPassword
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          onDeletePermanently(documento_id)
          Swal.fire({
            title: 'Eliminado',
            text: 'El archivo se eliminó permanentemente.',
            icon: 'success'
          })
        } catch (error) {
          console.error('Error al eliminar permanentemente:', error)
          let errorMessage = 'No se pudo eliminar el archivo.'

          // Si el error es por contraseña incorrecta (401)
          if (error.response && error.response.status === 401) {
            errorMessage = 'Contraseña de administrador incorrecta.'
          }

          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error'
          })
        }
      }
    }
  }

  const handleRestore = async (e) => {
    e.stopPropagation()

    const confirmRestore = await Swal.fire({
      title: '¿Desea restaurar este archivo?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'question'
    })

    if (confirmRestore.isConfirmed) {
      try {
        // Realiza la petición PUT al backend para restaurar el archivo
        const response = await api.put(
          `/deleted/documents/${documento_id}/restore`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 200) {
          onRestore(documento_id)
          Swal.fire({
            title: 'Éxito',
            text: 'Archivo restaurado correctamente.',
            icon: 'success'
          })
        } else {
          console.error('Error al restaurar el archivo:', response.data)
          Swal.fire({
            title: 'Error',
            text: 'No se pudo restaurar el archivo.',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('Error al restaurar el archivo:', error)
        Swal.fire({
          title: 'Error',
          text: 'No se pudo restaurar el archivo.',
          icon: 'error'
        })
      }
    }
  }

  // Lógica para el icono de miniatura
  let thumbnailIcon = null
  if (imagenes_url && imagenes_url.length > 0) {
    if (imagenes_url[0].endsWith('.pdf')) {
      thumbnailIcon = <FaFilePdf />
    } else {
      thumbnailIcon = <FaFileImage />
    }
  }

  // Lógica para mostrar la fecha
  const fecha = fecha_documento
    ? `${fecha_documento.anio}-${fecha_documento.mes}-${fecha_documento.dia}`
    : 'Sin fecha'

  return (
    <div className="result-card-eliminados">
      <div className="card-content-eliminados">
        {/* Mostrar los datos del archivo */}
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

        {/* Mostrar personas asociadas */}
        {personas.map((persona, index) => (
          <React.Fragment key={index}>
            <p>
              <strong>Rol de Persona:</strong> {persona.rol}
            </p>
            <p>
              <strong>Nombre de Persona:</strong> {persona.nombre}
            </p>
            <p>
              <strong>Tipo de Persona:</strong> {persona.tipo}
            </p>
          </React.Fragment>
        ))}

        {/* Mostrar departamentos asociados */}
        {departamentos.length > 0 && (
          <p>
            <strong>Departamento:</strong> {departamentos.join(', ')}
          </p>
        )}

        {/* Mostrar información de legajo y expediente */}
        {legajo && (
          <p>
            <strong>Legajo Número:</strong> {legajo.numero}
          </p>
        )}
        {expediente && (
          <p>
            <strong>Expediente Número:</strong> {expediente.numero}
          </p>
        )}

        {/* Mostrar información de mensura */}
        {mensura && (
          <>
            <p>
              <strong>Lugar de Mensura:</strong> {mensura.lugar}
            </p>
            <p>
              <strong>Propiedad de Mensura:</strong> {mensura.propiedad}
            </p>
          </>
        )}

        {/* Mostrar información notarial */}
        {notarial && (
          <>
            <p>
              <strong>Registro Notarial:</strong> {notarial.registro}
            </p>
            <p>
              <strong>Protocolo Notarial:</strong> {notarial.protocolo}
            </p>
            {/* ... (resto de las propiedades de notarial) ... */}
          </>
        )}

        {/* Mostrar información de eliminación */}
        {eliminacion && (
          <>
            <p>
              <strong>Eliminado por:</strong> {eliminacion.usuario}
            </p>
            <p>
              <strong>Fecha de eliminación:</strong>{' '}
              {eliminacion.fecha.substring(0, 19).replace('T', ' ')}
            </p>
          </>
        )}
      </div>

      {/* Miniatura con ícono */}
      {thumbnailIcon && (
        <div className="miniatura-eliminados" onClick={handleClick}>
          {thumbnailIcon}
        </div>
      )}

      {/* Botón Eliminar permanentemente */}
      {user && (user.rol === 'administrador' || user.rol === 'empleado') && (
        <button
          className="delete-permanently-button"
          onClick={handleDeletePermanently}
          title="Eliminar permanentemente"
        >
          <FaTrash />
        </button>
      )}

      {/* Botón Restaurar */}
      {user && (user.rol === 'administrador' || user.rol === 'empleado') && (
        <button
          className="restore-button"
          onClick={handleRestore}
          title="Restaurar"
        >
          <FaUndo />
        </button>
      )}
    </div>
  )
}

ResultCardEliminados.propTypes = {
  result: PropTypes.shape({
    documento_id: PropTypes.number.isRequired,
    tipo_documento: PropTypes.string.isRequired,
    fecha_documento: PropTypes.shape({
      anio: PropTypes.number,
      mes: PropTypes.number,
      dia: PropTypes.number
    }),
    caratula_asunto_extracto: PropTypes.string.isRequired,
    tema: PropTypes.string,
    folios: PropTypes.number.isRequired,
    fecha_marcado_eliminacion: PropTypes.string, // Asegúrate de que este campo sea un string
    personas: PropTypes.arrayOf(
      PropTypes.shape({
        rol: PropTypes.string,
        nombre: PropTypes.string,
        tipo: PropTypes.string
      })
    ),
    departamentos: PropTypes.arrayOf(PropTypes.string),
    imagenes_url: PropTypes.arrayOf(PropTypes.string),
    legajo: PropTypes.shape({
      numero: PropTypes.string
    }),
    expediente: PropTypes.shape({
      numero: PropTypes.string
    }),
    mensura: PropTypes.shape({
      lugar: PropTypes.string,
      propiedad: PropTypes.string
    }),
    notarial: PropTypes.shape({
      registro: PropTypes.string,
      protocolo: PropTypes.string,
      mes_inicio: PropTypes.number,
      mes_fin: PropTypes.number,
      escritura_nro: PropTypes.string,
      negocio_juridico: PropTypes.string
    }),
    eliminacion: PropTypes.shape({
      usuario: PropTypes.string,
      fecha: PropTypes.string
    })
  }).isRequired,
  onDeletePermanently: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired
}

export default ResultCardEliminados
