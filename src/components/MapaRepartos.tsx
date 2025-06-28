
import React from 'react'
import { ParadaReparto } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface MapaRepartosProps {
  paradas: ParadaReparto[]
  proximaParada?: ParadaReparto
}

export const MapaRepartos = ({ paradas, proximaParada }: MapaRepartosProps) => {
  // Filtrar paradas que tienen coordenadas válidas
  const paradasConCoordenadas = paradas.filter(
    parada => parada.envio?.latitud_destino && parada.envio?.longitud_destino
  )

  if (paradasConCoordenadas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay paradas con coordenadas válidas para mostrar en el mapa</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Mapa de Ruta</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span>Próxima</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span>Pendiente</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="w-full h-80 sm:h-96 rounded-lg border border-border bg-muted/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Mapa no disponible</p>
              <p className="text-sm text-muted-foreground/70">Configure Google Maps para ver la ruta</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
