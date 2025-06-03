
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp 
} from 'lucide-react';

interface EstadisticasCardsProps {
  estadisticas: {
    total: number;
    planificados: number;
    enProgreso: number;
    completados: number;
  };
}

export function EstadisticasCards({ estadisticas }: EstadisticasCardsProps) {
  const cards = [
    {
      title: 'Total Hoy',
      value: estadisticas.total,
      icon: Package,
      color: 'blue',
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-700',
    },
    {
      title: 'Planificados',
      value: estadisticas.planificados,
      icon: Clock,
      color: 'yellow',
      bgClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-600',
      textClass: 'text-yellow-700',
    },
    {
      title: 'En Progreso',
      value: estadisticas.enProgreso,
      icon: AlertCircle,
      color: 'orange',
      bgClass: 'bg-orange-50 border-orange-200',
      iconClass: 'text-orange-600',
      textClass: 'text-orange-700',
    },
    {
      title: 'Completados',
      value: estadisticas.completados,
      icon: CheckCircle,
      color: 'green',
      bgClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      textClass: 'text-green-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <Card key={card.title} className={`${card.bgClass} hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.textClass} mb-1`}>
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.textClass}`}>
                    {card.value}
                  </p>
                  {card.title === 'Completados' && (
                    <p className={`text-xs ${card.textClass} mt-1 flex items-center gap-1`}>
                      <TrendingUp className="h-3 w-3" />
                      +12% vs ayer
                    </p>
                  )}
                </div>
                <Icon className={`h-10 w-10 ${card.iconClass}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
