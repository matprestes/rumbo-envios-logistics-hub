
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Reparto } from '@/types/database';
import { Package, Clock, MapPin } from 'lucide-react';

interface ListaRepartosProps {
  repartos: Reparto[];
  loading: boolean;
}

export function ListaRepartos({ repartos, loading }: ListaRepartosProps) {
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado': return 'default';
      case 'en_progreso': return 'secondary';
      case 'planificado': return 'outline';
      default: return 'destructive';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Cargando repartos...</p>
        </CardContent>
      </Card>
    );
  }

  if (repartos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron repartos
          </h3>
          <p className="text-muted-foreground">
            No hay repartos que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {repartos.map((reparto) => (
        <Card key={reparto.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Reparto #{reparto.id}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(reparto.fecha_reparto).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {reparto.paradas?.length || 0} paradas
                    </div>
                  </div>
                  {reparto.notas && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {reparto.notas}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={getEstadoBadgeVariant(reparto.estado)}>
                  {reparto.estado.replace('_', ' ').toUpperCase()}
                </Badge>
                <Link to={`/repartos/${reparto.id}`}>
                  <Button>Ver Detalles</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
