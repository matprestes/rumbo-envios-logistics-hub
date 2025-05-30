
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion: string
  telefono?: string
  email?: string
  estado?: string
  created_at?: string
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setClientes(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching clientes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [])

  return { clientes, loading, error, refetch: () => window.location.reload() }
}
