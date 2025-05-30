
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ParadaReparto } from '@/types/database'

export function useParadasReparto(repartoId?: number) {
  const [paradas, setParadas] = useState<ParadaReparto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerParadas = async () => {
    try {
      if (!repartoId) return
      
      setLoading(true)
      const { data, error } = await supabase
        .from('paradas_reparto')
        .select(`
          *,
          envio:envios(*)
        `)
        .eq('reparto_id', repartoId)
        .order('orden_visita', { ascending: true })

      if (error) throw error

      setParadas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error obteniendo paradas:', err)
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstadoParada = async (paradaId: number, nuevoEstado: string) => {
    try {
      const updateData: any = {
        estado_parada: nuevoEstado,
        updated_at: new Date().toISOString(),
      }

      // Si se marca como completado, agregar hora real
      if (nuevoEstado === 'completado') {
        updateData.hora_real_llegada = new Date().toTimeString().split(' ')[0]
      }

      const { error } = await supabase
        .from('paradas_reparto')
        .update(updateData)
        .eq('id', paradaId)

      if (error) throw error

      setParadas(prev => 
        prev.map(parada => 
          parada.id === paradaId 
            ? { ...parada, estado_parada: nuevoEstado as any, ...updateData }
            : parada
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Error actualizando estado de parada:', err)
      return { error: err instanceof Error ? err.message : 'Error desconocido' }
    }
  }

  const iniciarParada = async (paradaId: number) => {
    return await actualizarEstadoParada(paradaId, 'en_progreso')
  }

  const completarParada = async (paradaId: number) => {
    return await actualizarEstadoParada(paradaId, 'completado')
  }

  const abrirNavegacion = (direccion: string, lat?: number, lng?: number) => {
    // Obtener ubicación actual y abrir Google Maps
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(direccion)
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destino}`
        window.open(url, '_blank')
      }, (error) => {
        console.error('Error obteniendo ubicación:', error)
        // Fallback sin ubicación actual
        const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(direccion)
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`
        window.open(url, '_blank')
      })
    } else {
      // Fallback para navegadores sin geolocalización
      const destino = lat && lng ? `${lat},${lng}` : encodeURIComponent(direccion)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`
      window.open(url, '_blank')
    }
  }

  useEffect(() => {
    if (repartoId) {
      obtenerParadas()
    }
  }, [repartoId])

  return {
    paradas,
    loading,
    error,
    obtenerParadas,
    iniciarParada,
    completarParada,
    abrirNavegacion,
  }
}
