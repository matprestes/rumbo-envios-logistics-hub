
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Repartidor } from '@/types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  repartidor: Repartidor | null
  loading: boolean
  iniciarSesion: (email: string, password: string) => Promise<{ error: any }>
  cerrarSesion: () => Promise<void>
  registrarse: (email: string, password: string, nombre: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [repartidor, setRepartidor] = useState<Repartidor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configurar listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Obtener datos del repartidor
          setTimeout(async () => {
            const { data: repartidorData } = await supabase
              .from('repartidores')
              .select('*')
              .eq('user_auth_id', session.user.id)
              .single()
            
            setRepartidor(repartidorData)
          }, 0)
        } else {
          setRepartidor(null)
        }
        setLoading(false)
      }
    )

    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const iniciarSesion = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
  }

  const registrarse = async (email: string, password: string, nombre: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
        },
      },
    })
    return { error }
  }

  const value = {
    user,
    session,
    repartidor,
    loading,
    iniciarSesion,
    cerrarSesion,
    registrarse,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
