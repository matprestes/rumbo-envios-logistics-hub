
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParadaCard } from '@/components/ParadaCard';
import { ParadaReparto } from '@/types/database';
import { MapPin } from 'lucide-react';

interface ListaParadasProps {
  paradas: ParadaReparto[];
  proximaParada?: ParadaReparto;
  onIniciarParada: (paradaId: number) => void;
  onCompletarParada: (paradaId: number) => void;
  onNavegar: (direccion: string, lat?: number, lng?: number) => void;
}

export function ListaParadas({
  paradas,
  proximaParada,
  onIniciarParada,
  onCompletarParada,
  onNavegar
}: ListaParadasProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Paradas del Reparto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paradas.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No hay paradas asignadas a este reparto</p>
            </div>
          ) : (
            paradas.map((parada) => (
              <ParadaCard
                key={parada.id}
                parada={parada}
                esProximaParada={proximaParada?.id === parada.id}
                onIniciar={() => onIniciarParada(parada.id)}
                onCompletar={() => onCompletarParada(parada.id)}
                onNavegar={() => {
                  if (parada.envio) {
                    onNavegar(
                      parada.envio.direccion_destino,
                      parada.envio.latitud_destino,
                      parada.envio.longitud_destino
                    );
                  }
                }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
