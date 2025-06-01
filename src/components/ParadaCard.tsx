
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
    const variants = {
      'asignado': 'bg-muted text-muted-foreground border-border',
      'en_progreso': 'bg-accent/10 text-accent-foreground border-accent/20',
      'completado': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-destructive/10 text-destructive border-destructive/20'
    }
    
    const variant = variants[estado as keyof typeof variants] || 'bg-muted text-muted-foreground border-border'
    
    return (
      <Badge variant="outline" className={variant}>
        {estado === 'asignado' && 'Asignado'}
        {estado === 'en_progreso' && 'En Progreso'}
        {estado === 'completado' && 'Completado'}
        {estado === 'cancelado' && 'Cancelado'}
        {!['asignado', 'en_progreso', 'completado', 'cancelado'].includes(estado) && estado}
      </Badge>
    )
  }

  return (
    <Card className={`transition-all duration-200 ${esProximaParada ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Parada {parada.orden_visita || '?'}
              </span>
              {getEstadoBadge(parada.estado_parada)}
              {esProximaParada && (
                <Badge className="bg-primary text-primary-foreground">Próxima</Badge>
              )}
            </div>
            
            {parada.descripcion_parada && (
              <h3 className="font-semibold text-foreground mb-2 break-words">
                {parada.descripcion_parada}
              </h3>
            )}
            
            {parada.envio && (
              <div className="flex items-start gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm break-words">{parada.envio.direccion_destino}</span>
              </div>
            )}
            
            {parada.hora_estimada_llegada && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Estimado: {parada.hora_estimada_llegada}
                  {parada.hora_real_llegada && (
                    <span className="ml-2 text-green-600 font-medium">
                      Real: {parada.hora_real_llegada}
                    </span>
                  )}
                </span>
              </div>
            )}
            
            {parada.notas_parada && (
              <p className="text-sm text-muted-foreground mt-2 break-words">
                {parada.notas_parada}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {parada.estado_parada === 'asignado' && (
            <Button size="sm" onClick={onIniciar} className="bg-primary hover:bg-primary/90">
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {parada.estado_parada === 'en_progreso' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
              onClick={onCompletar}
            >
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
