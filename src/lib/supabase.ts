
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://evnydkaakyhiulxlxzln.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlka2Fha3loaXVseGx4emxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTM0NTIsImV4cCI6MjA2NjcyOTQ1Mn0.N7dGXf9lE6jLaNFhKjTOanhAbAaZUpwLlGTqT-KE-D4'

// Crear una única instancia del cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})
