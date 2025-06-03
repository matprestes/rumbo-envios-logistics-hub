
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface FiltrosRepartosProps {
  filtroEstado: string;
  setFiltroEstado: (estado: string) => void;
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
}

export function FiltrosRepartos({ 
  filtroEstado, 
  setFiltroEstado, 
  busqueda, 
  setBusqueda 
}: FiltrosRepartosProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID o fecha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="planificado">Planificado</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
