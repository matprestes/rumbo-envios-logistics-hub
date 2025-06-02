
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Users, CheckCircle } from 'lucide-react'

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

interface SeleccionClientesProps {
  empresaId: string
  clientes: Cliente[]
  clientesSeleccionados: number[]
  toggleCliente: (clienteId: number) => void
  seleccionarTodos: () => void
  loading: boolean
}

export const SeleccionClientes: React.FC<SeleccionClientesProps> = ({
  empresaId,
  clientes,
  clientesSeleccionados,
  toggleCliente,
  seleccionarTodos,
  loading
}) => {
  return (
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
  )
}
