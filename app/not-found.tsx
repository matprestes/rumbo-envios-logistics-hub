
'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <AlertTriangle className="h-16 w-16 mx-auto text-orange-500 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            La página que buscas no existe o ha sido movida.
          </p>
          <Button asChild className="w-full">
            <Link href="/panel">
              <Home className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
