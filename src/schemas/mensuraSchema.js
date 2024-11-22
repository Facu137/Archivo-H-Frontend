// src/schemas/mensuraSchema.js
import { z } from 'zod'

export const mensuraSchema = z.object({
  // Datos del documento (NO dentro de "files")
  legajoNumero: z.string().min(1).optional(),
  legajoEsBis: z.number().int().min(0).max(100).optional(),
  expedienteNumero: z.string().min(1).optional(),
  expedienteEsBis: z.number().int().min(0).max(100).optional(),
  tipoDocumento: z.literal('Mensura'),
  anio: z.coerce.number().int().max(new Date().getFullYear()),
  // ... otros campos del documento
  personaNombre: z.string().min(1),
  personaTipo: z.enum(['Persona Física', 'Persona Jurídica']),
  personaRol: z.enum([
    'Iniciador',
    'Titular',
    'Escribano',
    'Emisor',
    'Destinatario'
  ]),
  lugar: z.string().optional(),
  propiedad: z.string().optional(),
  departamentoNombre: z.string().optional(),
  departamentoEsActual: z.preprocess(
    (val) => val === 'true' || val === true || val === 1,
    z.boolean()
  ),
  // Array de archivos (opcional, para las imágenes)
  files: z.array(z.any()).optional() // O usa fileSchema si necesitas validarlos individualmente
})

export const validateMensuraUpload = (data) => {
  console.log('Datos recibidos por validateMensuraUpload:', data) // Mantén esta línea para debugging
  return mensuraSchema.parse(data)
}
