
'use client';

import { useEffect, useRef, useState } from 'react';
import { Reparto } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin } from 'lucide-react';

interface MapaRutasGoogleProps {
  repartos: Reparto[];
  loading: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function MapaRutasGoogle({ repartos, loading }: MapaRutasGoogleProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        setError('API Key de Google Maps no configurada');
        return;
      }

      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setError('Error al cargar Google Maps');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires por defecto
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!map || !isMapLoaded || loading) return;

    // Limpiar marcadores anteriores
    // (En una implementación completa, mantendríamos referencia a los marcadores)

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidCoordinates = false;

    const coloresPorEstado = {
      'planificado': '#3B82F6',
      'en_progreso': '#F59E0B', 
      'completado': '#10B981',
      'cancelado': '#EF4444'
    };

    repartos.forEach((reparto, index) => {
      if (!reparto.paradas) return;

      reparto.paradas.forEach((parada) => {
        if (!parada.envio?.latitud_destino || !parada.envio?.longitud_destino) return;

        hasValidCoordinates = true;
        const position = {
          lat: parada.envio.latitud_destino,
          lng: parada.envio.longitud_destino
        };

        bounds.extend(position);

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: `Reparto #${reparto.id} - Parada ${parada.orden_visita || 1}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: coloresPorEstado[reparto.estado as keyof typeof coloresPorEstado] || '#6B7280',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3">
              <h3 class="font-semibold text-lg mb-2">Reparto #${reparto.id}</h3>
              <p class="text-sm text-gray-600 mb-1">Parada ${parada.orden_visita || 1}</p>
              <p class="text-sm mb-2">${parada.envio.direccion_destino}</p>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded text-xs" style="background-color: ${coloresPorEstado[reparto.estado as keyof typeof coloresPorEstado] || '#6B7280'}; color: white;">
                  ${reparto.estado?.toUpperCase()}
                </span>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    });

    if (hasValidCoordinates) {
      map.fitBounds(bounds);
      // Evitar zoom excesivo para un solo punto
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, isMapLoaded, repartos, loading]);

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar el mapa</h3>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Inicializando mapa...</p>
          </div>
        </div>
      )}

      {/* Leyenda */}
      {isMapLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold mb-3">Estados de Reparto</h4>
          <div className="space-y-2">
            {[
              { estado: 'planificado', color: '#3B82F6', label: 'Planificado' },
              { estado: 'en_progreso', color: '#F59E0B', label: 'En Progreso' },
              { estado: 'completado', color: '#10B981', label: 'Completado' },
              { estado: 'cancelado', color: '#EF4444', label: 'Cancelado' }
            ].map(({ estado, color, label }) => (
              <div key={estado} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
