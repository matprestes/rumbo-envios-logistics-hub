
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ParadaReparto } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MapaRepartosProps {
  paradas: ParadaReparto[]
  proximaParada?: ParadaReparto
}

export const MapaRepartos = ({ paradas, proximaParada }: MapaRepartosProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapboxToken, setMapboxToken] = useState('')
  const [isTokenValid, setIsTokenValid] = useState(false)

  // Filtrar paradas que tienen coordenadas válidas
  const paradasConCoordenadas = paradas.filter(
    parada => parada.envio?.latitud_destino && parada.envio?.longitud_destino
  )

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || paradasConCoordenadas.length === 0) return

    try {
      mapboxgl.accessToken = mapboxToken
      setIsTokenValid(true)

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
            w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
            ${isProxima ? 'bg-blue-500 border-blue-700 text-white animate-pulse' : 
              isCompletada ? 'bg-green-500 border-green-700 text-white' : 
              'bg-gray-500 border-gray-700 text-white'}
          `
          markerElement.textContent = (parada.orden_visita || index + 1).toString()

          // Crear popup con información de la parada
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${parada.descripcion_parada || `Parada ${parada.orden_visita || index + 1}`}</h3>
                <p class="text-sm text-gray-600">${parada.envio.direccion_destino}</p>
                <p class="text-sm ${isCompletada ? 'text-green-600' : isProxima ? 'text-blue-600' : 'text-gray-600'}">
                  Estado: ${parada.estado_parada}
                </p>
                ${parada.hora_estimada_llegada ? `<p class="text-sm">Estimado: ${parada.hora_estimada_llegada}</p>` : ''}
                ${parada.hora_real_llegada ? `<p class="text-sm">Real: ${parada.hora_real_llegada}</p>` : ''}
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
              'line-color': '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.7
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
          map.current.fitBounds(bounds, { padding: 50 })
        }
      })

    } catch (error) {
      console.error('Error inicializando el mapa:', error)
      setIsTokenValid(false)
    }

    return () => {
      map.current?.remove()
    }
  }, [mapboxToken, paradasConCoordenadas, proximaParada])

  if (paradasConCoordenadas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay paradas con coordenadas válidas para mostrar en el mapa</p>
        </CardContent>
      </Card>
    )
  }

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Ruta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token">Token de Mapbox</Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="Ingresa tu token público de Mapbox"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Obtén tu token en{' '}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Token de Mapbox inválido. Por favor verifica tu token.</p>
          <button
            onClick={() => setMapboxToken('')}
            className="mt-2 text-blue-600 hover:underline"
          >
            Cambiar token
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mapa de Ruta</span>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Próxima</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Pendiente</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg"
          style={{ minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  )
}
