
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  Plus, 
  Map, 
  BarChart3,
  X 
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarItems = [
  {
    title: 'Panel Principal',
    href: '/panel',
    icon: BarChart3,
  },
  {
    title: 'Mis Repartos',
    href: '/repartos',
    icon: Package,
  },
  {
    title: 'Generar Repartos',
    href: '/repartos/nuevo',
    icon: Plus,
  },
  {
    title: 'Mapa de Rutas',
    href: '/mapa-rutas',
    icon: Map,
  },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
            <h2 className="font-semibold text-foreground">Navegación</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== '/panel' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Card className="p-3">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Sistema de Repartos</p>
                <p>Versión 2.0</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
