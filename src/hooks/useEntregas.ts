
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Entrega } from '@/types/database'
import { useAuth } from './useAuth'

export function useEntregas() {
  const { user } = useAuth()
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerEntregas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('envios')
        .select(`
          *,
          cliente:clientes(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setEntregas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error obteniendo entregas:', err)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoCompletada = async (entregaId: number, fotoUrl?: string) => {
    try {
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

      if (error) throw error

      // Actualizar el estado local
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
      const { error } = await supabase
        .from('envios')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', entregaId)

      if (error) throw error

      // Actualizar el estado local
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
    if (user) {
      obtenerEntregas()
    }
  }, [user])

  return {
    entregas,
    loading,
    error,
    obtenerEntregas,
    marcarComoCompletada,
    actualizarEstado,
  }
}
