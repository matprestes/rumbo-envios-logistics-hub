
export interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion: string
  latitud?: number
  longitud?: number
  telefono?: string
  email?: string
  empresa_id?: number
  notas?: string
  estado?: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface Entrega {
  id: number
  cliente_id: number
  direccion_destino: string
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada'
  fecha_entrega: string
  repartidor_id?: number
  notas?: string
  foto_comprobante?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  cliente?: Cliente
}

export interface Repartidor {
  id: number
  nombre: string
  user_auth_id: string
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    nombre?: string
    apellido?: string
  }
}
