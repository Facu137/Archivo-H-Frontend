import React, { useState, useEffect, useCallback } from 'react'
import './GestionArchivo.css'
import { validateFileUpload } from '../../schemas/fileSchema'
import { validateMensuraUpload } from '../../schemas/mensuraSchema'
import { validateNotarialUpload } from '../../schemas/notarialSchema'
import { useAuth } from '../../context/AuthContext'
import { ZodError } from 'zod'

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

export const GestionArchivo = () => {
  const [fileType, setFileType] = useState(FILE_TYPES.Mensura)
  const [formFields, setFormFields] = useState([])
  const [fileUploads, setFileUploads] = useState([])
  const [errors, setErrors] = useState({})
  const { token } = useAuth()

  const numericFields = [
    'legajoNumero',
    'expedienteNumero',
    'anio',
    'mes',
    'dia',
    'Fojas',
    'Folios',
    'creadorId'
  ]

  const createFormFields = useCallback(() => {
    const fieldList = FORM_FIELDS[fileType]
    const newFormFields = fieldList.map((field) => ({
      id: field,
      value: '',
      isPersonField: PERSON_FIELDS.includes(field)
    }))
    setFormFields(newFormFields)
  }, [fileType])

  useEffect(() => {
    createFormFields()
  }, [createFormFields])

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value)
  }

  const handleFormFieldChange = (id, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field))
    )
  }

  const handleFileUpload = (e) => {
    setFileUploads((prevUploads) => [...prevUploads, ...e.target.files])
  }

  const handleFileRemove = (index) => {
    setFileUploads((prevUploads) => prevUploads.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    // Asegúrate de que los campos booleanos se envíen como booleanos
    formData.set('legajoEsBis', formData.get('legajoEsBis') === 'true')
    formData.set('expedienteEsBis', formData.get('expedienteEsBis') === 'true')
    formData.set('esPublico', formData.get('esPublico') === 'true')

    // Convertir campos numéricos a números
    numericFields.forEach((field) => {
      const value = formData.get(field)
      if (value !== null && value !== undefined) {
        formData.set(field, parseInt(value, 10))
      }
    })

    // Adjunta los archivos al formData
    fileUploads.forEach((file, index) => {
      formData.append('file', file)
    })

    let schema
    let endpoint

    switch (fileType) {
      case FILE_TYPES.Mensura:
        schema = validateMensuraUpload
        endpoint = '/documents/upload/mensura'
        break
      case FILE_TYPES.Notarial:
        schema = validateNotarialUpload
        endpoint = '/documents/upload/notarial'
        break
      default:
        schema = validateFileUpload
        endpoint = '/documents/upload/general'
        break
    }

    try {
      // Imprime los datos antes de la validación
      console.log('Data to validate:', Object.fromEntries(formData))

      // Validación en el frontend
      const dataToValidate = {
        ...Object.fromEntries(formData),
        tipoDocumento: fileType, // Asegúrate de que tipoDocumento sea el valor correcto
        file: {
          ...fileUploads[0],
          size: parseInt(fileUploads[0].size, 10) // Convertir fileSize a número
        }
      }

      const validatedData = schema(dataToValidate) // Descomenta esta línea

      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(validatedData), // Enviar validatedData como JSON
        headers: {
          'Content-Type': 'application/json', // Indicar que el body es JSON
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        console.log('Archivo subido correctamente')
        // Handle successful upload (e.g., show success message, reset form)
      } else {
        console.error('Error al subir el archivo:', response.status)
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation error:', error.issues)
        // Manejar el error de validación, mostrar mensajes al usuario, etc.
        const errorMessages = error.issues.reduce((acc, issue) => {
          acc[issue.path[0]] = issue.message
          return acc
        }, {})
        setErrors(errorMessages)
      } else {
        console.error('Error:', error)
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
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.id}:</label>
              <input
                type={numericFields.includes(field.id) ? 'number' : 'text'}
                id={field.id}
                name={field.id}
                value={field.value}
                onChange={(e) =>
                  handleFormFieldChange(field.id, e.target.value)
                }
              />
              {field.isPersonField && (
                <div className="person-type">
                  <label>
                    <input
                      type="radio"
                      name={`${field.id}Type`}
                      value="Física"
                    />
                    Física
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`${field.id}Type`}
                      value="Jurídica"
                    />
                    Jurídica
                  </label>
                </div>
              )}
              {errors[field.id] && (
                <div className="error-message">{errors[field.id]}</div>
              )}
            </div>
          ))}
        </div>

        <div id="fileUploads">
          <label htmlFor="files">Archivos (imágenes o PDFs):</label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileUpload}
          />
          {fileUploads.map((file, index) => (
            <div key={index}>
              {file.name}
              <button type="button" onClick={() => handleFileRemove(index)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">
          Guardar
        </button>
      </form>
    </div>
  )
}
