
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ParadaReparto } from '@/types/database'
import { MapPin, Clock, Play, CheckCircle, Navigation } from 'lucide-react'

interface ParadaCardProps {
  parada: ParadaReparto
  onIniciar: () => void
  onCompletar: () => void
  onNavegar: () => void
  esProximaParada: boolean
}

export const ParadaCard = ({ 
  parada, 
  onIniciar, 
  onCompletar, 
  onNavegar, 
  esProximaParada 
}: ParadaCardProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'asignado':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Asignado</Badge>
      case 'en_progreso':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En Progreso</Badge>
      case 'completado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <Card className={`${esProximaParada ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">
                Parada {parada.orden_visita || '?'}
              </span>
              {getEstadoBadge(parada.estado_parada)}
              {esProximaParada && (
                <Badge className="bg-blue-600 text-white">Próxima</Badge>
              )}
            </div>
            
            {parada.descripcion_parada && (
              <h3 className="font-semibold text-gray-900 mb-2">
                {parada.descripcion_parada}
              </h3>
            )}
            
            {parada.envio && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{parada.envio.direccion_destino}</span>
              </div>
            )}
            
            {parada.hora_estimada_llegada && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Estimado: {parada.hora_estimada_llegada}
                  {parada.hora_real_llegada && (
                    <span className="ml-2 text-green-600">
                      Real: {parada.hora_real_llegada}
                    </span>
                  )}
                </span>
              </div>
            )}
            
            {parada.notas_parada && (
              <p className="text-sm text-gray-500 mt-2">
                {parada.notas_parada}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          {parada.estado_parada === 'asignado' && (
            <Button size="sm" onClick={onIniciar}>
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {parada.estado_parada === 'en_progreso' && (
            <Button size="sm" variant="outline" className="bg-green-50 text-green-700" onClick={onCompletar}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Completar
            </Button>
          )}
          
          {parada.envio && parada.estado_parada !== 'completado' && (
            <Button size="sm" variant="outline" onClick={onNavegar}>
              <Navigation className="h-4 w-4 mr-1" />
              Navegar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
