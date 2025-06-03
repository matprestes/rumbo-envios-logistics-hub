
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import type { ParadaReparto } from '@/types/database';

interface MapaRepartosGoogleProps {
  paradas: ParadaReparto[];
  proximaParada?: ParadaReparto;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function MapaRepartosGoogle({ paradas, proximaParada }: MapaRepartosGoogleProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Filtrar paradas que tienen coordenadas válidas
  const paradasConCoordenadas = paradas.filter(
    parada => parada.envio?.latitud_destino && parada.envio?.longitud_destino
  );

  const initializeMap = (apiKey: string) => {
    if (!mapContainer.current || !apiKey || paradasConCoordenadas.length === 0) return;

    setLoading(true);

    try {
      if (window.google) {
        createMap();
      } else {
        loadGoogleMapsScript(apiKey);
      }
    } catch (error) {
      console.error('Error inicializando Google Maps:', error);
      setLoading(false);
    }
  };

  const createMap = () => {
    if (!window.google || !mapContainer.current) return;

    try {
      const firstParada = paradasConCoordenadas[0];
      const newMap = new window.google.maps.Map(mapContainer.current, {
        center: { 
          lat: firstParada.envio!.latitud_destino!, 
          lng: firstParada.envio!.longitud_destino! 
        },
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      // Agregar marcadores para cada parada
      const bounds = new window.google.maps.LatLngBounds();
      
      paradasConCoordenadas.forEach((parada, index) => {
        if (!parada.envio?.latitud_destino || !parada.envio?.longitud_destino) return;

        const isProxima = proximaParada?.id === parada.id;
        const isCompletada = parada.estado_parada === 'completado';

        const position = {
          lat: parada.envio.latitud_destino,
          lng: parada.envio.longitud_destino
        };

        // Crear marcador personalizado
        const marker = new window.google.maps.Marker({
          position: position,
          map: newMap,
          title: parada.descripcion_parada || `Parada ${parada.orden_visita || index + 1}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: isProxima ? '#3b82f6' : isCompletada ? '#10b981' : '#6b7280',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          label: {
            text: (parada.orden_visita || index + 1).toString(),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }
        });

        // Crear ventana de información
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">
                ${parada.descripcion_parada || `Parada ${parada.orden_visita || index + 1}`}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                ${parada.envio.direccion_destino}
              </p>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; 
                  background-color: ${isCompletada ? '#dcfce7' : isProxima ? '#dbeafe' : '#f3f4f6'}; 
                  color: ${isCompletada ? '#166534' : isProxima ? '#1d4ed8' : '#374151'};">
                  ${parada.estado_parada}
                </span>
              </div>
              ${parada.hora_estimada_llegada ? `<p style="margin: 4px 0; font-size: 12px; color: #6b7280;">Estimado: ${parada.hora_estimada_llegada}</p>` : ''}
              ${parada.hora_real_llegada ? `<p style="margin: 4px 0; font-size: 12px; color: #059669;">Real: ${parada.hora_real_llegada}</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(newMap, marker);
        });

        bounds.extend(position);
      });

      // Crear línea de ruta si hay más de una parada
      if (paradasConCoordenadas.length > 1) {
        const routePath = paradasConCoordenadas
          .sort((a, b) => (a.orden_visita || 0) - (b.orden_visita || 0))
          .map(parada => ({
            lat: parada.envio!.latitud_destino!,
            lng: parada.envio!.longitud_destino!
          }));

        new window.google.maps.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: newMap
        });
      }

      // Ajustar vista para mostrar todas las paradas
      if (paradasConCoordenadas.length > 0) {
        newMap.fitBounds(bounds, { padding: 50 });
        
        // Establecer zoom máximo
        const listener = window.google.maps.event.addListener(newMap, 'idle', () => {
          if (newMap.getZoom() > 15) newMap.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }

      setMap(newMap);
      setShowApiKeyInput(false);
      setLoading(false);
    } catch (error) {
      console.error('Error creando el mapa:', error);
      setLoading(false);
    }
  };

  const loadGoogleMapsScript = (apiKey: string) => {
    window.initGoogleMaps = createMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Error cargando Google Maps');
      setLoading(false);
    };
    document.head.appendChild(script);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleMapsApiKey.trim()) {
      initializeMap(googleMapsApiKey.trim());
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (map) {
        // Google Maps will be cleaned up automatically
      }
    };
  }, [map]);

  if (paradasConCoordenadas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No hay paradas con coordenadas válidas para mostrar en el mapa
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showApiKeyInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Mapa de Ruta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Configurar Google Maps</h3>
            <p className="text-sm text-muted-foreground">
              Ingresa tu API key de Google Maps para visualizar las rutas
            </p>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="API Key de Google Maps"
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Obtén tu API key en <a href="https://developers.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
              </p>
            </div>
            <Button type="submit" className="w-full">
              <Navigation className="h-4 w-4 mr-2" />
              Cargar Mapa
            </Button>
          </form>
        </CardContent>
      </Card>
    );
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
  );
}
