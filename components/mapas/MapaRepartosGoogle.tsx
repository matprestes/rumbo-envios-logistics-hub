
'use client';

import { useEffect, useRef, useState } from 'react';
import { ParadaReparto } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin } from 'lucide-react';

interface MapaRepartosGoogleProps {
  paradas: ParadaReparto[];
  proximaParada?: ParadaReparto;
}

export function MapaRepartosGoogle({ paradas, proximaParada }: MapaRepartosGoogleProps) {
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
        center: { lat: -34.6037, lng: -58.3816 },
        mapTypeId: 'roadmap',
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidCoordinates = false;

    const coloresPorEstado = {
      'asignado': '#3B82F6',
      'en_progreso': '#F59E0B',
      'completado': '#10B981',
      'cancelado': '#EF4444'
    };

    paradas.forEach((parada, index) => {
      if (!parada.envio?.latitud_destino || !parada.envio?.longitud_destino) return;

      hasValidCoordinates = true;
      const position = {
        lat: parada.envio.latitud_destino,
        lng: parada.envio.longitud_destino
      };

      bounds.extend(position);

      const isProxima = proximaParada?.id === parada.id;
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: `Parada ${parada.orden_visita || index + 1}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isProxima ? 12 : 8,
          fillColor: coloresPorEstado[parada.estado_parada as keyof typeof coloresPorEstado] || '#6B7280',
          fillOpacity: 0.8,
          strokeColor: isProxima ? '#FBBF24' : '#ffffff',
          strokeWeight: isProxima ? 3 : 2,
        },
        label: {
          text: `${parada.orden_visita || index + 1}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3">
            <h3 class="font-semibold text-lg mb-2">Parada ${parada.orden_visita || index + 1}</h3>
            <p class="text-sm mb-2">${parada.envio.direccion_destino}</p>
            <p class="text-sm text-gray-600 mb-2">Destinatario: ${parada.envio.nombre_destinatario || 'No especificado'}</p>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded text-xs" style="background-color: ${coloresPorEstado[parada.estado_parada as keyof typeof coloresPorEstado] || '#6B7280'}; color: white;">
                ${parada.estado_parada?.toUpperCase()}
              </span>
              ${isProxima ? '<span class="px-2 py-1 bg-yellow-500 text-white rounded text-xs">PRÓXIMA</span>' : ''}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    if (hasValidCoordinates) {
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, isMapLoaded, paradas, proximaParada]);

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
    </div>
  );
}
