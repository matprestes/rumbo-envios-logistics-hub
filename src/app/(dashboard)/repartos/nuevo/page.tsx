
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NuevoRepartoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/repartos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Generar Nuevo Reparto
          </h1>
          <p className="text-muted-foreground">
            Crea repartos automáticamente seleccionando clientes y configuraciones
          </p>
        </div>
      </div>

      {/* Formulario de Generación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary" />
              Configuración del Reparto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta funcionalidad estará disponible próximamente. 
                Permite generar repartos automáticamente basados en ubicaciones geográficas y configuraciones personalizadas.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Aquí aparecerá la vista previa del reparto que se generará.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
