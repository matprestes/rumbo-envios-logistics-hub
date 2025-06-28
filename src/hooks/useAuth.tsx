'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Repartidor } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  repartidor: Repartidor | null;
  loading: boolean;
  iniciarSesion: (email: string, password: string) => Promise<{ error: any }>;
  cerrarSesion: () => Promise<void>;
  registrarse: (email: string, password: string, nombre: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [repartidor, setRepartidor] = useState<Repartidor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent auth callback deadlock
          setTimeout(async () => {
            try {
              const { data: repartidorData, error } = await supabase
                .from('repartidores')
                .select('*')
                .eq('user_auth_id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching repartidor:', error);
              } else {
                setRepartidor(repartidorData);
              }
            } catch (err) {
              console.error('Error in repartidor fetch:', err);
            }
          }, 0);
        } else {
          setRepartidor(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const iniciarSesion = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error };
    } catch (err) {
      console.error('Login error:', err);
      return { error: err };
    }
  };

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const registrarse = async (email: string, password: string, nombre: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nombre: nombre.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`
        },
      });
      return { error };
    } catch (err) {
      console.error('Registration error:', err);
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    repartidor,
    loading,
    iniciarSesion,
    cerrarSesion,
    registrarse,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
