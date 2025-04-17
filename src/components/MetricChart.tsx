
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, TooltipProps, AreaChart, Area 
} from 'recharts';
import { Metric } from '@/types/client';

interface MetricChartProps {
  title: string;
  data: Metric[];
  dataKey: keyof Metric;
  color?: string;
  secondaryColor?: string;
  className?: string;
  type?: 'line' | 'area';
  showGrid?: boolean;
}

const CustomTooltip = ({
  active, 
  payload, 
  label,
  dataKey
}: TooltipProps<any, any> & { dataKey: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
        <p className="text-gray-600 text-xs mb-1">{`${label}`}</p>
        <p className="font-semibold text-lg text-funillab-blue">
          {`${payload[0].value.toLocaleString()}`}
        </p>
        <p className="text-xs text-gray-500">{dataKey}</p>
      </div>
    );
  }

  return null;
};

const MetricChart: React.FC<MetricChartProps> = ({
  title,
  data,
  dataKey,
  color = '#021e4a',
  secondaryColor = '#00e5ff',
  className = '',
  type = 'area',
  showGrid = true,
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
    <Card className={`overflow-hidden shadow-md border-gray-100 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="text-funillab-blue text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart
                data={formattedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="#949494"
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke="#949494"
                  tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
                <Tooltip content={<CustomTooltip dataKey={metricName} />} />
                <Legend wrapperStyle={{ paddingTop: 15 }} />
                <Line 
                  type="monotone" 
                  dataKey={dataKey.toString()} 
                  name={metricName}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: secondaryColor }}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="#949494"
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke="#949494"
                  tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
                <Tooltip content={<CustomTooltip dataKey={metricName} />} />
                <Legend wrapperStyle={{ paddingTop: 15 }} />
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey={dataKey.toString()} 
                  name={metricName}
                  stroke={color}
                  strokeWidth={3}
                  fill={`url(#color-${dataKey})`}
                  activeDot={{ r: 6, strokeWidth: 0, fill: secondaryColor }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricChart;
