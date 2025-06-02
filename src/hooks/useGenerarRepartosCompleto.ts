
import { useState, useEffect, useCallback } from 'react'
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

export function useGenerarRepartosCompleto() {
  // Form state
  const [fecha, setFecha] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const [repartidorId, setRepartidorId] = useState('')
  const [notas, setNotas] = useState('')
  
  // Data state
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [repartidores, setRepartidores] = useState<Repartidor[]>([])
  
  // Selection state
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load empresas
        const { data: empresasData, error: empresasError } = await supabase
          .from('empresas')
          .select('*')
          .eq('estado', 'activo')
          .order('nombre')
        
        if (empresasError) throw empresasError
        setEmpresas(empresasData || [])
        
        // Load repartidores
        const { data: repartidoresData, error: repartidoresError } = await supabase
          .from('repartidores')
          .select('*')
          .eq('estado', 'activo')
          .order('nombre')
        
        if (repartidoresError) throw repartidoresError
        setRepartidores(repartidoresData || [])
        
      } catch (error) {
        console.error('Error loading initial data:', error)
        toast.error('Error al cargar los datos iniciales')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Load clientes when empresa changes
  useEffect(() => {
    const loadClientes = async () => {
      if (!empresaId) {
        setClientes([])
        setClientesSeleccionados([])
        return
      }

      try {
        const { data: clientesData, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('empresa_id', parseInt(empresaId))
          .eq('estado', 'activo')
          .order('nombre')
        
        if (error) throw error
        setClientes(clientesData || [])
        setClientesSeleccionados([])
      } catch (error) {
        console.error('Error loading clientes:', error)
        toast.error('Error al cargar los clientes')
        setClientes([])
      }
    }

    loadClientes()
  }, [empresaId])

  // Toggle cliente selection
  const toggleCliente = useCallback((clienteId: number) => {
    setClientesSeleccionados(prev => {
      if (prev.includes(clienteId)) {
        return prev.filter(id => id !== clienteId)
      } else {
        return [...prev, clienteId]
      }
    })
  }, [])

  // Select/deselect all clientes
  const seleccionarTodos = useCallback(() => {
    if (clientesSeleccionados.length === clientes.length) {
      setClientesSeleccionados([])
    } else {
      setClientesSeleccionados(clientes.map(cliente => cliente.id))
    }
  }, [clientes, clientesSeleccionados])

  // Generate reparto
  const generarReparto = useCallback(async () => {
    if (!fecha || !empresaId || !repartidorId || clientesSeleccionados.length === 0) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setGenerando(true)

    try {
      // Create reparto
      const { data: repartoData, error: repartoError } = await supabase
        .from('repartos')
        .insert({
          fecha_reparto: fecha,
          repartidor_id: parseInt(repartidorId),
          empresa_asociada_id: parseInt(empresaId),
          estado: 'planificado',
          notas: notas || null
        })
        .select()
        .single()

      if (repartoError) throw repartoError

      const repartoId = repartoData.id
      const empresa = empresas.find(e => e.id === parseInt(empresaId))

      if (!empresa) {
        throw new Error('Empresa no encontrada')
      }

      // Create starting point (empresa)
      const { data: envioInicioData, error: envioInicioError } = await supabase
        .from('envios')
        .insert({
          direccion_origen: empresa.direccion,
          latitud_origen: empresa.latitud,
          longitud_origen: empresa.longitud,
          empresa_origen_id: empresa.id,
          direccion_destino: empresa.direccion,
          latitud_destino: empresa.latitud,
          longitud_destino: empresa.longitud,
          empresa_destino_id: empresa.id,
          precio: 0,
          estado: 'asignado',
          repartidor_asignado_id: parseInt(repartidorId),
          es_parada_inicio: true
        })
        .select()
        .single()

      if (envioInicioError) throw envioInicioError

      // Create starting stop
      await supabase
        .from('paradas_reparto')
        .insert({
          reparto_id: repartoId,
          envio_id: envioInicioData.id,
          descripcion_parada: `Punto de inicio - ${empresa.nombre}`,
          orden_visita: 1,
          estado_parada: 'asignado'
        })

      // Create envios and paradas for selected clients
      const clientesData = clientes.filter(cliente => 
        clientesSeleccionados.includes(cliente.id)
      )

      for (let i = 0; i < clientesData.length; i++) {
        const cliente = clientesData[i]
        
        // Create envio for client
        const { data: envioData, error: envioError } = await supabase
          .from('envios')
          .insert({
            direccion_origen: empresa.direccion,
            latitud_origen: empresa.latitud,
            longitud_origen: empresa.longitud,
            empresa_origen_id: empresa.id,
            direccion_destino: cliente.direccion,
            latitud_destino: cliente.latitud,
            longitud_destino: cliente.longitud,
            nombre_destinatario: `${cliente.nombre} ${cliente.apellido}`,
            telefono_destinatario: cliente.telefono,
            precio: 0,
            estado: 'asignado',
            repartidor_asignado_id: parseInt(repartidorId)
          })
          .select()
          .single()

        if (envioError) throw envioError

        // Create parada for client
        await supabase
          .from('paradas_reparto')
          .insert({
            reparto_id: repartoId,
            envio_id: envioData.id,
            descripcion_parada: `Entrega a ${cliente.nombre} ${cliente.apellido}`,
            orden_visita: i + 2, // +2 because first stop is the starting point
            estado_parada: 'asignado'
          })
      }

      toast.success(`Reparto generado exitosamente con ${clientesSeleccionados.length + 1} paradas`)
      
      // Reset form
      setFecha('')
      setEmpresaId('')
      setRepartidorId('')
      setNotas('')
      setClientesSeleccionados([])
      
    } catch (error) {
      console.error('Error generating reparto:', error)
      toast.error('Error al generar el reparto')
    } finally {
      setGenerando(false)
    }
  }, [fecha, empresaId, repartidorId, clientesSeleccionados, notas, empresas, clientes])

  return {
    // Form state
    fecha,
    setFecha,
    empresaId,
    setEmpresaId,
    repartidorId,
    setRepartidorId,
    notas,
    setNotas,
    
    // Data
    empresas,
    clientes,
    repartidores,
    
    // Selection
    clientesSeleccionados,
    
    // Loading states
    loading,
    generando,
    
    // Actions
    toggleCliente,
    seleccionarTodos,
    generarReparto
  }
}
