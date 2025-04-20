
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetricChart from '@/components/MetricChart';
import { Metric } from '@/types/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MetricsChartProps {
  metrics: Metric[];
  loading: boolean;
  error: string | null;
}

const MetricsChart: React.FC<MetricsChartProps> = React.memo(({ metrics, loading, error }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gráfico de Métricas</CardTitle>
        <CardDescription>
          Visualização das métricas ao longo do tempo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {!loading && !error && metrics.length > 0 && (
          <MetricChart
            title="Métricas de Instagram"
            data={metrics}
            dataKey="reach"
            type="area"
          />
        )}
        
        {!loading && !error && metrics.length === 0 && (
          <div className="p-4 text-center">
            <p>Nenhuma métrica encontrada para o período selecionado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MetricsChart.displayName = 'MetricsChart';

export default MetricsChart;
