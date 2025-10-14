import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateField, clearValidationError } from "@/store/patientCompany/patientCompanySlice";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { useState } from "react";

interface Props {
  field: keyof RootState["patientCompanySave"]["data"];
  label: string;
  required?: boolean;
  placeholder?: string;
}

const DateInput = ({ field, label, required, placeholder }: Props) => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.patientCompanySave.data[field]);
  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );

  // Convert the stored value to a Date object, or use current date as default
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (value && typeof value === "string") {
      try {
        return new Date(value);
      } catch {
        return new Date();
      }
    }
    return new Date();
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
      dispatch(updateField({
        field:field as any,
        value: newDate.toISOString(),
      }));
      if (validationError) {
        dispatch(clearValidationError(field as string));
      }
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm mb-2 text-[#1C2024]">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex relative flex-row items-center cursor-pointer">
            <Input
              type="text"
              className="outline-none px-4 py-2 h-[40px] w-full border border-[#D9D9E0] rounded-md cursor-pointer"
              readOnly
              value={format(selectedDate, "MM/dd/yyyy")}
              placeholder={placeholder || "MM/DD/YYYY"}
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {validationError && (
        <p className="text-xs text-red-500">{validationError}</p>
      )}
    </div>
  );
};

export default DateInput;
