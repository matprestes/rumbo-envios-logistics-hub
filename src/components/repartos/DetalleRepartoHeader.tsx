
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Reparto } from '@/types/database';
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react';

interface DetalleRepartoHeaderProps {
  reparto?: Reparto | null;
  error?: string;
}

export function DetalleRepartoHeader({ reparto, error }: DetalleRepartoHeaderProps) {
  const navigate = useNavigate();

  if (error || !reparto) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/repartos')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="bg-destructive/10 p-2 rounded-lg">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Error</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/repartos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="bg-primary/10 p-2 rounded-lg">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Reparto #{reparto.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(reparto.fecha_reparto).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
}
