// src/pages/ModificacionArchivo/modificarArchivo.jsx
import React, { useState, useEffect } from 'react'
import './GestionArchivo.css'
import * as zod from 'zod'
import { fileSchema } from '../../schemas/fileSchema'
import { mensuraSchema } from '../../schemas/mensuraSchema'
import { notarialSchema } from '../../schemas/notarialSchema'
import 'bootstrap/dist/css/bootstrap.min.css'
import api from '../../api' // Import the api instance

export const GestionArchivo = () => {
  const [fileType, setFileType] = useState('Mensura')
  const [formFields, setFormFields] = useState([])
  const [fileUploads, setFileUploads] = useState([])
  const [errors, setErrors] = useState({})
  const [documentId, setDocumentId] = useState(null)
  const [selectedTable, setSelectedTable] = useState('documentos')

  useEffect(() => {
    const createFormFields = () => {
      const fields = {
        Mensura: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'DepartamentoAntiguo',
          'DepartamentoActual',
          'Lugar',
          'dia',
          'mes',
          'año',
          'Titular',
          'Carátula',
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
          'año',
          'EscrituraNº',
          'Iniciador',
          'Extracto',
          'NegocioJuridico',
          'Folio'
        ],
        Correspondencia: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'dia',
          'mes',
          'año',
          'Emisor',
          'Destinatario',
          'Asunto',
          'Fojas'
        ],
        Leyes_Decretos: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'dia',
          'mes',
          'año',
          'Emisor',
          'Destinatario',
          'Asunto',
          'Fojas'
        ],
        Gobierno: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'dia',
          'mes',
          'año',
          'Iniciador',
          'Carátula',
          'Tema',
          'Folios'
        ],
        Tierras_Fiscales: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'dia',
          'mes',
          'año',
          'Iniciador',
          'Carátula',
          'Tema',
          'Folios'
        ],
        Tribunales: [
          'numeroLegajo',
          'legajoBis',
          'numeroExpediente',
          'expedienteBis',
          'dia',
          'mes',
          'año',
          'Iniciador',
          'Carátula',
          'Tema',
          'Folios'
        ]
      }

      const fieldList = fields[fileType]
      const newFormFields = fieldList.map((field) => ({
        id: field,
        value: '',
        isPersonField: [
          'Iniciador',
          'Titular',
          'Escribano',
          'Emisor',
          'Destinatario'
        ].includes(field)
      }))
      setFormFields(newFormFields)
      setErrors({})
    }

    createFormFields()
  }, [fileType])

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value)
  }

  const handleFormFieldChange = (id, value) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, value } : field
    )
    setFormFields(updatedFields)

    validateField(id, value)
  }

  const handleFileUpload = (e) => {
    setFileUploads([...fileUploads, ...e.target.files])
  }

  const handleFileRemove = (index) => {
    const updatedFileUploads = [...fileUploads]
    updatedFileUploads.splice(index, 1)
    setFileUploads(updatedFileUploads)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    let validationSchema

    switch (fileType) {
      case 'Mensura':
        validationSchema = mensuraSchema
        break
      case 'Notarial':
        validationSchema = notarialSchema
        break
      default:
        validationSchema = fileSchema
        break
    }

    try {
      validationSchema.parse({
        ...Object.fromEntries(formData),
        files: fileUploads
      })

      const camposAModificar = {}
      formFields.forEach((field) => {
        camposAModificar[field.id] = field.value
      })

      const requestBody = {
        tabla: selectedTable,
        campos: camposAModificar,
        tipoDocumento: fileType
      }

      const response = await api.put(`/${documentId}`, requestBody) // Use the api instance

      if (response.ok) {
        console.log('Documento modificado correctamente')
      } else {
        console.error('Error al modificar el documento:', response.status)
      }
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const validationErrors = {}
        error.issues.forEach((issue) => {
          validationErrors[issue.path[0]] = issue.message
        })
        setErrors(validationErrors)
      } else {
        console.error('Error al enviar el formulario:', error)
      }
    }
  }

  const validateField = (fieldId, value) => {
    try {
      let validationSchema
      switch (fileType) {
        case 'Mensura':
          validationSchema = mensuraSchema
          break
        case 'Notarial':
          validationSchema = notarialSchema
          break
        default:
          validationSchema = fileSchema
          break
      }

      validationSchema.shape[fieldId].parse(value)

      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors }
        delete updatedErrors[fieldId]
        return updatedErrors
      })
    } catch (error) {
      if (error instanceof zod.ZodError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldId]: error.issues[0].message
        }))
      } else {
        console.error('Error al validar el campo:', error)
      }
    }
  }

  return (
    <div className="main-content">
      <div className="mb-3">
        <label htmlFor="documentId" className="form-label">
          ID del documento:
        </label>
        <input
          type="number"
          id="documentId"
          className="form-control"
          value={documentId}
          onChange={(e) => setDocumentId(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tableSelect" className="form-label">
          Tabla a modificar:
        </label>
        <select
          id="tableSelect"
          className="form-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="documentos">Documentos</option>
          <option value="mensura">Mensura</option>
          <option value="notarial">Notarial</option>
        </select>
      </div>

      <form
        id="fileForm"
        onSubmit={handleSubmit}
        className="needs-validation"
        noValidate
      >
        <label htmlFor="fileType">Seleccionar Tipo de Archivo:</label>
        <select
          id="fileType"
          name="fileType"
          value={fileType}
          onChange={handleFileTypeChange}
          className="form-select"
          required
        >
          <option value="Mensura">Mensura</option>
          <option value="Notarial">Notarial</option>
          <option value="Correspondencia">Correspondencia</option>
          <option value="Leyes_Decretos">Leyes y Decretos</option>
          <option value="Gobierno">Gobierno</option>
          <option value="Tierras_Fiscales">Tierras Fiscales</option>
          <option value="Tribunales">Tribunales</option>
        </select>

        <div id="formFields" className="row g-3">
          {formFields.map((field) => (
            <div key={field.id} className="col-md-4">
              <label htmlFor={field.id} className="form-label">
                {field.id}:
              </label>
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={field.value}
                onChange={(e) =>
                  handleFormFieldChange(field.id, e.target.value)
                }
                className={`form-control ${errors[field.id] ? 'is-invalid' : ''}`}
                required
              />
              {errors[field.id] && (
                <div className="invalid-feedback">{errors[field.id]}</div>
              )}

              {field.isPersonField && (
                <div className="person-type">
                  <label>Física</label>
                  <input type="radio" name={`${field.id}Type`} value="Física" />
                  <label>Jurídica</label>
                  <input
                    type="radio"
                    name={`${field.id}Type`}
                    value="Jurídica"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div id="fileUploads" className="mb-3">
          <label htmlFor="files" className="form-label">
            Archivos (imágenes o PDFs):
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileUpload}
            className="form-control"
            required
          />
          {fileUploads.map((file, index) => (
            <div key={index}>
              {file.name}
              <button type="button" onClick={() => handleFileRemove(index)}>
                Eliminar
              </button>
            </div>
          ))}
          {errors.file && <div className="invalid-feedback">{errors.file}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  )
}
