
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqqboufzcbyjiahbkyih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcWJvdWZ6Y2J5amlhaGJreWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MzM4OTEsImV4cCI6MjA2NDAwOTg5MX0.MzPVZfa4J7LZiFa3D7kx9ETP7pwoiaz-Qr87pGXl5tQ'

// Crear una única instancia del cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})
