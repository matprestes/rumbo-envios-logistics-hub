
# Sistema de Gestión de Repartos - Rumbo Envíos

## Descripción del Proyecto

Sistema integral de gestión de repartos y entregas desarrollado en React con TypeScript, diseñado para optimizar la logística de última milla. El sistema permite a los repartidores gestionar sus rutas, visualizar entregas en tiempo real y optimizar sus recorridos utilizando Google Maps.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como build tool y dev server
- **Tailwind CSS** para estilos responsivos
- **Shadcn/UI** como sistema de componentes
- **React Router DOM** para navegación
- **Lucide React** para iconografía

### Backend y Base de Datos
- **Supabase** como Backend as a Service (BaaS)
- **PostgreSQL** como base de datos principal
- **Row Level Security (RLS)** para seguridad de datos
- **Supabase Auth** para autenticación

### Mapas y Geolocalización
- **Google Maps API** para visualización de rutas
- **Mapbox GL JS** como alternativa de mapas
- **Geolocalización HTML5** para tracking en tiempo real

### Gestión de Estado
- **TanStack Query** para data fetching y cache
- **React Context** para estado global de autenticación
- **React Hooks** personalizados para lógica de negocio

## 📁 Estructura del Proyecto

```
src/
├── app/                              # Páginas siguiendo Next.js App Router
│   ├── layout.tsx                    # Layout raíz con providers
│   ├── page.tsx                      # Página principal (redirect)
│   ├── globals.css                   # Estilos globales
│   ├── not-found.tsx                 # Página 404
│   ├── login/                        # Autenticación
│   │   └── page.tsx                  
│   └── (dashboard)/                  # Grupo de rutas protegidas
│       ├── layout.tsx                # Layout con navbar y sidebar
│       ├── panel/                    # Dashboard principal
│       │   └── page.tsx              
│       ├── repartos/                 # Gestión de repartos
│       │   ├── page.tsx              # Lista de repartos
│       │   ├── nuevo/                # Generar repartos
│       │   │   └── page.tsx          
│       │   └── [id]/                 # Detalle de reparto
│       │       └── page.tsx          
│       └── mapa-rutas/               # Visualización en mapas
│           └── page.tsx              
├── components/                       # Componentes reutilizables
│   ├── ui/                          # Componentes base (shadcn/ui)
│   ├── layout/                      # Componentes de layout
│   │   ├── DashboardNavbar.tsx      # Barra de navegación
│   │   └── DashboardSidebar.tsx     # Menú lateral
│   ├── dashboard/                   # Componentes del panel
│   │   ├── EstadisticasCards.tsx    # Tarjetas de métricas
│   │   ├── AccesosRapidos.tsx       # Enlaces rápidos
│   │   └── ResumenRepartos.tsx      # Resumen de repartos
│   ├── repartos/                    # Componentes de repartos
│   │   ├── ListaRepartos.tsx        # Lista con filtros
│   │   ├── FiltrosRepartos.tsx      # Componentes de filtrado
│   │   ├── DetalleRepartoHeader.tsx # Header del detalle
│   │   └── InformacionReparto.tsx   # Info del reparto
│   ├── paradas/                     # Componentes de paradas
│   │   └── ListaParadas.tsx         # Lista de paradas
│   ├── mapas/                       # Componentes de mapas
│   │   ├── MapaRutasInteractivo.tsx # Mapa principal
│   │   └── FiltrosMapaRutas.tsx     # Filtros del mapa
│   └── GenerarRepartos/             # Generación masiva
│       ├── ConfiguracionReparto.tsx
│       ├── SeleccionClientes.tsx
│       └── BotonGeneracion.tsx
├── hooks/                           # Hooks personalizados
│   ├── useAuth.tsx                  # Autenticación y usuario
│   ├── useRepartos.ts               # CRUD de repartos
│   ├── useParadasReparto.ts         # Gestión de paradas
│   ├── useClientes.ts               # Gestión de clientes
│   ├── useEntregas.ts               # Gestión de entregas
│   └── useGenerarRepartosCompleto.ts # Generación automática
├── lib/                             # Configuraciones y utilidades
│   ├── supabase.ts                  # Cliente de Supabase
│   └── utils.ts                     # Utilidades generales
├── types/                           # Definiciones de tipos
│   └── database.ts                  # Tipos de la base de datos
└── integrations/                    # Integraciones externas
    └── supabase/                    # Configuración de Supabase
        ├── client.ts
        └── types.ts
```

## 🗄️ Base de Datos

### Tablas Principales

#### `repartidores`
Almacena información de los repartidores del sistema.
```sql
- id: integer (PK)
- nombre: text
- user_auth_id: uuid (FK a auth.users)
- estado: estado_general_enum
- created_at, updated_at: timestamp
```

#### `empresas`
Empresas cliente que solicitan servicios de reparto.
```sql
- id: integer (PK)
- nombre: text
- direccion: text
- telefono: text
- email: text
- latitud, longitud: double precision
- estado: estado_general_enum
- created_at, updated_at: timestamp
```

#### `clientes`
Clientes finales que reciben las entregas.
```sql
- id: integer (PK)
- nombre, apellido: text
- direccion: text
- telefono: text
- email: text
- latitud, longitud: double precision
- empresa_id: integer (FK)
- estado: estado_general_enum
- created_at, updated_at: timestamp
```

#### `repartos`
Agrupaciones de entregas asignadas a un repartidor para una fecha específica.
```sql
- id: integer (PK)
- fecha_reparto: date
- repartidor_id: integer (FK)
- empresa_asociada_id: integer (FK)
- estado: estado_reparto_enum
- notas: text
- created_at, updated_at: timestamp
```

#### `envios`
Entregas individuales con información completa de origen y destino.
```sql
- id: integer (PK)
- direccion_origen, direccion_destino: text
- latitud_origen, longitud_origen: double precision
- latitud_destino, longitud_destino: double precision
- empresa_origen_id, empresa_destino_id: integer (FK)
- remitente_cliente_id: integer (FK)
- estado: estado_envio_enum
- precio: numeric
- peso_kg: numeric
- fecha_estimada_entrega: date
- horario_retiro_desde, horario_entrega_hasta: time
- repartidor_asignado_id: integer (FK)
- created_at, updated_at: timestamp
```

#### `paradas_reparto`
Paradas individuales dentro de un reparto, vinculando envíos específicos.
```sql
- id: integer (PK)
- reparto_id: integer (FK)
- envio_id: integer (FK)
- orden_visita: integer
- estado_parada: estado_envio_enum
- hora_estimada_llegada, hora_real_llegada: time
- descripcion_parada: text
- notas_parada: text
- created_at, updated_at: timestamp
```

### Enums Utilizados

#### `estado_general_enum`
- `activo`: Entidad activa en el sistema
- `inactivo`: Entidad deshabilitada temporalmente
- `suspendido`: Entidad suspendida por políticas

#### `estado_reparto_enum`
- `planificado`: Reparto creado pero no iniciado
- `en_progreso`: Reparto en ejecución
- `completado`: Todas las paradas completadas
- `cancelado`: Reparto cancelado

#### `estado_envio_enum`
- `pendiente_asignacion`: Envío creado, pendiente de asignar
- `asignado`: Asignado a un repartidor
- `en_progreso`: En proceso de entrega
- `completado`: Entregado exitosamente
- `fallido`: Entrega fallida
- `cancelado`: Envío cancelado

### Funciones Especiales

#### `actualizar_orden_paradas_reparto()`
Función PL/pgSQL que actualiza el orden de visita de múltiples paradas de manera atómica.

```sql
-- Parámetros:
-- p_reparto_id: ID del reparto
-- p_paradas_actualizadas: JSON array con parada_id y nuevo_orden_visita
```

#### `get_current_repartidor_id()`
Función que obtiene el ID del repartidor basado en el usuario autenticado.

```sql
-- Retorna: bigint (ID del repartidor o NULL)
```

### Políticas de Seguridad (RLS)

El sistema utiliza Row Level Security para garantizar que:
- Los repartidores solo acceden a sus propios repartos y paradas
- Los datos de clientes y empresas están protegidos
- Las operaciones están auditadas por usuario

## 📱 Páginas y Funcionalidades

### 1. Página de Login (`/login`)
**Archivo:** `src/app/login/page.tsx`

**Funcionalidades:**
- Autenticación con email y contraseña
- Integración con Supabase Auth
- Redirección automática post-login
- Manejo de errores de autenticación
- Diseño responsivo con validación en tiempo real

**Lógica Implementada:**
- Hook `useAuth` para gestión de estado de autenticación
- Validación de credenciales con feedback visual
- Persistencia de sesión en localStorage
- Redirección protegida a rutas autenticadas

### 2. Panel Principal (`/panel`)
**Archivo:** `src/app/(dashboard)/panel/page.tsx`

**Funcionalidades:**
- Dashboard con métricas en tiempo real
- Tarjetas de estadísticas (repartos completados, en progreso, etc.)
- Accesos rápidos a funciones principales
- Resumen de repartos del día actual
- Vista responsiva para móviles y tablets

**Lógica Implementada:**
- Hook `useRepartos` para obtener datos de repartos
- Cálculo dinámico de estadísticas por estado
- Componentes modulares para cada sección
- Filtrado automático por fecha actual

### 3. Lista de Repartos (`/repartos`)
**Archivo:** `src/app/(dashboard)/repartos/page.tsx`

**Funcionalidades:**
- Lista completa de repartos asignados
- Filtros por estado (planificado, en progreso, completado)
- Búsqueda por ID o fecha
- Navegación a detalle de cada reparto
- Indicadores visuales de estado

**Lógica Implementada:**
- Hook personalizado para filtrado en tiempo real
- Componente `FiltrosRepartos` para controles
- Componente `ListaRepartos` para renderizado
- Memoización para optimización de performance

### 4. Detalle de Reparto (`/repartos/[id]`)
**Archivo:** `src/app/(dashboard)/repartos/[id]/page.tsx`

**Funcionalidades:**
- Vista detallada de un reparto específico
- Información completa de paradas y estados
- Integración con Google Maps para visualización
- Acciones para iniciar/completar paradas
- Navegación GPS a cada destino

**Lógica Implementada:**
- Hook `useParadasReparto` para gestión de paradas
- Integración con APIs de mapas para navegación
- Estados locales para tracking de progreso
- Validaciones de transiciones de estado

### 5. Generar Repartos (`/repartos/nuevo`)
**Archivo:** `src/app/(dashboard)/repartos/nuevo/page.tsx`

**Funcionalidades:**
- Creación masiva de repartos por lote
- Selección de empresa y fecha
- Selección múltiple de clientes
- Configuración de parámetros del reparto
- Preview antes de la generación

**Lógica Implementada:**
- Hook `useGenerarRepartosCompleto` para estado complejo
- Validaciones de negocio antes de creación
- Integración con algoritmos de optimización de rutas
- Transacciones para creación atómica

### 6. Mapa de Rutas (`/mapa-rutas`)
**Archivo:** `src/app/(dashboard)/mapa-rutas/page.tsx`

**Funcionalidades:**
- Visualización de repartos en Google Maps
- Filtros por fecha y estado
- Marcadores diferenciados por estado
- Información emergente en cada parada
- Vista de rutas optimizadas

**Lógica Implementada:**
- Integración con Mapbox GL JS
- Configuración dinámica de tokens de API
- Renderizado condicional de marcadores
- Clustering para múltiples puntos

## 🔧 Hooks Personalizados

### `useAuth`
**Archivo:** `src/hooks/useAuth.tsx`

Gestiona toda la lógica de autenticación y estado del usuario.

**Funcionalidades:**
- Manejo de sesiones de Supabase
- Estado de loading durante autenticación
- Funciones para login, logout y registro
- Obtención automática de datos del repartidor
- Manejo de errores de autenticación

### `useRepartos`
**Archivo:** `src/hooks/useRepartos.ts`

CRUD completo para la gestión de repartos.

**Funcionalidades:**
- Obtención de repartos del usuario autenticado
- Filtrado por RLS automático
- Actualización de estados de reparto
- Validación de transiciones de estado
- Cache y sincronización con TanStack Query

### `useParadasReparto`
**Archivo:** `src/hooks/useParadasReparto.ts`

Gestiona las paradas individuales dentro de un reparto.

**Funcionalidades:**
- CRUD de paradas por reparto
- Inicio y finalización de paradas
- Integración con navegación GPS
- Tracking de ubicación en tiempo real
- Actualización de estados y tiempos

### `useGenerarRepartosCompleto`
**Archivo:** `src/hooks/useGenerarRepartosCompleto.ts`

Maneja la lógica compleja de generación masiva de repartos.

**Funcionalidades:**
- Estado completo del formulario de generación
- Validaciones de negocio
- Selección múltiple de clientes
- Integración con algoritmos de optimización
- Transacciones atómicas para creación

## 🔒 Seguridad

### Row Level Security (RLS)
- Todas las tablas principales tienen RLS habilitado
- Políticas que restringen acceso por `user_id` y `repartidor_id`
- Validación automática en queries de Supabase

### Autenticación
- JWT tokens manejados por Supabase Auth
- Refresh automático de tokens
- Logout automático en tokens expirados
- Validación de permisos en cada request

### Validación de Datos
- Validaciones en frontend con React Hook Form
- Constraints de base de datos para integridad
- Sanitización de inputs para prevenir XSS
- Validación de tipos con TypeScript

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 18
npm o yarn
Cuenta de Supabase
API Key de Google Maps o Mapbox
```

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno
```env
VITE_SUPABASE_URL=tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_GOOGLE_MAPS_API_KEY=tu-google-maps-key
```

### Configuración de Base de Datos
1. Ejecutar migraciones de Supabase
2. Configurar políticas RLS
3. Crear funciones personalizadas
4. Insertar datos de prueba

### Ejecución
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

## 📈 Optimizaciones Implementadas

### Performance
- Lazy loading de componentes pesados
- Memoización de cálculos complejos
- Virtualization para listas largas
- Caching agresivo con TanStack Query

### SEO y Accesibilidad
- Semantic HTML5
- ARIA labels en componentes interactivos
- Navegación por teclado completa
- Contraste de colores optimizado

### Mobile-First
- Diseño responsive con Tailwind CSS
- Touch-friendly interactions
- Optimización para redes lentas
- PWA capabilities preparadas

## 🔮 Roadmap Futuro

### Funcionalidades Planeadas
- [ ] Notificaciones push en tiempo real
- [ ] Integración con APIs de tracking GPS
- [ ] Sistema de ratings y reviews
- [ ] Analytics avanzados de rendimiento
- [ ] Modo offline con sincronización
- [ ] Integración con sistemas de facturación
- [ ] API REST para integraciones externas
- [ ] Dashboard para administradores

### Mejoras Técnicas
- [ ] Implementación de WebSockets
- [ ] Service Workers para offline
- [ ] Tests automatizados (Jest + Testing Library)
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Sentry
- [ ] Optimización de bundle size

## 👥 Contribución

Este proyecto está diseñado para ser mantenible y escalable. Para contribuir:

1. Fork el repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- Crear issue en GitHub
- Contactar al equipo de desarrollo
- Revisar documentación en `/docs`

---

**Desarrollado con ❤️ para optimizar la logística de última milla**
