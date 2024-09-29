// src/schemas/notarialSchema.js
import { z } from 'zod'
import { fileSchema } from './fileSchema.js' // Importa fileSchema

const baseSchema = z.object({
  // Campos comunes a todos los documentos
  legajoNumero: z.coerce
    .number()
    .int()
    .min(1, 'El número de legajo es requerido'),
  legajoEsBis: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),
  expedienteNumero: z.coerce
    .number()
    .int()
    .min(1, 'El número de expediente es requerido'),
  expedienteEsBis: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),
  tipoDocumento: z.literal('Notarial'),
  anio: z.coerce.number().int().min(1800).max(new Date().getFullYear()),
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
  personaNombre: z.string().min(1, 'El nombre de la persona es requerido'),
  personaTipo: z.enum(
    ['Persona Física', 'Persona Jurídica'],
    'Tipo de persona no válido'
  ),
  personaRol: z.enum(
    ['Iniciador', 'Titular', 'Escribano', 'Emisor', 'Destinatario'],
    'Rol de persona no válido'
  ),

  // Campos específicos de documentos notariales
  registro: z.string().min(1, 'El registro es requerido'),
  protocolo: z.string().min(1, 'El protocolo es requerido'),
  mesInicio: z.coerce.number().int().min(1).max(12),
  mesFin: z.coerce.number().int().min(1).max(12),
  escrituraNro: z.string().min(1, 'El número de escritura es requerido'),
  negocioJuridico: z.string().min(1, 'El negocio jurídico es requerido')
})

// El fileSchema no necesita cambios

export const notarialSchema = baseSchema.extend({
  file: fileSchema
})

export const validateNotarialUpload = (data) => {
  return notarialSchema.parse(data)
}
