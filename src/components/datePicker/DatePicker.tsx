import React from 'react';
import { Calendar } from '@/components/ui/calendar';

const DatePicker: React.FC = () => {
  
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

export default DatePicker;
