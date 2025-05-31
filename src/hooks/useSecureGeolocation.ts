
import { useState, useCallback } from 'react'

interface GeolocationOptions {
  timeout?: number
  enableHighAccuracy?: boolean
  maximumAge?: number
}

interface GeolocationResult {
  latitude: number
  longitude: number
}

export function useSecureGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por el navegador')
      return false
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      const isGranted = permission.state === 'granted'
      setHasPermission(isGranted)
      return isGranted
    } catch (err) {
      console.warn('No se pudo verificar permisos de geolocalización:', err)
      setHasPermission(null)
      return null
    }
  }, [])

  const getCurrentPosition = useCallback(async (
    options: GeolocationOptions = {}
  ): Promise<GeolocationResult | null> => {
    setLoading(true)
    setError(null)

    const defaultOptions: GeolocationOptions = {
      timeout: 10000,
      enableHighAccuracy: false,
      maximumAge: 300000, // 5 minutes cache
      ...options
    }

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalización no soportada')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          defaultOptions
        )
      })

      const result = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      setLoading(false)
      return result
    } catch (err) {
      let errorMessage = 'Error obteniendo ubicación'
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            setHasPermission(false)
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible'
            break
          case err.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
        }
      }

      setError(errorMessage)
      setLoading(false)
      console.error('Geolocation error:', err)
      return null
    }
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      const position = await getCurrentPosition({ timeout: 5000 })
      if (position) {
        setHasPermission(true)
        return true
      }
      return false
    } catch (err) {
      console.error('Permission request failed:', err)
      return false
    }
  }, [getCurrentPosition])

  return {
    loading,
    error,
    hasPermission,
    getCurrentPosition,
    checkPermission,
    requestPermission
  }
}
