
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./app/layout";
import HomePage from "./app/page";
import LoginPage from "./app/login/page";
import PanelPage from "./app/panel/page";
import RepartosPage from "./app/repartos/page";
import DetalleReparto from "./pages/DetalleReparto";
import GenerarRepartos from "./pages/GenerarRepartos";
import MapaRutasPage from "./app/mapa-rutas/page";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <RootLayout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/panel" element={<PanelPage />} />
      <Route path="/repartos" element={<RepartosPage />} />
      <Route path="/reparto/:id" element={<DetalleReparto />} />
      <Route path="/generar-repartos" element={<GenerarRepartos />} />
      <Route path="/mapa-rutas" element={<MapaRutasPage />} />
      <Route path="/demo" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </RootLayout>
);

export default App;
