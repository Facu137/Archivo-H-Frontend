import React, { useState, useEffect, useCallback } from 'react'
import './GestionArchivo.css'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig'
import { z } from 'zod'

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
      // Schema específico para campos de persona
      schemaFields[`${field}Nombre`] = z
        .string()
        .min(1, `El nombre de ${field} es requerido`)
      schemaFields[`${field}Tipo`] = z
        .string()
        .min(1, `El tipo de ${field} es requerido`)
    } else if (field === 'legajoEsBis' || field === 'expedienteEsBis') {
      // Campos booleanos
      schemaFields[field] = z.boolean()
    } else if (['dia', 'mes', 'anio', 'Fojas'].includes(field)) {
      // Campos numéricos
      schemaFields[field] = z
        .number()
        .int()
        .positive('El valor debe ser positivo')
      if (field === 'mes') schemaFields[field] = schemaFields[field].max(12)
      if (field === 'dia') schemaFields[field] = schemaFields[field].max(31)
      if (field === 'anio')
        schemaFields[field] = schemaFields[field].max(new Date().getFullYear())
    } else {
      // Campos de texto regulares
      schemaFields[field] = z.string().min(1, `El campo ${field} es requerido`)
    }
  })

  return z.object(schemaFields)
}

export const GestionArchivo = () => {
  const [fileType, setFileType] = useState(FILE_TYPES.Mensura)
  const [formData, setFormData] = useState({})
  const [fileUploads, setFileUploads] = useState([])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const { token, user } = useAuth()

  const createFormFields = useCallback(() => {
    const fieldList = FORM_FIELDS[fileType]
    const newFormData = {}
    fieldList.forEach((field) => {
      if (PERSON_FIELDS.includes(field)) {
        newFormData[`${field}Nombre`] = ''
        newFormData[`${field}Tipo`] = ''
      } else {
        newFormData[field] = field.includes('EsBis') ? false : ''
      }
    })
    setFormData(newFormData)
    setErrors({})
  }, [fileType])

  useEffect(() => {
    createFormFields()
  }, [createFormFields])

  const validateForm = () => {
    try {
      const schema = createFormSchema(fileType)
      schema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleFormFieldChange = (field, value) => {
    const numberFields = ['dia', 'mes', 'anio', 'Fojas']
    const processedValue = numberFields.includes(field)
      ? value === ''
        ? ''
        : Number(value)
      : value

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue
    }))

    // Limpiar el error específico cuando se modifica el campo
    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }))
  }

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value)
  }

  const handleFileUpload = (e) => {
    const maxFileSize = 20 * 1024 * 1024 // 20 MB limit
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
      setMessage('Algunos archivos fueron rechazados por tipo o tamaño.')
    }

    setFileUploads((prevUploads) => [...prevUploads, ...validFiles])
  }

  const handleFileRemove = (index) => {
    setFileUploads((prevUploads) => prevUploads.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage('Por favor, corrija los errores en el formulario.')
      return
    }

    const formDataToSend = new FormData()

    // Añadir todos los campos del formulario
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    // Añadir archivos
    fileUploads.forEach((file) => {
      formDataToSend.append('archivo', file)
    })

    // Añadir campos adicionales
    formDataToSend.append('tipoDocumento', fileType)
    formDataToSend.append('creadorId', user.id || 0)

    try {
      const response = await axiosInstance.post(
        `api/documents/upload/${fileType.toLowerCase()}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        setMessage('Archivo subido correctamente')
        createFormFields() // Reset form
        setFileUploads([])
      } else {
        setMessage(`Error al subir el archivo: ${response.status}`)
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error)
      if (error.response && error.response.data) {
        setMessage(
          `Error: ${error.response.data.message || 'Error desconocido'}`
        )
      } else {
        setMessage('Error al procesar la solicitud')
      }
    }
  }

  const renderFormField = (field) => {
    if (PERSON_FIELDS.includes(field)) {
      return (
        <div>
          <input
            type="text"
            id={`${field}Nombre`}
            name={`${field}Nombre`}
            value={formData[`${field}Nombre`] || ''}
            onChange={(e) =>
              handleFormFieldChange(`${field}Nombre`, e.target.value)
            }
            placeholder="Nombre"
          />
          {errors[`${field}Nombre`] && (
            <p className="error">{errors[`${field}Nombre`]}</p>
          )}
          <div className="person-type">
            <label>
              <input
                type="radio"
                name={`${field}Tipo`}
                value="Persona Física"
                checked={formData[`${field}Tipo`] === 'Persona Física'}
                onChange={() =>
                  handleFormFieldChange(`${field}Tipo`, 'Persona Física')
                }
              />
              Persona Física
            </label>
            <label>
              <input
                type="radio"
                name={`${field}Tipo`}
                value="Persona Jurídica"
                checked={formData[`${field}Tipo`] === 'Persona Jurídica'}
                onChange={() =>
                  handleFormFieldChange(`${field}Tipo`, 'Persona Jurídica')
                }
              />
              Persona Jurídica
            </label>
          </div>
          {errors[`${field}Tipo`] && (
            <p className="error">{errors[`${field}Tipo`]}</p>
          )}
        </div>
      )
    }

    const isNumberField = ['dia', 'mes', 'anio', 'Fojas'].includes(field)
    const isBooleanField = ['legajoEsBis', 'expedienteEsBis'].includes(field)

    if (isBooleanField) {
      return (
        <input
          type="checkbox"
          id={field}
          name={field}
          checked={formData[field] || false}
          onChange={(e) => handleFormFieldChange(field, e.target.checked)}
        />
      )
    }

    return (
      <input
        type={isNumberField ? 'number' : 'text'}
        id={field}
        name={field}
        value={formData[field] || ''}
        onChange={(e) => handleFormFieldChange(field, e.target.value)}
        {...(field === 'mes' && { min: 1, max: 12 })}
        {...(field === 'dia' && { min: 1, max: 31 })}
        {...(field === 'anio' && { min: 1800, max: new Date().getFullYear() })}
        {...(isNumberField && { min: 1 })}
      />
    )
  }

  return (
    <div className="main-content">
      <form id="fileForm" onSubmit={handleSubmit}>
        <label htmlFor="fileType">Seleccionar Tipo de Archivo:</label>
        <select
          id="fileType"
          name="fileType"
          value={fileType}
          onChange={handleFileTypeChange}
        >
          {Object.entries(FILE_TYPES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <div id="formFields">
          {FORM_FIELDS[fileType].map((field) => (
            <div key={field}>
              <label htmlFor={field}>{field}:</label>
              {renderFormField(field)}
              {errors[field] && <p className="error">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div id="fileUploads">
          <label htmlFor="fileUpload">Subir Archivos:</label>
          <input
            type="file"
            id="fileUpload"
            name="archivo"
            multiple
            onChange={handleFileUpload}
          />
          <div className="file-list">
            {fileUploads.map((file, index) => (
              <div key={index}>
                {file.name}{' '}
                <button type="button" onClick={() => handleFileRemove(index)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Enviar</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}
