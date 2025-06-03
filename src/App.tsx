
import { Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout';
import HomePage from './app/page';
import NotFound from './app/not-found';

// Páginas principales
import LoginPage from './app/login/page';

// Páginas del dashboard (protegidas)
import DashboardLayout from './app/(dashboard)/layout';
import PanelPage from './app/(dashboard)/panel/page';
import RepartosPage from './app/(dashboard)/repartos/page';
import NuevoRepartoPage from './app/(dashboard)/repartos/nuevo/page';
import DetalleRepartoPage from './app/(dashboard)/repartos/[id]/page';
import MapaRutasPage from './app/(dashboard)/mapa-rutas/page';

function App() {
  return (
    <RootLayout>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<HomePage />} />
        
        {/* Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas del dashboard (protegidas) */}
        <Route path="/panel" element={<DashboardLayout><PanelPage /></DashboardLayout>} />
        <Route path="/repartos" element={<DashboardLayout><RepartosPage /></DashboardLayout>} />
        <Route path="/repartos/nuevo" element={<DashboardLayout><NuevoRepartoPage /></DashboardLayout>} />
        <Route path="/repartos/:id" element={<DashboardLayout><DetalleRepartoPage /></DashboardLayout>} />
        <Route path="/mapa-rutas" element={<DashboardLayout><MapaRutasPage /></DashboardLayout>} />
        
        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
