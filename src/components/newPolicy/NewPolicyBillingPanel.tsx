"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Buttons from "@/components/buttons/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

import { AppDispatch, RootState } from "@/store";
import {
  createPolicyTableData,
  fetchEmployeePolicySubCategories,
  fetchFilterOptions,
  fetchPrefix,
  updateEmployeePolicy,
  fetchDependentRelations,
} from "@/store/employee_policies/thunks";
import { API_VERSION } from "@/utils/constants";

import { DistributeDataTable } from "./DistributeAmountTable";
import SetLimitsEditableTable from "./SetLimitsEditableTable";
import { useRouter } from "next/navigation";
import Alerts from "../alerts/Alerts";
import { t } from "@/utils/languages";
import { extractApiErrorMessage } from "@/utils/errorHandler";

/* ---------------- Reusable Components ---------------- */

const CardWrapper: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="w-full p-6 bg-white shadow-xs border border-[#D9D9E0] rounded-xl space-y-6">
    {(title || description) && (
      <div className="space-y-2">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    )}
    {children}
  </div>
);

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  label: string;
  value: string | undefined;
  options: Option[];
  placeholder: string;
  onChange: any;
  error?: string;
  required?: boolean;
}

type AlertVariant = "success" | "warning" | "danger" | "primary" | "secondary";

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
  required = false,
}) => {
  // Find the selected option to get its display value
  const selectedOption = options.find((opt: any) => opt.key === value);
  const displayValue = selectedOption ? selectedOption.value : value;

  return (
    <div className="flex flex-col space-y-3">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full h-9.5">
          <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
          <Image
            src="/assets/icons/CaretDownDark.svg"
            height={16}
            width={16}
            alt="dropdown"
          />
        </SelectTrigger>

        <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
          <Command>
            <CommandInput placeholder="Search" />
            <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2">
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt: any) => (
                  <CommandItem
                    key={opt.key}
                    onSelect={() => onChange(opt.key)}
                    className="flex items-center px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                  >
                    {opt.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

interface DatePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
}) => (
  <div className="flex flex-col space-y-3">
    <Label>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex relative flex-row items-center cursor-pointer">
          <Input
            type="text"
            className="min-w-55 h-9.5 py-4 cursor-pointer"
            readOnly
            value={format(value, "MM/dd/yyyy")}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black pointer-events-none"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => d && onChange(d)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {error && (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);

/* ---------------- Main Component ---------------- */

const ReceiptDetailPanel = ({ policyData }: { policyData?: any }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: filters, prefix, dependentRelations } = useSelector(
    (state: RootState) => state.employeePoliciesFilters
  );

  const [employeeCategory, setEmployeeCategory] = useState<string>();
  const [subCategory, setSubCategory] = useState<string>();
  const [validFrom, setValidFrom] = useState<Date>(new Date());
  const [validTill, setValidTill] = useState<Date>(new Date());
  const [dependentLists, setDependentLists] = useState<any[]>([]);
  
  
  // Process dependent lists data to ensure proper format
  const processedDependentLists = useMemo(() => {
    if (!dependentLists || dependentLists.length === 0) return [];
    
    return dependentLists.map((item: any) => {
      // If the item doesn't have dependentRelationId, try to find it from dependentRelations
      if (!item.dependentRelationId && item.dependentRelation) {
        const relation = dependentRelations.find((rel: any) => rel.value === item.dependentRelation);
        return {
          ...item,
          dependentRelationId: relation?.key || item.dependentRelation,
        };
      }
      return item;
    });
  }, [dependentLists, dependentRelations]);
  const [countList, setCountList] = useState<any>();

  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    heading?: string;
    content?: string;
    variant?: AlertVariant;
  }>({ open: false });

  const [formFieldErrors, setFormFieldErrors] = useState<Record<string, string>>({});

  /* 🔹 Pre-fill data when policyData is available */
  useEffect(() => {
    if (policyData) {
      setEmployeeCategory(policyData.employeeCategoryId);
      setSubCategory(policyData.employeeSubCategoryId);
      setValidFrom(new Date(policyData.validFrom));
      setValidTill(new Date(policyData.validTill));

      setCountList({
        opd: policyData.opdLimit,
        ipd: policyData.ipdLimit,
        total: policyData.totalLimit ?? policyData.allLimit, // fallback
      });

      setDependentLists(
        policyData.dependentLists?.map((d: any) => ({
          id: d.id,
          dependentRelationId: d.dependentNumber, // adjust if different in UI
          maxDependents: d.maxDependent,
          fromAge: d.fromAge,
          toAge: d.toAge,
        })) || []
      );
    }
  }, [policyData]);
  /* 🔹 Load dropdown/filter data */
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        dispatch(fetchPrefix({ version: API_VERSION }));
        dispatch(fetchFilterOptions({ version: API_VERSION }));
        dispatch(fetchDependentRelations({ version: API_VERSION, tenant: "" }));
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    
    if (employeeCategory && isMounted) {
      dispatch(
        fetchEmployeePolicySubCategories({
          categoryId: employeeCategory,
          version: API_VERSION,
        })
      );
    }
    
    return () => {
      isMounted = false;
    };
  }, [employeeCategory, dispatch]);

  const categories = useMemo(() => filters?.category || [], [filters]);
  const subCategories = useMemo(() => filters?.subCategories || [], [filters]);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate Employee Category
    if (!employeeCategory) {
      newErrors.employeeCategory = t("error.requiredField", { field: "Employee Category" });
      isValid = false;
    }

    // Validate Sub Category
    if (!subCategory) {
      newErrors.subCategory = t("error.requiredField", { field: "Sub Category" });
      isValid = false;
    }

    // Validate dates - Valid Till should be greater than Valid From
    if (validTill <= validFrom) {
      newErrors.validTill = t("success.employeePolicyValidTillGreaterThanFrom");
      isValid = false;
    }

    // Validate limits - At least one of IPD, OPD, or All must have a value greater than zero
    const opdValue = countList?.opd || 0;
    const ipdValue = countList?.ipd || 0;
    const totalValue = countList?.total || 0;
    
    if (opdValue <= 0 && ipdValue <= 0 && totalValue <= 0) {
      newErrors.limits = t("success.employeePolicyAtLeastOneLimit");
      isValid = false;
    }

    setFormFieldErrors(newErrors);
    return isValid;
  };
  
  const onSubmit = async () => {
    // Clear previous errors
    setFormFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    const requestBody = {
      model: {
        employeeCategory,
        subCategory: [subCategory],
        validFrom,
        validTill,
        opd: countList?.opd,
        ipd: countList?.ipd,
        all: countList?.total,
        // Array of dependent eligibility records - each record represents a table row
        eligibilityList: processedDependentLists.map((e: any) => ({
          // eligibilityId: e.id || null, // Only needed for updates
          dependencyRelation: Number(e.dependentRelationId), // Dependency enum value (1-7)
          fromAge: e.fromAge, // Minimum age
          toAge: e.toAge, // Maximum age
          maxDependency: e.maxDependents, // Maximum number of dependents
        })),
      },
    } as any;
    

    try {
      if (policyData) {
        requestBody.model.employeePolicyId = policyData.id;
        requestBody.model.subCategory = subCategory;
        
        // For update API, use updateEligibilityList with eligibilityId
        requestBody.model.updateEligibilityList = processedDependentLists.map((e: any) => ({
          eligibilityId: e.id || null, // Include eligibilityId for updates
          dependencyRelation: Number(e.dependentRelationId), // Dependency enum value (1-7)
          fromAge: e.fromAge, // Minimum age
          toAge: e.toAge, // Maximum age
          maxDependency: e.maxDependents, // Maximum number of dependents
        }));

        await dispatch(
          updateEmployeePolicy({
            version: API_VERSION,
            body: requestBody,
          })
        ).unwrap();
        
        // Redirect to listing page with success message
        router.push('/employee_policies?success=updated');
      } else {
        await dispatch(
          createPolicyTableData({
            version: API_VERSION,
            requestBody,
          })
        ).unwrap();

        // Redirect to listing page with success message
        router.push('/employee_policies?success=created');
      }
    } catch (error: any) {
      // Extract actual error message from API response using utility function
      const errorMessage = extractApiErrorMessage(error);

      // Display the error
      setAlertConfig({
        open: true,
        heading: "Error!",
        content: errorMessage,
        variant: "danger",
      });
    }
  };

  return (
    <>
      <div
        className="overflow-y-auto no-scrollbar w-full px-60 pb-20"
        style={{ height: "calc(100vh - 110px)" }}
      >
        {alertConfig.open && (
          <div className="mb-4">
            <Alerts
              heading={alertConfig.heading}
              content={alertConfig.content}
              variant={alertConfig.variant}
              open={alertConfig.open}
              showCloseIcon
              onClick={() => setAlertConfig({ open: false })}
            />
          </div>
        )}

        <div className="space-y-6 flex flex-col w-full mx-auto">
          <CardWrapper
            title="Policy Details"
            description="Enter policy specifics for selected employee categories."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormSelect
                label="Employee Category"
                value={employeeCategory}
                options={categories}
                placeholder="Select Category"
                onChange={setEmployeeCategory}
                error={formFieldErrors.employeeCategory}
                required={true}
              />
              <FormSelect
                label="Sub Category"
                value={subCategory}
                options={subCategories}
                placeholder="Select Sub Category"
                onChange={setSubCategory}
                error={formFieldErrors.subCategory}
                required={true}
              />
              <DatePickerInput
                label="Valid From"
                value={validFrom}
                onChange={setValidFrom}
              />
              <DatePickerInput
                label="Valid Till"
                value={validTill}
                onChange={setValidTill}
                error={formFieldErrors.validTill}
              />
            </div>
          </CardWrapper>

          <CardWrapper>
            <SetLimitsEditableTable
              onDataChange={setCountList}
              data={countList}
            />
            {formFieldErrors.limits && (
              <p className="text-xs text-red-500 mt-3">
                {formFieldErrors.limits}
              </p>
            )}
          </CardWrapper>

          <CardWrapper>
            <DistributeDataTable
              tabledata={dependentRelations.length > 0 ? dependentRelations : prefix}
              onDataChange={setDependentLists}
              initialData={dependentLists}
            />
          </CardWrapper>
        </div>
      </div>

      <div
        id="footer"
        className="z-[100] bg-white w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 "
      >
        <div className="w-fit h-fit flex items-center gap-4"></div>
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={() => router.push("/employee_policies")}
          >
            Cancel
          </Buttons>
          <Buttons
            onClick={onSubmit}
            size="button-medium"
            type="primary-button"
            variant="button"
          >
            Save Changes
          </Buttons>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetailPanel;
