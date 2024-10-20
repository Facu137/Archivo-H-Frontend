// src/schemas/fileSchema.js
import { z } from 'zod'

export const fileSchema = z.object({
  // Datos del legajo
  legajoNumero: z.string().min(1, 'El número de legajo es requerido'),
  legajoEsBis: z.coerce.number().int().min(0).max(100),

  // Datos del expediente
  expedienteNumero: z.string().min(1, 'El número de expediente es requerido'),
  expedienteEsBis: z.coerce.number().int().min(0).max(100),

  // Datos del documento
  tipoDocumento: z.enum(
    [
      'Gobierno',
      'Mensura',
      'Notarial',
      'Correspondencia',
      'Tierras_Fiscales',
      'Tribunales',
      'Leyes_Decretos'
    ],
    'Tipo de documento no válido'
  ),
  anio: z.coerce.number().int().max(new Date().getFullYear()),
  mes: z.coerce.number().int().min(1).max(12).optional(),
  dia: z.coerce.number().int().min(1).max(31).optional(),
  caratulaAsuntoExtracto: z
    .string()
    .min(1, 'La carátula/asunto/extracto es requerido'),
  tema: z.string().min(1, 'El tema es requerido'),
  folios: z.coerce
    .number()
    .int()
    .positive('El número de folios debe ser positivo'),
  esPublico: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),
  creadorId: z.coerce
    .number()
    .int()
    .positive('El ID del creador debe ser un número positivo'),

  // Datos de la persona
  personaNombre: z.string().min(1, 'El nombre de la persona es requerido'),
  personaTipo: z.enum(
    ['Persona Física', 'Persona Jurídica'],
    'Tipo de persona no válido'
  ),
  personaRol: z.enum(
    ['Iniciador', 'Titular', 'Escribano', 'Emisor', 'Destinatario'],
    'Rol de persona no válido'
  ),

  // Validación para el archivo
  file: z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z
        .string()
        .refine(
          (mime) =>
            [
              'image/tiff',
              'image/jpg',
              'image/jpeg',
              'application/pdf'
            ].includes(mime),
          {
            message: 'Tipo de archivo no soportado. Use TIFF, JPG, JPEG o PDF.'
          }
        ),
      destination: z.string(),
      filename: z.string(),
      path: z.string(),
      size: z.number().max(20000000, 'El archivo no debe superar los 20MB')
    })
    .optional()
})

export const validateFileUpload = (data) => {
  return fileSchema.parse(data)
}
