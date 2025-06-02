
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays } from 'lucide-react'

interface Empresa {
  id: number
  nombre: string
  direccion: string
  latitud?: number
  longitud?: number
}

interface Repartidor {
  id: number
  nombre: string
  estado: string
}

interface ConfiguracionRepartoProps {
  fecha: string
  setFecha: (fecha: string) => void
  empresaId: string
  setEmpresaId: (id: string) => void
  repartidorId: string
  setRepartidorId: (id: string) => void
  notas: string
  setNotas: (notas: string) => void
  empresas: Empresa[]
  repartidores: Repartidor[]
  loading: boolean
}

export const ConfiguracionReparto: React.FC<ConfiguracionRepartoProps> = ({
  fecha,
  setFecha,
  empresaId,
  setEmpresaId,
  repartidorId,
  setRepartidorId,
  notas,
  setNotas,
  empresas,
  repartidores,
  loading
}) => {
  return (
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
              <SelectValue placeholder={loading ? "Cargando empresas..." : "Selecciona una empresa"} />
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
              <SelectValue placeholder={loading ? "Cargando repartidores..." : "Selecciona un repartidor"} />
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
  )
}
