
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Reparto, ParadaReparto } from '@/types/database'
import { useAuth } from './useAuth'

export function useRepartos() {
  const { repartidor } = useAuth()
  const [repartos, setRepartos] = useState<Reparto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerRepartos = async () => {
    try {
      if (!repartidor?.id) return
      
      setLoading(true)
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
        .order('fecha_reparto', { ascending: false })

      if (error) throw error

      setRepartos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error obteniendo repartos:', err)
    } finally {
      setLoading(false)
    }
  }

  const obtenerRepartoPorId = async (repartoId: number) => {
    try {
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
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      console.error('Error obteniendo reparto:', err)
      return { data: null, error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  const actualizarEstadoReparto = async (repartoId: number, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('repartos')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', repartoId)

      if (error) throw error

      setRepartos(prev => 
        prev.map(reparto => 
          reparto.id === repartoId 
            ? { ...reparto, estado: nuevoEstado as any }
            : reparto
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error actualizando estado del reparto:', err)
      return { error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  useEffect(() => {
    if (repartidor?.id) {
      obtenerRepartos()
    }
  }, [repartidor?.id])

  return {
    repartos,
    loading,
    error,
    obtenerRepartos,
    obtenerRepartoPorId,
    actualizarEstadoReparto,
  }
}
