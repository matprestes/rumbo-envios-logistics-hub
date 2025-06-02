
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'
import { useState, useMemo } from 'react'

export default function RepartosPage() {
  const { user, repartidor } = useAuth()
  const { repartos, loading } = useRepartos()
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')

  if (!user || !repartidor) {
    return <Navigate to="/login" replace />
  }

  const repartosFiltrados = useMemo(() => {
    return repartos.filter(reparto => {
      const cumpleFiltroEstado = filtroEstado === 'todos' || reparto.estado === filtroEstado
      const cumpleBusqueda = busqueda === '' || 
        reparto.id.toString().includes(busqueda) ||
        reparto.fecha_reparto.includes(busqueda)
      
      return cumpleFiltroEstado && cumpleBusqueda
    })
  }, [repartos, filtroEstado, busqueda])

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado': return 'default'
      case 'en_progreso': return 'secondary'
      case 'planificado': return 'outline'
      default: return 'destructive'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/panel" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Mis Repartos
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Repartos
          </h2>
          <p className="text-gray-600">
            Administra todos tus repartos asignados
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por ID o fecha..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="planificado">Planificado</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Repartos */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando repartos...</p>
            </CardContent>
          </Card>
        ) : repartosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron repartos
              </h3>
              <p className="text-gray-500">
                {repartos.length === 0 
                  ? 'No tienes repartos asignados aún.'
                  : 'No hay repartos que coincidan con los filtros aplicados.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {repartosFiltrados.map((reparto) => (
              <Card key={reparto.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Reparto #{reparto.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(reparto.fecha_reparto).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {reparto.paradas?.length || 0} paradas
                          </div>
                        </div>
                        {reparto.notas && (
                          <p className="text-sm text-gray-500 mt-2">
                            {reparto.notas}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={getEstadoBadgeVariant(reparto.estado)}>
                        {reparto.estado.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Link to={`/reparto/${reparto.id}`}>
                        <Button>Ver Detalles</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
