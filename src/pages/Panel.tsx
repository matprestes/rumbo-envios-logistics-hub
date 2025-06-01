
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useEntregas } from '@/hooks/useEntregas'
import { useRepartos } from '@/hooks/useRepartos'
import { Package, MapPin, User, LogOut, Clock, CheckCircle, Truck, Route, TrendingUp } from 'lucide-react'

const Panel = () => {
  const navigate = useNavigate()
  const { user, repartidor, cerrarSesion, loading: authLoading } = useAuth()
  const { entregas, loading: entregasLoading, actualizarEstado, marcarComoCompletada } = useEntregas()
  const { repartos, loading: repartosLoading } = useRepartos()
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
    repartosActivos: repartos.filter(r => r.estado === 'en_progreso' || r.estado === 'planificado').length,
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

  if (authLoading || entregasLoading || repartosLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando panel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Rumbo Envíos</h1>
                <p className="text-sm text-muted-foreground">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ¡Bienvenido, {repartidor?.nombre || 'Repartidor'}!
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus entregas y repartos desde el panel de control
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Completadas Hoy</p>
                  <p className="text-3xl font-bold text-green-700">{stats.completadas}</p>
                  <p className="text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12% vs ayer
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">En Progreso</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.enProgreso}</p>
                  <p className="text-xs text-blue-600 mt-1">Entregas activas</p>
                </div>
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-700">{stats.pendientes}</p>
                  <p className="text-xs text-orange-600 mt-1">Por asignar</p>
                </div>
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Repartos Activos</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.repartosActivos}</p>
                  <p className="text-xs text-purple-600 mt-1">Rutas planificadas</p>
                </div>
                <Route className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary group" 
            onClick={() => navigate('/repartos')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Route className="h-12 w-12 text-primary mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Mis Repartos</h3>
              <p className="text-muted-foreground mb-4">
                Gestiona las rutas y paradas asignadas para hoy
              </p>
              <Button className="w-full">
                Ver Repartos
                <Route className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-accent group">
            <CardContent className="p-8 text-center">
              <div className="bg-accent/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Package className="h-12 w-12 text-accent mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Entregas del Día</h3>
              <p className="text-muted-foreground mb-4">
                Revisa y gestiona las entregas individuales
              </p>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Ver Entregas
                <Package className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Entregas Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mis Entregas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'todas', label: 'Todas', count: entregas.length },
                { key: 'activas', label: 'Activas', count: entregas.filter(e => e.estado !== 'completada').length },
                { key: 'pendiente_asignacion', label: 'Pendientes', count: stats.pendientes },
                { key: 'en_progreso', label: 'En Progreso', count: stats.enProgreso },
                { key: 'completada', label: 'Completadas', count: stats.completadas }
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={selectedTab === tab.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTab(tab.key)}
                  className="relative"
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {tab.count}
                    </Badge>
                  )}
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
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No hay entregas {selectedTab === 'todas' ? '' : selectedTab}
                </h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'todas' 
                    ? 'Aún no tienes entregas asignadas para hoy'
                    : `No tienes entregas ${selectedTab} en este momento`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntregas.slice(0, 5).map((entrega) => (
              <Card key={entrega.id} className="hover:shadow-md transition-shadow border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          Cliente: {entrega.cliente?.nombre} {entrega.cliente?.apellido}
                        </h3>
                        {getEstadoBadge(entrega.estado)}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{entrega.direccion_destino}</span>
                      </div>
                      {entrega.cliente?.telefono && (
                        <p className="text-sm text-muted-foreground">
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
          
          {filteredEntregas.length > 5 && (
            <Card className="text-center py-6 bg-muted/30">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Mostrando 5 de {filteredEntregas.length} entregas
                </p>
                <Button variant="outline" size="sm">
                  Ver todas las entregas
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default Panel
