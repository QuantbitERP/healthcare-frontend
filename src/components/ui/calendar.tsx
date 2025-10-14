"use client";
import * as React from "react";
import {
  DayPicker,
  DayPickerProps,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


type CalendarProps = DayPickerProps & {
  className?: string;
  classNames?: Partial<DayPickerProps["classNames"]>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-secondary-hover [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-zinc-50 hover:bg-secondary hover:text-white focus:bg-primary focus:text-zinc-50",
        day_today: "border !border-primary !bg-white !text-black",
        day_outside:
          "day-outside text-zinc-500 aria-selected:bg-zinc-100/50 aria-selected:text-zinc-500",
        day_disabled: "text-zinc-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-secondary-hover aria-selected:text-zinc-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      captionLayout="dropdown"
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
