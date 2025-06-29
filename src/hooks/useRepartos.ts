

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Reparto, ParadaReparto } from '@/types/database';
import { useAuth } from './useAuth';

export function useRepartos() {
  const { repartidor, user } = useAuth();
  const [repartos, setRepartos] = useState<Reparto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerRepartos = async () => {
    try {
      if (!repartidor?.id || !user) {
        setRepartos([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // RLS policies will ensure user only sees their own repartos
      const { data, error } = await supabase
        .from('repartos')
        .select(`
          *,
          paradas:paradas_reparto(
            *,
            envio:envios(*)
          )
        `)
        .eq('repartidor_id', repartidor.id)
        .order('fecha_reparto', { ascending: false });

      if (error) {
        console.error('Error fetching repartos:', error);
        throw error;
      }

      setRepartos(data as Reparto[] || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error obteniendo repartos:', err);
    } finally {
      setLoading(false);
    }
  };

  const obtenerRepartoPorId = async (repartoId: number) => {
    try {
      if (!repartidor?.id || !user) {
        return { data: null, error: 'Usuario no autenticado' };
      }

      const { data, error } = await supabase
        .from('repartos')
        .select(`
          *,
          paradas:paradas_reparto(
            *,
            envio:envios(*)
          )
        `)
        .eq('id', repartoId)
        .eq('repartidor_id', repartidor.id) // Ensure ownership
        .maybeSingle();

      if (error) {
        console.error('Error fetching reparto:', error);
        throw error;
      }

      if (!data) {
        return { data: null, error: 'Reparto no encontrado o no autorizado' };
      }

      return { data: data as Reparto, error: null };
    } catch (err) {
      console.error('Error obteniendo reparto:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  const actualizarEstadoReparto = async (repartoId: number, nuevoEstado: Reparto['estado']) => {
    try {
      if (!repartidor?.id || !user) {
        return { error: 'Usuario no autenticado' };
      }

      // Verify ownership before updating
      const reparto = repartos.find(r => r.id === repartoId);
      if (!reparto || reparto.repartidor_id !== repartidor.id) {
        return { error: 'No autorizado para este reparto' };
      }

      // Validate state transition
      const validTransitions: Record<string, string[]> = {
        'planificado': ['en_progreso', 'cancelado'],
        'en_progreso': ['completado', 'cancelado'],
        'completado': [], // No transitions from completed
        'cancelado': [] // No transitions from cancelled
      };

      if (!validTransitions[reparto.estado]?.includes(nuevoEstado)) {
        return { error: 'Transición de estado inválida' };
      }

      const { error } = await supabase
        .from('repartos')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', repartoId)
        .eq('repartidor_id', repartidor.id); // Double-check ownership

      if (error) throw error;

      setRepartos(prev => 
        prev.map(reparto => 
          reparto.id === repartoId 
            ? { ...reparto, estado: nuevoEstado as Reparto['estado'] }
            : reparto
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error actualizando estado del reparto:', err);
      return { error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  useEffect(() => {
    if (repartidor?.id && user) {
      obtenerRepartos();
    }
  }, [repartidor?.id, user]);

  return {
    repartos,
    loading,
    error,
    obtenerRepartos,
    obtenerRepartoPorId,
    actualizarEstadoReparto,
  };
}
