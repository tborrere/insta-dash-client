
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import MetricChart from '@/components/MetricChart';
import { DateRangePicker } from '@/components/DateRangePicker';
import CalendarEmbed from '@/components/CalendarEmbed';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Metric } from '@/types/client';

// Importamos o serviço de métricas que contém a função getClientById
import { getClientById } from '@/services/mockData';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user?.clientId) {
          throw new Error('Client ID not found.');
        }

        const startDate = dateRange?.from || subDays(new Date(), 7);
        const endDate = dateRange?.to || new Date();

        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        const { data, error } = await supabase
          .from('metricas_instagram')
          .select('*')
          .eq('cliente_id', user.clientId)
          .gte('data', formattedStartDate)
          .lte('data', formattedEndDate)
          .order('data', { ascending: true });

        if (error) {
          throw new Error(error.message);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user?.clientId, dateRange]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Card className="mb-4 mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visão Geral</CardTitle>
            <CardDescription>
              Selecione o período para visualizar as métricas do Instagram.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Seguidores"
            value={metrics.reduce((acc, curr) => acc + (curr.followers || 0), 0)}
            icon={<span>👥</span>}
          />
          <MetricCard
            title="Curtidas"
            value={metrics.reduce((acc, curr) => acc + (curr.likes || 0), 0)}
            icon={<span>👍</span>}
          />
          <MetricCard
            title="Comentários"
            value={metrics.reduce((acc, curr) => acc + (curr.comments || 0), 0)}
            icon={<span>💬</span>}
          />
          <MetricCard
            title="Alcance"
            value={metrics.reduce((acc, curr) => acc + (curr.reach || 0), 0)}
            icon={<span>📊</span>}
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Gráfico de Métricas</CardTitle>
            <CardDescription>
              Visualização das métricas ao longo do tempo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Carregando gráfico...</p>}
            {error && <p className="text-red-500">Erro ao carregar gráfico: {error}</p>}
            {!loading && !error && metrics.length > 0 && (
              <MetricChart
                title="Métricas de Instagram"
                data={metrics}
                dataKey="reach"
                type="area"
              />
            )}
            {!loading && !error && metrics.length === 0 && (
              <p>Nenhuma métrica encontrada para o período selecionado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Agendamentos</CardTitle>
            <CardDescription>
              Visualize e gerencie seus agendamentos de conteúdo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.calendar ? (
              <CalendarEmbed calendarUrl={user.calendar} />
            ) : (
              <p>Nenhum calendário associado a este cliente.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
