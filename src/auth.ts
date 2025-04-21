
import { createClient } from '@supabase/supabase-js'

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
    // Cliente (verificação direta da senha_hash, sem bcrypt)
    const { data, error } = await supabase
      .from('clientes')
      .select('id, senha_hash')
      .eq('email', email)
      .single()
  
    if (error || !data) throw new Error('E‑mail não encontrado')
    // Comparação direta da senha com senha_hash 
    // (simplificado sem bcrypt para evitar a dependência)
    const ok = senha === data.senha_hash;
    if (!ok) throw new Error('Senha incorreta')
    localStorage.setItem('user_id', data.id)
    localStorage.setItem('role', role)
    return { role: 'cliente', id: data.id }
  }
}
