
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRepartos } from '@/hooks/useRepartos';
import { useParadasReparto } from '@/hooks/useParadasReparto';
import { DetalleRepartoHeader } from '@/components/repartos/DetalleRepartoHeader';
import { InformacionReparto } from '@/components/repartos/InformacionReparto';
import { ListaParadas } from '@/components/paradas/ListaParadas';
import { MapaRepartos } from '@/components/MapaRepartos';
import { Reparto } from '@/types/database';
import { toast } from 'sonner';

export default function DetalleRepartoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const repartoId = id ? parseInt(id as string) : undefined;
  
  const { user, repartidor, loading: authLoading } = useAuth();
  const { obtenerRepartoPorId, actualizarEstadoReparto } = useRepartos();
  const { paradas, loading: paradasLoading, iniciarParada, completarParada, abrirNavegacion } = useParadasReparto(repartoId);
  
  const [reparto, setReparto] = useState<Reparto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarReparto = async () => {
      if (!repartoId) {
        setError('ID de reparto inválido');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await obtenerRepartoPorId(repartoId);
        if (fetchError) {
          setError(fetchError);
          toast.error('Error al cargar el reparto: ' + fetchError);
        } else if (data) {
          setReparto(data);
        } else {
          setError('Reparto no encontrado');
          toast.error('Reparto no encontrado');
        }
      } catch (err) {
        console.error('Error loading reparto:', err);
        setError('Error inesperado al cargar el reparto');
        toast.error('Error inesperado al cargar el reparto');
      } finally {
        setLoading(false);
      }
    };

    if (repartidor?.id && user) {
      cargarReparto();
    }
  }, [repartoId, obtenerRepartoPorId, repartidor?.id, user]);

  if (!authLoading && !user) {
    router.replace('/login');
    return null;
  }

  if (!repartoId) {
    router.replace('/repartos');
    return null;
  }

  if (authLoading || loading || paradasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando detalle...</span>
        </div>
      </div>
    );
  }

  if (error || !reparto) {
    return (
      <div className="space-y-6">
        <DetalleRepartoHeader 
          reparto={null}
          error={error || 'Reparto no encontrado'}
        />
      </div>
    );
  }

  const proximaParada = paradas.find(p => p.estado_parada === 'asignado');

  const iniciarReparto = async () => {
    if (!reparto || reparto.estado !== 'planificado') return;
    
    const resultado = await actualizarEstadoReparto(reparto.id, 'en_progreso');
    if (resultado.success) {
      setReparto(prev => prev ? { ...prev, estado: 'en_progreso' as any } : null);
      toast.success('Reparto iniciado correctamente');
    } else {
      toast.error(resultado.error || 'Error al iniciar el reparto');
    }
  };

  return (
    <div className="space-y-6">
      <DetalleRepartoHeader reparto={reparto} />
      
      <InformacionReparto 
        reparto={reparto}
        proximaParada={proximaParada}
        onIniciarReparto={iniciarReparto}
        onNavegar={() => {
          if (proximaParada?.envio) {
            abrirNavegacion(
              proximaParada.envio.direccion_destino,
              proximaParada.envio.latitud_destino,
              proximaParada.envio.longitud_destino
            );
          }
        }}
      />
      
      <MapaRepartos 
        paradas={paradas} 
        proximaParada={proximaParada}
      />
      
      <ListaParadas 
        paradas={paradas}
        proximaParada={proximaParada}
        onIniciarParada={iniciarParada}
        onCompletarParada={completarParada}
        onNavegar={abrirNavegacion}
      />
    </div>
  );
}
