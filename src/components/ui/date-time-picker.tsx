"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimePickerDropdown } from "./time-picker-dropdown";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const newDateTime = new Date(newDate);
      newDateTime.setHours(value.getHours());
      newDateTime.setMinutes(value.getMinutes());
      onChange(newDateTime);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              className="h-9.5 py-4 pr-10 cursor-pointer w-48"
              readOnly
              disabled={disabled}
              value={format(value, "MM/dd/yyyy h:mm a")}
              placeholder={placeholder}
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="border-t border-[#D9D9E0] p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <TimePickerDropdown value={value} onChange={onChange}>
                  <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                    <span className="text-sm font-medium">
                      {format(value, "h:mm a")}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </div>
                </TimePickerDropdown>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
