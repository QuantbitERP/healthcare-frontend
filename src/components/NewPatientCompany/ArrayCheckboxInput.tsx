import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  field: keyof RootState["patientCompanySave"]["data"];
  value: string;
  label: string;
  required?: boolean;
}

const ArrayCheckboxInput = ({ field, value, label, required }: Props) => {
  
  // Get the current selection state from Redux
  const selected = useSelector((state: RootState) => {
    const fieldData = state.patientCompanySave?.data?.[field];
    return Array.isArray(fieldData) ? fieldData.includes(value) : false;
  });

  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );

  const handleToggle = () => {
    // dispatch(toggleArrayFieldItem({ field:field as keyof PatientCompanyData, value }));
    // if (validationError) {
    //   dispatch(clearValidationError(field as string));
    // }
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2 px-2 py-1">
        <Checkbox 
          id={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`} 
          checked={selected} 
          onCheckedChange={handleToggle} 
        />
        <Label 
          htmlFor={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm text-[#1C2024] cursor-pointer"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
      {validationError && (
        <p className="text-xs text-red-500 px-2">{validationError}</p>
      )}
    </div>
  );
};

export default ArrayCheckboxInput;
