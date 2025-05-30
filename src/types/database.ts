
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
  estado: 'pendiente_asignacion' | 'en_progreso' | 'completada' | 'cancelada'
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

export interface Reparto {
  id: number
  fecha_reparto: string
  repartidor_id: number
  empresa_asociada_id?: number
  estado: 'planificado' | 'en_progreso' | 'completado' | 'cancelado'
  notas?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  paradas?: ParadaReparto[]
}

export interface ParadaReparto {
  id: number
  reparto_id: number
  envio_id?: number
  descripcion_parada?: string
  orden_visita?: number
  estado_parada: 'asignado' | 'en_progreso' | 'completado' | 'cancelado'
  hora_estimada_llegada?: string
  hora_real_llegada?: string
  notas_parada?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  envio?: Entrega
}
