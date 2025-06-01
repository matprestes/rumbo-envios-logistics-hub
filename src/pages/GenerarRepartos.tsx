
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarDays, Building2, Users, Package, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Empresa {
  id: number
  nombre: string
  direccion: string
}

interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion: string
  telefono?: string
  email?: string
}

interface Repartidor {
  id: number
  nombre: string
  estado: string
}

const GenerarRepartos = () => {
  const [fecha, setFecha] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const [repartidorId, setRepartidorId] = useState('')
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [repartidores, setRepartidores] = useState<Repartidor[]>([])
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [notas, setNotas] = useState('')

  // Cargar empresas y repartidores al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Cargar clientes cuando se selecciona una empresa
  useEffect(() => {
    if (empresaId) {
      cargarClientes()
    } else {
      setClientes([])
      setClientesSeleccionados([])
    }
  }, [empresaId])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // Cargar empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('id, nombre, direccion')
        .eq('estado', 'activo')
        .order('nombre')

      if (empresasError) throw empresasError
      setEmpresas(empresasData || [])

      // Cargar repartidores
      const { data: repartidoresData, error: repartidoresError } = await supabase
        .from('repartidores')
        .select('id, nombre, estado')
        .eq('estado', 'activo')
        .order('nombre')

      if (repartidoresError) throw repartidoresError
      setRepartidores(repartidoresData || [])

    } catch (error) {
      console.error('Error cargando datos:', error)
      toast.error('Error al cargar los datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const cargarClientes = async () => {
    if (!empresaId) return

    try {
      const { data: clientesData, error } = await supabase
        .from('clientes')
        .select('id, nombre, apellido, direccion, telefono, email')
        .eq('empresa_id', parseInt(empresaId))
        .eq('estado', 'activo')
        .order('nombre')

      if (error) throw error
      setClientes(clientesData || [])
      setClientesSeleccionados([])
    } catch (error) {
      console.error('Error cargando clientes:', error)
      toast.error('Error al cargar los clientes')
    }
  }

  const toggleCliente = (clienteId: number) => {
    setClientesSeleccionados(prev => 
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    )
  }

  const seleccionarTodos = () => {
    if (clientesSeleccionados.length === clientes.length) {
      setClientesSeleccionados([])
    } else {
      setClientesSeleccionados(clientes.map(c => c.id))
    }
  }

  const generarReparto = async () => {
    if (!fecha || !empresaId || !repartidorId || clientesSeleccionados.length === 0) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setGenerando(true)

      // Crear el reparto
      const { data: repartoData, error: repartoError } = await supabase
        .from('repartos')
        .insert({
          fecha_reparto: fecha,
          repartidor_id: parseInt(repartidorId),
          empresa_asociada_id: parseInt(empresaId),
          estado: 'planificado',
          notas: notas || `Reparto generado para ${clientesSeleccionados.length} clientes`
        })
        .select()
        .single()

      if (repartoError) throw repartoError

      // Crear envíos para cada cliente seleccionado
      const enviosPromises = clientesSeleccionados.map(async (clienteId, index) => {
        const cliente = clientes.find(c => c.id === clienteId)
        if (!cliente) return null

        // Crear envío
        const { data: envioData, error: envioError } = await supabase
          .from('envios')
          .insert({
            remitente_cliente_id: clienteId,
            direccion_origen: empresas.find(e => e.id === parseInt(empresaId))?.direccion || '',
            direccion_destino: cliente.direccion,
            empresa_origen_id: parseInt(empresaId),
            precio: 0,
            estado: 'asignado',
            fecha_estimada_entrega: fecha,
            repartidor_asignado_id: parseInt(repartidorId),
            detalles_adicionales: `Envío generado automáticamente para ${cliente.nombre} ${cliente.apellido}`
          })
          .select()
          .single()

        if (envioError) throw envioError

        // Crear parada del reparto
        const { error: paradaError } = await supabase
          .from('paradas_reparto')
          .insert({
            reparto_id: repartoData.id,
            envio_id: envioData.id,
            descripcion_parada: `Entrega a ${cliente.nombre} ${cliente.apellido}`,
            orden_visita: index + 1,
            estado_parada: 'asignado'
          })

        if (paradaError) throw paradaError

        return envioData
      })

      await Promise.all(enviosPromises)

      toast.success(`¡Reparto creado exitosamente! Se generaron ${clientesSeleccionados.length} paradas.`)
      
      // Limpiar formulario
      setFecha('')
      setEmpresaId('')
      setRepartidorId('')
      setNotas('')
      setClientesSeleccionados([])
      setClientes([])

    } catch (error) {
      console.error('Error generando reparto:', error)
      toast.error('Error al generar el reparto')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              Generador de Repartos por Lote
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Crea repartos masivos seleccionando empresa, fecha y clientes
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuración del Reparto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Configuración del Reparto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha del Reparto *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa Origen *</Label>
                <Select value={empresaId} onValueChange={setEmpresaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        <div>
                          <div className="font-medium">{empresa.nombre}</div>
                          <div className="text-sm text-gray-500">{empresa.direccion}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Repartidor */}
              <div className="space-y-2">
                <Label htmlFor="repartidor">Repartidor Asignado *</Label>
                <Select value={repartidorId} onValueChange={setRepartidorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un repartidor" />
                  </SelectTrigger>
                  <SelectContent>
                    {repartidores.map((repartidor) => (
                      <SelectItem key={repartidor.id} value={repartidor.id.toString()}>
                        {repartidor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notas">Notas del Reparto</Label>
                <Input
                  id="notas"
                  placeholder="Observaciones adicionales..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selección de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Clientes de la Empresa
                </div>
                {clientes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {clientesSeleccionados.length} de {clientes.length} seleccionados
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={seleccionarTodos}
                    >
                      {clientesSeleccionados.length === clientes.length ? 'Deseleccionar' : 'Seleccionar'} Todos
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!empresaId ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  Selecciona una empresa para ver los clientes
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Cargando clientes...</p>
                </div>
              ) : clientes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  No hay clientes activos para esta empresa
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        clientesSeleccionados.includes(cliente.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleCliente(cliente.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={clientesSeleccionados.includes(cliente.id)}
                          onChange={() => toggleCliente(cliente.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">
                            {cliente.nombre} {cliente.apellido}
                          </h4>
                          <p className="text-sm text-gray-600">{cliente.direccion}</p>
                          {(cliente.telefono || cliente.email) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {cliente.telefono && <span>{cliente.telefono}</span>}
                              {cliente.telefono && cliente.email && <span> • </span>}
                              {cliente.email && <span>{cliente.email}</span>}
                            </div>
                          )}
                        </div>
                        {clientesSeleccionados.includes(cliente.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botón de Generación */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  Se creará un reparto con {clientesSeleccionados.length} paradas para la fecha seleccionada
                </span>
              </div>
              <Button
                onClick={generarReparto}
                disabled={!fecha || !empresaId || !repartidorId || clientesSeleccionados.length === 0 || generando}
                className="min-w-[200px]"
                size="lg"
              >
                {generando ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Generar Reparto
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GenerarRepartos
