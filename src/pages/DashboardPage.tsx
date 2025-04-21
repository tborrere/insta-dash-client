
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import MetricChart from '@/components/MetricChart';
import CalendarEmbed from '@/components/CalendarEmbed';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { fetchClientInfo, fetchMetricsForClient } from '@/services/supabaseClient';
import { Metric } from '@/types/client';
import { HardDrive, FileText, Megaphone } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [clientInfo, setClientInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.clientId) {
          const client = await fetchClientInfo(user.clientId);
          setClientInfo(client);
          
          const clientMetrics = await fetchMetricsForClient(user.clientId);
          setMetrics(clientMetrics);
          setFilteredMetrics(clientMetrics);
        } else if (user?.role === 'admin') {
          const client = await fetchClientInfo('client1');
          setClientInfo(client);
          
          const clientMetrics = await fetchMetricsForClient('client1');
          setMetrics(clientMetrics);
          setFilteredMetrics(clientMetrics);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!dateRange?.from) {
      setFilteredMetrics(metrics);
      return;
    }

    const filtered = metrics.filter(metric => {
      const metricDate = new Date(metric.date);
      
      if (dateRange.from && !dateRange.to) {
        return metricDate >= dateRange.from;
      }
      
      if (dateRange.from && dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        return metricDate >= dateRange.from && metricDate < endDate;
      }
      
      return true;
    });
    
    setFilteredMetrics(filtered);
  }, [dateRange, metrics]);

  const latestMetrics = filteredMetrics.length > 0 ? filteredMetrics[filteredMetrics.length - 1] : null;
  
  const calculateTrend = (current: number, previous: number): number => {
    return previous ? Math.round(((current - previous) / previous) * 100) : 0;
  };

  const trendIndex = filteredMetrics.length > 7 ? filteredMetrics.length - 8 : 0;
  const previousMetrics = filteredMetrics[trendIndex];
  
  const trends = latestMetrics && previousMetrics ? {
    reach: calculateTrend(latestMetrics.reach, previousMetrics.reach),
    impressions: calculateTrend(latestMetrics.impressions, previousMetrics.impressions),
    likes: calculateTrend(latestMetrics.likes, previousMetrics.likes),
    comments: calculateTrend(latestMetrics.comments, previousMetrics.comments),
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-[90vh] items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const displayName = clientInfo?.name || user?.name || '';
  const driveUrl = clientInfo?.drive_url;
  const notionUrl = clientInfo?.notion_url;
  const anunciosUrl = clientInfo?.anuncios_url;

  console.log("Client info:", clientInfo);
  console.log("Drive URL:", driveUrl);
  console.log("Notion URL:", notionUrl);
  console.log("Anuncios URL:", anunciosUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">{displayName}</h1>
                <p className="text-secondary text-base mt-1">
                  Bem-vindo, <span className="font-bold">{displayName}</span>! Confira abaixo as métricas de desempenho da sua conta.
                </p>
              </div>
              <div className="flex gap-2">
                {/* DRIVE Button */}
                {driveUrl ? (
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 border rounded transition-colors duration-150 bg-white hover:bg-gray-100 hover:text-blue-900 text-gray-700"
                  >
                    <span className="mr-2">
                      <HardDrive className="h-5 w-5" />
                    </span>
                    DRIVE
                  </a>
                ) : (
                  <div className="flex items-center px-4 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed">
                    <span className="mr-2">
                      <HardDrive className="h-5 w-5" />
                    </span>
                    DRIVE
                  </div>
                )}
                
                {/* NOTION Button */}
                {notionUrl ? (
                  <a
                    href={notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 border rounded transition-colors duration-150 bg-white hover:bg-gray-100 hover:text-blue-900 text-gray-700"
                  >
                    <span className="mr-2">
                      <FileText className="h-5 w-5" />
                    </span>
                    NOTION
                  </a>
                ) : (
                  <div className="flex items-center px-4 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed">
                    <span className="mr-2">
                      <FileText className="h-5 w-5" />
                    </span>
                    NOTION
                  </div>
                )}
                
                {/* ANÚNCIOS Button */}
                {anunciosUrl ? (
                  <a
                    href={anunciosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 border rounded transition-colors duration-150 bg-white hover:bg-gray-100 hover:text-blue-900 text-gray-700"
                  >
                    <span className="mr-2">
                      <Megaphone className="h-5 w-5" />
                    </span>
                    ANÚNCIOS
                  </a>
                ) : (
                  <div className="flex items-center px-4 py-2 border rounded bg-gray-200 text-gray-400 cursor-not-allowed">
                    <span className="mr-2">
                      <Megaphone className="h-5 w-5" />
                    </span>
                    ANÚNCIOS
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CalendarEmbed 
          calendarUrl="https://calendar.google.com/calendar/embed?src=tborrere%40gmail.com&ctz=America%2FSao_Paulo" 
        />

        <div className="mb-8 flex justify-end">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-[300px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Alcance"
            value={latestMetrics?.reach.toLocaleString() || "0"}
            icon={<span />}
            trend={trends ? { value: trends.reach, isPositive: trends.reach >= 0 } : undefined}
          />
          
          <MetricCard
            title="Impressões"
            value={latestMetrics?.impressions.toLocaleString() || "0"}
            icon={<span />}
            trend={trends ? { value: trends.impressions, isPositive: trends.impressions >= 0 } : undefined}
          />
          
          <MetricCard
            title="Curtidas"
            value={latestMetrics?.likes.toLocaleString() || "0"}
            icon={<span />}
            trend={trends ? { value: trends.likes, isPositive: trends.likes >= 0 } : undefined}
          />
          
          <MetricCard
            title="Comentários"
            value={latestMetrics?.comments.toLocaleString() || "0"}
            icon={<span />}
            trend={trends ? { value: trends.comments, isPositive: trends.comments >= 0 } : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MetricChart 
            title="Crescimento de Seguidores" 
            data={filteredMetrics} 
            dataKey="followers" 
            color="#021e4a"
          />
          
          <MetricChart 
            title="Alcance nos Últimos Dias" 
            data={filteredMetrics} 
            dataKey="reach" 
            color="#021e4a"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricChart 
            title="Curtidas por Dia" 
            data={filteredMetrics} 
            dataKey="likes" 
            color="#021e4a"
          />
          
          <MetricChart 
            title="Comentários por Dia" 
            data={filteredMetrics} 
            dataKey="comments" 
            color="#021e4a"
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
