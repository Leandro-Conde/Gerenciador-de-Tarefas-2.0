import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://vmglciwaonssdvlrbgqk.supabase.co";
const supabaseKey = "sb_publishable_bAwzVjh0OjJxham8KFgijQ_ThAu1Mz9";

export const supabase = createClient(supabaseUrl, supabaseKey)

