
import { MapPin, Phone, Clock, Package, Check, Play, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Entrega {
  id: number;
  clienteNombre: string;
  clienteDireccion: string;
  clienteTelefono: string;
  empresa: string;
  estado: string;
  tiempoEstimado: string;
  distancia: string;
  precio: number;
  descripcion: string;
  horaRecogida: string;
  horaEntrega: string;
}

interface DeliveryCardProps {
  entrega: Entrega;
  onUpdateEstado: (id: number, nuevoEstado: string) => void;
}

const DeliveryCard = ({ entrega, onUpdateEstado }: DeliveryCardProps) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge className="status-badge status-pending">Pendiente</Badge>;
      case 'en_progreso':
        return <Badge className="status-badge status-in-progress">En Progreso</Badge>;
      case 'completado':
        return <Badge className="status-badge status-completed">Completado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getAccionButton = () => {
    switch (entrega.estado) {
      case 'pendiente':
        return (
          <Button 
            size="sm" 
            onClick={() => onUpdateEstado(entrega.id, 'en_progreso')}
            className="bg-delivery-blue-500 hover:bg-delivery-blue-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar
          </Button>
        );
      case 'en_progreso':
        return (
          <Button 
            size="sm" 
            onClick={() => onUpdateEstado(entrega.id, 'completado')}
            className="bg-delivery-green-500 hover:bg-delivery-green-600"
          >
            <Check className="h-4 w-4 mr-2" />
            Completar
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="delivery-card hover:scale-[1.01] transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{entrega.clienteNombre}</h3>
              {getEstadoBadge(entrega.estado)}
            </div>
            <p className="text-sm text-gray-600 font-medium">{entrega.empresa}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-lg font-bold text-delivery-green-600">€{entrega.precio.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Comisión: €{(entrega.precio * 0.15).toFixed(2)}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                <DropdownMenuItem>Contactar Cliente</DropdownMenuItem>
                <DropdownMenuItem>Reportar Problema</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del cliente */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-delivery-blue-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{entrega.clienteDireccion}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-delivery-blue-500" />
            <a 
              href={`tel:${entrega.clienteTelefono}`} 
              className="text-sm text-delivery-blue-600 hover:underline"
            >
              {entrega.clienteTelefono}
            </a>
          </div>
        </div>

        <Separator />

        {/* Descripción del pedido */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Descripción:</span>
          </div>
          <p className="text-sm text-gray-600 ml-6">{entrega.descripcion}</p>
        </div>

        <Separator />

        {/* Información de tiempo y distancia */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-delivery-orange-500" />
              <span className="text-xs font-medium text-gray-600">TIEMPO ESTIMADO</span>
            </div>
            <p className="text-sm font-semibold ml-6">{entrega.tiempoEstimado}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-delivery-orange-500" />
              <span className="text-xs font-medium text-gray-600">DISTANCIA</span>
            </div>
            <p className="text-sm font-semibold ml-6">{entrega.distancia}</p>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recogida:</span>
              <p className="font-semibold">{entrega.horaRecogida}</p>
            </div>
            <div>
              <span className="text-gray-600">Entrega:</span>
              <p className="font-semibold">{entrega.horaEntrega}</p>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        {getAccionButton() && (
          <div className="pt-2">
            {getAccionButton()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryCard;
