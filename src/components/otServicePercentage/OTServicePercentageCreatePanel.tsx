"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Buttons from "@/components/buttons/Button";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { AppDispatch, RootState } from "@/store";
import {
  fetchHospitals,
  fetchDepartments,
  fetchRateNames,
  fetchCompanies,
  fetchServices,
  fetchBillingClasses,
  saveOTServicePercentage,
  updateOTServicePercentage,
  fetchOperationCategories,
} from "@/store/actions/otServicePercentageActions";

import { ServiceDetailsTable } from "./ServiceDetailsTable";
import { ServiceDetailItem } from "./ServiceDetailsTableData";
import CappingChargesModal from "./CappingChargesModal";
import { useRouter } from "next/navigation";
import Alerts from "../alerts/Alerts";
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between h-10 px-3 py-2 text-sm border border-[#D9D9E0] rounded-md"
          >
            <span
              className={`truncate ${!displayValue ? "text-gray-400" : ""}`}
            >
              {displayValue || placeholder}
            </span>
            <Image
              src="assets/icons/CaretDownDark.svg"
              height={16}
              width={16}
              alt="dropdown"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 border border-[#D9D9E0] rounded-md shadow-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList className="max-h-200">
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: any) => (
                  <CommandItem
                    key={option.key}
                    value={option.key}
                    onSelect={() => onChange(option.key)}
                    className="flex items-center px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                  >
                    {option.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

/* ---------------- Main Component ---------------- */

interface GlobalSettings {
  categoryId: string;
  companyId: string;
  departmentId: string;
  rateNameId: string;
  hospitalId: string;
  percentage: boolean;
  isCathlabApplicable: boolean;
}

const OTServicePercentageCreatePanel = ({
  existingData,
}: {
  existingData?: any;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get filter options from store
  const {
    hospitals,
    departments,
    rateNames,
    companies,
    services: fetchedServices,
    operationCategories,
    billingClasses,
  } = useSelector((state: RootState) => state.otServicePercentage);

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    categoryId: "",
    companyId: "",
    departmentId: "",
    rateNameId: "",
    hospitalId: "",
    percentage: false,
    isCathlabApplicable: false,
  });

  const [serviceDetails, setServiceDetails] = useState<ServiceDetailItem[]>([]);
  const [formFieldErrors, setFormFieldErrors] = useState<
    Record<string, string>
  >({});
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [isCappingModalOpen, setIsCappingModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<ServiceDetailItem | null>(null);

  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    heading?: string;
    content?: string;
    variant?: AlertVariant;
  }>({ open: false });

  // Process data to ensure proper format
  const processedServiceDetails = useMemo(() => {
    if (!serviceDetails || serviceDetails.length === 0) return [];

    return serviceDetails.map((item: any) => ({
      ...item,
      // Add any processing logic here if needed
    }));
  }, [serviceDetails]);

  /* 🔹 Pre-fill global settings when existingData is available */
  useEffect(() => {
    let isMounted = true;

    if (existingData && isMounted) {
      setGlobalSettings({
        categoryId: existingData.categoryId || "",
        companyId: existingData.companyId || "",
        departmentId: existingData.departmentId || "",
        rateNameId: existingData.rateNameId || "",
        hospitalId: existingData.hospitalId || "",
        percentage: existingData.percentage || false,
        isCathlabApplicable: existingData.isCathlabApplicable || false,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [existingData]);

  /* 🔹 Transform existing service details when both existingData and billingClasses are available */
  useEffect(() => {
    let isMounted = true;

    if (
      existingData &&
      billingClasses &&
      billingClasses.length > 0 &&
      isMounted
    ) {
      // Transform existing service details to match component structure
      if (
        existingData.servicesDetails &&
        existingData.servicesDetails.length > 0
      ) {
        const transformedServiceDetails = existingData.servicesDetails.map(
          (service: any) => {
            // Transform roomCategorys to match billing classes structure
            const transformedRoomCategorys = billingClasses.map(
              (billingClass) => {
                // Find matching room category in the original data using flexible matching
                const originalRoomCategory = service.roomCategorys?.find(
                  (rc: any) => {
                    const categoryName =
                      rc.roomCategoryName?.toLowerCase() || "";
                    const billingClassName =
                      billingClass.value?.toLowerCase() || "";

                    // Flexible matching - check if the billing class name contains key parts of the category name
                    // This works for any room category naming convention
                    return (
                      categoryName.includes(billingClassName) ||
                      billingClassName.includes(categoryName)
                    );
                  }
                );

                return {
                  ...(originalRoomCategory?.detailID
                    ? { detailID: originalRoomCategory.detailID }
                    : {}),
                  roomCategoryId: billingClass.key,
                  amountorPercentage:
                    originalRoomCategory?.amountorPercentage || 0,
                };
              }
            );

            // Transform cappingRoomCategorys to match billing classes structure
            const transformedCappingRoomCategorys = billingClasses.map(
              (billingClass) => {
                // Find matching capping room category in the original data using flexible matching
                const originalCappingRoomCategory =
                  service.cappingRoomCategorys?.find((rc: any) => {
                    const categoryName =
                      rc.cappingRoomCategoryName?.toLowerCase() || "";
                    const billingClassName =
                      billingClass.value?.toLowerCase() || "";

                    // Flexible matching - check if the billing class name contains key parts of the category name
                    // This works for any room category naming convention
                    return (
                      categoryName.includes(billingClassName) ||
                      billingClassName.includes(categoryName)
                    );
                  });

                return {
                  ...(originalCappingRoomCategory?.detailID
                    ? { detailID: originalCappingRoomCategory.detailID }
                    : {}),
                  cappingRoomCategoryId: billingClass.key,
                  cappingAmountorPercentage:
                    originalCappingRoomCategory?.cappingAmountorPercentage || 0,
                };
              }
            );

            return {
              id: service.id || Date.now().toString(),
              serviceId: service.serviceId || "",
              serviceName: service.serviceName || "",
              serviceCode: service.serviceCode || "",
              baseHrs: service.baseHours || 0,
              opd: 0, // This field doesn't exist in API response, keeping default
              // Remove unused static fields
              classASPR: 0,
              classASTD: 0,
              classAA: 0,
              classBAC: 0,
              classBCo: 0,
              // Store the transformed data
              cappingRoomCategorys: transformedCappingRoomCategorys,
              roomCategorys: transformedRoomCategorys,
              isCapping: service.isCapping || false,
              cappingHours: service.cappingHours || 0,
              servicePercentageId: service.servicePercentageId || service.id, // For update API
            };
          }
        );

        setServiceDetails(transformedServiceDetails);
      } else {
        setServiceDetails([]);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [existingData, billingClasses]);

  /* 🔹 Load dropdown/filter data */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        dispatch(fetchHospitals());
        dispatch(fetchRateNames());
        dispatch(fetchCompanies());
        dispatch(fetchBillingClasses()); // Room categories
        dispatch(fetchOperationCategories());
        dispatch(fetchDepartments({ hospitalIds: [] })); // Load all departments
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Refresh room categories on component mount
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      dispatch(fetchBillingClasses());
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (globalSettings.hospitalId && isMounted) {
      dispatch(fetchServices({ hospitalId: globalSettings.hospitalId }));
    }

    return () => {
      isMounted = false;
    };
  }, [globalSettings.hospitalId, dispatch]);

  // Transform data for dropdowns
  const transformData = (data: any[]) => {
    return (
      data?.map((item: any) => ({
        key: item.id || item.key,
        value: item.name || item.value || item.label,
        label: item.name || item.value || item.label,
      })) || []
    );
  };

  const handleGlobalSettingsChange = (
    field: keyof GlobalSettings,
    value: any
  ) => {
    setGlobalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear selected service when hospital changes
    if (field === "hospitalId") {
      setSelectedServiceId("");
    }

    // Clear related errors
    if (formFieldErrors[field]) {
      setFormFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleServiceNameClick = (service: ServiceDetailItem) => {
    setSelectedServiceForModal(service);
    setIsCappingModalOpen(true);
  };

  const handleCappingModalClose = () => {
    setIsCappingModalOpen(false);
    setSelectedServiceForModal(null);
  };

  const handleCappingModalSave = (data: any) => {
    // Update the service details with the new data
    setServiceDetails((prev) =>
      prev.map((service) =>
        service.id === selectedServiceForModal?.id
          ? {
            ...service,
            baseHrs: data.cappingHrs,
            cappingHours: data.cappingHrs,
            isCapping: true,
            opd: data.opd,
            // Update capping room categories structure using billing classes
            cappingRoomCategorys:
              billingClasses && billingClasses.length > 0
                ? billingClasses
                  .map((billingClass) => {
                    const fieldKey = `roomCategory_${billingClass.key}`;
                    const amount = data[fieldKey] || 0;

                    // Find existing capping room category to get detailID
                    const existingCappingRoomCategory =
                      service.cappingRoomCategorys?.find(
                        (rc: any) =>
                          rc.cappingRoomCategoryId === billingClass.key
                      );

                    return {
                      ...(existingCappingRoomCategory?.detailID
                        ? { detailID: existingCappingRoomCategory.detailID }
                        : {}),
                      cappingRoomCategoryId: billingClass.key,
                      cappingAmountorPercentage: amount,
                    };
                  })
                  .filter((item) => item.cappingAmountorPercentage > 0)
                : [],
          }
          : service
      )
    );

    setAlertConfig({
      open: true,
      heading: "Success!",
      content: "Capping charges updated successfully",
      variant: "success",
    });
  };

  // Handle service details updates with room category support
  const handleServiceDetailsChange = (newData: ServiceDetailItem[]) => {
    // Check if any room category values have changed and update accordingly
    const updatedData = newData.map((service) => {
      // Check if this service has room category data that needs to be updated
      const hasRoomCategoryChanges =
        service.roomCategorys && service.roomCategorys.length > 0;

      if (hasRoomCategoryChanges) {
        // Ensure roomCategorys array is properly structured
        const updatedRoomCategorys =
          service.roomCategorys?.map((rc: any) => ({
            ...rc,
            amountorPercentage: rc.amountorPercentage || 0,
          })) || [];

        return {
          ...service,
          roomCategorys: updatedRoomCategorys,
        };
      }

      return service;
    });

    setServiceDetails(updatedData);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate required fields
    if (!globalSettings.categoryId) {
      newErrors.categoryId = "Category is required";
      isValid = false;
    }

    if (!globalSettings.companyId) {
      newErrors.companyId = "Company is required";
      isValid = false;
    }

    if (!globalSettings.rateNameId) {
      newErrors.rateNameId = "Rate Name is required";
      isValid = false;
    }

    if (!globalSettings.departmentId) {
      newErrors.departmentId = "Department is required";
      isValid = false;
    }

    // Validate service details
    if (serviceDetails.length === 0) {
      newErrors.serviceDetails = "At least one service detail is required";
      isValid = false;
    }

    setFormFieldErrors(newErrors);
    return isValid;
  };

  // Transform service details to match API format using billing classes
  const transformServiceDetailsForAPI = (
    serviceDetails: ServiceDetailItem[],
    isUpdate = false
  ) => {
    return serviceDetails.map((service) => {
      // Always use roomCategorys array if available, otherwise create from billing classes
      let roomCategory: any[] = [];
      let cappingRoomCategory: any[] = [];

      // Use roomCategorys array if available (from table editing or existing data)
      if (service.roomCategorys && service.roomCategorys.length > 0) {
        roomCategory = service.roomCategorys.map((category: any) => ({
          ...(isUpdate && category.detailID
            ? { detailID: category.detailID }
            : {}),
          roomCategoryId: category.roomCategoryId || category.id,
          amountorPercentage: category.amountorPercentage || 0,
        }));
      } else if (billingClasses && billingClasses.length > 0) {
        // Fallback: Create room categories from billing classes for new entries
        billingClasses.forEach((billingClass) => {
          // Get the value from the service's room category data
          let amount = 0;

          const existingRoomCategory = service.roomCategorys?.find(
            (rc: any) => rc.roomCategoryId === billingClass.key
          );
          if (existingRoomCategory) {
            amount = existingRoomCategory.amountorPercentage || 0;
          }

          // Include all room categories, even with 0 values for updates
          roomCategory.push({
            ...(isUpdate && existingRoomCategory?.detailID
              ? { detailID: existingRoomCategory.detailID }
              : {}),
            roomCategoryId: billingClass.key,
            amountorPercentage: amount,
          });
        });
      }

      // Check if we have original capping room category data (from edit mode)
      if (
        service.cappingRoomCategorys &&
        service.cappingRoomCategorys.length > 0
      ) {
        // Use the original capping room category structure
        cappingRoomCategory = service.cappingRoomCategorys.map(
          (category: any) => ({
            ...(isUpdate && category.detailID
              ? { detailID: category.detailID }
              : {}),
            cappingRoomCategoryId:
              category.cappingRoomCategoryId || category.id,
            cappingAmountorPercentage: category.cappingAmountorPercentage || 0,
          })
        );
      } else if (billingClasses && billingClasses.length > 0) {
        // Create capping room categories from billing classes for new entries
        billingClasses.forEach((billingClass) => {
          // Get the value from the service's capping room category data or from class fields
          let amount = 0;

          // Get from existing cappingRoomCategorys
          const existingCappingRoomCategory =
            service.cappingRoomCategorys?.find(
              (rc: any) => rc.cappingRoomCategoryId === billingClass.key
            );
          if (existingCappingRoomCategory) {
            amount = existingCappingRoomCategory.cappingAmountorPercentage || 0;
          }

          // Include all room categories, even with 0 values for updates
          cappingRoomCategory.push({
            ...(isUpdate && existingCappingRoomCategory?.detailID
              ? { detailID: existingCappingRoomCategory.detailID }
              : {}),
            cappingRoomCategoryId: billingClass.key,
            cappingAmountorPercentage: amount,
          });
        });
      }

      const baseServiceData = {
        serviceId: service.serviceId,
        serviceCode: service.serviceCode,
        baseHours: service.baseHrs,
        cappingHours: service.cappingHours || 0,
        isCapping: service.isCapping || false,
        roomCategory: roomCategory,
        cappingRoomCategory: cappingRoomCategory,
      };

      // Add servicePercentageId for update API
      if (isUpdate) {
        return {
          servicePercentageId: service.servicePercentageId, // Use actual service percentage ID
          ...baseServiceData,
        };
      }

      return baseServiceData;
    });
  };

  const onSubmit = async () => {
    // Clear previous errors
    setFormFieldErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      if (existingData) {
        // Update API - use isUpdate = true for transformation
        const transformedServiceDetails = transformServiceDetailsForAPI(
          processedServiceDetails,
          true
        );

        const updateRequestBody = {
          model: {
            otServicePercentageId: existingData.id,
            hospitalId: globalSettings.hospitalId,
            categoryId: globalSettings.categoryId,
            companyId: globalSettings.companyId,
            departmentId: globalSettings.departmentId,
            rateNameId: globalSettings.rateNameId,
            isPercentage: globalSettings.percentage,
            isCathlabApplicable: globalSettings.isCathlabApplicable,
            servicesDetail: transformedServiceDetails,
          },
        };

        await dispatch(updateOTServicePercentage(updateRequestBody)).unwrap();

        // Redirect to listing page immediately with success message
        router.push("/ot_service_percentage?success=updated");
      } else {
        // Create API - use isUpdate = false for transformation
        const transformedServiceDetails = transformServiceDetailsForAPI(
          processedServiceDetails,
          false
        );

        const createRequestBody = {
          model: {
            hospitalId: globalSettings.hospitalId,
            categoryId: globalSettings.categoryId,
            companyId: globalSettings.companyId,
            departmentId: globalSettings.departmentId,
            rateNameId: globalSettings.rateNameId,
            percentage: globalSettings.percentage,
            isCathlabApplicable: globalSettings.isCathlabApplicable,
            servicesDetail: transformedServiceDetails,
          },
        };

        await dispatch(saveOTServicePercentage(createRequestBody)).unwrap();

        // Redirect to listing page immediately with success message
        router.push("/ot_service_percentage?success=created");
      }
    } catch (error: any) {
      // Extract error message using common utility
      const errorMessage = extractApiErrorMessage(error);

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
      <div className="flex flex-col h-screen w-full bg-[#F8F9FA]">
        {/* Alert Messages - Slides down from top */}

        {/* Main Content - Adjusts based on toast presence */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="pt-8 pb-0">
            <Alerts
              open={alertConfig.open}
              heading={alertConfig.heading}
              content={alertConfig.content}
              variant={alertConfig.variant}
            />
          </div>
          {/* Global Settings Section */}
          <CardWrapper>
            {/* First Row */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Category */}
              <FormSelect
                label="Category"
                value={globalSettings.categoryId}
                options={transformData(operationCategories)}
                placeholder="Select Category"
                onChange={(value: string) =>
                  handleGlobalSettingsChange("categoryId", value)
                }
                error={formFieldErrors.categoryId}
                required
              />

              {/* Company */}
              <FormSelect
                label="Company"
                value={globalSettings.companyId}
                options={transformData(companies)}
                placeholder="Select Company"
                onChange={(value: string) =>
                  handleGlobalSettingsChange("companyId", value)
                }
                error={formFieldErrors.companyId}
                required
              />

              {/* Department */}
              <FormSelect
                label="Department"
                value={globalSettings.departmentId}
                options={transformData(departments)}
                placeholder="Select Department"
                onChange={(value: string) =>
                  handleGlobalSettingsChange("departmentId", value)
                }
                error={formFieldErrors.departmentId}
                required
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-3 gap-6">
              {/* Rate Name */}
              <FormSelect
                label="Rate Name"
                value={globalSettings.rateNameId}
                options={transformData(rateNames)}
                placeholder="Select Rate Name"
                onChange={(value: string) =>
                  handleGlobalSettingsChange("rateNameId", value)
                }
                error={formFieldErrors.rateNameId}
                required
              />

              {/* Percentage Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="percentage"
                  checked={globalSettings.percentage}
                  onCheckedChange={(checked) =>
                    handleGlobalSettingsChange("percentage", checked)
                  }
                />
                <Label htmlFor="percentage" className="text-sm">
                  Percentage
                </Label>
              </div>

              {/* Is Cathlab Applicable Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cathlab"
                  checked={globalSettings.isCathlabApplicable}
                  onCheckedChange={(checked) =>
                    handleGlobalSettingsChange("isCathlabApplicable", checked)
                  }
                />
                <Label htmlFor="cathlab" className="text-sm">
                  Is Cathlab Applicable
                </Label>
              </div>
            </div>
          </CardWrapper>

          {/* Service Details Section */}
          <CardWrapper>
            {/* Service Addition Area */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Hospital */}
              <FormSelect
                label="Hospital"
                value={globalSettings.hospitalId}
                options={transformData(hospitals)}
                placeholder="Select Hospital"
                onChange={(value: string) =>
                  handleGlobalSettingsChange("hospitalId", value)
                }
                error={formFieldErrors.hospitalId}
                required
              />

              {/* OT Service Name */}
              <FormSelect
                label="OT Service Name"
                value={selectedServiceId}
                options={transformData(fetchedServices)}
                placeholder="Select OT Service"
                onChange={(value: string) => {
                  setSelectedServiceId(value);
                  // Clear error when value is selected
                  if (formFieldErrors.selectedServiceId) {
                    setFormFieldErrors((prev) => ({
                      ...prev,
                      selectedServiceId: "",
                    }));
                  }
                }}
                error={formFieldErrors.selectedServiceId}
              />

              {/* Add Button */}
              <div className="flex flex-col space-y-3">
                <Label>&nbsp;</Label>
                <Buttons
                  size="button-medium"
                  type="secondary-button"
                  variant="button"
                  onClick={() => {
                    if (!selectedServiceId) {
                      setAlertConfig({
                        open: true,
                        heading: "Error!",
                        content: "Please select a service before adding",
                        variant: "danger",
                      });
                      return;
                    }

                    // Find the selected service details
                    const selectedService = transformData(fetchedServices).find(
                      (service) => service.key === selectedServiceId
                    );
                    if (!selectedService) {
                      setAlertConfig({
                        open: true,
                        heading: "Error",
                        content: "Selected service not found",
                        variant: "danger",
                      });
                      return;
                    }

                    // Create new service detail entry
                    const newServiceDetail: ServiceDetailItem = {
                      id: Date.now().toString(), // Generate unique ID
                      serviceId: selectedServiceId,
                      serviceName: selectedService.value || "",
                      serviceCode: "", // Service code might not be available in the API response
                      baseHrs: 0,
                      opd: 0,
                      classASPR: 0,
                      classASTD: 0,
                      classAA: 0,
                      classBAC: 0,
                      classBCo: 0,
                      // Initialize room category arrays
                      roomCategorys: billingClasses
                        ? billingClasses.map((billingClass) => ({
                          roomCategoryId: billingClass.key,
                          amountorPercentage: 0,
                        }))
                        : [],
                      cappingRoomCategorys: [],
                      isCapping: false,
                      cappingHours: 0,
                    };

                    // Add to service details
                    setServiceDetails((prev) => [...prev, newServiceDetail]);

                    // Clear the selected service
                    setSelectedServiceId("");
                  }}
                >
                  Add
                </Buttons>
              </div>
            </div>

            {/* Service Details Table */}
            <ServiceDetailsTable
              onDataChange={handleServiceDetailsChange}
              initialData={serviceDetails}
              onServiceNameClick={handleServiceNameClick}
              billingClasses={billingClasses}
            />
            {formFieldErrors.serviceDetails && (
              <p className="text-xs text-red-500 mt-3">
                {formFieldErrors.serviceDetails}
              </p>
            )}
          </CardWrapper>
        </div>

        {/* Footer */}
        <div
          id="footer"
          className="z-[20] bg-white w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0"
        >
          <div className="w-fit h-fit flex items-center gap-4"></div>
          <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
            <Buttons
              size="button-medium"
              type="secondary-button"
              variant="button"
              onClick={() => router.push("/ot_service_percentage")}
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
      </div>

      {/* Capping Charges Modal */}
      <CappingChargesModal
        isOpen={isCappingModalOpen}
        onClose={handleCappingModalClose}
        serviceData={selectedServiceForModal}
        onSave={handleCappingModalSave}
        globalSettings={globalSettings}
        existingData={existingData}
        billingClasses={billingClasses}
      />
    </>
  );
};

export default OTServicePercentageCreatePanel;
