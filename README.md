
# Sistema de Gestión de Repartos 🚚

Sistema completo de gestión de entregas y repartos para empresas de logística y delivery desarrollado con React, TypeScript, Tailwind CSS y Supabase. Incluye autenticación de usuarios, gestión de envíos, rutas optimizadas y seguimiento en tiempo real con integración de Google Maps.

## 📋 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Base de Datos](#-base-de-datos)
4. [Estructura de Navegación](#-estructura-de-navegación)
5. [Páginas y Funcionalidades](#-páginas-y-funcionalidades)
6. [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
7. [Instalación y Configuración](#-instalación-y-configuración)
8. [Guía de Uso](#-guía-de-uso)
9. [Hooks Personalizados](#-hooks-personalizados)
10. [Componentes Principales](#️-componentes-principales)
11. [Seguridad](#-seguridad)
12. [Contribuir](#-contribuir)

## 🌟 Características Principales

### 🔐 Sistema de Autenticación
- **Autenticación segura** con Supabase Auth
- **Row Level Security (RLS)** para protección de datos
- **Gestión de sesiones** automática
- **Permisos por usuario** - cada repartidor solo ve sus datos

### 📱 Panel de Control Intuitivo
- **Dashboard centralizado** con métricas en tiempo real
- **Estadísticas de entrega** (completadas, pendientes, en progreso)
- **Vista general** de repartos del día
- **Acceso rápido** a todas las funcionalidades

### 🗺️ Gestión Avanzada de Repartos
- **Creación masiva** de repartos por lote
- **Listado completo** de repartos asignados
- **Filtrado avanzado** por estado, fecha y búsqueda
- **Vista detallada** de cada reparto con información completa

### 📍 Seguimiento de Paradas en Tiempo Real
- **Estados dinámicos**: asignado → en progreso → completado
- **Identificación visual** de la próxima parada
- **Tiempos estimados** vs reales de llegada
- **Notas adicionales** por parada

### 🗺️ Integración con Google Maps
- **Visualización completa** de rutas en mapa interactivo
- **Ruta optimizada** con todas las paradas ordenadas
- **Marcadores diferenciados** por estado de parada
- **Direcciones paso a paso** integradas
- **Navegación GPS** directa desde la aplicación

### 📱 Diseño Responsivo
- **Optimizado para móviles** - diseñado para repartidores
- **Interfaz táctil** amigable
- **Carga eficiente** de mapas y datos
- **Compatibilidad total** con dispositivos móviles

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios (App Router Style)
```
src/
├── app/                          # Rutas principales (estilo Next.js)
│   ├── layout.tsx               # Layout raíz con providers
│   ├── page.tsx                 # Página de inicio (redirect)
│   ├── login/
│   │   └── page.tsx            # Página de login
│   ├── panel/
│   │   └── page.tsx            # Dashboard principal
│   ├── repartos/
│   │   └── page.tsx            # Lista de repartos
│   └── mapa-rutas/
│       └── page.tsx            # Visualización de rutas en Google Maps
├── components/
│   ├── ui/                      # Componentes de UI (shadcn/ui)
│   ├── GenerarRepartos/         # Componentes específicos
│   │   ├── ConfiguracionReparto.tsx
│   │   ├── SeleccionClientes.tsx
│   │   └── BotonGeneracion.tsx
│   ├── MapaRepartos.tsx         # Componente de mapa Mapbox
│   ├── RepartoCard.tsx          # Tarjeta de reparto
│   └── ParadaCard.tsx           # Tarjeta de parada
├── hooks/                       # Hooks personalizados
│   ├── useAuth.tsx             # Autenticación
│   ├── useRepartos.ts          # Gestión de repartos
│   ├── useParadasReparto.ts    # Gestión de paradas
│   ├── useClientes.ts          # Gestión de clientes
│   ├── useGenerarRepartos.ts   # Generación automática
│   └── useGenerarRepartosCompleto.ts # Generación por lote
├── lib/
│   ├── supabase.ts             # Cliente de Supabase
│   └── utils.ts                # Utilidades generales
├── types/
│   └── database.ts             # Tipos de TypeScript
└── pages/                      # Páginas legacy (compatibilidad)
    ├── DetalleReparto.tsx      # Detalle individual de reparto
    ├── GenerarRepartos.tsx     # Generación de repartos por lote
    ├── Index.tsx               # Página demo
    └── NotFound.tsx            # Página 404
```

## 💾 Base de Datos

### Esquema Principal (Supabase PostgreSQL)

#### Tabla `repartidores`
Gestiona la información de los repartidores del sistema.

```sql
CREATE TABLE repartidores (
  id SERIAL PRIMARY KEY,
  user_auth_id UUID REFERENCES auth.users,
  nombre TEXT NOT NULL,
  estado estado_general_enum DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

**Campos principales:**
- `user_auth_id`: Vinculación con autenticación de Supabase
- `nombre`: Nombre completo del repartidor
- `estado`: activo/inactivo

#### Tabla `empresas`
Almacena información de las empresas asociadas.

```sql
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  telefono TEXT,
  email TEXT,
  estado estado_general_enum DEFAULT 'activo',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

**Campos principales:**
- `nombre`, `direccion`: Información básica
- `latitud`, `longitud`: Coordenadas para mapas
- `estado`: Activo/inactivo

#### Tabla `clientes`
Base de datos de clientes para entregas.

```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  direccion TEXT NOT NULL,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  telefono TEXT,
  email TEXT,
  empresa_id INTEGER REFERENCES empresas(id),
  estado estado_general_enum DEFAULT 'activo',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

#### Tabla `repartos`
Información principal de cada reparto diario.

```sql
CREATE TABLE repartos (
  id SERIAL PRIMARY KEY,
  fecha_reparto DATE NOT NULL,
  repartidor_id INTEGER NOT NULL REFERENCES repartidores(id),
  empresa_asociada_id INTEGER REFERENCES empresas(id),
  estado estado_reparto_enum DEFAULT 'planificado',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

**Estados posibles:**
- `planificado`: Reparto creado pero no iniciado
- `en_progreso`: Reparto en ejecución
- `completado`: Reparto finalizado
- `cancelado`: Reparto cancelado

#### Tabla `paradas_reparto`
Paradas individuales de cada reparto.

```sql
CREATE TABLE paradas_reparto (
  id SERIAL PRIMARY KEY,
  reparto_id INTEGER NOT NULL REFERENCES repartos(id),
  envio_id INTEGER REFERENCES envios(id),
  descripcion_parada TEXT,
  orden_visita INTEGER,
  estado_parada estado_envio_enum DEFAULT 'asignado',
  hora_estimada_llegada TIME,
  hora_real_llegada TIME,
  notas_parada TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

**Estados de parada:**
- `asignado`: Parada asignada pero no iniciada
- `en_progreso`: Repartidor en camino o en ubicación
- `completado`: Entrega realizada
- `cancelado`: Parada cancelada

#### Tabla `envios`
Información detallada de cada envío.

```sql
CREATE TABLE envios (
  id SERIAL PRIMARY KEY,
  direccion_origen TEXT NOT NULL,
  latitud_origen DOUBLE PRECISION,
  longitud_origen DOUBLE PRECISION,
  empresa_origen_id INTEGER REFERENCES empresas(id),
  direccion_destino TEXT NOT NULL,
  latitud_destino DOUBLE PRECISION,
  longitud_destino DOUBLE PRECISION,
  nombre_destinatario TEXT,
  telefono_destinatario TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  estado estado_envio_enum DEFAULT 'pendiente_asignacion',
  repartidor_asignado_id INTEGER REFERENCES repartidores(id),
  es_parada_inicio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID
);
```

### Relaciones de Base de Datos

```
repartidores (1) ←→ (N) repartos
repartos (1) ←→ (N) paradas_reparto
paradas_reparto (N) ←→ (1) envios
envios (N) ←→ (1) empresas (origen/destino)
clientes (N) ←→ (1) empresas
```

### Seguridad de Datos (RLS)

Todas las tablas implementan **Row Level Security** para garantizar que:
- Cada repartidor solo accede a sus propios datos
- Las consultas están optimizadas con índices
- Los permisos son granulares por funcionalidad

## 🧭 Estructura de Navegación

### Rutas Principales

| Ruta | Componente | Descripción | Acceso |
|------|------------|-------------|---------|
| `/` | `HomePage` | Redirección a login | Público |
| `/login` | `LoginPage` | Autenticación de usuarios | Público |
| `/panel` | `PanelPage` | Dashboard principal | Autenticado |
| `/repartos` | `RepartosPage` | Lista de repartos | Autenticado |
| `/reparto/:id` | `DetalleReparto` | Detalle específico | Autenticado |
| `/generar-repartos` | `GenerarRepartos` | Creación por lote | Autenticado |
| `/mapa-rutas` | `MapaRutasPage` | Visualización Google Maps | Autenticado |

### Navegación Protegida

Todas las rutas autenticadas verifican:
- Usuario válido en sesión
- Repartidor asociado al usuario
- Permisos específicos por recurso

## 📄 Páginas y Funcionalidades

### 1. Página de Login (`/login`)

**Archivo:** `src/app/login/page.tsx`

**Funcionalidades:**
- Formulario de autenticación con email y contraseña
- Validación en tiempo real
- Manejo de errores con mensajes descriptivos
- Redirección automática si ya está autenticado
- Diseño responsivo con gradientes

**Lógica principal:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    await login(email, password)
    toast.success('Sesión iniciada correctamente')
  } catch (err) {
    setError(err.message)
    toast.error(errorMessage)
  }
}
```

### 2. Panel Principal (`/panel`)

**Archivo:** `src/app/panel/page.tsx`

**Funcionalidades:**
- **Dashboard con métricas en tiempo real:**
  - Total de repartos del día
  - Repartos planificados, en progreso y completados
  - Estadísticas visuales con iconos
- **Accesos rápidos** a todas las funcionalidades
- **Lista de repartos del día** con estados y acciones
- **Navegación intuitiva** a otras secciones

**Lógica de estadísticas:**
```typescript
const repartosHoy = repartos.filter(reparto => {
  const hoy = new Date().toISOString().split('T')[0]
  return reparto.fecha_reparto === hoy
})

const estadisticas = {
  total: repartosHoy.length,
  planificados: repartosHoy.filter(r => r.estado === 'planificado').length,
  enProgreso: repartosHoy.filter(r => r.estado === 'en_progreso').length,
  completados: repartosHoy.filter(r => r.estado === 'completado').length,
}
```

### 3. Lista de Repartos (`/repartos`)

**Archivo:** `src/app/repartos/page.tsx`

**Funcionalidades:**
- **Listado completo** de todos los repartos asignados
- **Filtros avanzados:**
  - Por estado (planificado, en progreso, completado)
  - Búsqueda por ID o fecha
  - Filtros combinables
- **Información detallada** de cada reparto
- **Acciones rápidas** para cada reparto

**Lógica de filtrado:**
```typescript
const repartosFiltrados = useMemo(() => {
  return repartos.filter(reparto => {
    const cumpleFiltroEstado = filtroEstado === 'todos' || reparto.estado === filtroEstado
    const cumpleBusqueda = busqueda === '' || 
      reparto.id.toString().includes(busqueda) ||
      reparto.fecha_reparto.includes(busqueda)
    
    return cumpleFiltroEstado && cumpleBusqueda
  })
}, [repartos, filtroEstado, busqueda])
```

### 4. Generación de Repartos (`/generar-repartos`)

**Archivo:** `src/pages/GenerarRepartos.tsx`

**Funcionalidades:**
- **Configuración del reparto:**
  - Selección de fecha
  - Empresa origen
  - Repartidor asignado
  - Notas adicionales
- **Selección masiva de clientes:**
  - Lista filtrada por empresa
  - Selección individual o múltiple
  - Vista previa de clientes seleccionados
- **Generación automática** de reparto con todas las paradas

**Componentes utilizados:**
- `ConfiguracionReparto`: Formulario de configuración
- `SeleccionClientes`: Lista de clientes seleccionables
- `BotonGeneracion`: Botón con validaciones y estado

**Lógica de generación:**
```typescript
const generarReparto = async () => {
  // 1. Crear reparto principal
  const repartoData = await supabase
    .from('repartos')
    .insert({
      fecha_reparto: fecha,
      repartidor_id: parseInt(repartidorId),
      empresa_asociada_id: parseInt(empresaId),
      estado: 'planificado'
    })

  // 2. Crear parada de inicio (empresa)
  // 3. Crear envíos para cada cliente seleccionado
  // 4. Crear paradas para cada envío
  // 5. Ordenar paradas por secuencia de visita
}
```

### 5. Mapa de Rutas (`/mapa-rutas`)

**Archivo:** `src/app/mapa-rutas/page.tsx`

**Funcionalidades:**
- **Integración completa con Google Maps:**
  - Carga dinámica de Google Maps API
  - Visualización de rutas optimizadas
  - Marcadores para cada parada
- **Selector de repartos** con información detallada
- **Panel de direcciones** paso a paso
- **Lista de paradas** ordenada por secuencia

**Lógica de integración con Google Maps:**
```typescript
// Cargar Google Maps dinámicamente
useEffect(() => {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry,places`
  script.onload = () => setMapLoaded(true)
  document.head.appendChild(script)
}, [])

// Calcular ruta optimizada
const request = {
  origin: origen.envio?.direccion_origen,
  destination: destino.envio?.direccion_destino,
  waypoints: paradasIntermedias.map(parada => ({
    location: parada.envio?.direccion_destino,
    stopover: true
  })),
  optimizeWaypoints: false,
  travelMode: google.maps.TravelMode.DRIVING,
}
```

### 6. Detalle de Reparto (`/reparto/:id`)

**Archivo:** `src/pages/DetalleReparto.tsx`

**Funcionalidades:**
- **Información completa del reparto**
- **Lista detallada de paradas** con estados
- **Mapa interactivo** con Mapbox
- **Gestión de estados** de paradas
- **Navegación GPS** integrada
- **Seguimiento en tiempo real**

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript para desarrollo robusto
- **Vite** para compilación y desarrollo rápido
- **Tailwind CSS** para estilos responsivos
- **shadcn/ui** para componentes de interfaz premium
- **Lucide React** para iconografía consistente
- **React Router DOM** para navegación SPA

### Backend y Base de Datos
- **Supabase** como backend completo (BaaS)
- **PostgreSQL** con Row Level Security
- **Supabase Auth** para autenticación
- **Real-time subscriptions** para actualizaciones en vivo

### Mapas y Geolocalización
- **Google Maps JavaScript API** para rutas y navegación
- **Mapbox GL JS** para mapas interactivos detallados
- **Geolocation API** para ubicación actual
- **Direcciones y geocodificación** automática

### Estado y Datos
- **TanStack Query** para gestión de estado del servidor
- **React Hooks** personalizados para lógica reutilizable
- **Context API** para estado global de autenticación
- **Optimistic Updates** para mejor experiencia de usuario

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js 18+** o superior
- **npm** o **yarn**
- **Cuenta de Supabase** (gratuita)
- **API Key de Google Maps** (opcional para mapas)

### Instalación Paso a Paso

1. **Clonar el repositorio:**
```bash
git clone [url-del-repositorio]
cd sistema-repartos
```

2. **Instalar dependencias:**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
```

4. **Configurar Supabase:**
   - Crear proyecto en [supabase.com](https://supabase.com)
   - Ejecutar migraciones SQL proporcionadas
   - Configurar políticas RLS
   - Activar autenticación por email

5. **Ejecutar en desarrollo:**
```bash
npm run dev
# o
yarn dev
```

### Configuración de Google Maps (Opcional)

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Activar Google Maps JavaScript API
3. Crear API Key con restricciones apropiadas
4. Configurar en variables de entorno

## 📱 Guía de Uso

### Para Repartidores

#### 1. **Iniciar Sesión**
- Acceder con credenciales proporcionadas por administrador
- Sistema carga automáticamente repartos asignados
- Redirección automática al panel principal

#### 2. **Panel Principal**
- **Vista general** de repartos del día
- **Estadísticas rápidas** de progreso
- **Acceso directo** a funcionalidades principales
- **Notificaciones** de estado en tiempo real

#### 3. **Gestionar Repartos**
- **Lista completa** con filtros avanzados
- **Vista detallada** de cada reparto
- **Cambio de estados** (planificado → en progreso → completado)
- **Mapa integrado** con ruta optimizada

#### 4. **Trabajar con Paradas**
- **Próxima parada** destacada automáticamente
- **Navegación GPS** con un clic
- **Actualización de estados** en tiempo real
- **Notas y observaciones** por parada

#### 5. **Visualización de Rutas**
- **Google Maps** con ruta completa
- **Direcciones paso a paso**
- **Paradas ordenadas** por secuencia
- **Información detallada** de cada destino

### Para Administradores

#### 1. **Generación de Repartos**
- **Creación masiva** por empresa
- **Selección múltiple** de clientes
- **Asignación de repartidores**
- **Optimización automática** de rutas

#### 2. **Seguimiento**
- **Monitor en tiempo real** de todos los repartos
- **Estadísticas de rendimiento**
- **Historial completo** de entregas

## 🔧 Hooks Personalizados

### `useAuth` - Gestión de Autenticación
```typescript
// Funcionalidades principales:
- login(email, password): Iniciar sesión
- logout(): Cerrar sesión
- user: Usuario actual
- repartidor: Información del repartidor
- loading: Estado de carga
```

### `useRepartos` - Gestión de Repartos
```typescript
// Funcionalidades principales:
- repartos: Lista de repartos
- obtenerRepartos(): Refrescar datos
- obtenerRepartoPorId(id): Obtener reparto específico
- actualizarEstadoReparto(id, estado): Cambiar estado
- loading, error: Estados de la consulta
```

### `useParadasReparto` - Gestión de Paradas
```typescript
// Funcionalidades principales:
- paradas: Lista de paradas del reparto
- iniciarParada(id): Marcar como en progreso
- completarParada(id): Marcar como completado
- abrirNavegacion(direccion): Abrir Google Maps
```

### `useGenerarRepartosCompleto` - Generación Masiva
```typescript
// Funcionalidades principales:
- Gestión de formulario completo
- Carga de empresas, clientes, repartidores
- Selección múltiple de clientes
- Generación automática de repartos y paradas
```

## 🏗️ Componentes Principales

### Componentes de UI (shadcn/ui)
- **Card, Button, Input, Select**: Componentes base
- **Badge, Alert, Dialog**: Componentes de estado
- **Navigation, Layout**: Componentes de estructura

### Componentes Personalizados

#### `ConfiguracionReparto`
Formulario para configurar parámetros del reparto:
- Fecha, empresa, repartidor, notas
- Validaciones en tiempo real
- Carga dinámica de opciones

#### `SeleccionClientes`
Lista interactiva para seleccionar clientes:
- Filtrado por empresa
- Selección múltiple
- Vista previa de seleccionados

#### `BotonGeneracion`
Botón inteligente para generar repartos:
- Validaciones previas
- Estado de carga
- Confirmación de acción

## 🔒 Seguridad

### Autenticación y Autorización
- **Supabase Auth** con tokens JWT
- **Row Level Security (RLS)** en todas las tablas
- **Políticas granulares** por usuario y recurso
- **Validación de entrada** en todos los formularios

### Protección de Datos
- **HTTPS** obligatorio en producción
- **Sanitización** de inputs del usuario
- **Gestión segura** de tokens y sesiones
- **Logs de auditoría** automáticos

### Políticas RLS Implementadas
```sql
-- Ejemplo: Repartidores solo ven sus repartos
CREATE POLICY "repartidores_own_repartos" 
ON repartos FOR ALL 
USING (repartidor_id = get_current_repartidor_id());
```

## 🐛 Resolución de Problemas

### Errores Comunes

#### "Failed to fetch"
- **Causa**: Configuración incorrecta de Supabase
- **Solución**: Verificar URL y API Key en `.env.local`

#### "Google Maps no carga"
- **Causa**: API Key inválida o sin permisos
- **Solución**: Verificar configuración en Google Cloud Console

#### "Usuario no encontrado"
- **Causa**: Repartidor no asociado al usuario
- **Solución**: Crear registro en tabla `repartidores`

### Debug y Logs
```bash
# Logs detallados en desarrollo
npm run dev -- --debug

# Inspeccionar consultas Supabase
localStorage.setItem('supabase.debug', 'true')
```

## 🚧 Roadmap Futuro

### Versión 2.0 (Próximas Funcionalidades)
- [ ] **Notificaciones push** en tiempo real
- [ ] **Chat integrado** repartidor-cliente
- [ ] **Optimización de rutas con IA**
- [ ] **Analytics avanzados** y reportes
- [ ] **App móvil nativa** (React Native)

### Versión 2.1 (Expansión)
- [ ] **Integración con APIs de terceros** (ERP, facturación)
- [ ] **Gestión de inventario** en tiempo real
- [ ] **Sistema de calificaciones** cliente-repartidor
- [ ] **Planificación automática** de rutas

## 🤝 Contribuir

### Proceso de Contribución

1. **Fork** del repositorio
2. **Crear branch** de feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Realizar cambios** con commits descriptivos
4. **Ejecutar tests** y verificar código:
   ```bash
   npm run test
   npm run lint
   ```
5. **Push** al branch:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
6. **Crear Pull Request** con descripción detallada

### Estándares de Código
- **TypeScript estricto** para type safety
- **ESLint + Prettier** para consistencia
- **Commits convencionales** para historial claro
- **Tests unitarios** para funcionalidades críticas

### Arquitectura de Contribuciones
- **Componentes pequeños** y reutilizables
- **Hooks personalizados** para lógica compleja
- **Separation of concerns** estricta
- **Documentación inline** con JSDoc

## 📞 Soporte y Contacto

### Canales de Soporte
- **Issues GitHub**: Para bugs y feature requests
- **Documentación**: Este README y comentarios en código
- **Email técnico**: soporte.tecnico@empresa.com

### Información del Proyecto
- **Versión actual**: 1.0.0
- **Licencia**: MIT
- **Mantenedores**: Equipo de Desarrollo
- **Última actualización**: Enero 2025

---

**Sistema de Gestión de Repartos** - Optimizando la logística de entregas con tecnología moderna 🚚📦

*Desarrollado con ❤️ usando React, TypeScript, Supabase y Google Maps*
