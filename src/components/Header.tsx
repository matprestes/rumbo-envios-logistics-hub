
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  repartidor: {
    nombre: string;
    telefono: string;
    vehiculo: string;
    zona: string;
  };
}

const Header = ({ repartidor }: HeaderProps) => {
  const iniciales = repartidor.nombre.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-delivery-blue-500 to-delivery-green-500 p-2 rounded-lg">
              <div className="text-white font-bold text-xl">RE</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rumbo Envíos</h1>
              <p className="text-sm text-gray-600">{repartidor.zona}</p>
            </div>
          </div>

          {/* Estado en línea */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-delivery-green-50 rounded-full">
              <div className="w-2 h-2 bg-delivery-green-500 rounded-full animate-pulse-delivery"></div>
              <span className="text-sm font-medium text-delivery-green-700">En Línea</span>
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-delivery-orange-500 hover:bg-delivery-orange-600">
                3
              </Badge>
            </Button>

            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-delivery-blue-100 text-delivery-blue-700 text-sm font-semibold">
                      {iniciales}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{repartidor.nombre}</p>
                    <p className="text-xs text-gray-500">{repartidor.vehiculo}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{repartidor.nombre}</p>
                  <p className="text-xs text-gray-500">{repartidor.telefono}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
