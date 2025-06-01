
# Sistema de Gestión de Repartos 🚚

Sistema completo de gestión de entregas y repartos para empresas de logística y delivery. Incluye autenticación de usuarios, gestión de envíos, rutas optimizadas y seguimiento en tiempo real.

## 🌟 Características Principales

### 📱 Panel de Control
- **Dashboard centralizado** con métricas en tiempo real
- **Estadísticas de entrega** (completadas, pendientes, en progreso)
- **Vista general** de repartos del día
- **Acceso rápido** a funcionalidades principales

### 🗺️ Gestión de Repartos
- **Listado completo** de repartos asignados
- **Filtrado por estado** (planificado, en progreso, completado)
- **Vista detallada** de cada reparto con:
  - Información completa del reparto
  - Lista de paradas ordenadas
  - Mapa interactivo con ruta optimizada
  - Estado en tiempo real de cada parada

### 📍 Gestión de Paradas
- **Seguimiento individual** de cada parada
- **Estados dinámicos**: asignado → en progreso → completado
- **Información detallada**:
  - Descripción de la parada
  - Dirección de destino
  - Hora estimada vs real de llegada
  - Notas adicionales
- **Identificación visual** de la próxima parada

### 🗺️ Mapa Interactivo
- **Visualización completa** de todas las paradas
- **Ruta conectada** mostrando el orden de visita
- **Marcadores diferenciados**:
  - 🔵 Próxima parada (animada)
  - 🟢 Paradas completadas
  - ⚪ Paradas pendientes
- **Popups informativos** con detalles de cada parada
- **Integración con Mapbox** para mapas de alta calidad

### 🧭 Navegación GPS
- **Integración con Google Maps** para navegación
- **Detección automática** de ubicación actual
- **Rutas optimizadas** desde ubicación actual a destino
- **Fallback** para navegación sin ubicación actual

### 🔐 Autenticación y Seguridad
- **Autenticación segura** con Supabase Auth
- **Row Level Security (RLS)** para protección de datos
- **Gestión de sesiones** automática
- **Permisos por usuario** - cada repartidor solo ve sus datos

### 📱 Diseño Responsivo
- **Optimizado para móviles** - diseñado para repartidores
- **Interfaz táctil** amigable
- **Carga eficiente** de mapas y datos
- **Acceso offline** básico para funcionalidades críticas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos responsivos
- **shadcn/ui** para componentes de interfaz
- **Lucide React** para iconografía
- **React Router DOM** para navegación

### Backend y Base de Datos
- **Supabase** como backend completo
- **PostgreSQL** con RLS para seguridad
- **Políticas de seguridad** granulares
- **Triggers y validaciones** automáticas

### Mapas y Geolocalización
- **Mapbox GL JS** para mapas interactivos
- **Google Maps** para navegación
- **Geolocation API** para ubicación actual
- **Geocodificación** para direcciones

### Estado y Datos
- **TanStack Query** para gestión de estado servidor
- **React Hooks** personalizados
- **Context API** para estado global
- **Optimistic Updates** para mejor UX

## 📋 Estructura de la Base de Datos

### Tablas Principales

#### `repartidores`
- Información de los repartidores
- Vinculación con autenticación de Supabase
- Estado activo/inactivo

#### `repartos`
- Información de repartos diarios
- Estado: planificado → en_progreso → completado
- Fecha y notas adicionales

#### `paradas_reparto`
- Paradas individuales de cada reparto
- Orden de visita secuencial
- Estados independientes por parada
- Tiempos estimados y reales

#### `envios`
- Información detallada de envíos
- Direcciones de origen y destino
- Coordenadas geográficas
- Datos del destinatario

#### `empresas` y `clientes`
- Gestión de empresas asociadas
- Base de datos de clientes
- Información de contacto y ubicación

### Relaciones
```
repartidores (1) ←→ (N) repartos
repartos (1) ←→ (N) paradas_reparto
paradas_reparto (N) ←→ (1) envios
envios (N) ←→ (1) empresas/clientes
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- Cuenta de Supabase
- Token de Mapbox (opcional, para mapas)

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd sistema-repartos

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Configuración de Supabase
1. Crear proyecto en [Supabase](https://supabase.com)
2. Configurar las variables de entorno:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```
3. Ejecutar migraciones SQL (incluidas en el proyecto)
4. Configurar políticas RLS

### Configuración de Mapbox
1. Crear cuenta en [Mapbox](https://mapbox.com)
2. Obtener token público
3. Configurar en la aplicación (se solicita al usar mapas)

### Ejecutar en Desarrollo
```bash
npm run dev
```

## 📱 Guía de Uso

### Para Repartidores

#### 1. Iniciar Sesión
- Acceder con credenciales proporcionadas
- El sistema carga automáticamente los repartos asignados

#### 2. Ver Repartos
- **Panel principal**: Vista general de repartos del día
- **Lista de repartos**: Todos los repartos con estados
- **Filtros**: Por estado y fecha

#### 3. Gestionar Reparto
- **Clic en reparto** para ver detalles
- **Iniciar reparto** cambia estado a "en progreso"
- **Ver mapa** con todas las paradas y ruta

#### 4. Trabajar con Paradas
- **Próxima parada** destacada automáticamente
- **Iniciar parada** para marcar como en progreso
- **Navegar** abre Google Maps con direcciones
- **Completar parada** al finalizar entrega

#### 5. Navegación GPS
- **Botón "Navegar"** en cada parada
- **Detección automática** de ubicación actual
- **Ruta optimizada** en Google Maps
- **Funciona sin GPS** usando solo dirección destino

### Para Administradores

#### 1. Gestión de Repartos
- Crear repartos diarios
- Asignar repartidores
- Planificar rutas óptimas

#### 2. Seguimiento en Tiempo Real
- Monitor de estado de todos los repartos
- Estadísticas de rendimiento
- Historial completo de entregas

## 🔧 Funcionalidades Técnicas

### Seguridad
- **Row Level Security**: Cada usuario solo accede a sus datos
- **Validación de entrada**: Sanitización de todos los inputs
- **Gestión de sesiones**: Logout automático por inactividad
- **Autorización granular**: Permisos específicos por funcionalidad

### Performance
- **Lazy loading**: Carga bajo demanda de componentes
- **Query optimization**: Consultas eficientes con índices
- **Caching**: Almacenamiento temporal de datos frecuentes
- **Optimistic updates**: Interfaz responsiva sin esperas

### Responsive Design
- **Mobile-first**: Diseñado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Touch-friendly**: Botones y controles optimizados para táctil
- **Orientación**: Funciona en portrait y landscape

### Offline Capabilities
- **Service Worker**: Caché básico de recursos
- **Local Storage**: Datos críticos disponibles offline
- **Sync**: Sincronización automática al recuperar conexión

## 🐛 Resolución de Problemas

### Errores Comunes

#### "Failed to fetch"
- **Causa**: Problemas de conexión o configuración de Supabase
- **Solución**: Verificar variables de entorno y conectividad

#### "Token de Mapbox inválido"
- **Causa**: Token no configurado o expirado
- **Solución**: Obtener nuevo token en Mapbox.com

#### "Reparto no encontrado"
- **Causa**: Permisos o reparto inexistente
- **Solución**: Verificar asignación de repartidor

#### Mapa no carga
- **Causa**: Token Mapbox o coordenadas inválidas
- **Solución**: Verificar token y datos de ubicación

### Debug
```bash
# Logs detallados
npm run dev -- --debug

# Limpiar caché
npm run build:clean
```

## 🚧 Roadmap

### Versión 2.0
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Optimización de rutas IA
- [ ] Análiticas avanzadas

### Versión 2.1
- [ ] App móvil nativa
- [ ] Integración con APIs de terceros
- [ ] Gestión de inventario
- [ ] Facturación automática

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork del proyecto
2. Crear branch de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- **Issues**: [GitHub Issues](./issues)
- **Documentación**: Este README
- **Email**: soporte@empresa.com

---

**Sistema de Gestión de Repartos** - Optimizando la logística de entregas 🚚📦
