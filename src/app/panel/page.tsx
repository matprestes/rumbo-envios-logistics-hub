
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Map,
  Users,
  BarChart3
} from 'lucide-react'

export default function PanelPage() {
  const { user, repartidor, logout } = useAuth()
  const { repartos, loading } = useRepartos()

  if (!user || !repartidor) {
    return <Navigate to="/login" replace />
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Repartos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {repartidor.nombre}
              </span>
              <Button variant="outline" onClick={logout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Control
          </h2>
          <p className="text-gray-600">
            Gestiona tus repartos y visualiza el progreso del día
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Planificados</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.planificados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.enProgreso}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.completados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Ver Repartos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gestiona todos tus repartos asignados
              </p>
              <Link to="/repartos">
                <Button className="w-full">Ver Repartos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-600" />
                Generar Repartos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Crea nuevos repartos por lote
              </p>
              <Link to="/generar-repartos">
                <Button className="w-full" variant="outline">Generar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-purple-600" />
                Mapa de Rutas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualiza rutas en Google Maps
              </p>
              <Link to="/mapa-rutas">
                <Button className="w-full" variant="outline">Ver Mapa</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Repartos de Hoy */}
        <Card>
          <CardHeader>
            <CardTitle>Repartos de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Cargando repartos...</p>
            ) : repartosHoy.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No tienes repartos programados para hoy
              </p>
            ) : (
              <div className="space-y-4">
                {repartosHoy.map((reparto) => (
                  <div key={reparto.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Reparto #{reparto.id}</h3>
                        <p className="text-sm text-gray-600">
                          {reparto.paradas?.length || 0} paradas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={
                          reparto.estado === 'completado' ? 'default' :
                          reparto.estado === 'en_progreso' ? 'secondary' : 'outline'
                        }
                      >
                        {reparto.estado.replace('_', ' ')}
                      </Badge>
                      <Link to={`/reparto/${reparto.id}`}>
                        <Button variant="outline" size="sm">Ver Detalles</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
