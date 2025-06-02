
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Empresa {
  id: number
  nombre: string
  direccion: string
  latitud?: number
  longitud?: number
}

interface Cliente {
  id: number
  nombre: string
  apellido: string
  direccion: string
  latitud?: number
  longitud?: number
  telefono?: string
  email?: string
}

interface Repartidor {
  id: number
  nombre: string
  estado: string
}

export const useGenerarRepartos = () => {
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
        .select('id, nombre, direccion, latitud, longitud')
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
        .select('id, nombre, apellido, direccion, latitud, longitud, telefono, email')
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
      console.log('Iniciando generación de reparto...')

      const empresaSeleccionada = empresas.find(e => e.id === parseInt(empresaId))
      if (!empresaSeleccionada) {
        throw new Error('Empresa no encontrada')
      }

      // 1. Crear el reparto
      const { data: repartoData, error: repartoError } = await supabase
        .from('repartos')
        .insert({
          fecha_reparto: fecha,
          repartidor_id: parseInt(repartidorId),
          empresa_asociada_id: parseInt(empresaId),
          estado: 'planificado',
          notas: notas || `Reparto generado automáticamente para ${clientesSeleccionados.length} clientes`
        })
        .select()
        .single()

      if (repartoError) throw repartoError
      console.log('Reparto creado:', repartoData)

      // 2. Crear envío de parada inicial (empresa)
      const { data: envioInicialData, error: envioInicialError } = await supabase
        .from('envios')
        .insert({
          direccion_origen: empresaSeleccionada.direccion,
          latitud_origen: empresaSeleccionada.latitud,
          longitud_origen: empresaSeleccionada.longitud,
          direccion_destino: empresaSeleccionada.direccion,
          latitud_destino: empresaSeleccionada.latitud,
          longitud_destino: empresaSeleccionada.longitud,
          empresa_origen_id: parseInt(empresaId),
          precio: 0,
          estado: 'asignado',
          fecha_estimada_entrega: fecha,
          repartidor_asignado_id: parseInt(repartidorId),
          es_parada_inicio: true,
          detalles_adicionales: `Punto de partida - ${empresaSeleccionada.nombre}`
        })
        .select()
        .single()

      if (envioInicialError) throw envioInicialError
      console.log('Envío inicial creado:', envioInicialData)

      // 3. Crear parada inicial (orden 0)
      const { error: paradaInicialError } = await supabase
        .from('paradas_reparto')
        .insert({
          reparto_id: repartoData.id,
          envio_id: envioInicialData.id,
          descripcion_parada: `Inicio de reparto - ${empresaSeleccionada.nombre}`,
          orden_visita: 0,
          estado_parada: 'asignado'
        })

      if (paradaInicialError) throw paradaInicialError
      console.log('Parada inicial creada')

      // 4. Crear envíos y paradas para cada cliente
      const enviosPromises = clientesSeleccionados.map(async (clienteId, index) => {
        const cliente = clientes.find(c => c.id === clienteId)
        if (!cliente) return null

        console.log(`Creando envío para cliente ${index + 1}:`, cliente.nombre)

        // Determinar origen: si es el primer cliente, origen es la empresa; si no, es el cliente anterior
        let direccionOrigen = empresaSeleccionada.direccion
        let latitudOrigen = empresaSeleccionada.latitud
        let longitudOrigen = empresaSeleccionada.longitud
        
        if (index > 0) {
          const clienteAnterior = clientes.find(c => c.id === clientesSeleccionados[index - 1])
          if (clienteAnterior) {
            direccionOrigen = clienteAnterior.direccion
            latitudOrigen = clienteAnterior.latitud
            longitudOrigen = clienteAnterior.longitud
          }
        }

        // Crear envío
        const { data: envioData, error: envioError } = await supabase
          .from('envios')
          .insert({
            remitente_cliente_id: clienteId,
            direccion_origen: direccionOrigen,
            latitud_origen: latitudOrigen,
            longitud_origen: longitudOrigen,
            direccion_destino: cliente.direccion,
            latitud_destino: cliente.latitud,
            longitud_destino: cliente.longitud,
            empresa_origen_id: parseInt(empresaId),
            precio: 0,
            estado: 'asignado',
            fecha_estimada_entrega: fecha,
            repartidor_asignado_id: parseInt(repartidorId),
            es_parada_inicio: false,
            detalles_adicionales: `Entrega a ${cliente.nombre} ${cliente.apellido}`
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

        console.log(`Envío y parada creados para cliente ${index + 1}`)
        return envioData
      })

      await Promise.all(enviosPromises)

      toast.success(`¡Reparto creado exitosamente! Se generaron ${clientesSeleccionados.length + 1} paradas (1 inicio + ${clientesSeleccionados.length} clientes).`)
      
      // Limpiar formulario
      setFecha('')
      setEmpresaId('')
      setRepartidorId('')
      setNotas('')
      setClientesSeleccionados([])
      setClientes([])

    } catch (error) {
      console.error('Error generando reparto:', error)
      toast.error('Error al generar el reparto: ' + (error as Error).message)
    } finally {
      setGenerando(false)
    }
  }

  return {
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
  }
}
