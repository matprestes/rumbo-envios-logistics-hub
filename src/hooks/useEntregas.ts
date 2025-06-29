
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
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
      // Note: envios doesn't have a direct relation to clientes table
      // It uses fields like nombre_destinatario, telefono_destinatario directly
      const { data, error } = await supabase
        .from('envios')
        .select('*')
        .eq('repartidor_asignado_id', repartidor.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching entregas:', error)
        throw error
      }

      // Transform the data to match our Entrega interface
      const transformedData = (data || []).map(envio => ({
        ...envio,
        // Create a cliente object from the envio data
        cliente: envio.nombre_destinatario ? {
          id: 0, // placeholder since there's no actual cliente record
          nombre: envio.nombre_destinatario || '',
          apellido: '',
          direccion: envio.direccion_destino,
          telefono: envio.telefono_destinatario || undefined,
          email: envio.email_destinatario || undefined,
        } : undefined
      }))

      setEntregas(transformedData as Entrega[])
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
        estado: 'completado',
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
            ? { ...entrega, estado: 'completado' as Entrega['estado'], foto_comprobante: fotoUrl }
            : entrega
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error marcando entrega como completada:', err)
      return { error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  const actualizarEstado = async (entregaId: number, nuevoEstado: Entrega['estado']) => {
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
        'pendiente_asignacion': ['asignado', 'cancelado'],
        'asignado': ['en_progreso', 'cancelado'],
        'en_progreso': ['completado', 'cancelado'],
        'completado': [], // No transitions from completed
        'cancelado': [] // No transitions from cancelled
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
            ? { ...entrega, estado: nuevoEstado as Entrega['estado'] }
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
