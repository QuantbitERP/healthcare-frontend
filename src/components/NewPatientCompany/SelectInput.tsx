import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
  clearValidationError,
} from "@/store/patientCompany/patientCompanySlice";
import { RootState } from "@/store";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

interface Props {
  label: string;
  field: keyof RootState["patientCompanySave"]["data"];
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  required?: boolean;
}

const SelectInput = ({ label, field, options, onChange, required }: Props) => {
  const dispatch = useDispatch();
  const [selectedOptionFound, setSelectedOptionFound] = useState(false);

  const selectedId =
    useSelector((state: RootState) => state.patientCompanySave.data[field]) ||
    "";

  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );
  const actualSelectedId = Array.isArray(selectedId)
    ? selectedId[0]
    : selectedId;

  const selectedOption = options.find((opt) => opt.label === actualSelectedId);

  useEffect(() => {
    if (selectedOption && !selectedOptionFound) {
      setSelectedOptionFound(true);
    }
  }, [selectedOption, selectedOptionFound]);
  if (options.length === 0 && actualSelectedId) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="text-sm mb-2 text-[#1C2024]">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
        <div className="w-full h-[40px] border border-[#D9D9E0] rounded-md flex items-center px-4 py-2 text-gray-500">
          Loading options...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm mb-2 text-[#1C2024]">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <Select
        onValueChange={(val) => {
          console.log(val);
          console.log("aseelasd");

          const selected = options.find((opt) => opt.value === val);
          if (selected) {
            const valueToStore = Array.isArray(selectedId)
              ? [selected.value]
              : selected.value;

            console.log({ valueToStore });

            dispatch(updateField({ field: field as any, value: valueToStore }));
            onChange?.(selected.value);
            // Clear validation error when user selects an option
            if (validationError) {
              dispatch(clearValidationError(field as string));
            }
          }
        }}
        value={selectedOption?.value || ""}
      >
        <SelectTrigger className="w-full h-[40px] border border-[#D9D9E0] rounded-md">
          <SelectValue placeholder={`Select ${label}`}>
            {selectedOption?.value || ""}
          </SelectValue>
          <Image
            src="assets/icons/CaretDownDark.svg"
            height={16}
            width={16}
            alt="dropdown"
          />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0 z-[300]"
        >
          <Command>
            <CommandInput placeholder="Search" />
            <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="px-0 py-0">
                {(options ?? []).map((opt) => (
                  <CommandItem
                    key={opt.label}
                    onSelect={() => {
                      // For array fields, store as array with single item
                      const valueToStore = Array.isArray(selectedId)
                        ? [opt.label]
                        : opt.label;
                      console.log(valueToStore);
                      console.log("adsad");
                      dispatch(updateField({ field: field as any, value: valueToStore }));
                      onChange?.(opt.value);
                      if (validationError) {
                        dispatch(clearValidationError(field as string));
                      }
                    }}
                    className="h-9 cursor-pointer w-full px-4 py-2 flex text-[#1C2024] text-sm hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                  >
                    {opt.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </SelectContent>
      </Select>
      {validationError && (
        <p className="text-xs text-red-500">{validationError}</p>
      )}
    </div>
  );
};

export default SelectInput;
