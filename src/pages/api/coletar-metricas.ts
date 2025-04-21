import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { token, instagramId, clienteId } = req.body;

  if (!token || !instagramId || !clienteId) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    const metrics = ['impressions', 'reach', 'followers_count'];
    const response = await fetch(`https://graph.facebook.com/v18.0/${instagramId}/insights?metric=${metrics.join(',')}&period=day&access_token=${token}`);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const resultado = data.data.reduce((acc, item) => {
      acc[item.name] = item.values?.[0]?.value || 0;
      return acc;
    }, {});

    const { error } = await supabase.from('metricas_instagram').insert([
      {
        cliente_id: clienteId,
        data: new Date().toISOString().slice(0, 10),
        alcance: resultado.reach,
        impressoes: resultado.impressions,
        seguidores: resultado.followers_count,
      }
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ status: 'Métricas salvas com sucesso!' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
