import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import MetricChart from '@/components/MetricChart';
import DateRangePicker from '@/components/DateRangePicker';
import CalendarEmbed from '@/components/CalendarEmbed';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

// Importamos o serviço de métricas que contém a função getClientById
import { getClientById } from '@/services/mockData';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState([]);
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

        setMetrics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user?.clientId, startDate, endDate]);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visão Geral</CardTitle>
            <CardDescription>
              Selecione o período para visualizar as métricas do Instagram.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DateRangePicker onChange={handleDateRangeChange} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Seguidores"
            value={metrics.reduce((acc, curr) => acc + (curr.seguidores || 0), 0)}
            isLoading={loading}
          />
          <MetricCard
            title="Curtidas"
            value={metrics.reduce((acc, curr) => acc + (curr.curtidas || 0), 0)}
            isLoading={loading}
          />
          <MetricCard
            title="Comentários"
            value={metrics.reduce((acc, curr) => acc + (curr.comentarios || 0), 0)}
            isLoading={loading}
          />
          <MetricCard
            title="Alcance"
            value={metrics.reduce((acc, curr) => acc + (curr.alcance || 0), 0)}
            isLoading={loading}
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
              <MetricChart metrics={metrics} />
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
