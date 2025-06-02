import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useGenerarRepartos() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generarRepartosAutomaticamente = async (fecha: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('generar-repartos', {
        body: { fecha },
      })

      if (error) {
        console.error('Error al generar repartos:', error)
        setError(error.message)
        toast.error(`Error al generar repartos: ${error.message}`)
      } else {
        console.log('Repartos generados correctamente:', data)
        toast.success('Repartos generados correctamente')
      }
    } catch (err) {
      console.error('Error inesperado al generar repartos:', err)
      setError('Error inesperado al generar repartos')
      toast.error('Error inesperado al generar repartos')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    generarRepartosAutomaticamente,
  }
}
