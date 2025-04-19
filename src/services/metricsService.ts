import { supabase } from '../lib/supabase'

export async function getMetricasPorCliente(cliente_id: string) {
  const { data, error } = await supabase
    .from('metricas_instagram')
    .select('*')
    .eq('cliente_id', cliente_id)
    .order('data', { ascending: true })

  if (error) {
    console.error('Erro ao buscar métricas:', error)
    return []
  }

  return data
}
