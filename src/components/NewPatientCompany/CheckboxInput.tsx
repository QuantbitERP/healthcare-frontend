import { useDispatch, useSelector } from "react-redux";
import { clearValidationError } from "@/store/patientCompany/patientCompanySlice";
import { RootState } from "@/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  field: keyof RootState["patientCompanySave"]["data"];
  label: string;
  required?: boolean;
}
const CheckboxInput = ({ field, label, required }: Props) => {
  const dispatch = useDispatch();
  const checked = useSelector((state: RootState) => state.patientCompanySave.data[field]) || false;
  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2 px-2 py-1">
        <Checkbox 
          id={`checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`}
          checked={checked === true}
          onCheckedChange={() => {
           // dispatch(updateField({ field, value: !!val }));
            if (validationError) {
              dispatch(clearValidationError(field as string));
            }
            }}
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

export default CheckboxInput;
