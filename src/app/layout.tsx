
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <BrowserRouter>
                <div className="min-h-screen w-full">
                  {children}
                </div>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
