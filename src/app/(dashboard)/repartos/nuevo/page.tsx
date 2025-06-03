
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { ConfiguracionReparto } from '@/components/GenerarRepartos/ConfiguracionReparto';
import { SeleccionClientes } from '@/components/GenerarRepartos/SeleccionClientes';
import { BotonGeneracion } from '@/components/GenerarRepartos/BotonGeneracion';
import { useGenerarRepartosCompleto } from '@/hooks/useGenerarRepartosCompleto';

export default function NuevoRepartoPage() {
  const {
    fecha,
    setFecha,
    empresaId,
    setEmpresaId,
    repartidorId,
    setRepartidorId,
    notas,
    setNotas,
    empresas,
    clientes,
    repartidores,
    clientesSeleccionados,
    loading,
    generando,
    toggleCliente,
    seleccionarTodos,
    generarReparto
  } = useGenerarRepartosCompleto();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Generar Repartos por Lote
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Crea repartos masivos seleccionando empresa, fecha y clientes
          </p>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuración del Reparto */}
        <ConfiguracionReparto
          fecha={fecha}
          setFecha={setFecha}
          empresaId={empresaId}
          setEmpresaId={setEmpresaId}
          repartidorId={repartidorId}
          setRepartidorId={setRepartidorId}
          notas={notas}
          setNotas={setNotas}
          empresas={empresas}
          repartidores={repartidores}
          loading={loading}
        />

        {/* Selección de Clientes */}
        <SeleccionClientes
          empresaId={empresaId}
          clientes={clientes}
          clientesSeleccionados={clientesSeleccionados}
          toggleCliente={toggleCliente}
          seleccionarTodos={seleccionarTodos}
          loading={loading}
        />
      </div>

      {/* Botón de Generación */}
      <BotonGeneracion
        fecha={fecha}
        empresaId={empresaId}
        repartidorId={repartidorId}
        clientesSeleccionados={clientesSeleccionados}
        generando={generando}
        onGenerarReparto={generarReparto}
      />
    </div>
  );
}
