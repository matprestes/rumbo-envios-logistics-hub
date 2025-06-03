
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Reparto } from '@/types/database';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface MapaRutasInteractivoProps {
  repartos: Reparto[];
  loading: boolean;
}

export function MapaRutasInteractivo({ repartos, loading }: MapaRutasInteractivoProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [map, setMap] = useState<any>(null);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      // Importar mapbox dinámicamente
      const mapboxgl = await import('mapbox-gl');
      mapboxgl.default.accessToken = token;

      const newMap = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-58.3816, -34.6037], // Buenos Aires como centro por defecto
        zoom: 10,
      });

      // Agregar controles de navegación
      newMap.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Agregar marcadores para cada reparto
      repartos.forEach((reparto) => {
        if (reparto.paradas) {
          reparto.paradas.forEach((parada) => {
            if (parada.envio?.latitud_destino && parada.envio?.longitud_destino) {
              const marker = new mapboxgl.default.Marker({
                color: getMarkerColor(reparto.estado)
              })
                .setLngLat([parada.envio.longitud_destino, parada.envio.latitud_destino])
                .setPopup(
                  new mapboxgl.default.Popup()
                    .setHTML(`
                      <div class="p-2">
                        <h3 class="font-semibold">Reparto #${reparto.id}</h3>
                        <p class="text-sm">Parada ${parada.orden_visita}</p>
                        <p class="text-xs">${parada.envio.direccion_destino}</p>
                        <p class="text-xs">Estado: ${reparto.estado}</p>
                      </div>
                    `)
                )
                .addTo(newMap);
            }
          });
        }
      });

      setMap(newMap);
      setShowTokenInput(false);

      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Error inicializando mapa:', error);
    }
  };

  const getMarkerColor = (estado: string) => {
    switch (estado) {
      case 'planificado': return '#3b82f6'; // blue
      case 'en_progreso': return '#f59e0b'; // orange
      case 'completado': return '#10b981'; // green
      case 'cancelado': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    if (map && repartos.length > 0) {
      // Actualizar marcadores cuando cambien los repartos
      // (implementación simplificada, en producción sería más complejo)
    }
  }, [repartos, map]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando repartos...</span>
        </div>
      </div>
    );
  }

  if (showTokenInput) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Configurar Google Maps</h3>
              <p className="text-sm text-muted-foreground">
                Ingresa tu token de Mapbox para visualizar las rutas
              </p>
            </div>
            
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Token de Mapbox"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Obtén tu token en <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
                </p>
              </div>
              <Button type="submit" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Cargar Mapa
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (repartos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay repartos para mostrar
          </h3>
          <p className="text-muted-foreground">
            Selecciona una fecha diferente o verifica los filtros aplicados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Leyenda */}
      <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-lg border z-10">
        <h4 className="text-sm font-semibold mb-2">Leyenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Planificado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>En Progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
