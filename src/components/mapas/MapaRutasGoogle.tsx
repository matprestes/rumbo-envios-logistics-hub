
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import type { Reparto } from '@/types/database';

interface MapaRutasGoogleProps {
  reparto: Reparto;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function MapaRutasGoogle({ reparto }: MapaRutasGoogleProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);

  const initializeMap = (apiKey: string) => {
    if (!mapContainer.current || !apiKey || !window.google) return;

    try {
      const newMap = new window.google.maps.Map(mapContainer.current, {
        center: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      const newDirectionsService = new window.google.maps.DirectionsService();
      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        draggable: false,
        suppressMarkers: false,
      });

      newDirectionsRenderer.setMap(newMap);

      setMap(newMap);
      setDirectionsService(newDirectionsService);
      setDirectionsRenderer(newDirectionsRenderer);
      setShowApiKeyInput(false);

      // Calculate route if reparto has paradas
      if (reparto.paradas && reparto.paradas.length >= 2) {
        calculateRoute(newDirectionsService, newDirectionsRenderer, reparto);
      }
    } catch (error) {
      console.error('Error inicializando Google Maps:', error);
    }
  };

  const calculateRoute = (directionsService: any, directionsRenderer: any, reparto: Reparto) => {
    const paradas = reparto.paradas || [];
    if (paradas.length < 2) return;

    const paradasOrdenadas = [...paradas].sort((a, b) => (a.orden_visita || 0) - (b.orden_visita || 0));
    
    const origin = paradasOrdenadas[0];
    const destination = paradasOrdenadas[paradasOrdenadas.length - 1];
    const waypoints = paradasOrdenadas.slice(1, -1).map(parada => ({
      location: parada.envio?.direccion_destino || '',
      stopover: true
    }));

    const request = {
      origin: origin.envio?.direccion_origen || origin.envio?.direccion_destino || '',
      destination: destination.envio?.direccion_destino || '',
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Error calculating route:', status);
      }
    });
  };

  const loadGoogleMaps = (apiKey: string) => {
    if (window.google) {
      initializeMap(apiKey);
      return;
    }

    window.initGoogleMaps = () => {
      initializeMap(apiKey);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleMapsApiKey.trim()) {
      loadGoogleMaps(googleMapsApiKey.trim());
    }
  };

  useEffect(() => {
    if (map && directionsService && directionsRenderer && reparto.paradas) {
      calculateRoute(directionsService, directionsRenderer, reparto);
    }
  }, [reparto, map, directionsService, directionsRenderer]);

  if (showApiKeyInput) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
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
      </div>
    );
  }

  if (!reparto.paradas || reparto.paradas.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay paradas para mostrar
          </h3>
          <p className="text-muted-foreground">
            Este reparto no tiene paradas configuradas
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
        <h4 className="text-sm font-semibold mb-2">Ruta del Reparto #{reparto.id}</h4>
        <div className="space-y-1 text-xs">
          <p className="text-muted-foreground">
            {reparto.paradas?.length || 0} paradas programadas
          </p>
          <p className="text-muted-foreground">
            Estado: <span className="font-medium">{reparto.estado}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
