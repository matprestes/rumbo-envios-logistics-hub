
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter } from 'lucide-react';

interface FiltrosMapaRutasProps {
  fechaSeleccionada: string;
  setFechaSeleccionada: (fecha: string) => void;
  estadoFiltro: string;
  setEstadoFiltro: (estado: string) => void;
  totalRepartos: number;
}

export function FiltrosMapaRutas({
  fechaSeleccionada,
  setFechaSeleccionada,
  estadoFiltro,
  setEstadoFiltro,
  totalRepartos
}: FiltrosMapaRutasProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="sm:w-48">
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="planificado">Planificado</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrando:</span>
            <Badge variant="outline">
              {totalRepartos} repartos
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
