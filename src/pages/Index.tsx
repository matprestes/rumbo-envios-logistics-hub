
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, Clock, User, Truck, CheckCircle } from 'lucide-react';
import DeliveryCard from '@/components/DeliveryCard';
import StatsCard from '@/components/StatsCard';
import Header from '@/components/Header';

// Datos simulados del repartidor
const mockRepartidor = {
  id: 1,
  nombre: "Carlos Rodriguez",
  telefono: "+34 666 123 456",
  vehiculo: "Moto Yamaha XMax",
  zona: "Centro - Salamanca"
};

// Datos simulados de entregas
const mockEntregas = [
  {
    id: 1,
    clienteNombre: "María García",
    clienteDireccion: "Calle Mayor 15, 3ºB",
    clienteTelefono: "+34 654 321 987",
    empresa: "RestauranteDelux",
    estado: "pendiente",
    tiempoEstimado: "25 min",
    distancia: "1.2 km",
    precio: 45.80,
    descripcion: "2x Pizza Margarita, 1x Coca Cola",
    horaRecogida: "14:30",
    horaEntrega: "15:00"
  },
  {
    id: 2,
    clienteNombre: "Juan Pérez",
    clienteDireccion: "Av. de la Constitución 89",
    clienteTelefono: "+34 612 456 789",
    empresa: "Farmacia Central",
    estado: "en_progreso",
    tiempoEstimado: "15 min",
    distancia: "0.8 km",
    precio: 12.50,
    descripcion: "Medicamentos receta 12345",
    horaRecogida: "13:45",
    horaEntrega: "14:15"
  },
  {
    id: 3,
    clienteNombre: "Ana Martínez",
    clienteDireccion: "Plaza del Mercado 5",
    clienteTelefono: "+34 698 147 258",
    empresa: "SuperExpress",
    estado: "completado",
    tiempoEstimado: "Completado",
    distancia: "2.1 km",
    precio: 28.90,
    descripcion: "Compra semanal - 15 productos",
    horaRecogida: "12:00",
    horaEntrega: "12:45"
  }
];

const Index = () => {
  const [entregas, setEntregas] = useState(mockEntregas);
  const [selectedTab, setSelectedTab] = useState('todas');

  const stats = {
    completadas: entregas.filter(e => e.estado === 'completado').length,
    pendientes: entregas.filter(e => e.estado === 'pendiente').length,
    enProgreso: entregas.filter(e => e.estado === 'en_progreso').length,
    gananciasHoy: entregas.filter(e => e.estado === 'completado').reduce((sum, e) => sum + (e.precio * 0.15), 0)
  };

  const filteredEntregas = selectedTab === 'todas' 
    ? entregas 
    : entregas.filter(e => {
        if (selectedTab === 'activas') return e.estado !== 'completado';
        return e.estado === selectedTab;
      });

  const updateEstadoEntrega = (id: number, nuevoEstado: string) => {
    setEntregas(entregas.map(entrega => 
      entrega.id === id ? { ...entrega, estado: nuevoEstado } : entrega
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header repartidor={mockRepartidor} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Completadas Hoy"
            value={stats.completadas}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="En Progreso"
            value={stats.enProgreso}
            icon={Truck}
            color="blue"
          />
          <StatsCard
            title="Pendientes"
            value={stats.pendientes}
            icon={Clock}
            color="orange"
          />
          <StatsCard
            title="Ganancias Hoy"
            value={`€${stats.gananciasHoy.toFixed(2)}`}
            icon={Package}
            color="green"
          />
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mis Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'activas', label: 'Activas' },
                { key: 'pendiente', label: 'Pendientes' },
                { key: 'en_progreso', label: 'En Progreso' },
                { key: 'completado', label: 'Completadas' }
              ].map(tab => (
                <Button
                  key={tab.key}
                  variant={selectedTab === tab.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTab(tab.key)}
                  className="text-sm"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Entregas */}
        <div className="space-y-4">
          {filteredEntregas.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No hay entregas {selectedTab === 'todas' ? '' : `${selectedTab}`}
                </h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'todas' 
                    ? 'Aún no tienes entregas asignadas para hoy'
                    : `No tienes entregas ${selectedTab} en este momento`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntregas.map((entrega, index) => (
              <div key={entrega.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <DeliveryCard 
                  entrega={entrega} 
                  onUpdateEstado={updateEstadoEntrega}
                />
              </div>
            ))
          )}
        </div>

        {/* Resumen del día */}
        <Card className="mt-8 bg-gradient-to-r from-delivery-blue-50 to-delivery-green-50 border-delivery-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-delivery-blue-700">
              <User className="h-5 w-5" />
              Resumen del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-delivery-green-600">{stats.completadas}</p>
                <p className="text-sm text-muted-foreground">Entregas Completadas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-delivery-blue-600">
                  {entregas.reduce((sum, e) => sum + parseFloat(e.distancia), 0).toFixed(1)} km
                </p>
                <p className="text-sm text-muted-foreground">Distancia Recorrida</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-delivery-orange-600">
                  €{stats.gananciasHoy.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Ganancias</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-delivery-blue-600">
                  {Math.round((stats.completadas / entregas.length) * 100) || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
