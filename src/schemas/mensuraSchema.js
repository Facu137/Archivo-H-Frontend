// src/schemas/mensuraSchema.js
import { z } from 'zod'
import { fileSchema } from './fileSchema.js' // Importa fileSchema

const baseSchema = z.object({
  // Datos del legajo
  legajoNumero: z.string().min(1, 'El número de legajo es requerido'),
  legajoEsBis: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),

  // Datos del expediente
  expedienteNumero: z.string().min(1, 'El número de expediente es requerido'),
  expedienteEsBis: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),

  // Datos del documento
  tipoDocumento: z.literal('Mensura'),
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

  // Campos específicos de Mensura
  lugar: z.string().min(1, 'El lugar es requerido'),
  propiedad: z.string().min(1, 'La propiedad es requerida')
})

// El fileSchema no necesita cambios

export const mensuraSchema = baseSchema.extend({
  file: fileSchema
})

export const validateMensuraUpload = (data) => {
  return mensuraSchema.parse(data)
}
