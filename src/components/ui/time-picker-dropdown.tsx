"use client";

import * as React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerDropdownProps {
  value: Date;
  onChange: (date: Date) => void;
  children: React.ReactNode;
}

export function TimePickerDropdown({ value, onChange, children }: TimePickerDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState<number>(value.getHours());
  const [minutes, setMinutes] = React.useState<number>(value.getMinutes());
  const minutesRef = React.useRef<HTMLDivElement>(null);

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const newDateTime = new Date(value);
    newDateTime.setHours(newHours);
    newDateTime.setMinutes(newMinutes);
    onChange(newDateTime);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(e.target.value) || 0;
    if (newHours >= 0 && newHours <= 23) {
      setHours(newHours);
      handleTimeChange(newHours, minutes);
    }
  };

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes);
    handleTimeChange(hours, newMinutes);
  };

  React.useEffect(() => {
    setHours(value.getHours());
    setMinutes(value.getMinutes());
  }, [value]);

  React.useEffect(() => {
    if (minutesRef.current) {
      const selectedElement = minutesRef.current.querySelector(
        `[data-minute="${minutes}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [minutes]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Hours</span>
            <Input
              type="number"
              min="0"
              max="23"
              value={hours.toString().padStart(2, "0")}
              onChange={handleHoursChange}
              className="w-12 h-7 text-center text-sm"
            />
          </div>
          <span className="text-lg font-semibold text-gray-700">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Minutes</span>
            <div className="relative">
              <div
                ref={minutesRef}
                className="w-12 h-16 overflow-y-auto border border-gray-200 rounded-md bg-white"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <div
                    key={i}
                    data-minute={i}
                    className={cn(
                      "h-8 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100",
                      minutes === i && "bg-blue-100 text-blue-600 font-medium"
                    )}
                    onClick={() => handleMinutesChange(i)}
                  >
                    {i.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
