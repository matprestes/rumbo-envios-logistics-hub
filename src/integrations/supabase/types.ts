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
          created_at: string | null
          direccion: string
          email: string | null
          empresa_id: number | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          id: number
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apellido: string
          created_at?: string | null
          direccion: string
          email?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apellido?: string
          created_at?: string | null
          direccion?: string
          email?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          direccion: string
          email: string | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          id: number
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          direccion: string
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      envios: {
        Row: {
          cliente_temporal_nombre: string | null
          cliente_temporal_telefono: string | null
          created_at: string | null
          detalles_adicionales: string | null
          direccion_destino: string
          direccion_origen: string
          empresa_destino_id: number | null
          empresa_origen_id: number | null
          es_parada_inicio: boolean | null
          estado: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_estimada_entrega: string | null
          horario_entrega_hasta: string | null
          horario_retiro_desde: string | null
          id: number
          latitud_destino: number | null
          latitud_origen: number | null
          longitud_destino: number | null
          longitud_origen: number | null
          nombre_destinatario: string | null
          notas_conductor: string | null
          notas_destino: string | null
          notas_origen: string | null
          peso_kg: number | null
          precio: number
          remitente_cliente_id: number | null
          repartidor_asignado_id: number | null
          telefono_destinatario: string | null
          tipo_paquete_id: number | null
          tipo_servicio_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cliente_temporal_nombre?: string | null
          cliente_temporal_telefono?: string | null
          created_at?: string | null
          detalles_adicionales?: string | null
          direccion_destino: string
          direccion_origen: string
          empresa_destino_id?: number | null
          empresa_origen_id?: number | null
          es_parada_inicio?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_estimada_entrega?: string | null
          horario_entrega_hasta?: string | null
          horario_retiro_desde?: string | null
          id?: never
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          nombre_destinatario?: string | null
          notas_conductor?: string | null
          notas_destino?: string | null
          notas_origen?: string | null
          peso_kg?: number | null
          precio?: number
          remitente_cliente_id?: number | null
          repartidor_asignado_id?: number | null
          telefono_destinatario?: string | null
          tipo_paquete_id?: number | null
          tipo_servicio_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cliente_temporal_nombre?: string | null
          cliente_temporal_telefono?: string | null
          created_at?: string | null
          detalles_adicionales?: string | null
          direccion_destino?: string
          direccion_origen?: string
          empresa_destino_id?: number | null
          empresa_origen_id?: number | null
          es_parada_inicio?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio_enum"] | null
          fecha_estimada_entrega?: string | null
          horario_entrega_hasta?: string | null
          horario_retiro_desde?: string | null
          id?: never
          latitud_destino?: number | null
          latitud_origen?: number | null
          longitud_destino?: number | null
          longitud_origen?: number | null
          nombre_destinatario?: string | null
          notas_conductor?: string | null
          notas_destino?: string | null
          notas_origen?: string | null
          peso_kg?: number | null
          precio?: number
          remitente_cliente_id?: number | null
          repartidor_asignado_id?: number | null
          telefono_destinatario?: string | null
          tipo_paquete_id?: number | null
          tipo_servicio_id?: number | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "envios_remitente_cliente_id_fkey"
            columns: ["remitente_cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
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
          envio_id: number | null
          estado_parada: Database["public"]["Enums"]["estado_envio_enum"] | null
          hora_estimada_llegada: string | null
          hora_real_llegada: string | null
          id: number
          notas_parada: string | null
          orden_visita: number | null
          reparto_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion_parada?: string | null
          envio_id?: number | null
          estado_parada?:
            | Database["public"]["Enums"]["estado_envio_enum"]
            | null
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: never
          notas_parada?: string | null
          orden_visita?: number | null
          reparto_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion_parada?: string | null
          envio_id?: number | null
          estado_parada?:
            | Database["public"]["Enums"]["estado_envio_enum"]
            | null
          hora_estimada_llegada?: string | null
          hora_real_llegada?: string | null
          id?: never
          notas_parada?: string | null
          orden_visita?: number | null
          reparto_id?: number
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_general_enum"] | null
          id: number
          nombre: string
          updated_at: string | null
          user_auth_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          nombre: string
          updated_at?: string | null
          user_auth_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_general_enum"] | null
          id?: never
          nombre?: string
          updated_at?: string | null
          user_auth_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      repartos: {
        Row: {
          created_at: string | null
          empresa_asociada_id: number | null
          estado: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto: string
          id: number
          notas: string | null
          repartidor_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_asociada_id?: number | null
          estado?: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto: string
          id?: never
          notas?: string | null
          repartidor_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_asociada_id?: number | null
          estado?: Database["public"]["Enums"]["estado_reparto_enum"] | null
          fecha_reparto?: string
          id?: never
          notas?: string | null
          repartidor_id?: number
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          distancia_max_km: number
          distancia_min_km: number
          id: number
          precio_base: number | null
          precio_por_km: number
          tipo_servicio_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          distancia_max_km: number
          distancia_min_km: number
          id?: never
          precio_base?: number | null
          precio_por_km: number
          tipo_servicio_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          distancia_max_km?: number
          distancia_min_km?: number
          id?: never
          precio_base?: number | null
          precio_por_km?: number
          tipo_servicio_id?: number
          updated_at?: string | null
          user_id?: string | null
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
          id: number
          nombre: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          nombre: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          nombre?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tipos_servicio: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          precio_base: number | null
          precio_extra_km_default: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          nombre: string
          precio_base?: number | null
          precio_extra_km_default?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          nombre?: string
          precio_base?: number | null
          precio_extra_km_default?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_orden_paradas_reparto: {
        Args: { p_reparto_id: number; p_paradas_actualizadas: Json }
        Returns: undefined
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
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
      estado_reparto_enum: [
        "planificado",
        "en_progreso",
        "completado",
        "cancelado",
      ],
    },
  },
} as const
