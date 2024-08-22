import React, { useState, useEffect } from 'react';
import './styles.css';
import * as zod from 'zod';

export const GestionArchivo = () => {
  const [fileType, setFileType] = useState('Mensura');
  const [formFields, setFormFields] = useState([]);
  const [fileUploads, setFileUploads] = useState([]);

  useEffect(() => {
    const createFormFields = () => {
      const fields = {
        Mensura: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'DepartamentoAntiguo', 'DepartamentoActual', 'Lugar', 'dia', 'mes', 'año', 'Titular', 'Carátula', 'Propiedad', 'Fojas'],
        Notarial: ['Escribano', 'Registro', 'Protocolo', 'MesInicio', 'MesFin', 'dia', 'mes', 'año', 'EscrituraNº', 'Iniciador', 'Extracto', 'NegocioJuridico', 'Folio'],
        Correspondencia: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Emisor', 'Destinatario', 'Asunto', 'Fojas'],
        Leyes_Decretos: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Emisor', 'Destinatario', 'Asunto', 'Fojas'],
        Gobierno: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios'],
        Tierras_Fiscales: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios'],
        Tribunales: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios']
      };

      const fieldList = fields[fileType];
      const newFormFields = fieldList.map((field) => ({
        id: field,
        value: '',
        isPersonField: ['Iniciador', 'Titular', 'Escribano', 'Emisor', 'Destinatario'].includes(field),
      }));
      setFormFields(newFormFields);
    };

    createFormFields();
  }, [fileType]);

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleFormFieldChange = (id, value) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setFormFields(updatedFields);
  };

  const handleFileUpload = (e) => {
    setFileUploads([...fileUploads, e.target.files[0]]);
  };

  const handleFileRemove = (index) => {
    const updatedFileUploads = [...fileUploads];
    updatedFileUploads.splice(index, 1);
    setFileUploads(updatedFileUploads);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const schema = zod.object({
      numeroLegajo: zod.string().nonempty(),
      legajoBis: zod.string().optional(),
      numeroExpediente: zod.string().nonempty(),
      expedienteBis: zod.string().optional(),
      DepartamentoAntiguo: zod.string().optional(),
      DepartamentoActual: zod.string().optional(),
      Lugar: zod.string().optional(),
      dia: zod.number().int().positive(),
      mes: zod.number().int().positive().max(12),
      año: zod.number().int().positive().min(1900).max(new Date().getFullYear()),
      Titular: zod.string().nonempty(),
      Carátula: zod.string().optional(),
      Propiedad: zod.string().optional(),
      Fojas: zod.number().int().positive().optional(),
      Escribano: zod.string().optional(),
      Registro: zod.string().optional(),
      Protocolo: zod.string().optional(),
      MesInicio: zod.string().optional(),
      MesFin: zod.string().optional(),
      EscrituraNº: zod.string().optional(),
      Iniciador: zod.string().nonempty(),
      Extracto: zod.string().optional(),
      NegocioJuridico: zod.string().optional(),
      Folio: zod.string().optional(),
      Emisor: zod.string().nonempty(),
      Destinatario: zod.string().nonempty(),
      Asunto: zod.string().optional(),
      Tema: zod.string().optional(),
      Folios: zod.string().optional(),
      files: zod.array(zod.instanceof(File)).nonempty()
    });

    try {
      const validatedData = schema.parse(Object.fromEntries(formData));
      // Aquí puedes enviar formData al servidor usando fetch o XMLHttpRequest
      console.log(validatedData);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <div className="main-content">
      <form id="fileForm" onSubmit={handleSubmit}>
        <label htmlFor="fileType">Seleccionar Tipo de Archivo:</label>
        <select id="fileType" name="fileType" value={fileType} onChange={handleFileTypeChange}>
          <option value="Mensura">Mensura</option>
          <option value="Notarial">Notarial</option>
          <option value="Correspondencia">Correspondencia</option>
          <option value="Leyes_Decretos">Leyes y Decretos</option>
          <option value="Gobierno">Gobierno</option>
          <option value="Tierras_Fiscales">Tierras Fiscales</option>
          <option value="Tribunales">Tribunales</option>
        </select>

        <div id="formFields">
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.id}:</label>
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={field.value}
                onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
              />
              {field.isPersonField && (
                <div className="person-type">
                  <label>Física</label>
                  <input type="radio" name={`${field.id}Type`} value="Física" />
                  <label>Jurídica</label>
                  <input type="radio" name={`${field.id}Type`} value="Jurídica" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div id="fileUploads">
          <label htmlFor="files">Archivos (imágenes o PDFs):</label>
          <input type="file" id="files" name="files"  multiple onChange={handleFileUpload} />
          {fileUploads.map((file, index) => (
            <div key={index}>
              {file.name}
              <button type="button" onClick={() => handleFileRemove(index)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button type="submit" class="submit-button">Guardar</button>
      </form>
    </div>
  );
};