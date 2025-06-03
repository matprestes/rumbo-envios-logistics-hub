
'use client';

import { useState } from 'react';
import { useRepartos } from '@/hooks/useRepartos';
import { MapaRutasGoogle } from '@/components/mapas/MapaRutasGoogle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, MapPin, Clock, Package, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function MapaRutasPage() {
  const { repartos, loading } = useRepartos();
  const [selectedRepartoId, setSelectedRepartoId] = useState<string>('');

  const selectedReparto = repartos.find(r => r.id.toString() === selectedRepartoId);

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado': return 'default';
      case 'en_progreso': return 'secondary';
      case 'planificado': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/panel">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mapa de Rutas
          </h1>
          <p className="text-muted-foreground">
            Visualiza las rutas de tus repartos en Google Maps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de Control */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Seleccionar Reparto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedRepartoId} onValueChange={setSelectedRepartoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un reparto" />
                </SelectTrigger>
                <SelectContent>
                  {repartos.map((reparto) => (
                    <SelectItem key={reparto.id} value={reparto.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>Reparto #{reparto.id}</span>
                        <Badge 
                          variant={getEstadoBadgeVariant(reparto.estado)}
                          className="ml-2"
                        >
                          {reparto.estado}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedReparto && (
                <div className="space-y-3">
                  <div className="border-t pt-3">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Información del Reparto
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{new Date(selectedReparto.fecha_reparto).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedReparto.paradas?.length || 0} paradas</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <Badge variant={getEstadoBadgeVariant(selectedReparto.estado)}>
                          {selectedReparto.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedReparto.notas && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium text-gray-900 mb-1">Notas:</h4>
                      <p className="text-sm text-gray-600">{selectedReparto.notas}</p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <Link href={`/repartos/${selectedReparto.id}`}>
                      <Button className="w-full" variant="outline">
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Paradas */}
          {selectedReparto && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Paradas del Reparto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedReparto.paradas
                    ?.sort((a, b) => (a.orden_visita || 0) - (b.orden_visita || 0))
                    ?.map((parada, index) => (
                      <div key={parada.id} className="flex items-center text-xs">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-blue-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{parada.descripcion_parada}</p>
                          <p className="text-gray-500 truncate">
                            {parada.envio?.direccion_destino}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mapa */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              {selectedReparto ? (
                <MapaRutasGoogle reparto={selectedReparto} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Selecciona un reparto para ver la ruta</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
