
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ParadaReparto } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, MapPin } from 'lucide-react'

interface MapaRepartosProps {
  paradas: ParadaReparto[]
  proximaParada?: ParadaReparto
}

export const MapaRepartos = ({ paradas, proximaParada }: MapaRepartosProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapboxToken, setMapboxToken] = useState('')
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filtrar paradas que tienen coordenadas válidas
  const paradasConCoordenadas = paradas.filter(
    parada => parada.envio?.latitud_destino && parada.envio?.longitud_destino
  )

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || paradasConCoordenadas.length === 0) return

    setLoading(true)
    
    try {
      mapboxgl.accessToken = mapboxToken
      setIsTokenValid(true)

      // Limpiar mapa anterior si existe
      if (map.current) {
        map.current.remove()
      }

      // Inicializar el mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [
          paradasConCoordenadas[0].envio!.longitud_destino!,
          paradasConCoordenadas[0].envio!.latitud_destino!
        ],
        zoom: 12
      })

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.current.on('load', () => {
        if (!map.current) return

        // Agregar marcadores para cada parada
        paradasConCoordenadas.forEach((parada, index) => {
          if (!parada.envio?.latitud_destino || !parada.envio?.longitud_destino) return

          const isProxima = proximaParada?.id === parada.id
          const isCompletada = parada.estado_parada === 'completado'

          // Crear elemento del marcador
          const markerElement = document.createElement('div')
          markerElement.className = `
            w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer
            ${isProxima ? 'bg-primary border-primary text-primary-foreground animate-pulse shadow-lg' : 
              isCompletada ? 'bg-green-500 border-green-600 text-white shadow-md' : 
              'bg-muted border-border text-muted-foreground shadow-sm hover:shadow-md'}
            transition-all duration-200
          `
          markerElement.textContent = (parada.orden_visita || index + 1).toString()

          // Crear popup con información de la parada
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            className: 'mapbox-popup-custom'
          }).setHTML(`
            <div class="p-3 min-w-[250px]">
              <h3 class="font-semibold text-foreground mb-2">${parada.descripcion_parada || `Parada ${parada.orden_visita || index + 1}`}</h3>
              <p class="text-sm text-muted-foreground mb-2">${parada.envio.direccion_destino}</p>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs px-2 py-1 rounded-full ${
                  isCompletada ? 'bg-green-100 text-green-800' : 
                  isProxima ? 'bg-primary/10 text-primary' : 
                  'bg-muted text-muted-foreground'
                }">
                  ${parada.estado_parada}
                </span>
              </div>
              ${parada.hora_estimada_llegada ? `<p class="text-xs text-muted-foreground">Estimado: ${parada.hora_estimada_llegada}</p>` : ''}
              ${parada.hora_real_llegada ? `<p class="text-xs text-green-600">Real: ${parada.hora_real_llegada}</p>` : ''}
            </div>
          `)

          // Agregar marcador al mapa
          new mapboxgl.Marker(markerElement)
            .setLngLat([parada.envio.longitud_destino, parada.envio.latitud_destino])
            .setPopup(popup)
            .addTo(map.current!)
        })

        // Crear línea de ruta si hay más de una parada
        if (paradasConCoordenadas.length > 1) {
          const coordinates = paradasConCoordenadas
            .sort((a, b) => (a.orden_visita || 0) - (b.orden_visita || 0))
            .map(parada => [
              parada.envio!.longitud_destino!,
              parada.envio!.latitud_destino!
            ])

          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates
              }
            }
          })

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'hsl(var(--primary))',
              'line-width': 3,
              'line-opacity': 0.8
            }
          })
        }

        // Ajustar vista para mostrar todas las paradas
        if (paradasConCoordenadas.length > 0) {
          const bounds = new mapboxgl.LngLatBounds()
          paradasConCoordenadas.forEach(parada => {
            bounds.extend([
              parada.envio!.longitud_destino!,
              parada.envio!.latitud_destino!
            ])
          })
          map.current.fitBounds(bounds, { 
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 15
          })
        }

        setLoading(false)
      })

      map.current.on('error', (e) => {
        console.error('Error del mapa:', e)
        setIsTokenValid(false)
        setLoading(false)
      })

    } catch (error) {
      console.error('Error inicializando el mapa:', error)
      setIsTokenValid(false)
      setLoading(false)
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [mapboxToken, paradasConCoordenadas, proximaParada])

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

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Token de Mapbox</Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="Ingresa tu token público de Mapbox"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Obtén tu token en{' '}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isTokenValid) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <div>
            <p className="text-destructive font-medium">Token de Mapbox inválido</p>
            <p className="text-sm text-muted-foreground">Por favor verifica tu token.</p>
          </div>
          <Button
            onClick={() => setMapboxToken('')}
            variant="outline"
            size="sm"
          >
            Cambiar token
          </Button>
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
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Cargando mapa...</span>
              </div>
            </div>
          )}
          <div
            ref={mapContainer}
            className="w-full h-80 sm:h-96 rounded-lg border border-border"
          />
        </div>
      </CardContent>
    </Card>
  )
}
