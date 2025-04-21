
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  "https://mjofjyhxwywjzyqnnjsz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qb2ZqeWh4d3l3anp5cW5uanN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTU4NjgsImV4cCI6MjA2MDM5MTg2OH0.7-cC2YscScdGNb6VhTwtRi7cEMXTsoWGAwCLtrzesBI"
)

/**
 * Faz login de Cliente ou Admin.
 * @param role 'cliente' | 'admin'
 */
export async function login(
  email: string,
  senha: string,
  role: 'cliente' | 'admin'
) {
  const table = role === 'admin' ? 'administradores' : 'clientes'

  const { data, error } = await supabase
    .from(table)
    .select('id, senha_hash')
    .eq('email', email)
    .single()

  if (error || !data) throw new Error('E‑mail não encontrado')

  const ok = await bcrypt.compare(senha, data.senha_hash)
  if (!ok) throw new Error('Senha incorreta')

  localStorage.setItem('user_id', data.id)
  localStorage.setItem('role', role)
}
