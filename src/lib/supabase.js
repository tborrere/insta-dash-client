
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mjofjyhxwywjzyqnnjsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qb2ZqeWh4d3l3anp5cW5uanN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTU4NjgsImV4cCI6MjA2MDM5MTg2OH0.7-cC2YscScdGNb6VhTwtRi7cEMXTsoWGAwCLtrzesBI'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})
