
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

CREATE OR REPLACE FUNCTION public.actualizar_orden_paradas_reparto(p_reparto_id integer, p_paradas_actualizadas jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$ 
DECLARE 
    parada_actualizada jsonb;
BEGIN 
    IF p_paradas_actualizadas IS NULL 
    OR jsonb_array_length(p_paradas_actualizadas) = 0 THEN 
        RETURN;
    END IF;
    
    FOR parada_actualizada IN 
    SELECT * 
    FROM jsonb_array_elements(p_paradas_actualizadas) 
    LOOP 
        UPDATE public.paradas_reparto 
        SET 
            orden_visita = (parada_actualizada ->> 'nuevo_orden_visita')::integer,
            updated_at = timezone('utc'::text, now()) 
        WHERE 
            id = (parada_actualizada ->> 'parada_id')::integer
            AND reparto_id = p_reparto_id;
    END LOOP;
END;
$function$;

-- FASE 3: Datos Iniciales

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
