import React, { useEffect, useCallback, useReducer } from 'react'
import './GestionArchivo.css'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import { z } from 'zod'
import PropTypes from 'prop-types'

const FILE_TYPES = {
  Mensura: 'Mensura',
  Notarial: 'Notarial',
  Correspondencia: 'Correspondencia',
  Leyes_Decretos: 'Leyes y Decretos',
  Gobierno: 'Gobierno',
  Tierras_Fiscales: 'Tierras Fiscales',
  Tribunales: 'Tribunales'
}

const FORM_FIELDS = {
  Mensura: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'DepartamentoAntiguo',
    'DepartamentoActual',
    'Lugar',
    'dia',
    'mes',
    'anio',
    'Titular',
    'caratulaAsuntoExtracto',
    'Propiedad',
    'Fojas'
  ],
  Notarial: [
    'Escribano',
    'Registro',
    'Protocolo',
    'MesInicio',
    'MesFin',
    'dia',
    'mes',
    'anio',
    'EscrituraNº',
    'Iniciador',
    'caratulaAsuntoExtracto',
    'NegocioJuridico',
    'Folio'
  ],
  Correspondencia: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'dia',
    'mes',
    'anio',
    'Emisor',
    'Destinatario',
    'caratulaAsuntoExtracto',
    'Fojas'
  ],
  Leyes_Decretos: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'dia',
    'mes',
    'anio',
    'Emisor',
    'Destinatario',
    'caratulaAsuntoExtracto',
    'Fojas'
  ],
  Gobierno: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'dia',
    'mes',
    'anio',
    'Iniciador',
    'caratulaAsuntoExtracto',
    'Tema',
    'Folios'
  ],
  Tierras_Fiscales: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'dia',
    'mes',
    'anio',
    'Iniciador',
    'caratulaAsuntoExtracto',
    'Tema',
    'Folios'
  ],
  Tribunales: [
    'legajoNumero',
    'legajoEsBis',
    'expedienteNumero',
    'expedienteEsBis',
    'dia',
    'mes',
    'anio',
    'Iniciador',
    'caratulaAsuntoExtracto',
    'Tema',
    'Folios'
  ]
}

const PERSON_FIELDS = [
  'Iniciador',
  'Titular',
  'Escribano',
  'Emisor',
  'Destinatario'
]

const createFormSchema = (fileType) => {
  const fieldList = FORM_FIELDS[fileType]
  const schemaFields = {}

  fieldList.forEach((field) => {
    if (PERSON_FIELDS.includes(field)) {
      schemaFields[`${field}Nombre`] = z
        .string()
        .min(1, `El nombre de ${field} es requerido`)
      schemaFields[`${field}Tipo`] = z
        .string()
        .min(1, `El tipo de ${field} es requerido`)
    } else if (field === 'legajoEsBis' || field === 'expedienteEsBis') {
      schemaFields[field] = z.number().optional()
    } else if (['dia', 'mes', 'anio', 'Fojas'].includes(field)) {
      schemaFields[field] = z
        .number()
        .int()
        .positive('El valor debe ser positivo')
      if (field === 'mes') schemaFields[field] = schemaFields[field].max(12)
      if (field === 'dia') schemaFields[field] = schemaFields[field].max(31)
      if (field === 'anio')
        schemaFields[field] = schemaFields[field].max(new Date().getFullYear())
    } else {
      schemaFields[field] = z.string().min(1, `El campo ${field} es requerido`)
    }
  })

  return z.object(schemaFields)
}

const initialState = {
  fileType: FILE_TYPES.Mensura,
  formData: {},
  fileUploads: [],
  message: '',
  errors: {},
  isUploading: false
}

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILE_TYPE':
      return { ...state, fileType: action.payload }
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload }
    case 'SET_FILE_UPLOADS':
      return { ...state, fileUploads: action.payload }
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'SET_ERRORS':
      return { ...state, errors: action.payload }
    case 'SET_IS_UPLOADING':
      return { ...state, isUploading: action.payload }
    default:
      return state
  }
}

const FormField = React.memo(({ field, value, onChange, error }) => {
  const isPersonField = PERSON_FIELDS.includes(field)
  const isNumberField = [
    'dia',
    'mes',
    'anio',
    'Fojas',
    'legajoEsBis',
    'expedienteEsBis'
  ].includes(field)

  if (isPersonField) {
    return (
      <div>
        <input
          type="text"
          id={`${field}Nombre`}
          name={`${field}Nombre`}
          value={value[`${field}Nombre`] || ''}
          onChange={(e) => onChange(`${field}Nombre`, e.target.value)}
          placeholder="Nombre"
        />
        {error[`${field}Nombre`] && (
          <p className="error">{error[`${field}Nombre`]}</p>
        )}
        <div className="person-type">
          <label>
            <input
              type="radio"
              name={`${field}Tipo`}
              value="Persona Física"
              checked={value[`${field}Tipo`] === 'Persona Física'}
              onChange={() => onChange(`${field}Tipo`, 'Persona Física')}
            />
            Persona Física
          </label>
          <label>
            <input
              type="radio"
              name={`${field}Tipo`}
              value="Persona Jurídica"
              checked={value[`${field}Tipo`] === 'Persona Jurídica'}
              onChange={() => onChange(`${field}Tipo`, 'Persona Jurídica')}
            />
            Persona Jurídica
          </label>
        </div>
        {error[`${field}Tipo`] && (
          <p className="error">{error[`${field}Tipo`]}</p>
        )}
      </div>
    )
  }

  return (
    <input
      type={isNumberField ? 'number' : 'text'}
      id={field}
      name={field}
      value={value[field] || ''}
      onChange={(e) => onChange(field, e.target.value)}
      {...(field === 'mes' && { min: 1, max: 12 })}
      {...(field === 'dia' && { min: 1, max: 31 })}
      {...(field === 'anio' && { min: 1800, max: new Date().getFullYear() })}
      {...(isNumberField && { min: 0 })}
    />
  )
})

FormField.displayName = 'FormField'

FormField.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
}

export const GestionArchivo = () => {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const { token, user } = useAuth()

  const createFormFields = useCallback(() => {
    const fieldList = FORM_FIELDS[state.fileType]
    const newFormData = {}
    fieldList.forEach((field) => {
      if (PERSON_FIELDS.includes(field)) {
        newFormData[`${field}Nombre`] = ''
        newFormData[`${field}Tipo`] = ''
      } else {
        newFormData[field] = ''
      }
    })
    dispatch({ type: 'SET_FORM_DATA', payload: newFormData })
    dispatch({ type: 'SET_ERRORS', payload: {} })
  }, [state.fileType])

  useEffect(() => {
    createFormFields()
  }, [createFormFields])

  const validateForm = () => {
    try {
      const schema = createFormSchema(state.fileType)
      schema.parse(state.formData)
      dispatch({ type: 'SET_ERRORS', payload: {} })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        dispatch({ type: 'SET_ERRORS', payload: newErrors })
        console.log('Errores detectados:', newErrors)
      }
      return false
    }
  }

  const handleFormFieldChange = (field, value) => {
    const numberFields = [
      'dia',
      'mes',
      'anio',
      'Fojas',
      'legajoEsBis',
      'expedienteEsBis'
    ]
    const processedValue = numberFields.includes(field)
      ? value === ''
        ? ''
        : Number(value)
      : value

    dispatch({
      type: 'SET_FORM_DATA',
      payload: { ...state.formData, [field]: processedValue }
    })

    dispatch({
      type: 'SET_ERRORS',
      payload: { ...state.errors, [field]: '' }
    })

    console.log('formData actual:', state.formData)
  }

  const handleFileTypeChange = (fileType) => {
    dispatch({ type: 'SET_FILE_TYPE', payload: fileType })
    const formDataToSend = new FormData()
    formDataToSend.append('tipoDocumento', fileType)
  }

  const handleFileUpload = (e) => {
    const maxFileSize = 20 * 1024 * 1024
    const validFileTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ]

    const files = Array.from(e.target.files)
    const validFiles = files.filter(
      (file) => validFileTypes.includes(file.type) && file.size <= maxFileSize
    )

    if (validFiles.length !== files.length) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Algunos archivos fueron rechazados por tipo o tamaño.'
      })
    }

    dispatch({
      type: 'SET_FILE_UPLOADS',
      payload: [...state.fileUploads, ...validFiles]
    })
  }

  const handleFileRemove = (index) => {
    dispatch({
      type: 'SET_FILE_UPLOADS',
      payload: state.fileUploads.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Por favor, corrija los errores en el formulario.'
      })
      return
    }

    dispatch({ type: 'SET_IS_UPLOADING', payload: true })

    const formDataToSend = new FormData()

    Object.keys(state.formData).forEach((key) => {
      formDataToSend.append(key, state.formData[key])
    })

    state.fileUploads.forEach((file) => {
      formDataToSend.append('archivo', file)
    })

    // Asegúrate de que 'tipoDocumento' se esté enviando correctamente
    formDataToSend.append('tipoDocumento', FILE_TYPES[state.fileType])
    formDataToSend.append('creadorId', user.id || 0)

    console.log('formDataToSend:', formDataToSend) // Add this line for debugging

    try {
      const response = await axiosInstance.post(
        `api/documents/upload/${state.fileType.toLowerCase()}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: 'Archivo subido correctamente'
        })
        createFormFields()
        dispatch({ type: 'SET_FILE_UPLOADS', payload: [] })
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: `Error al subir el archivo: ${response.status}`
        })
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error)
      if (error.response && error.response.data) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: `Error: ${error.response.data.message || 'Error desconocido'}`
        })
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: 'Error al procesar la solicitud'
        })
      }
    } finally {
      dispatch({ type: 'SET_IS_UPLOADING', payload: false })
    }
  }

  return (
    <div className="main-content">
      <form id="fileForm" onSubmit={handleSubmit}>
        <div className="file-type-select">
          <label htmlFor="fileTypeSelect">Seleccionar Tipo de Archivo:</label>
          <select
            id="fileTypeSelect"
            value={state.fileType}
            onChange={(e) => handleFileTypeChange(e.target.value)}
          >
            {Object.entries(FILE_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div id="formFields">
          {FORM_FIELDS[state.fileType].map((field) => (
            <div key={field}>
              <label htmlFor={field}>{field}:</label>
              <FormField
                field={field}
                value={state.formData}
                onChange={handleFormFieldChange}
                error={state.errors}
              />
              {state.errors[field] && (
                <p className="error">{state.errors[field]}</p>
              )}
            </div>
          ))}
          <input
            type="hidden"
            name="TitularNombre"
            value={state.formData.TitularNombre}
          />
          <input
            type="hidden"
            name="TitularTipo"
            value={state.formData.TitularTipo}
          />
        </div>

        <div id="fileUploads">
          <label htmlFor="fileUpload">Subir Archivos:</label>
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            multiple
            accept=".pdf, .jpeg, .jpg, .png, .tiff"
            onChange={handleFileUpload}
          />
          {state.fileUploads.length > 0 && (
            <ul>
              {state.fileUploads.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button type="button" onClick={() => handleFileRemove(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={state.isUploading}>
          {state.isUploading ? 'Subiendo...' : 'Guardar'}
        </button>
        {state.message && <p>{state.message}</p>}
      </form>
    </div>
  )
}

export default GestionArchivo
