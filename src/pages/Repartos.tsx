
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { RepartoCard } from '@/components/RepartoCard'
import { Truck, ArrowLeft, User, LogOut } from 'lucide-react'

const Repartos = () => {
  const navigate = useNavigate()
  const { user, repartidor, cerrarSesion, loading: authLoading } = useAuth()
  const { repartos, loading: repartosLoading } = useRepartos()

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />
  }

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (authLoading || repartosLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando repartos...</span>
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/panel')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mis Repartos</h1>
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
        {/* Lista de Repartos */}
        <div className="space-y-4">
          {repartos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Truck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  No hay repartos asignados
                </h3>
                <p className="text-gray-400">
                  Aún no tienes repartos asignados para esta fecha
                </p>
              </CardContent>
            </Card>
          ) : (
            repartos.map((reparto) => (
              <RepartoCard
                key={reparto.id}
                reparto={reparto}
                onClick={() => navigate(`/reparto/${reparto.id}`)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Repartos
