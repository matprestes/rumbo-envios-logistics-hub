
import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { useParadasReparto } from '@/hooks/useParadasReparto'
import { ParadaCard } from '@/components/ParadaCard'
import { MapaRepartos } from '@/components/MapaRepartos'
import { Reparto } from '@/types/database'
import { ArrowLeft, MapPin, Calendar, User, LogOut, Truck, Navigation, Play, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const DetalleReparto = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const repartoId = id ? parseInt(id) : undefined
  
  const { user, repartidor, cerrarSesion, loading: authLoading } = useAuth()
  const { obtenerRepartoPorId, actualizarEstadoReparto } = useRepartos()
  const { paradas, loading: paradasLoading, iniciarParada, completarParada, abrirNavegacion } = useParadasReparto(repartoId)
  
  const [reparto, setReparto] = useState<Reparto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarReparto = async () => {
      if (!repartoId) {
        setError('ID de reparto inválido')
        setLoading(false)
        return
      }
      
      setLoading(true)
      setError(null)
      
      try {
        const { data, error: fetchError } = await obtenerRepartoPorId(repartoId)
        if (fetchError) {
          setError(fetchError)
          toast.error('Error al cargar el reparto: ' + fetchError)
        } else if (data) {
          setReparto(data)
        } else {
          setError('Reparto no encontrado')
          toast.error('Reparto no encontrado')
        }
      } catch (err) {
        console.error('Error loading reparto:', err)
        setError('Error inesperado al cargar el reparto')
        toast.error('Error inesperado al cargar el reparto')
      } finally {
        setLoading(false)
      }
    }

    if (repartidor?.id && user) {
      cargarReparto()
    }
  }, [repartoId, obtenerRepartoPorId, repartidor?.id, user])

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />
  }

  if (!repartoId) {
    return <Navigate to="/repartos" replace />
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'planificado': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-orange-100 text-orange-800 border-orange-200',
      'completado': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-red-100 text-red-800 border-red-200'
    }
    
    const variant = variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200'
    
    return (
      <Badge variant="outline" className={variant}>
        {estado === 'planificado' && 'Planificado'}
        {estado === 'en_progreso' && 'En Progreso'}
        {estado === 'completado' && 'Completado'}
        {estado === 'cancelado' && 'Cancelado'}
        {!['planificado', 'en_progreso', 'completado', 'cancelado'].includes(estado) && estado}
      </Badge>
    )
  }

  // Encontrar la próxima parada pendiente
  const proximaParada = paradas.find(p => p.estado_parada === 'asignado')
  
  // Función para iniciar el reparto
  const iniciarReparto = async () => {
    if (!reparto || reparto.estado !== 'planificado') return
    
    const resultado = await actualizarEstadoReparto(reparto.id, 'en_progreso')
    if (resultado.success) {
      setReparto(prev => prev ? { ...prev, estado: 'en_progreso' as any } : null)
      toast.success('Reparto iniciado correctamente')
    } else {
      toast.error(resultado.error || 'Error al iniciar el reparto')
    }
  }

  // Función para abrir navegación a la próxima parada
  const navegarAProximaParada = () => {
    if (!proximaParada?.envio) return
    
    abrirNavegacion(
      proximaParada.envio.direccion_destino,
      proximaParada.envio.latitud_destino,
      proximaParada.envio.longitud_destino
    )
  }

  if (authLoading || loading || paradasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando detalle...</span>
        </div>
      </div>
    )
  }

  if (error || !reparto) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/repartos')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="bg-destructive/10 p-2 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Error</h1>
                  <p className="text-sm text-muted-foreground">No se pudo cargar el reparto</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={cerrarSesion}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {error || 'Reparto no encontrado'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Verifique que el ID del reparto sea correcto y que tenga permisos para verlo.
                </p>
                <Button onClick={() => navigate('/repartos')}>
                  Volver a repartos
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/repartos')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Reparto #{reparto.id}</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {repartidor?.nombre || user?.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={cerrarSesion}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Información del Reparto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span>Información del Reparto</span>
              <div className="flex flex-wrap items-center gap-2">
                {getEstadoBadge(reparto.estado)}
                {reparto.estado === 'planificado' && paradas.length > 0 && (
                  <Button onClick={iniciarReparto} size="sm" className="bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Reparto
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Fecha: {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Paradas: {paradas.length}
                </span>
              </div>
            </div>
            {reparto.notas && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{reparto.notas}</p>
              </div>
            )}
            
            {/* Acciones rápidas */}
            {proximaParada && reparto.estado === 'en_progreso' && (
              <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-accent-foreground">Próxima Parada</h4>
                    <p className="text-sm text-accent-foreground/80">
                      {proximaParada.descripcion_parada || `Parada ${proximaParada.orden_visita}`}
                    </p>
                    <p className="text-sm text-accent-foreground/70">
                      {proximaParada.envio?.direccion_destino}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => iniciarParada(proximaParada.id)}
                      size="sm"
                      variant="outline"
                      className="bg-accent/10 border-accent/30 hover:bg-accent/20"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                    <Button
                      onClick={navegarAProximaParada}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navegar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mapa de Ruta */}
        <div>
          <MapaRepartos 
            paradas={paradas} 
            proximaParada={proximaParada}
          />
        </div>

        {/* Lista de Paradas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Paradas del Reparto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paradas.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay paradas asignadas a este reparto</p>
                </div>
              ) : (
                paradas.map((parada) => (
                  <ParadaCard
                    key={parada.id}
                    parada={parada}
                    esProximaParada={proximaParada?.id === parada.id}
                    onIniciar={() => iniciarParada(parada.id)}
                    onCompletar={() => completarParada(parada.id)}
                    onNavegar={() => {
                      if (parada.envio) {
                        abrirNavegacion(
                          parada.envio.direccion_destino,
                          parada.envio.latitud_destino,
                          parada.envio.longitud_destino
                        )
                      }
                    }}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default DetalleReparto
