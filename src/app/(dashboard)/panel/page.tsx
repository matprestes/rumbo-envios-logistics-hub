
import { useAuth } from '@/hooks/useAuth';
import { useRepartos } from '@/hooks/useRepartos';
import { EstadisticasCards } from '@/components/dashboard/EstadisticasCards';
import { AccesosRapidos } from '@/components/dashboard/AccesosRapidos';
import { ResumenRepartos } from '@/components/dashboard/ResumenRepartos';

export default function PanelPage() {
  const { repartidor } = useAuth();
  const { repartos, loading } = useRepartos();

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const repartosHoy = repartos.filter(reparto => {
    const hoy = new Date().toISOString().split('T')[0];
    return reparto.fecha_reparto === hoy;
  });

  const estadisticas = {
    total: repartosHoy.length,
    planificados: repartosHoy.filter(r => r.estado === 'planificado').length,
    enProgreso: repartosHoy.filter(r => r.estado === 'en_progreso').length,
    completados: repartosHoy.filter(r => r.estado === 'completado').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Bienvenido, {repartidor?.nombre}!
        </h1>
        <p className="text-muted-foreground text-lg">{today}</p>
      </div>

      {/* Estadísticas */}
      <EstadisticasCards estadisticas={estadisticas} />

      {/* Accesos Rápidos */}
      <AccesosRapidos />

      {/* Resumen de Repartos */}
      <ResumenRepartos 
        repartos={repartosHoy} 
        loading={loading} 
      />
    </div>
  );
}
