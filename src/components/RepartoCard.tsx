
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reparto } from '@/types/database'
import { MapPin, Calendar, Package } from 'lucide-react'

interface RepartoCardProps {
  reparto: Reparto
  onClick: () => void
}

export const RepartoCard = ({ reparto, onClick }: RepartoCardProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'planificado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planificado</Badge>
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

  const cantidadParadas = reparto.paradas?.length || 0
  const fechaFormateada = new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                Reparto #{reparto.id}
              </h3>
              {getEstadoBadge(reparto.estado)}
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{fechaFormateada}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4" />
              <span className="text-sm">{cantidadParadas} paradas</span>
            </div>
            
            {reparto.notas && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {reparto.notas}
              </p>
            )}
          </div>
          
          <MapPin className="h-5 w-5 text-blue-600 ml-2" />
        </div>
      </CardContent>
    </Card>
  )
}
