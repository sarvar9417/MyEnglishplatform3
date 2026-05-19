import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL     as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase kalitlari topilmadi. .env faylidan VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni tekshiring.\n' +
    '.env.example faylini .env ga copy qilib, ichidagi kalitlarni o\'zingizniki bilan almashtiring.'
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY)
