
import { z } from 'zod'

// Input sanitization utility
export const sanitizeText = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 1000) // Limit length
}

// Common validation schemas
export const emailSchema = z.string().email('Email inválido').min(1, 'Email requerido')

export const passwordSchema = z.string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(100, 'La contraseña es demasiado larga')

export const nombreSchema = z.string()
  .min(1, 'Nombre requerido')
  .max(100, 'Nombre demasiado largo')
  .transform(sanitizeText)

export const direccionSchema = z.string()
  .min(1, 'Dirección requerida')
  .max(500, 'Dirección demasiado larga')
  .transform(sanitizeText)

export const telefonoSchema = z.string()
  .optional()
  .transform((val) => val ? sanitizeText(val) : undefined)

export const notasSchema = z.string()
  .optional()
  .transform((val) => val ? sanitizeText(val) : undefined)

// Estado validation schemas
export const estadoEntregaSchema = z.enum([
  'pendiente_asignacion',
  'asignado', 
  'en_progreso',
  'completada',
  'cancelada'
])

export const estadoRepartoSchema = z.enum([
  'planificado',
  'en_progreso', 
  'completado',
  'cancelado'
])

export const estadoParadaSchema = z.enum([
  'asignado',
  'en_progreso',
  'completado', 
  'cancelado'
])

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

// Registration form validation
export const registroSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nombre: nombreSchema
})

// Validation helper function
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Datos inválidos' }
    }
    return { success: false, error: 'Error de validación' }
  }
}
