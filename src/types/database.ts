
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
  remitente_cliente_id?: number
  nombre_destinatario?: string
  telefono_destinatario?: string
  cliente_temporal_nombre?: string
  cliente_temporal_telefono?: string
  direccion_origen: string
  latitud_origen?: number
  longitud_origen?: number
  empresa_origen_id?: number
  notas_origen?: string
  direccion_destino: string
  latitud_destino?: number
  longitud_destino?: number
  empresa_destino_id?: number
  notas_destino?: string
  tipo_paquete_id?: number
  peso_kg?: number
  tipo_servicio_id?: number
  precio: number
  estado: 'pendiente_asignacion' | 'asignado' | 'en_progreso' | 'completada' | 'cancelada'
  fecha_estimada_entrega?: string
  horario_retiro_desde?: string
  horario_entrega_hasta?: string
  repartidor_asignado_id?: number
  notas_conductor?: string
  detalles_adicionales?: string
  created_at?: string
  updated_at?: string
  user_id?: string
  cliente?: Cliente
}

export interface Repartidor {
  id: number
  user_auth_id?: string
  nombre: string
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
  user_id?: string
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
