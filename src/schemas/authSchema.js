// src/schemas/authSchema.js
import { z } from 'zod'

const baseSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email({ message: 'Correo electrónico no válido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .optional()
    .transform((value) => (value === '' ? undefined : value)), // Transforma '' a undefined
  confirmPassword: z
    .string()
    .min(6, {
      message: 'La confirmación de contraseña debe tener al menos 6 caracteres'
    })
    .optional()
    .transform((value) => (value === '' ? undefined : value)) // Transforma '' a undefined
})

const updateUserSchema = baseSchema
  .extend({
    nombre: z
      .string({ required_error: 'El nombre es requerido' })
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    apellido: z
      .string({ required_error: 'El apellido es requerido' })
      .min(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'] // Indica que el error es en la confirmación de contraseña
    }
  )

export { updateUserSchema }
