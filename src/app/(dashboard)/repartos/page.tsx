
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRepartos } from '@/hooks/useRepartos';
import { ListaRepartos } from '@/components/repartos/ListaRepartos';
import { FiltrosRepartos } from '@/components/repartos/FiltrosRepartos';
import { useState, useMemo } from 'react';

export default function RepartosPage() {
  const { repartidor } = useAuth();
  const { repartos, loading } = useRepartos();
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  const repartosFiltrados = useMemo(() => {
    return repartos.filter(reparto => {
      const cumpleFiltroEstado = filtroEstado === 'todos' || reparto.estado === filtroEstado;
      const cumpleBusqueda = busqueda === '' || 
        reparto.id.toString().includes(busqueda) ||
        reparto.fecha_reparto.includes(busqueda);
      
      return cumpleFiltroEstado && cumpleBusqueda;
    });
  }, [repartos, filtroEstado, busqueda]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mis Repartos
        </h1>
        <p className="text-muted-foreground">
          Administra todos tus repartos asignados
        </p>
      </div>

      {/* Filtros */}
      <FiltrosRepartos
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      {/* Lista de Repartos */}
      <ListaRepartos 
        repartos={repartosFiltrados}
        loading={loading}
      />
    </div>
  );
}
