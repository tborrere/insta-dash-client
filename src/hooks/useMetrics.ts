
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/types/client';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const useMetrics = (clientId: string | undefined) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });

  const fetchMetrics = useCallback(async () => {
    if (!clientId) {
      setError('ID do cliente não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const startDate = dateRange?.from || subDays(new Date(), 7);
      const endDate = dateRange?.to || new Date();

      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('metricas_instagram')
        .select('*')
        .eq('cliente_id', clientId)
        .gte('data', formattedStartDate)
        .lte('data', formattedEndDate)
        .order('data', { ascending: true });

      if (error) {
        console.error('Erro na consulta do Supabase:', error);
        throw new Error(`Falha ao buscar métricas: ${error.message}`);
      }

      // Transformando os dados recebidos do Supabase para o formato da interface Metric
      const formattedMetrics: Metric[] = (data || []).map((item: any) => ({
        id: item.id,
        client_id: item.cliente_id,
        date: item.data,
        reach: item.alcance || 0,
        impressions: item.impressoes || 0,
        likes: item.curtidas || 0,
        comments: item.comentarios || 0,
        followers: item.seguidores || 0,
        engagement: item.engajamento || 0
      }));

      setMetrics(formattedMetrics);
    } catch (err: any) {
      console.error('Erro ao buscar métricas:', err);
      setError(err.message || 'Ocorreu um erro ao buscar as métricas');
    } finally {
      setLoading(false);
    }
  }, [clientId, dateRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    dateRange,
    setDateRange,
    refreshMetrics: fetchMetrics
  };
};
