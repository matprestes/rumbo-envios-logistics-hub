
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reparto, ParadaReparto } from '@/types/database';
import { Calendar, Truck, Play, Navigation } from 'lucide-react';

interface InformacionRepartoProps {
  reparto: Reparto;
  proximaParada?: ParadaReparto;
  onIniciarReparto: () => void;
  onNavegar: () => void;
}

export function InformacionReparto({ 
  reparto, 
  proximaParada, 
  onIniciarReparto, 
  onNavegar 
}: InformacionRepartoProps) {
  const getEstadoBadge = (estado: string) => {
    const variants = {
      'planificado': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-orange-100 text-orange-800 border-orange-200',
      'completado': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    
    const variant = variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <Badge variant="outline" className={variant}>
        {estado === 'planificado' && 'Planificado'}
        {estado === 'en_progreso' && 'En Progreso'}
        {estado === 'completado' && 'Completado'}
        {estado === 'cancelado' && 'Cancelado'}
        {!['planificado', 'en_progreso', 'completado', 'cancelado'].includes(estado) && estado}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>Información del Reparto</span>
          <div className="flex flex-wrap items-center gap-2">
            {getEstadoBadge(reparto.estado)}
            {reparto.estado === 'planificado' && (
              <Button onClick={onIniciarReparto} size="sm" className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Reparto
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Fecha: {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Paradas: {reparto.paradas?.length || 0}
            </span>
          </div>
        </div>
        
        {reparto.notas && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{reparto.notas}</p>
          </div>
        )}
        
        {/* Próxima Parada */}
        {proximaParada && reparto.estado === 'en_progreso' && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-medium text-accent-foreground">Próxima Parada</h4>
                <p className="text-sm text-accent-foreground/80">
                  {proximaParada.descripcion_parada || `Parada ${proximaParada.orden_visita}`}
                </p>
                <p className="text-sm text-accent-foreground/70">
                  {proximaParada.envio?.direccion_destino}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onNavegar}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Navegar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
