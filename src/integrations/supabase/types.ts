export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          apellido: string
          ciudad: string | null
          codigo_postal: string | null
          created_at: string | null
          direccion: string
          email: string | null
          empresa_id: number | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_registro: string | null
          id: number
          instrucciones_especiales: string | null
          latitud: number | null
          longitud: number | null
          nombre: string
          preferencias_entrega: string | null
          telefono: string | null
          tipo_cliente: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          direccion: string
          email?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_registro?: string | null
          id?: number
          instrucciones_especiales?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre: string
          preferencias_entrega?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          direccion?: string
          email?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_registro?: string | null
          id?: number
          instrucciones_especiales?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          preferencias_entrega?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ciudad: string | null
          codigo_fiscal: string | null
          codigo_postal: string | null
          contacto_principal: string | null
          created_at: string | null
          dias_operacion: string | null
          direccion: string
          email: string | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          horario_atencion: string | null
          id: number
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          sitio_web: string | null
          telefono: string | null
          tipo_empresa: string | null
          updated_at: string | null
        }
        Insert: {
          ciudad?: string | null
          codigo_fiscal?: string | null
          codigo_postal?: string | null
          contacto_principal?: string | null
          created_at?: string | null
          dias_operacion?: string | null
          direccion: string
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          horario_atencion?: string | null
          id?: number
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          sitio_web?: string | null
          telefono?: string | null
          tipo_empresa?: string | null
          updated_at?: string | null
        }
        Update: {
          ciudad?: string | null
          codigo_fiscal?: string | null
          codigo_postal?: string | null
          contacto_principal?: string | null
          created_at?: string | null
          dias_operacion?: string | null
          direccion?: string
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          horario_atencion?: string | null
          id?: number
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          sitio_web?: string | null
          telefono?: string | null
          tipo_empresa?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      envios: {
        Row: {
          calificacion_servicio: number | null
          codigo_seguimiento: string | null
          comentarios_cliente: string | null
          created_at: string | null
          descripcion_contenido: string | null
          dimensiones: string | null
          direccion_destino: string
          direccion_origen: string
          distancia_km: number | null
          email_destinatario: string | null
          empresa_destino_id: number | null
          empresa_origen_id: number | null
          es_fragil: boolean | null
          es_parada_inicio: boolean | null
          es_urgente: boolean | null
          estado: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_creacion: string | null
          fecha_entrega_programada: string | null
          fecha_entrega_real: string | null
          fecha_recoleccion: string | null
          firma_digital: string | null
          foto_comprobante: string | null
          id: number
          instrucciones_entrega: string | null
          latitud_destino: number | null
          latitud_origen: number | null
          longitud_destino: number | null
          longitud_origen: number | null
          nombre_destinatario: string | null
          observaciones: string | null
          peso_kg: number | null
          precio: number
          repartidor_asignado_id: number | null
          requiere_firma: boolean | null
          telefono_destinatario: string | null
          tipo_paquete_id: number | null
          tipo_servicio_id: number | null
          updated_at: string | null
          valor_declarado: number | null
        }
        Insert: {
          calificacion_servicio?: number | null
          codigo_seguimiento?: string | null
          comentarios_cliente?: string | null
          created_at?: string | null
          descripcion_contenido?: string | null
          dimensiones?: string | null
          direccion_destino: string
          direccion_origen: string
          distancia_km?: number | null
          email_destinatario?: string | null
          empresa_destino_id?: number | null
          empresa_origen_id?: number | null
          es_fragil?: boolean | null
          es_parada_inicio?: boolean | null
          es_urgente?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_creacion?: string | null
          fecha_entrega_programada?: string | null
          fecha_entrega_real?: string | null
          fecha_recoleccion?: string | null
          firma_digital?: string | null
          foto_comprobante?: string | null
          id?: number
          instrucciones_entrega?: string | null
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          nombre_destinatario?: string | null
          observaciones?: string | null
          peso_kg?: number | null
          precio?: number
          repartidor_asignado_id?: number | null
          requiere_firma?: boolean | null
          telefono_destinatario?: string | null
          tipo_paquete_id?: number | null
          tipo_servicio_id?: number | null
          updated_at?: string | null
          valor_declarado?: number | null
        }
        Update: {
          calificacion_servicio?: number | null
          codigo_seguimiento?: string | null
          comentarios_cliente?: string | null
          created_at?: string | null
          descripcion_contenido?: string | null
          dimensiones?: string | null
          direccion_destino?: string
          direccion_origen?: string
          distancia_km?: number | null
          email_destinatario?: string | null
          empresa_destino_id?: number | null
          empresa_origen_id?: number | null
          es_fragil?: boolean | null
          es_parada_inicio?: boolean | null
          es_urgente?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_creacion?: string | null
          fecha_entrega_programada?: string | null
          fecha_entrega_real?: string | null
          fecha_recoleccion?: string | null
          firma_digital?: string | null
          foto_comprobante?: string | null
          id?: number
          instrucciones_entrega?: string | null
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          nombre_destinatario?: string | null
          observaciones?: string | null
          peso_kg?: number | null
          precio?: number
          repartidor_asignado_id?: number | null
          requiere_firma?: boolean | null
          telefono_destinatario?: string | null
          tipo_paquete_id?: number | null
          tipo_servicio_id?: number | null
          updated_at?: string | null
          valor_declarado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "envios_empresa_destino_id_fkey"
            columns: ["empresa_destino_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_empresa_origen_id_fkey"
            columns: ["empresa_origen_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_repartidor_asignado_id_fkey"
            columns: ["repartidor_asignado_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_tipo_paquete_id_fkey"
            columns: ["tipo_paquete_id"]
            isOneToOne: false
            referencedRelation: "tipos_paquete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_tipo_servicio_id_fkey"
            columns: ["tipo_servicio_id"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id"]
          },
        ]
      }
      paradas_reparto: {
        Row: {
          created_at: string | null
          descripcion_parada: string | null
          envio_id: number
          estado_parada:
            | Database["public"]["Enums"]["estado_parada_enum"]
            | null
          fecha_reagendado: string | null
          hora_estimada_llegada: string | null
          hora_real_llegada: string | null
          id: number
          motivo_falla: string | null
          observaciones: string | null
          orden_visita: number
          reagendado: boolean | null
          reparto_id: number
          tiempo_estimado_parada: number | null
          tiempo_real_parada: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion_parada?: string | null
          envio_id: number
          estado_parada?:
            | Database["public"]["Enums"]["estado_parada_enum"]
            | null
          fecha_reagendado?: string | null
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: number
          motivo_falla?: string | null
          observaciones?: string | null
          orden_visita: number
          reagendado?: boolean | null
          reparto_id: number
          tiempo_estimado_parada?: number | null
          tiempo_real_parada?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion_parada?: string | null
          envio_id?: number
          estado_parada?:
            | Database["public"]["Enums"]["estado_parada_enum"]
            | null
          fecha_reagendado?: string | null
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: number
          motivo_falla?: string | null
          observaciones?: string | null
          orden_visita?: number
          reagendado?: boolean | null
          reparto_id?: number
          tiempo_estimado_parada?: number | null
          tiempo_real_parada?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paradas_reparto_envio_id_fkey"
            columns: ["envio_id"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paradas_reparto_reparto_id_fkey"
            columns: ["reparto_id"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
        ]
      }
      repartidores: {
        Row: {
          apellido: string | null
          calificacion_promedio: number | null
          comision_por_entrega: number | null
          created_at: string | null
          direccion: string | null
          dni: string | null
          email: string | null
          entregas_completadas: number | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_ingreso: string | null
          fecha_nacimiento: string | null
          foto_perfil: string | null
          id: number
          licencia_conducir: string | null
          nombre: string
          salario_base: number | null
          telefono: string | null
          updated_at: string | null
          user_auth_id: string | null
          vehiculo_patente: string | null
          vehiculo_tipo: string | null
          zona_asignada: string | null
        }
        Insert: {
          apellido?: string | null
          calificacion_promedio?: number | null
          comision_por_entrega?: number | null
          created_at?: string | null
          direccion?: string | null
          dni?: string | null
          email?: string | null
          entregas_completadas?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          foto_perfil?: string | null
          id?: number
          licencia_conducir?: string | null
          nombre: string
          salario_base?: number | null
          telefono?: string | null
          updated_at?: string | null
          user_auth_id?: string | null
          vehiculo_patente?: string | null
          vehiculo_tipo?: string | null
          zona_asignada?: string | null
        }
        Update: {
          apellido?: string | null
          calificacion_promedio?: number | null
          comision_por_entrega?: number | null
          created_at?: string | null
          direccion?: string | null
          dni?: string | null
          email?: string | null
          entregas_completadas?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          foto_perfil?: string | null
          id?: number
          licencia_conducir?: string | null
          nombre?: string
          salario_base?: number | null
          telefono?: string | null
          updated_at?: string | null
          user_auth_id?: string | null
          vehiculo_patente?: string | null
          vehiculo_tipo?: string | null
          zona_asignada?: string | null
        }
        Relationships: []
      }
      repartos: {
        Row: {
          combustible_final: number | null
          combustible_inicial: number | null
          comision_repartidor: number | null
          created_at: string | null
          distancia_total_km: number | null
          empresa_asociada_id: number | null
          entregas_completadas: number | null
          entregas_fallidas: number | null
          estado: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto: string
          gastos_combustible: number | null
          gastos_varios: number | null
          hora_fin: string | null
          hora_inicio: string | null
          id: number
          kilometraje_final: number | null
          kilometraje_inicial: number | null
          monto_total: number | null
          notas: string | null
          observaciones: string | null
          repartidor_id: number
          tiempo_estimado_minutos: number | null
          total_entregas: number | null
          updated_at: string | null
          vehiculo_asignado: string | null
        }
        Insert: {
          combustible_final?: number | null
          combustible_inicial?: number | null
          comision_repartidor?: number | null
          created_at?: string | null
          distancia_total_km?: number | null
          empresa_asociada_id?: number | null
          entregas_completadas?: number | null
          entregas_fallidas?: number | null
          estado?: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto: string
          gastos_combustible?: number | null
          gastos_varios?: number | null
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: number
          kilometraje_final?: number | null
          kilometraje_inicial?: number | null
          monto_total?: number | null
          notas?: string | null
          observaciones?: string | null
          repartidor_id: number
          tiempo_estimado_minutos?: number | null
          total_entregas?: number | null
          updated_at?: string | null
          vehiculo_asignado?: string | null
        }
        Update: {
          combustible_final?: number | null
          combustible_inicial?: number | null
          comision_repartidor?: number | null
          created_at?: string | null
          distancia_total_km?: number | null
          empresa_asociada_id?: number | null
          entregas_completadas?: number | null
          entregas_fallidas?: number | null
          estado?: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto?: string
          gastos_combustible?: number | null
          gastos_varios?: number | null
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: number
          kilometraje_final?: number | null
          kilometraje_inicial?: number | null
          monto_total?: number | null
          notas?: string | null
          observaciones?: string | null
          repartidor_id?: number
          tiempo_estimado_minutos?: number | null
          total_entregas?: number | null
          updated_at?: string | null
          vehiculo_asignado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartos_empresa_asociada_id_fkey"
            columns: ["empresa_asociada_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_repartidor_id_fkey"
            columns: ["repartidor_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
        ]
      }
      tarifas_distancia_calculadora: {
        Row: {
          activo: boolean | null
          created_at: string | null
          distancia_max_km: number | null
          distancia_min_km: number
          id: number
          precio_base: number
          precio_por_km: number
          tipo_servicio_id: number | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          distancia_max_km?: number | null
          distancia_min_km?: number
          id?: number
          precio_base?: number
          precio_por_km?: number
          tipo_servicio_id?: number | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          distancia_max_km?: number | null
          distancia_min_km?: number
          id?: number
          precio_base?: number
          precio_por_km?: number
          tipo_servicio_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarifas_distancia_calculadora_tipo_servicio_id_fkey"
            columns: ["tipo_servicio_id"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_paquete: {
        Row: {
          created_at: string | null
          descripcion: string | null
          dimensiones_max: string | null
          disponible: boolean | null
          id: number
          instrucciones_manejo: string | null
          nombre: string
          peso_max_kg: number | null
          precio_adicional: number | null
          requiere_cuidado_especial: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          dimensiones_max?: string | null
          disponible?: boolean | null
          id?: number
          instrucciones_manejo?: string | null
          nombre: string
          peso_max_kg?: number | null
          precio_adicional?: number | null
          requiere_cuidado_especial?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          dimensiones_max?: string | null
          disponible?: boolean | null
          id?: number
          instrucciones_manejo?: string | null
          nombre?: string
          peso_max_kg?: number | null
          precio_adicional?: number | null
          requiere_cuidado_especial?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_servicio: {
        Row: {
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          id: number
          nombre: string
          precio_base: number
          precio_extra_km_default: number | null
          prioridad: number | null
          tiempo_estimado_horas: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          nombre: string
          precio_base?: number
          precio_extra_km_default?: number | null
          prioridad?: number | null
          tiempo_estimado_horas?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          nombre?: string
          precio_base?: number
          precio_extra_km_default?: number | null
          prioridad?: number | null
          tiempo_estimado_horas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_repartidor_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      estado_envio_enum:
        | "pendiente_asignacion"
        | "asignado"
        | "en_progreso"
        | "completado"
        | "cancelado"
      estado_general_enum: "activo" | "inactivo"
      estado_parada_enum:
        | "asignado"
        | "en_progreso"
        | "completado"
        | "cancelado"
      estado_reparto_enum:
        | "planificado"
        | "en_progreso"
        | "completado"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_envio_enum: [
        "pendiente_asignacion",
        "asignado",
        "en_progreso",
        "completado",
        "cancelado",
      ],
      estado_general_enum: ["activo", "inactivo"],
      estado_parada_enum: [
        "asignado",
        "en_progreso",
        "completado",
        "cancelado",
      ],
      estado_reparto_enum: [
        "planificado",
        "en_progreso",
        "completado",
        "cancelado",
      ],
    },
  },
} as const
