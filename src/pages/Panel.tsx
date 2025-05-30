
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useEntregas } from '@/hooks/useEntregas'
import { Package, MapPin, User, LogOut, Clock, CheckCircle, Truck } from 'lucide-react'

const Panel = () => {
  const { user, repartidor, cerrarSesion, loading: authLoading } = useAuth()
  const { entregas, loading: entregasLoading, actualizarEstado, marcarComoCompletada } = useEntregas()
  const [selectedTab, setSelectedTab] = useState('todas')

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />
  }

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const stats = {
    completadas: entregas.filter(e => e.estado === 'completada').length,
    pendientes: entregas.filter(e => e.estado === 'pendiente_asignacion').length,
    enProgreso: entregas.filter(e => e.estado === 'en_progreso').length,
  }

  const filteredEntregas = selectedTab === 'todas' 
    ? entregas 
    : entregas.filter(e => {
        if (selectedTab === 'activas') return e.estado !== 'completada'
        return e.estado === selectedTab
      })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente_asignacion':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendiente</Badge>
      case 'en_progreso':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En Progreso</Badge>
      case 'completada':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (authLoading || entregasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando panel...</span>
        </div>
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
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rumbo Envíos</h1>
                <p className="text-sm text-gray-600">{today}</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completadas Hoy</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">En Progreso</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.enProgreso}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendientes}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mis Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'activas', label: 'Activas' },
                { key: 'pendiente_asignacion', label: 'Pendientes' },
                { key: 'en_progreso', label: 'En Progreso' },
                { key: 'completada', label: 'Completadas' }
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={selectedTab === tab.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTab(tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Entregas */}
        <div className="space-y-4">
          {filteredEntregas.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  No hay entregas {selectedTab === 'todas' ? '' : selectedTab}
                </h3>
                <p className="text-gray-400">
                  {selectedTab === 'todas' 
                    ? 'Aún no tienes entregas asignadas para hoy'
                    : `No tienes entregas ${selectedTab} en este momento`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntregas.map((entrega) => (
              <Card key={entrega.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Cliente: {entrega.cliente?.nombre} {entrega.cliente?.apellido}
                        </h3>
                        {getEstadoBadge(entrega.estado)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{entrega.direccion_destino}</span>
                      </div>
                      {entrega.cliente?.telefono && (
                        <p className="text-sm text-gray-500">
                          Tel: {entrega.cliente.telefono}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {entrega.estado !== 'completada' && (
                    <div className="flex gap-2 mt-4">
                      {entrega.estado === 'pendiente_asignacion' && (
                        <Button
                          size="sm"
                          onClick={() => actualizarEstado(entrega.id, 'en_progreso')}
                        >
                          Iniciar Entrega
                        </Button>
                      )}
                      {entrega.estado === 'en_progreso' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => marcarComoCompletada(entrega.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Completada
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Panel
