
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface CalendarEmbedProps {
  calendarUrl: string;
}

const CalendarEmbed: React.FC<CalendarEmbedProps> = ({ calendarUrl }) => {
  return (
    <Card className="mb-8 overflow-hidden border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-funillab-blue">
          <Calendar className="h-5 w-5" />
          Calendário de Publicações
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full">
          <iframe
            src={calendarUrl}
            className="w-full h-full border-0"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarEmbed;
