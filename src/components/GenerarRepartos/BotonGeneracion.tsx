
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Package } from 'lucide-react'

interface BotonGeneracionProps {
  fecha: string
  empresaId: string
  repartidorId: string
  clientesSeleccionados: number[]
  generando: boolean
  onGenerarReparto: () => void
}

export const BotonGeneracion: React.FC<BotonGeneracionProps> = ({
  fecha,
  empresaId,
  repartidorId,
  clientesSeleccionados,
  generando,
  onGenerarReparto
}) => {
  const isDisabled = !fecha || !empresaId || !repartidorId || clientesSeleccionados.length === 0 || generando

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Se creará un reparto con {clientesSeleccionados.length + (clientesSeleccionados.length > 0 ? 1 : 0)} paradas 
              {clientesSeleccionados.length > 0 && (
                <span> (1 parada de inicio + {clientesSeleccionados.length} clientes)</span>
              )}
            </span>
          </div>
          <Button
            onClick={onGenerarReparto}
            disabled={isDisabled}
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
  )
}
