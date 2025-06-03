
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Truck, Menu, LogOut, User } from 'lucide-react';
import { Repartidor } from '@/types/database';

interface DashboardNavbarProps {
  repartidor: Repartidor;
  onToggleSidebar: () => void;
}

export function DashboardNavbar({ repartidor, onToggleSidebar }: DashboardNavbarProps) {
  const { cerrarSesion } = useAuth();

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Sistema de Repartos
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Rumbo Envíos
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {repartidor.nombre}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={cerrarSesion}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
