
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useFotoComprobante() {
  const [uploading, setUploading] = useState(false)

  const subirFoto = async (file: File, entregaId: number) => {
    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `${entregaId}-${Date.now()}.${fileExt}`
      const filePath = `comprobantes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('fotos-comprobante')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('fotos-comprobante')
        .getPublicUrl(filePath)

      return { url: data.publicUrl, error: null }
    } catch (error) {
      console.error('Error subiendo foto:', error)
      return { 
        url: null, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    } finally {
      setUploading(false)
    }
  }

  return {
    subirFoto,
    uploading,
  }
}
