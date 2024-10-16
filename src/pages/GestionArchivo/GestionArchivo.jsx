import React, { useState, useEffect, useCallback } from 'react'
import './GestionArchivo.css'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosConfig' // Asegúrate de que la ruta sea correcta

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
  const [message, setMessage] = useState('')
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

    let endpoint

    switch (fileType) {
      case FILE_TYPES.Mensura:
        endpoint = 'api/documents/upload/mensura'
        break
      case FILE_TYPES.Notarial:
        endpoint = 'api/documents/upload/notarial'
        break
      default:
        endpoint = 'api/documents/upload/general'
        break
    }

    try {
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 || response.status === 201) {
        setMessage('Archivo subido correctamente')
        console.log('Archivo subido correctamente')
        // Handle successful upload (e.g., show success message, reset form)
      } else {
        setMessage(`Error al subir el archivo: ${response.status}`)
        console.error('Error al subir el archivo:', response.status)
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      setMessage('Error al procesar la solicitud')
      console.error('Error:', error)
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
      {message && (
        <div
          className={
            message.includes('Error') ? 'error-message' : 'success-message'
          }
        >
          {message}
        </div>
      )}
    </div>
  )
}
