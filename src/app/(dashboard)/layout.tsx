
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, repartidor, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user || !repartidor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar 
        repartidor={repartidor}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        <DashboardSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
