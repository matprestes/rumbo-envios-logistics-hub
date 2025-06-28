'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParadaReparto } from '@/types/database';
import { useAuth } from './useAuth';

export function useParadasReparto(repartoId?: number) {
  const { repartidor, user } = useAuth();
  const [paradas, setParadas] = useState<ParadaReparto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerParadas = async () => {
    try {
      if (!repartoId || !repartidor?.id || !user) {
        setParadas([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // First verify reparto ownership
      const { data: repartoData, error: repartoError } = await supabase
        .from('repartos')
        .select('id')
        .eq('id', repartoId)
        .eq('repartidor_id', repartidor.id)
        .maybeSingle();

      if (repartoError) {
        console.error('Error verifying reparto ownership:', repartoError);
        throw repartoError;
      }

      if (!repartoData) {
        throw new Error('Reparto no encontrado o no autorizado');
      }

      // Now fetch paradas - RLS policies will ensure proper access
      const { data, error } = await supabase
        .from('paradas_reparto')
        .select(`
          *,
          envio:envios(*)
        `)
        .eq('reparto_id', repartoId)
        .order('orden_visita', { ascending: true });

      if (error) {
        console.error('Error fetching paradas:', error);
        throw error;
      }

      setParadas(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error obteniendo paradas:', err);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoParada = async (paradaId: number, nuevoEstado: string) => {
    try {
      if (!repartidor?.id || !user) {
        return { error: 'Usuario no autenticado' };
      }

      // Verify ownership before updating
      const parada = paradas.find(p => p.id === paradaId);
      if (!parada) {
        return { error: 'Parada no encontrada' };
      }

      // Validate state transition
      const validTransitions: Record<string, string[]> = {
        'asignado': ['en_progreso', 'cancelado'],
        'en_progreso': ['completado', 'cancelado'],
        'completado': [], // No transitions from completed
        'cancelado': [] // No transitions from cancelled
      };

      if (!validTransitions[parada.estado_parada]?.includes(nuevoEstado)) {
        return { error: 'Transición de estado inválida' };
      }

      const updateData: any = {
        estado_parada: nuevoEstado,
        updated_at: new Date().toISOString(),
      };

      // If marking as completed, add real arrival time
      if (nuevoEstado === 'completado') {
        updateData.hora_real_llegada = new Date().toTimeString().split(' ')[0];
      }

      const { error } = await supabase
        .from('paradas_reparto')
        .update(updateData)
        .eq('id', paradaId);

      if (error) throw error;

      setParadas(prev => 
        prev.map(parada => 
          parada.id === paradaId 
            ? { ...parada, estado_parada: nuevoEstado as any, ...updateData }
            : parada
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error actualizando estado de parada:', err);
      return { error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  const iniciarParada = async (paradaId: number) => {
    return await actualizarEstadoParada(paradaId, 'en_progreso');
  };

  const completarParada = async (paradaId: number) => {
    return await actualizarEstadoParada(paradaId, 'completado');
  };

  const abrirNavegacion = (direccion: string, lat?: number, lng?: number) => {
    // Sanitize the address input to prevent potential injection
    const sanitizedDireccion = direccion.replace(/[<>]/g, '');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(sanitizedDireccion);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destino}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }, (error) => {
        console.error('Error obteniendo ubicación:', error);
        // Fallback without current location
        const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(sanitizedDireccion);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }, {
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: false
      });
    } else {
      // Fallback for browsers without geolocation
      const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(sanitizedDireccion);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    if (repartoId && repartidor?.id && user) {
      obtenerParadas();
    }
  }, [repartoId, repartidor?.id, user]);

  return {
    paradas,
    loading,
    error,
    obtenerParadas,
    iniciarParada,
    completarParada,
    abrirNavegacion,
  };
}
