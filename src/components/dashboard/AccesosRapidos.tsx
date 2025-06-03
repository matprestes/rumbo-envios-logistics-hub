
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, Plus, Map, Route } from 'lucide-react';

export function AccesosRapidos() {
  const accesos = [
    {
      title: 'Ver Repartos',
      description: 'Gestiona todos tus repartos asignados',
      href: '/repartos',
      icon: Package,
      buttonText: 'Ver Repartos',
      variant: 'default' as const,
      bgClass: 'hover:bg-primary/5 border-primary/20',
    },
    {
      title: 'Generar Repartos',
      description: 'Crea nuevos repartos por lote',
      href: '/repartos/nuevo',
      icon: Plus,
      buttonText: 'Generar',
      variant: 'outline' as const,
      bgClass: 'hover:bg-green-50 border-green-200',
    },
    {
      title: 'Mapa de Rutas',
      description: 'Visualiza rutas en Google Maps',
      href: '/mapa-rutas',
      icon: Map,
      buttonText: 'Ver Mapa',
      variant: 'outline' as const,
      bgClass: 'hover:bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {accesos.map((acceso) => {
        const Icon = acceso.icon;
        
        return (
          <Link key={acceso.href} to={acceso.href}>
            <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${acceso.bgClass} group`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50 group-hover:bg-background/80 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {acceso.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {acceso.description}
                </p>
                <Button variant={acceso.variant} className="w-full">
                  {acceso.buttonText}
                  <Icon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
