import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
  clearValidationError,
} from "@/store/patientCompany/patientCompanySlice";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";

interface Props {
  label: string;
  field: keyof RootState["patientCompanySave"]["data"];
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const TextInput = ({ type, label, field, placeholder, required }: Props) => {
  const dispatch = useDispatch();
  const value =
    useSelector((state: RootState) => state.patientCompanySave.data[field]) ||
    "";
  const validationError = useSelector(
    (state: RootState) => state.patientCompanySave.validationErrors[field]
  );

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm mb-2 text-[#1C2024]">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <Input
        value={
          typeof value === "string" || typeof value === "number" ? value : ""
        }
        type={type || "text"}
        onChange={(e) => {
          console.log(e.target.value);

          dispatch(
            updateField({
              field:field as any,
              value:e.target.value,
            })
          );
          if (validationError) {
            dispatch(clearValidationError(field as string));
          }
        }}
        placeholder={placeholder}
        className="outline-none px-4 py-2 h-[40px] w-full border border-[#D9D9E0] rounded-md"
      />
      {validationError && (
        <p className="text-xs text-red-500">{validationError}</p>
      )}
    </div>
  );
};

export default TextInput;
