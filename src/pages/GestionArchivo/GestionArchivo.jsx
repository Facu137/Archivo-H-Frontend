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

const formSchema = z.object({
  legajoNumero: z.string().min(1, 'El número de legajo es requerido'),
  legajoEsBis: z.boolean(),
  expedienteNumero: z.string().min(1, 'El número de expediente es requerido'),
  expedienteEsBis: z.boolean(),
  tipoDocumento: z.enum(Object.keys(FILE_TYPES)),
  anio: z.number().int().min(1800).max(new Date().getFullYear()),
  mes: z.number().int().min(1).max(12).optional(),
  dia: z.number().int().min(1).max(31).optional(),
  caratulaAsuntoExtracto: z
    .string()
    .min(1, 'La carátula/asunto/extracto es requerido'),
  tema: z.string().min(1, 'El tema es requerido'),
  folios: z.number().int().positive('El número de folios debe ser positivo'),
  esPublico: z.boolean(),
  personaNombre: z.string().min(1, 'El nombre de la persona es requerido'),
  personaTipo: z.enum(['Persona Física', 'Persona Jurídica']),
  personaRol: z.enum(PERSON_FIELDS)
})

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
      newFormData[field] = ''
    })
    setFormData(newFormData)
  }, [fileType])

  useEffect(() => {
    createFormFields()
  }, [createFormFields])

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value)
  }

  const handleFormFieldChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }))
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

  const validateForm = () => {
    try {
      formSchema.parse(formData)
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
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label htmlFor={field}>{field}:</label>
              {PERSON_FIELDS.includes(field) ? (
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
                  <div className="person-type">
                    <label>
                      <input
                        type="radio"
                        name={`${field}Tipo`}
                        value="Persona Física"
                        checked={formData[`${field}Tipo`] === 'Persona Física'}
                        onChange={() =>
                          handleFormFieldChange(
                            `${field}Tipo`,
                            'Persona Física'
                          )
                        }
                      />
                      Persona Física
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`${field}Tipo`}
                        value="Persona Jurídica"
                        checked={
                          formData[`${field}Tipo`] === 'Persona Jurídica'
                        }
                        onChange={() =>
                          handleFormFieldChange(
                            `${field}Tipo`,
                            'Persona Jurídica'
                          )
                        }
                      />
                      Persona Jurídica
                    </label>
                  </div>
                  <input
                    type="text"
                    id={`${field}Rol`}
                    name={`${field}Rol`}
                    value={formData[`${field}Rol`] || ''}
                    onChange={(e) =>
                      handleFormFieldChange(`${field}Rol`, e.target.value)
                    }
                    placeholder="Rol"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field] || ''}
                  onChange={(e) => handleFormFieldChange(field, e.target.value)}
                />
              )}
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
