
import React, { useMemo } from 'react';
import MetricCard from '@/components/MetricCard';
import { Metric } from '@/types/client';

interface MetricsSummaryProps {
  metrics: Metric[];
  isLoading: boolean;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics, isLoading }) => {
  // Memoizando os cálculos para evitar recálculos desnecessários
  const summaryData = useMemo(() => {
    if (isLoading || metrics.length === 0) {
      return {
        followers: 0,
        likes: 0,
        comments: 0,
        reach: 0
      };
    }
    
    return {
      followers: metrics.reduce((acc, curr) => acc + (curr.followers || 0), 0),
      likes: metrics.reduce((acc, curr) => acc + (curr.likes || 0), 0),
      comments: metrics.reduce((acc, curr) => acc + (curr.comments || 0), 0),
      reach: metrics.reduce((acc, curr) => acc + (curr.reach || 0), 0)
    };
  }, [metrics, isLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Seguidores"
        value={summaryData.followers}
        icon={<span>👥</span>}
      />
      <MetricCard
        title="Curtidas"
        value={summaryData.likes}
        icon={<span>👍</span>}
      />
      <MetricCard
        title="Comentários"
        value={summaryData.comments}
        icon={<span>💬</span>}
      />
      <MetricCard
        title="Alcance"
        value={summaryData.reach}
        icon={<span>📊</span>}
      />
    </div>
  );
};

export default MetricsSummary;
