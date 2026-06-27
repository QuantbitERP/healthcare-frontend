"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetPortal,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import Buttons from "@/components/buttons/Button";
import Image from "next/image";

interface CappingChargesData {
  serviceName: string;
  serviceCode: string;
  cappingHrs: number;
  opd: number;
  classASPR: number;
  classASTD: number;
  classAA: number;
  classBAC: number;
  classBCovid: number;
  classBCradle: number;
  classBHDU: number;
  classBNICU: number;
  classBNonAC: number;
  classBPICU: number;
  // Dynamic room category fields
  [key: string]: any;
}

interface CappingChargesModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceDetailItem | null;
  onSave: (data: CappingChargesData) => void;
  globalSettings: {
    hospitalId: string;
    categoryId: string;
    companyId: string;
    departmentId: string;
    rateNameId: string;
    percentage: boolean;
    isCathlabApplicable: boolean;
  };
  existingData?: any;
  billingClasses?: any[];
}

interface ServiceDetailItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  baseHrs: number;
  opd: number;
  classASPR: number;
  classASTD: number;
  classAA: number;
  classBAC: number;
  classBCo: number;
  // Additional fields for existing data
  cappingRoomCategorys?: any[];
  roomCategorys?: any[];
  isCapping?: boolean;
  cappingHours?: number;
  servicePercentageId?: string; // For update API
}

const CappingChargesModal: React.FC<CappingChargesModalProps> = ({
  isOpen,
  onClose,
  serviceData,
  onSave,
  globalSettings: _globalSettings,
  existingData: _existingData,
  billingClasses,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<CappingChargesData>({
    serviceName: "OT Charges",
    serviceCode: "OT000001",
    cappingHrs: 0,
    opd: 0,
    classASPR: 0,
    classASTD: 0,
    classAA: 0,
    classBAC: 0,
    classBCovid: 0,
    classBCradle: 0,
    classBHDU: 0,
    classBNICU: 0,
    classBNonAC: 0,
    classBPICU: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (serviceData && isMounted) {
      // Initialize with default values
      let cappingHrs = serviceData.baseHrs || 0;
      let opd = serviceData.opd || 0;
      let classASPR = 0;
      let classASTD = 0;
      let classAA = 0;
      let classBAC = 0;
      let classBCovid = 0;
      let classBCradle = 0;
      let classBHDU = 0;
      let classBNICU = 0;
      let classBNonAC = 0;
      let classBPICU = 0;

      // Populate from cappingRoomCategorys array if available
      if (serviceData.cappingRoomCategorys && serviceData.cappingRoomCategorys.length > 0) {
        serviceData.cappingRoomCategorys.forEach((category: any) => {
          const categoryName = category.cappingRoomCategoryName?.toLowerCase() || "";
          const amount = category.cappingAmountorPercentage || 0;

          // Map based on exact room category names from the listing
          if (categoryName.includes("opd")) {
            opd = amount;
          } else if (categoryName.includes("class a - spr") || categoryName.includes("classa-spr")) {
            classASPR = amount;
          } else if (categoryName.includes("class a - std") || categoryName.includes("classa-std")) {
            classASTD = amount;
          } else if (categoryName.includes("class aa") || categoryName.includes("classaa")) {
            classAA = amount;
          } else if (categoryName.includes("class b - ac") || categoryName.includes("classb-ac")) {
            classBAC = amount;
          } else if (categoryName.includes("class b - covid") || categoryName.includes("classb-covid")) {
            classBCovid = amount;
          } else if (categoryName.includes("class b - cradle") || categoryName.includes("classb-cradle")) {
            classBCradle = amount;
          } else if (categoryName.includes("class b - hdu") || categoryName.includes("classb-hdu")) {
            classBHDU = amount;
          } else if (categoryName.includes("class b - nicu") || categoryName.includes("classb-nicu")) {
            classBNICU = amount;
          } else if (categoryName.includes("class b - non ac") || categoryName.includes("classb-nonac")) {
            classBNonAC = amount;
          } else if (categoryName.includes("class b - picu") || categoryName.includes("classb-picu")) {
            classBPICU = amount;
          }
        });
      }

      // Use cappingHours if available, otherwise fall back to baseHrs
      if (serviceData.cappingHours !== undefined) {
        cappingHrs = serviceData.cappingHours;
      }

      setFormData({
        serviceName: serviceData.serviceName,
        serviceCode: serviceData.serviceCode,
        cappingHrs: cappingHrs,
        opd: opd,
        classASPR: classASPR,
        classASTD: classASTD,
        classAA: classAA,
        classBAC: classBAC,
        classBCovid: classBCovid,
        classBCradle: classBCradle,
        classBHDU: classBHDU,
        classBNICU: classBNICU,
        classBNonAC: classBNonAC,
        classBPICU: classBPICU,
      });
    }
  }, [serviceData, isMounted]);

  const handleInputChange = (field: string, value: string) => {
    if (!isMounted) return;

    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  // Create dynamic room category fields based on billing classes
  const createRoomCategoryFields = () => {
    // Always use billing classes for dynamic field creation
    if (!billingClasses || billingClasses.length === 0) {
      // Return empty array if no billing classes available
      return [];
    }

    // Create dynamic fields based on billing classes
    return billingClasses.map((billingClass) => {
      const displayName = billingClass.value || billingClass.label || billingClass.name;
      const fieldKey = `roomCategory_${billingClass.key}`;

      // Get the current value from formData or from serviceData's capping room categories
      const currentValue = formData[fieldKey] ||
        serviceData?.cappingRoomCategorys?.find(
          (rc: any) => rc.cappingRoomCategoryId === billingClass.key
        )?.cappingAmountorPercentage || 0;

      return (
        <div key={billingClass.key} className="grid grid-cols-2 h-10">
          <div className="px-4 flex items-center text-left text-sm text-[#60646C]">
            {displayName}
          </div>
          <div className="px-4 flex items-center justify-end">
            <Input
              type="number"
              step="0.01"
              value={currentValue}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              className="w-full text-right border-0 focus:ring-2 focus:ring-blue-500 bg-transparent h-8"
              placeholder="0.00"
            />
          </div>
        </div>
      );
    });
  };

  const handleSave = () => {
    if (!serviceData) return;

    // Create the data structure that the parent component expects
    const saveData = {
      cappingHrs: formData.cappingHrs,
      opd: formData.opd,
      // Include all dynamic room category fields
      ...Object.keys(formData).reduce((acc, key) => {
        if (key.startsWith('roomCategory_')) {
          acc[key] = formData[key];
        }
        return acc;
      }, {} as any)
    };

    // Call the parent's onSave callback with the updated data
    onSave(saveData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetPortal>
        <SheetPrimitive.Content
          className="fixed inset-x-0 bottom-0 z-50 gap-4 bg-white p-0 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom w-full h-11/12 overflow-hidden rounded-t-xl border-t flex flex-col"
        >

          {/* Title Section */}
          <SheetHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Image
                src="assets/icons/receipt-rupee.svg"
                alt="Rupee icon"
                width={24}
                height={24}
              />
              <SheetTitle className="text-xl font-semibold text-[#1C2024]">Capping Charges</SheetTitle>
            </div>
          </SheetHeader>

          {/* Content - Table Style */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Table Rows */}
                <div className="divide-y divide-[#D9D9E0]">
                  {/* Service Name - Non-editable */}
                  <div className="grid grid-cols-2 h-10">
                    <div className="px-4 flex items-center text-left text-sm text-[#60646C]">
                      Service Name
                    </div>
                    <div className="px-4 flex items-center justify-end text-sm text-[#1C2024] bg-gray-50">
                      {formData.serviceName || "Service Name"}
                    </div>
                  </div>

                  {/* Service Code - Non-editable */}
                  <div className="grid grid-cols-2 h-10">
                    <div className="px-4 flex items-center text-left text-sm text-[#60646C]">
                      Service Code
                    </div>
                    <div className="px-4 flex items-center justify-end text-sm text-[#1C2024] bg-gray-50">
                      {formData.serviceCode || "OT000001"}
                    </div>
                  </div>

                  {/* Capping Hrs */}
                  <div className="grid grid-cols-2 h-10">
                    <div className="px-4 flex items-center text-left text-sm text-[#60646C]">
                      Capping Hrs.
                    </div>
                    <div className="px-4 flex items-center justify-end">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.cappingHrs}
                        onChange={(e) => handleInputChange("cappingHrs", e.target.value)}
                        className="w-full text-right border-0 focus:ring-2 focus:ring-blue-500 bg-transparent h-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Dynamic Room Category Fields */}
                  {createRoomCategoryFields()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex justify-end gap-4 p-6 border-t border-border bg-white mt-auto">
            <Buttons
              size="button-medium"
              type="secondary-button"
              variant="button"
              onClick={onClose}
            >
              Cancel
            </Buttons>
            <Buttons
              onClick={handleSave}
              size="button-medium"
              type="primary-button"
              variant="button"
            >
              Save Changes
            </Buttons>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
};

export default CappingChargesModal;
