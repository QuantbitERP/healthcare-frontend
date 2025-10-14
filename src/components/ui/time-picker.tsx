"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: Date | undefined ;
  onChange: (newTime: Date) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hours, setHours] = React.useState<number>(
    value ? value.getHours() : 0
  );
  const [minutes, setMinutes] = React.useState<number>(
    value ? value.getMinutes() : 0
  );
  const hoursRef = React.useRef<HTMLDivElement>(null);
  const minutesRef = React.useRef<HTMLDivElement>(null);

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const newDate = new Date();
    newDate.setHours(newHours);
    newDate.setMinutes(newMinutes);
    onChange(newDate);
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const container = e.currentTarget as HTMLDivElement;
      container.scrollTop += e.deltaY;
    };

    const hoursContainer = hoursRef.current;
    const minutesContainer = minutesRef.current;

    if (hoursContainer) {
      hoursContainer.addEventListener("wheel", handleWheel, { passive: false });
    }
    if (minutesContainer) {
      minutesContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (hoursContainer) {
        hoursContainer.removeEventListener("wheel", handleWheel);
      }
      if (minutesContainer) {
        minutesContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div className="w-full p-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="text-xs font-medium text-[#60646C] mb-1">Hours</div>
          <div
            ref={hoursRef}
            className="h-[100px] overflow-y-auto border border-[#D9D9E0] rounded-md"
          >
            {hoursArray.map((hour) => (
              <button
                key={hour}
                className={cn(
                  "w-full py-1 px-2 text-xs text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] focus:bg-[#E6F4FE] focus:text-[#0D74CE]",
                  hours === hour && "bg-[#E6F4FE] text-[#0D74CE]"
                )}
                onClick={() => {
                  setHours(hour);
                  handleTimeChange(hour, minutes);
                }}
              >
                {hour.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-[#60646C] mb-1">Minutes</div>
          <div
            ref={minutesRef}
            className="h-[100px] overflow-y-auto border border-[#D9D9E0] rounded-md"
          >
            {minutesArray.map((minute) => (
              <button
                key={minute}
                className={cn(
                  "w-full py-1 px-2 text-xs text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] focus:bg-[#E6F4FE] focus:text-[#0D74CE]",
                  minutes === minute && "bg-[#E6F4FE] text-[#0D74CE]"
                )}
                onClick={() => {
                  setMinutes(minute);
                  handleTimeChange(hours, minute);
                }}
              >
                {minute.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
