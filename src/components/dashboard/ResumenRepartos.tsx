
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Reparto } from '@/types/database';
import { Package, MapPin, Calendar } from 'lucide-react';

interface ResumenRepartosProps {
  repartos: Reparto[];
  loading: boolean;
}

export function ResumenRepartos({ repartos, loading }: ResumenRepartosProps) {
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Repartos de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4">Cargando repartos...</p>
        ) : repartos.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No tienes repartos programados para hoy
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repartos.map((reparto) => (
              <div key={reparto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Reparto #{reparto.id}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{reparto.paradas?.length || 0} paradas</span>
                    </div>
                    {reparto.notas && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {reparto.notas}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getEstadoBadge(reparto.estado)}
                  <Link to={`/repartos/${reparto.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
