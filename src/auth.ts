
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
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
  if (role === 'admin') {
    // Admin usa senha em texto puro (sem hash/bcrypt)
    const { data, error } = await supabase
      .from('administradores')
      .select('id')
      .eq('email', email)
      .eq('senha', senha)
      .single()

    if (error || !data) throw new Error('E‑mail ou senha incorretos')
    localStorage.setItem('user_id', data.id)
    localStorage.setItem('role', role)
    return { role: 'admin', id: data.id }
  } else {
    // Cliente (continua como antes, usando bcrypt)
    const { data, error } = await supabase
      .from('clientes')
      .select('id, senha_hash')
      .eq('email', email)
      .single()
  
    if (error || !data) throw new Error('E‑mail não encontrado')
    const ok = await bcrypt.compare(senha, data.senha_hash)
    if (!ok) throw new Error('Senha incorreta')
    localStorage.setItem('user_id', data.id)
    localStorage.setItem('role', role)
    return { role: 'cliente', id: data.id }
  }
}
