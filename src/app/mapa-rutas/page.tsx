
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRepartos } from '@/hooks/useRepartos'
import { Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Map, MapPin, Clock, Package, Navigation } from 'lucide-react'

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function MapaRutasPage() {
  const { user, repartidor } = useAuth()
  const { repartos, loading } = useRepartos()
  const [selectedRepartoId, setSelectedRepartoId] = useState<string>('')
  const [map, setMap] = useState<any>(null)
  const [directionsService, setDirectionsService] = useState<any>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  if (!user || !repartidor) {
    return <Navigate to="/login" replace />
  }

  const selectedReparto = repartos.find(r => r.id.toString() === selectedRepartoId)

  // Cargar Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry,places`
      script.async = true
      script.defer = true
      
      window.initMap = () => {
        setMapLoaded(true)
      }
      
      script.onload = window.initMap
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !window.google) return

    const mapElement = document.getElementById('google-map')
    if (!mapElement) return

    const newMap = new window.google.maps.Map(mapElement, {
      center: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires por defecto
      zoom: 12,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    })

    const newDirectionsService = new window.google.maps.DirectionsService()
    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
      draggable: false,
      panel: document.getElementById('directions-panel'),
    })

    newDirectionsRenderer.setMap(newMap)

    setMap(newMap)
    setDirectionsService(newDirectionsService)
    setDirectionsRenderer(newDirectionsRenderer)
  }, [mapLoaded])

  // Mostrar ruta del reparto seleccionado
  useEffect(() => {
    if (!selectedReparto || !directionsService || !directionsRenderer) return

    const paradas = selectedReparto.paradas || []
    if (paradas.length < 2) return

    // Ordenar paradas por orden de visita
    const paradasOrdenadas = [...paradas].sort((a, b) => (a.orden_visita || 0) - (b.orden_visita || 0))

    const origen = paradasOrdenadas[0]
    const destino = paradasOrdenadas[paradasOrdenadas.length - 1]
    const waypoints = paradasOrdenadas.slice(1, -1).map(parada => ({
      location: parada.envio?.direccion_destino || '',
      stopover: true
    }))

    const request = {
      origin: origen.envio?.direccion_origen || origen.envio?.direccion_destino || '',
      destination: destino.envio?.direccion_destino || '',
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }

    directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
      } else {
        console.error('Error calculating route:', status)
      }
    })
  }, [selectedReparto, directionsService, directionsRenderer])

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
              <Map className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Mapa de Rutas
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Visualización de Rutas
          </h2>
          <p className="text-gray-600">
            Selecciona un reparto para ver la ruta optimizada en Google Maps
          </p>
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
                      <Link to={`/reparto/${selectedReparto.id}`}>
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
                {!mapLoaded ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500">Cargando Google Maps...</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Nota: Se requiere una API key válida de Google Maps
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    <div id="google-map" className="w-full h-full rounded-lg"></div>
                    {!selectedRepartoId && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                          <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Selecciona un reparto para ver la ruta</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Panel de Direcciones */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Direcciones de la Ruta</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  id="directions-panel" 
                  className="max-h-48 overflow-y-auto text-sm"
                >
                  {!selectedRepartoId && (
                    <p className="text-gray-500">
                      Las direcciones aparecerán aquí cuando selecciones un reparto
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
