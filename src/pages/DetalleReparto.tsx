
import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { useParadasReparto } from '@/hooks/useParadasReparto'
import { ParadaCard } from '@/components/ParadaCard'
import { Reparto } from '@/types/database'
import { ArrowLeft, MapPin, Calendar, User, LogOut, Truck } from 'lucide-react'

const DetalleReparto = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const repartoId = id ? parseInt(id) : undefined
  
  const { user, repartidor, cerrarSesion, loading: authLoading } = useAuth()
  const { obtenerRepartoPorId } = useRepartos()
  const { paradas, loading: paradasLoading, iniciarParada, completarParada, abrirNavegacion } = useParadasReparto(repartoId)
  
  const [reparto, setReparto] = useState<Reparto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarReparto = async () => {
      if (!repartoId) return
      
      setLoading(true)
      const { data, error } = await obtenerRepartoPorId(repartoId)
      if (!error && data) {
        setReparto(data)
      }
      setLoading(false)
    }

    cargarReparto()
  }, [repartoId, obtenerRepartoPorId])

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />
  }

  if (!repartoId) {
    return <Navigate to="/repartos" replace />
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'planificado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planificado</Badge>
      case 'en_progreso':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En Progreso</Badge>
      case 'completado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  // Encontrar la próxima parada pendiente
  const proximaParada = paradas.find(p => p.estado_parada === 'asignado')

  if (authLoading || loading || paradasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando detalle...</span>
        </div>
      </div>
    )
  }

  if (!reparto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              Reparto no encontrado
            </h3>
            <Button onClick={() => navigate('/repartos')}>
              Volver a repartos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/repartos')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reparto #{reparto.id}</h1>
                <p className="text-sm text-gray-600">
                  {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {repartidor?.nombre || user?.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={cerrarSesion}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Información del Reparto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Información del Reparto</span>
              {getEstadoBadge(reparto.estado)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Fecha: {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Paradas: {paradas.length}
                </span>
              </div>
            </div>
            {reparto.notas && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{reparto.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Paradas */}
        <Card className="mb-6">
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
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No hay paradas asignadas a este reparto</p>
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
