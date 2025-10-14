import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  selected: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholderText?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select a date",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholderText}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
