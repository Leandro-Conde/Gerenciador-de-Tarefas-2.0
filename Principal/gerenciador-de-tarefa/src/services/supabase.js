import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://vmglciwaonssdv1rbgqk.supabase.co'
const supabaseKey = 'sb_publishable_SUA_KEY_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)

