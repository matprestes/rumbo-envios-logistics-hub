
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Entrega } from '@/types/database'
import { useAuth } from './useAuth'

export function useEntregas() {
  const { user, repartidor } = useAuth()
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerEntregas = async () => {
    try {
      if (!user || !repartidor) {
        setEntregas([])
        setLoading(false)
        return
      }
      
      setLoading(true)
      setError(null)
      
      // Only fetch deliveries assigned to current repartidor
      const { data, error } = await supabase
        .from('envios')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .eq('repartidor_asignado_id', repartidor.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching entregas:', error)
        throw error
      }

      setEntregas(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error obteniendo entregas:', err)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoCompletada = async (entregaId: number, fotoUrl?: string) => {
    try {
      if (!user || !repartidor) {
        return { error: 'Usuario no autenticado' }
      }

      // Verify ownership before updating
      const entrega = entregas.find(e => e.id === entregaId)
      if (!entrega || entrega.repartidor_asignado_id !== repartidor.id) {
        return { error: 'No autorizado para esta entrega' }
      }

      const updateData: any = {
        estado: 'completada',
        updated_at: new Date().toISOString(),
      }

      if (fotoUrl) {
        updateData.foto_comprobante = fotoUrl
      }

      const { error } = await supabase
        .from('envios')
        .update(updateData)
        .eq('id', entregaId)
        .eq('repartidor_asignado_id', repartidor.id) // Double-check ownership

      if (error) throw error

      // Update local state
      setEntregas(prev => 
        prev.map(entrega => 
          entrega.id === entregaId 
            ? { ...entrega, estado: 'completada', foto_comprobante: fotoUrl }
            : entrega
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error marcando entrega como completada:', err)
      return { error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  const actualizarEstado = async (entregaId: number, nuevoEstado: string) => {
    try {
      if (!user || !repartidor) {
        return { error: 'Usuario no autenticado' }
      }

      // Verify ownership before updating
      const entrega = entregas.find(e => e.id === entregaId)
      if (!entrega || entrega.repartidor_asignado_id !== repartidor.id) {
        return { error: 'No autorizado para esta entrega' }
      }

      // Validate state transition
      const validTransitions: Record<string, string[]> = {
        'pendiente_asignacion': ['asignado', 'cancelada'],
        'asignado': ['en_progreso', 'cancelada'],
        'en_progreso': ['completada', 'cancelada'],
        'completada': [], // No transitions from completed
        'cancelada': [] // No transitions from cancelled
      }

      if (!validTransitions[entrega.estado]?.includes(nuevoEstado)) {
        return { error: 'Transición de estado inválida' }
      }

      const { error } = await supabase
        .from('envios')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', entregaId)
        .eq('repartidor_asignado_id', repartidor.id) // Double-check ownership

      if (error) throw error

      // Update local state
      setEntregas(prev => 
        prev.map(entrega => 
          entrega.id === entregaId 
            ? { ...entrega, estado: nuevoEstado as any }
            : entrega
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error actualizando estado:', err)
      return { error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  useEffect(() => {
    if (user && repartidor) {
      obtenerEntregas()
    }
  }, [user, repartidor])

  return {
    entregas,
    loading,
    error,
    obtenerEntregas,
    marcarComoCompletada,
    actualizarEstado,
  }
}
