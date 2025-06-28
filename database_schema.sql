
-- SISTEMA DE GESTIÓN DE REPARTOS - ESQUEMA COMPLETO
-- Para cargar en Supabase: https://evnydkaakyhiulxlxzln.supabase.co

-- FASE 1: Recreación de Tipos Enumerados
DO $$ BEGIN
    CREATE TYPE estado_general_enum AS ENUM ('activo', 'inactivo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_envio_enum AS ENUM ('pendiente_asignacion', 'asignado', 'en_progreso', 'completado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_reparto_enum AS ENUM ('planificado', 'en_progreso', 'completado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_parada_enum AS ENUM ('asignado', 'en_progreso', 'completado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- FASE 2: Funciones Esenciales
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_repartidor_id()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN (
        SELECT id 
        FROM public.repartidores 
        WHERE user_auth_id = auth.uid() 
        LIMIT 1
    );
END;
$function$;

-- FASE 3: Creación de Tablas

-- Tabla de repartidores
CREATE TABLE IF NOT EXISTS public.repartidores (
    id BIGSERIAL PRIMARY KEY,
    user_auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellido TEXT,
    telefono TEXT,
    email TEXT UNIQUE,
    dni TEXT UNIQUE,
    fecha_nacimiento DATE,
    direccion TEXT,
    vehiculo_tipo TEXT,
    vehiculo_patente TEXT,
    licencia_conducir TEXT,
    foto_perfil TEXT,
    estado estado_general_enum DEFAULT 'activo',
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    salario_base NUMERIC(10,2),
    comision_por_entrega NUMERIC(5,2),
    zona_asignada TEXT,
    calificacion_promedio NUMERIC(3,2) DEFAULT 0,
    entregas_completadas INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    contacto_principal TEXT,
    ciudad TEXT,
    codigo_postal TEXT,
    latitud NUMERIC(10,7),
    longitud NUMERIC(10,7),
    horario_atencion TEXT,
    dias_operacion TEXT,
    estado estado_general_enum DEFAULT 'activo',
    tipo_empresa TEXT,
    codigo_fiscal TEXT,
    sitio_web TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT NOT NULL,
    ciudad TEXT,
    codigo_postal TEXT,
    latitud NUMERIC(10,7),
    longitud NUMERIC(10,7),
    empresa_id BIGINT REFERENCES public.empresas(id) ON DELETE SET NULL,
    tipo_cliente TEXT DEFAULT 'particular',
    preferencias_entrega TEXT,
    instrucciones_especiales TEXT,
    estado estado_general_enum DEFAULT 'activo',
    fecha_registro DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de tipos de servicio
CREATE TABLE IF NOT EXISTS public.tipos_servicio (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    precio_base NUMERIC(8,2) NOT NULL DEFAULT 0,
    precio_extra_km_default NUMERIC(5,2) DEFAULT 0,
    tiempo_estimado_horas INTEGER,
    disponible BOOLEAN DEFAULT true,
    prioridad INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de tipos de paquete
CREATE TABLE IF NOT EXISTS public.tipos_paquete (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    peso_max_kg NUMERIC(5,2),
    dimensiones_max TEXT,
    precio_adicional NUMERIC(6,2) DEFAULT 0,
    requiere_cuidado_especial BOOLEAN DEFAULT false,
    instrucciones_manejo TEXT,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de tarifas por distancia
CREATE TABLE IF NOT EXISTS public.tarifas_distancia_calculadora (
    id BIGSERIAL PRIMARY KEY,
    tipo_servicio_id BIGINT REFERENCES public.tipos_servicio(id) ON DELETE CASCADE,
    distancia_min_km NUMERIC(6,2) NOT NULL DEFAULT 0,
    distancia_max_km NUMERIC(6,2),
    precio_por_km NUMERIC(5,2) NOT NULL DEFAULT 0,
    precio_base NUMERIC(8,2) NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de envíos
CREATE TABLE IF NOT EXISTS public.envios (
    id BIGSERIAL PRIMARY KEY,
    codigo_seguimiento TEXT UNIQUE DEFAULT ('ENV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('envios_id_seq')::TEXT, 6, '0')),
    direccion_origen TEXT NOT NULL,
    latitud_origen NUMERIC(10,7),
    longitud_origen NUMERIC(10,7),
    empresa_origen_id BIGINT REFERENCES public.empresas(id) ON DELETE SET NULL,
    direccion_destino TEXT NOT NULL,
    latitud_destino NUMERIC(10,7),
    longitud_destino NUMERIC(10,7),
    nombre_destinatario TEXT,
    telefono_destinatario TEXT,
    email_destinatario TEXT,
    tipo_servicio_id BIGINT REFERENCES public.tipos_servicio(id) ON DELETE SET NULL,
    tipo_paquete_id BIGINT REFERENCES public.tipos_paquete(id) ON DELETE SET NULL,
    peso_kg NUMERIC(6,2),
    dimensiones TEXT,
    descripcion_contenido TEXT,
    valor_declarado NUMERIC(10,2),
    instrucciones_entrega TEXT,
    requiere_firma BOOLEAN DEFAULT false,
    es_fragil BOOLEAN DEFAULT false,
    es_urgente BOOLEAN DEFAULT false,
    precio NUMERIC(10,2) NOT NULL DEFAULT 0,
    distancia_km NUMERIC(6,2),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
    fecha_recoleccion TIMESTAMP WITH TIME ZONE,
    fecha_entrega_programada TIMESTAMP WITH TIME ZONE,
    fecha_entrega_real TIMESTAMP WITH TIME ZONE,
    estado estado_envio_enum DEFAULT 'pendiente_asignacion',
    repartidor_asignado_id BIGINT REFERENCES public.repartidores(id) ON DELETE SET NULL,
    foto_comprobante TEXT,
    firma_digital TEXT,
    observaciones TEXT,
    calificacion_servicio INTEGER CHECK (calificacion_servicio >= 1 AND calificacion_servicio <= 5),
    comentarios_cliente TEXT,
    es_parada_inicio BOOLEAN DEFAULT false,
    empresa_destino_id BIGINT REFERENCES public.empresas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de repartos
CREATE TABLE IF NOT EXISTS public.repartos (
    id BIGSERIAL PRIMARY KEY,
    fecha_reparto DATE NOT NULL,
    repartidor_id BIGINT NOT NULL REFERENCES public.repartidores(id) ON DELETE CASCADE,
    estado estado_reparto_enum DEFAULT 'planificado',
    hora_inicio TIME,
    hora_fin TIME,
    distancia_total_km NUMERIC(8,2),
    tiempo_estimado_minutos INTEGER,
    empresa_asociada_id BIGINT REFERENCES public.empresas(id) ON DELETE SET NULL,
    vehiculo_asignado TEXT,
    combustible_inicial NUMERIC(5,2),
    combustible_final NUMERIC(5,2),
    kilometraje_inicial INTEGER,
    kilometraje_final INTEGER,
    total_entregas INTEGER DEFAULT 0,
    entregas_completadas INTEGER DEFAULT 0,
    entregas_fallidas INTEGER DEFAULT 0,
    monto_total NUMERIC(10,2) DEFAULT 0,
    comision_repartidor NUMERIC(10,2) DEFAULT 0,
    gastos_combustible NUMERIC(8,2) DEFAULT 0,
    gastos_varios NUMERIC(8,2) DEFAULT 0,
    notas TEXT,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de paradas de reparto
CREATE TABLE IF NOT EXISTS public.paradas_reparto (
    id BIGSERIAL PRIMARY KEY,
    reparto_id BIGINT NOT NULL REFERENCES public.repartos(id) ON DELETE CASCADE,
    envio_id BIGINT NOT NULL REFERENCES public.envios(id) ON DELETE CASCADE,
    orden_visita INTEGER NOT NULL,
    descripcion_parada TEXT,
    hora_estimada_llegada TIME,
    hora_real_llegada TIME,
    tiempo_estimado_parada INTEGER DEFAULT 15,
    tiempo_real_parada INTEGER,
    estado_parada estado_parada_enum DEFAULT 'asignado',
    motivo_falla TEXT,
    reagendado BOOLEAN DEFAULT false,
    fecha_reagendado DATE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(reparto_id, orden_visita)
);

-- FASE 4: Índices para Optimización
CREATE INDEX IF NOT EXISTS idx_repartidores_user_auth_id ON public.repartidores(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_repartidores_estado ON public.repartidores(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_id ON public.clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_envios_estado ON public.envios(estado);
CREATE INDEX IF NOT EXISTS idx_envios_repartidor_asignado ON public.envios(repartidor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_envios_fecha_creacion ON public.envios(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_repartos_fecha ON public.repartos(fecha_reparto);
CREATE INDEX IF NOT EXISTS idx_repartos_repartidor_id ON public.repartos(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_repartos_estado ON public.repartos(estado);
CREATE INDEX IF NOT EXISTS idx_paradas_reparto_id ON public.paradas_reparto(reparto_id);
CREATE INDEX IF NOT EXISTS idx_paradas_envio_id ON public.paradas_reparto(envio_id);

-- FASE 5: Triggers para updated_at
CREATE TRIGGER handle_updated_at_repartidores BEFORE UPDATE ON public.repartidores FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_empresas BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_clientes BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_tipos_servicio BEFORE UPDATE ON public.tipos_servicio FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_tipos_paquete BEFORE UPDATE ON public.tipos_paquete FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_tarifas_distancia BEFORE UPDATE ON public.tarifas_distancia_calculadora FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_envios BEFORE UPDATE ON public.envios FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_repartos BEFORE UPDATE ON public.repartos FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_paradas BEFORE UPDATE ON public.paradas_reparto FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- FASE 6: Políticas RLS (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_paquete ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas_distancia_calculadora ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paradas_reparto ENABLE ROW LEVEL SECURITY;

-- Políticas para repartidores
CREATE POLICY "Los repartidores pueden ver su propio perfil" ON public.repartidores
    FOR SELECT USING (user_auth_id = auth.uid());

CREATE POLICY "Los repartidores pueden actualizar su propio perfil" ON public.repartidores
    FOR UPDATE USING (user_auth_id = auth.uid());

-- Políticas para empresas (acceso de lectura para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver empresas" ON public.empresas
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Políticas para clientes (acceso de lectura para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver clientes" ON public.clientes
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Políticas para tipos de servicio y paquete (acceso de lectura para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden ver tipos de servicio" ON public.tipos_servicio
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden ver tipos de paquete" ON public.tipos_paquete
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden ver tarifas" ON public.tarifas_distancia_calculadora
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Políticas para envíos
CREATE POLICY "Los repartidores pueden ver sus envíos asignados" ON public.envios
    FOR SELECT USING (
        repartidor_asignado_id = (
            SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
        )
    );

CREATE POLICY "Los repartidores pueden actualizar sus envíos asignados" ON public.envios
    FOR UPDATE USING (
        repartidor_asignado_id = (
            SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
        )
    );

-- Políticas para repartos
CREATE POLICY "Los repartidores pueden ver sus repartos" ON public.repartos
    FOR SELECT USING (
        repartidor_id = (
            SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
        )
    );

CREATE POLICY "Los repartidores pueden actualizar sus repartos" ON public.repartos
    FOR UPDATE USING (
        repartidor_id = (
            SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
        )
    );

-- Políticas para paradas de reparto
CREATE POLICY "Los repartidores pueden ver las paradas de sus repartos" ON public.paradas_reparto
    FOR SELECT USING (
        reparto_id IN (
            SELECT id FROM public.repartos 
            WHERE repartidor_id = (
                SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
            )
        )
    );

CREATE POLICY "Los repartidores pueden actualizar las paradas de sus repartos" ON public.paradas_reparto
    FOR UPDATE USING (
        reparto_id IN (
            SELECT id FROM public.repartos 
            WHERE repartidor_id = (
                SELECT id FROM public.repartidores WHERE user_auth_id = auth.uid()
            )
        )
    );

-- FASE 7: Datos Iniciales
-- Tipos de Servicio
INSERT INTO public.tipos_servicio (nombre, descripcion, precio_base, precio_extra_km_default) VALUES
('Express', 'Entrega el mismo día', 15.00, 2.50),
('Estándar', 'Entrega en 24-48 horas', 8.00, 1.50),
('Programado', 'Entrega en fecha específica', 10.00, 2.00),
('Económico', 'Entrega en 3-5 días', 5.00, 1.00)
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Paquete
INSERT INTO public.tipos_paquete (nombre, descripcion) VALUES
('Pequeño', 'Hasta 2kg - 30x20x10cm'),
('Mediano', 'Hasta 5kg - 50x40x20cm'),
('Grande', 'Hasta 10kg - 70x50x30cm'),
('Extra Grande', 'Hasta 20kg - 100x70x50cm'),
('Frágil', 'Requiere manejo especial'),
('Documentos', 'Sobres y documentos')
ON CONFLICT (nombre) DO NOTHING;

-- Tarifas de Distancia
INSERT INTO public.tarifas_distancia_calculadora (tipo_servicio_id, distancia_min_km, distancia_max_km, precio_por_km, precio_base) VALUES
(1, 0, 5, 3.00, 15.00),   -- Express 0-5km
(1, 5.01, 15, 2.50, 15.00), -- Express 5-15km
(1, 15.01, 50, 2.00, 15.00), -- Express 15-50km
(2, 0, 10, 2.00, 8.00),   -- Estándar 0-10km
(2, 10.01, 30, 1.50, 8.00), -- Estándar 10-30km
(2, 30.01, 100, 1.20, 8.00), -- Estándar 30-100km
(3, 0, 15, 2.50, 10.00),  -- Programado 0-15km
(3, 15.01, 50, 2.00, 10.00), -- Programado 15-50km
(4, 0, 20, 1.50, 5.00),   -- Económico 0-20km
(4, 20.01, 100, 1.00, 5.00) -- Económico 20-100km
ON CONFLICT DO NOTHING;

-- Empresa ejemplo
INSERT INTO public.empresas (nombre, direccion, telefono, email, estado) VALUES
('Depósito Central', 'Av. Corrientes 1234, CABA', '+54 11 4123-4567', 'deposito@empresa.com', 'activo'),
('Sucursal Norte', 'Av. Cabildo 2500, CABA', '+54 11 4765-4321', 'norte@empresa.com', 'activo'),
('Centro de Distribución', 'Ruta 8 Km 30, Pilar', '+54 11 4987-6543', 'distribucion@empresa.com', 'activo')
ON CONFLICT (nombre) DO NOTHING;
