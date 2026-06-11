import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Missing Supabase env vars. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseKey ?? '',
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)
