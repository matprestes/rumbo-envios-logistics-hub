
import { useState } from 'react';
import { useRepartos } from '@/hooks/useRepartos';
import { MapaRutasInteractivo } from '@/components/mapas/MapaRutasInteractivo';
import { FiltrosMapaRutas } from '@/components/mapas/FiltrosMapaRutas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Route } from 'lucide-react';

export default function MapaRutasPage() {
  const { repartos, loading } = useRepartos();
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');

  const repartosFiltrados = repartos.filter(reparto => {
    const cumpleFecha = reparto.fecha_reparto === fechaSeleccionada;
    const cumpleEstado = estadoFiltro === 'todos' || reparto.estado === estadoFiltro;
    return cumpleFecha && cumpleEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Map className="h-8 w-8 text-primary" />
          Mapa de Rutas
        </h1>
        <p className="text-muted-foreground">
          Visualiza y optimiza las rutas de reparto en Google Maps
        </p>
      </div>

      {/* Filtros */}
      <FiltrosMapaRutas
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        totalRepartos={repartosFiltrados.length}
      />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Repartos</p>
                <p className="text-2xl font-bold">{repartosFiltrados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Planificados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {repartosFiltrados.filter(r => r.estado === 'planificado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-orange-600">
                  {repartosFiltrados.filter(r => r.estado === 'en_progreso').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {repartosFiltrados.filter(r => r.estado === 'completado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Visualización de Rutas - {new Date(fechaSeleccionada).toLocaleDateString('es-AR')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <MapaRutasInteractivo 
              repartos={repartosFiltrados}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
