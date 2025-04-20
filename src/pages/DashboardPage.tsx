
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import MetricsSummary from '@/components/dashboard/MetricsSummary';
import MetricsChart from '@/components/dashboard/MetricsChart';
import CalendarSection from '@/components/dashboard/CalendarSection';
import { useMetrics } from '@/hooks/useMetrics';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    metrics, 
    loading, 
    error, 
    dateRange, 
    setDateRange 
  } = useMetrics(user?.clientId);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <ErrorBoundary fallback="Ocorreu um erro ao carregar o painel">
          <DashboardOverview 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          
          <MetricsSummary 
            metrics={metrics} 
            isLoading={loading} 
          />
          
          <MetricsChart 
            metrics={metrics}
            loading={loading}
            error={error}
          />
          
          <CalendarSection calendarUrl={user?.calendar} />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default DashboardPage;
