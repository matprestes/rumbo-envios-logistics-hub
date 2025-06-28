
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    'https://evnydkaakyhiulxlxzln.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bnlka2Fha3loaXVseGx4emxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTM0NTIsImV4cCI6MjA2NjcyOTQ1Mn0.N7dGXf9lE6jLaNFhKjTOanhAbAaZUpwLlGTqT-KE-D4'
  );
}
