
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRepartos } from '@/hooks/useRepartos';
import { useParadasReparto } from '@/hooks/useParadasReparto';
import { DetalleRepartoHeader } from '@/components/repartos/DetalleRepartoHeader';
import { InformacionReparto } from '@/components/repartos/InformacionReparto';
import { ListaParadas } from '@/components/paradas/ListaParadas';
import { MapaRepartosGoogle } from '@/components/mapas/MapaRepartosGoogle';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DetalleRepartoPage() {
  const params = useParams();
  const router = useRouter();
  const repartoId = parseInt(params.id as string);
  const { obtenerRepartoPorId } = useRepartos();
  const { paradas, loading: paradasLoading } = useParadasReparto(repartoId);
  
  const [reparto, setReparto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarReparto = async () => {
      if (!repartoId || isNaN(repartoId)) {
        setError('ID de reparto inválido');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await obtenerRepartoPorId(repartoId);
        if (error) {
          setError(error);
        } else if (data) {
          setReparto(data);
        } else {
          setError('Reparto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el reparto');
      } finally {
        setLoading(false);
      }
    };

    cargarReparto();
  }, [repartoId, obtenerRepartoPorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando reparto...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error al cargar el reparto
            </h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/repartos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Repartos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reparto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Reparto no encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              El reparto que buscas no existe o no tienes permisos para verlo.
            </p>
            <Link href="/repartos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Repartos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const proximaParada = paradas.find(p => p.estado_parada === 'asignado') || 
                      paradas.find(p => p.estado_parada === 'en_progreso');

  return (
    <div className="space-y-6">
      {/* Header */}
      <DetalleRepartoHeader reparto={reparto} />

      {/* Información y Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InformacionReparto reparto={reparto} />
        </div>
        <div className="lg:col-span-2">
          <MapaRepartosGoogle 
            paradas={paradas}
            proximaParada={proximaParada}
          />
        </div>
      </div>

      {/* Lista de Paradas */}
      <ListaParadas 
        paradas={paradas}
        loading={paradasLoading}
        repartoId={repartoId}
      />
    </div>
  );
}
