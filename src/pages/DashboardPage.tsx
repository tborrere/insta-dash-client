
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import MetricChart from '@/components/MetricChart';
import { getClientById, getMetricsForClient } from '@/services/mockData';
import { Metric } from '@/types/client';
import { Instagram, TrendingUp, Eye, Heart, MessageCircle, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.clientId) {
          // For client users, fetch their own data
          const clientMetrics = getMetricsForClient(user.clientId);
          setMetrics(clientMetrics);
        } else if (user?.role === 'admin') {
          // For admin users, fetch a default client (for demo)
          const clientMetrics = getMetricsForClient('client1');
          setMetrics(clientMetrics);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Get the latest metrics data
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  
  // Calculate growth trends (for demonstration)
  const calculateTrend = (current: number, previous: number): number => {
    return previous ? Math.round(((current - previous) / previous) * 100) : 0;
  };

  // Get trends by comparing the latest data with data from a week ago
  const trendIndex = metrics.length > 7 ? metrics.length - 8 : 0;
  const previousMetrics = metrics[trendIndex];
  
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-funillab-purple"></div>
        </div>
      </div>
    );
  }

  const clientInfo = user?.clientId ? getClientById(user.clientId) : null;
  const displayName = clientInfo?.name || user?.name || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Métricas do Instagram</h1>
          <p className="text-gray-600">
            Bem-vindo, <span className="font-medium">{displayName}</span>! 
            Confira abaixo as métricas de desempenho da sua conta.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Alcance"
            value={latestMetrics?.reach.toLocaleString() || "0"}
            icon={<Eye className="h-4 w-4 text-primary" />}
            trend={trends ? { value: trends.reach, isPositive: trends.reach >= 0 } : undefined}
          />
          
          <MetricCard
            title="Impressões"
            value={latestMetrics?.impressions.toLocaleString() || "0"}
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            trend={trends ? { value: trends.impressions, isPositive: trends.impressions >= 0 } : undefined}
          />
          
          <MetricCard
            title="Curtidas"
            value={latestMetrics?.likes.toLocaleString() || "0"}
            icon={<Heart className="h-4 w-4 text-primary" />}
            trend={trends ? { value: trends.likes, isPositive: trends.likes >= 0 } : undefined}
          />
          
          <MetricCard
            title="Comentários"
            value={latestMetrics?.comments.toLocaleString() || "0"}
            icon={<MessageCircle className="h-4 w-4 text-primary" />}
            trend={trends ? { value: trends.comments, isPositive: trends.comments >= 0 } : undefined}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MetricChart 
            title="Crescimento de Seguidores" 
            data={metrics} 
            dataKey="followers" 
          />
          
          <MetricChart 
            title="Alcance nos Últimos 30 Dias" 
            data={metrics} 
            dataKey="reach" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricChart 
            title="Curtidas por Dia" 
            data={metrics} 
            dataKey="likes" 
          />
          
          <MetricChart 
            title="Comentários por Dia" 
            data={metrics} 
            dataKey="comments" 
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
