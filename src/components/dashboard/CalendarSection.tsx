
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CalendarEmbed from '@/components/CalendarEmbed';

interface CalendarSectionProps {
  calendarUrl: string | undefined;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Agendamentos</CardTitle>
        <CardDescription>
          Visualize e gerencie seus agendamentos de conteúdo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {calendarUrl ? (
          <CalendarEmbed calendarUrl={calendarUrl} />
        ) : (
          <p>Nenhum calendário associado a este cliente.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
