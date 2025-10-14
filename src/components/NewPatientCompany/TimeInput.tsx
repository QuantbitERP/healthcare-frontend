"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, clearValidationError } from "@/store/patientCompany/patientCompanySlice";
import { RootState } from "@/store";
import { ClockIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  field: keyof RootState["patientCompanySave"]["data"];
  required?: boolean;
  placeholder?: string;
}

const TimeInput = ({ label, field, required, placeholder }: Props) => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.patientCompanySave.data[field]) as string | undefined;
  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );

  const [isOpen, setIsOpen] = useState(false);

  // Parse the stored value or use current time as default
  const [selectedTime, setSelectedTime] = useState(() => {
    if (value && typeof value === "string") {
      return value;
    }
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM format
  });

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    dispatch(updateField({ field :field as any , value: newTime }));
    if (validationError) {
      dispatch(clearValidationError(field as string));
    }
    setIsOpen(false);
  };

  const generateTimeOptions = () => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) { // 15-minute intervals
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex flex-col space-y-3">
      <Label className="text-sm mb-2 text-[#1C2024]">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex relative flex-row items-center cursor-pointer">
            <Input
              type="text"
              className="outline-none px-4 py-2 h-[40px] w-full border border-[#D9D9E0] rounded-md cursor-pointer"
              readOnly
              value={selectedTime}
              placeholder={placeholder || "HH:MM"}
            />
            <ClockIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="max-h-64 overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                    selectedTime === time ? "bg-blue-100 text-blue-700" : ""
                  }`}
                  onClick={() => handleTimeChange(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {validationError && (
        <p className="text-xs text-red-500">{validationError}</p>
      )}
    </div>
  );
};

export default TimeInput;
