
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
  const [googleMapsToken, setGoogleMapsToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      // Here you would initialize Google Maps instead of Mapbox
      // For now, we'll show a placeholder
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error inicializando mapa:', error);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleMapsToken.trim()) {
      initializeMap(googleMapsToken.trim());
    }
  };

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
                Ingresa tu API Key de Google Maps para visualizar las rutas
              </p>
            </div>
            
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Google Maps API Key"
                  value={googleMapsToken}
                  onChange={(e) => setGoogleMapsToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Obtén tu API Key en <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
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
      <div ref={mapContainer} className="absolute inset-0 rounded-lg bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Mapa de Google no disponible</p>
          <p className="text-sm text-muted-foreground/70">Configure la API Key para ver las rutas</p>
        </div>
      </div>
      
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
