
export interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion: string
  telefono?: string
  email?: string
  empresa_id?: number
  latitud?: number
  longitud?: number
  estado?: string
  notas?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Empresa {
  id: number
  nombre: string
  direccion: string
  telefono?: string
  email?: string
  latitud?: number
  longitud?: number
  estado?: string
  notas?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Repartidor {
  id: number
  nombre: string
  user_auth_id?: string
  estado?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Envio {
  id: number
  direccion_origen: string
  direccion_destino: string
  latitud_origen?: number
  longitud_origen?: number
  latitud_destino?: number
  longitud_destino?: number
  empresa_origen_id?: number
  empresa_destino_id?: number
  remitente_cliente_id?: number
  nombre_destinatario?: string
  telefono_destinatario?: string
  tipo_paquete_id?: number
  peso_kg?: number
  tipo_servicio_id?: number
  precio: number
  estado?: string
  fecha_estimada_entrega?: string
  horario_retiro_desde?: string
  horario_entrega_hasta?: string
  repartidor_asignado_id?: number
  notas_origen?: string
  notas_destino?: string
  notas_conductor?: string
  detalles_adicionales?: string
  cliente_temporal_nombre?: string
  cliente_temporal_telefono?: string
  es_parada_inicio?: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Reparto {
  id: number
  fecha_reparto: string
  repartidor_id: number
  empresa_asociada_id?: number
  estado?: string
  notas?: string
  user_id?: string
  created_at?: string
  updated_at?: string
  paradas?: ParadaReparto[]
}

export interface ParadaReparto {
  id: number
  reparto_id: number
  envio_id?: number
  orden_visita?: number
  descripcion_parada?: string
  hora_estimada_llegada?: string
  hora_real_llegada?: string
  estado_parada?: string
  notas_parada?: string
  user_id?: string
  created_at?: string
  updated_at?: string
  envio?: Envio
}

export interface TipoServicio {
  id: number
  nombre: string
  descripcion?: string
  precio_base?: number
  precio_extra_km_default?: number
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface TipoPaquete {
  id: number
  nombre: string
  descripcion?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface TarifaDistanciaCalculadora {
  id: number
  tipo_servicio_id: number
  distancia_min_km: number
  distancia_max_km: number
  precio_base?: number
  precio_por_km: number
  user_id?: string
  created_at?: string
  updated_at?: string
}

// Para compatibilidad con el código existente
export type Entrega = Envio
