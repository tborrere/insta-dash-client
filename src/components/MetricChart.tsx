
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { Metric } from '@/types/client';

interface MetricChartProps {
  title: string;
  data: Metric[];
  dataKey: keyof Metric;
  color?: string;
  className?: string;
}

const CustomTooltip = ({
  active, 
  payload, 
  label,
  dataKey
}: TooltipProps<any, any> & { dataKey: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-gray-600">{`${label}`}</p>
        <p className="font-semibold text-funillab-purple">
          {`${dataKey}: ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

const MetricChart: React.FC<MetricChartProps> = ({
  title,
  data,
  dataKey,
  color = '#9b87f5',
  className = '',
}) => {
  // Format data for better display
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }));
  }, [data]);

  // Get nice human readable metric name
  const metricName = useMemo(() => {
    const names: Record<string, string> = {
      reach: 'Alcance',
      impressions: 'Impressões',
      likes: 'Curtidas',
      comments: 'Comentários',
      followers: 'Seguidores',
      engagement: 'Engajamento'
    };
    return names[dataKey.toString()] || dataKey.toString();
  }, [dataKey]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full px-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip dataKey={metricName} />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey.toString()} 
                name={metricName}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricChart;
