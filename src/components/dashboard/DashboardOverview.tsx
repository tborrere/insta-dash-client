
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';

interface DashboardOverviewProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  dateRange, 
  onDateRangeChange 
}) => {
  return (
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
          onDateRangeChange={onDateRangeChange}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;
