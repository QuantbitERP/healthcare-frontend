/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Dialogue from "@/components/dialogueBox/DialogueBox";
import Buttons from "@/components/buttons/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { OpdBillService } from "@/services/api-client/services/OpdBillService";
import {
  ChargesEstimationSaveRequestDto,
  ChargesEstimationService,
  CreateBillCommand,
  GetBillsResponseDto,
  PatientSearchDto,
} from "@/services/api-client";
import { RowType } from "./TableData";
import { buildOpdBillPayload } from "@/utils/buildOpdBillNonDraftSavePayload";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import { useRouter } from "next/navigation";
import { useSave } from "../IndividualPatientBillingDetailPage/context/saveContext";
import {
  downloadCasePaperPdf,
  exportToWord,
  fetchPatientDuesDetails,
} from "@/store/opd_bills/thunks";
import axios from "axios";
import {
  exportChargesEstimationExcel,
  exportChargesEstimationPdf,
} from "@/store/charges_estimation/thunks";

interface FooterProps {
  isAllSelected: boolean;
  data: RowType[];
  setData: React.Dispatch<React.SetStateAction<RowType[]>>;
  onSave: () => void;
  selectedPatient: ChargesEstimationSaveRequestDto | null;
  setSelectedPatient: React.Dispatch<
    React.SetStateAction<ChargesEstimationSaveRequestDto | null>
  >;
  showCustomAlert: (config: {
    heading: string;
    content: string;
    variant?: "success" | "warning" | "danger" | "primary" | "secondary";
    buttonText?: string;
    showButton?: boolean;
    onClick?: () => void;
    disappear?: boolean;
    setIsPateintSelected?: boolean;
  }) => void;
  setIsPateintSelected: React.Dispatch<React.SetStateAction<boolean>>;
  billData?: GetBillsResponseDto[];
}

const Footer: React.FC<FooterProps> = ({
  isAllSelected,
  data,
  setData,
  // onSave,
  selectedPatient,
  setSelectedPatient,
  showCustomAlert,
  setIsPateintSelected,
  billData,
}) => {
  const baseApiUrl = process.env.NEXT_PUBLIC_BASEAPI_URL;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    setSaveSuccess,
    setIsSaving,
    isSaving,
    isSavingDraft,
    setIsSavingDraft,
  } = useSave();
  const [showDilogue, setShowDilogue] = useState<boolean>(false);
  const {
    setPatientServicesTable,
    patientServicesTableInEstimation,
    setPatientServicesTableInEstimation,
  } = useGlobalTables();
  const { filtersValues, setFiltersValues, gstID } =
    useGlobalTables();

  useEffect(() => {
    setPatientServicesTable(data);
  }, [data, setPatientServicesTable]);

  const handleReset = () => {
    setData([]);
    setSelectedPatient(null);
    setShowDilogue(false);
    setIsSaving(false);
    setIsPateintSelected(false);
    showCustomAlert({
      heading: "Reset ",
      content: "All form data has been reset",
      variant: "success",
      disappear: true,
    });
  };


const handleFinalizeAndPrint = async () => {
    try {
      setIsSavingDraft(true);
  
      const model = {
        chargeEstimationid: undefined, 
        hospitalid: selectedPatient?.hospitalid ?? "",
        isregistered: !!selectedPatient?.patientid,
        patientid: selectedPatient?.patientid ?? "",
        patientname: selectedPatient?.patientname ?? "",
        patientaddress: selectedPatient?.patientaddress ?? "",
        age: selectedPatient?.age ?? 0,
        gender: selectedPatient?.gender ?? 0,
        contactNo: selectedPatient?.contactNo ?? "",
        abhaId: selectedPatient?.abhaId ?? "",
  
        admissiondate: filtersValues?.admissionDate ?? new Date().toISOString(),
        dischargedate: filtersValues?.dischargeDate ?? new Date().toISOString(),
        noofdays: filtersValues?.noOfDays ?? 0,
  
        consultationdoctorid: filtersValues?.consultationDoctor?.id ?? null,
        billingClassId: filtersValues?.billingClasses?.id ?? null,
        schemecompanyid: filtersValues?.company?.id ?? null,
        visitTypeiId: filtersValues?.visitType?.id
          ? Number(filtersValues.visitType.id)
          : 0,
        estimationTypeId: filtersValues?.estimationType?.id ?? 0,
  
        totalAmount: 0,
        totalDiscount: 0,
        gstId: gstID?.key?.trim() || null,
        cgstAmount: 0,
        sgstAmount: 0,
        totalGstAmount: 0,
        totalEstimatedAmount: 0,
  
        diagnosisnote: filtersValues?.diagnosisNote ?? "",
        remark: filtersValues?.remark ?? "",
  
        serviceDetails: (patientServicesTableInEstimation ?? []).map((item) => ({
          chargeEstimationServiceid: undefined, 
          hospitalserviceid: item.hospitalserviceid,
          packageId: item.packageId ?? null,
          hospitalDepartmentid: item.hospitalDepartmentid ?? null,
          hospitaldoctorid:
            !item.hospitaldoctorid || item.hospitaldoctorid.trim() === ""
              ? null
              : item.hospitaldoctorid,
          isEmergency: !!item.isEmergency,
          rate: Number(item.rate),
          quantity: Number(item.quantity),
          amount: Number(item.amount ?? 0),
          discountPercentage: Number(item.discountPercentage ?? 0),
          discountAmount: Number(item.discountAmount ?? 0),
          mouDiscountAmount: Number(item.mouDiscountAmount ?? 0),
          gstId: gstID?.key?.trim() || null,
          cgstAmount: Number(item.cgstAmount ?? 0),
          sgstAmount: Number(item.sgstAmount ?? 0),
          totalAmount: Number(item.totalAmount ?? 0),
          inPackageAmount: Number(item.inPackageAmount ?? 0),
          outofPackageAmount: Number(item.outofPackageAmount ?? 0),
          editaleServiceName: item.editaleServiceName ?? "",
          concessionRemark: item.concessionRemark ?? "",
          cancelRemark: item.cancelRemark ?? "",
          isDeleted: !!item.isDeleted,
        })),
      };
  
      const command = { model };
      const res = await ChargesEstimationService.postApiVChargesEstimationSave(
        "1", 
        "",
        command
      );
  
      if (res?.isError) {
        setIsSavingDraft(false);
        router.push("/charges_estimation?status=error");
        return;
      }
  
      setSaveSuccess(true);
      router.push("/charges_estimation?status=success");
    } catch (error) {
      router.push("/charges_estimation?status=error");
      console.error("Error saving draft estimation:", error);
    } finally {
      setIsSavingDraft(false);
    }
  };
  

  const handleCasePapers = () => {
    dispatch(
      downloadCasePaperPdf({
        version: "1",
        billId: selectedPatient?.patientid ?? "",
        tenant: "",
      })
    );
  };

  const handleExportExcel = async (estimationId: string, patientid: string) => {
    try {
      const payload = {
        version: "1",
        tenant: "",
        requestBody: { estimationId, patientid },
      };

      const response = await dispatch(
        exportChargesEstimationExcel(payload)
      ).unwrap();

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Estimation_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); 
    } catch (error: any) {
      console.error("Download failed:", error);
      alert("Error downloading Excel: " + error.message);
    }
  };

  const handleExportPdf = async (estimationId: string, patientid: string) => {
    try {
      const payload = {
        version: "1",
        tenant: "",
        requestBody: { estimationId, patientid },
      };

      const response = await dispatch(
        exportChargesEstimationPdf(payload)
      ).unwrap();

      const blob = new Blob([response], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Estimation_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error: any) {
      console.error("Download failed:", error);
      alert("Error downloading file: " + error.message);
    }
  };

  const handlePatientDues = () => {
    dispatch(
      fetchPatientDuesDetails({
        version: "1",
        patientId: selectedPatient?.patientid,
        tenant: "",
      })
    );
  };
  return (
    <>
      <div className="w-full h-4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>
      <Dialogue
        open={showDilogue}
        setOpen={setShowDilogue}
        showDropdown
        showTextbox
        data={[]}
        rows={[]}
      />
      <div
        id="footer"
        className="w-full  h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4">
          <Buttons
            size="button-medium"
            type="danger-button"
            variant="button"
            onClick={() => setShowDilogue(true)}
          >
            Delete
          </Buttons>
          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={() =>
              handleExportExcel(
                selectedPatient?.patientid ?? "",
                selectedPatient?.patientid ?? ""
              )
            }
          >
            Export to Excel
          </Buttons>

          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={() =>
              handleExportPdf(
                selectedPatient?.patientid ?? "",
                selectedPatient?.patientid ?? ""
              )
            }
          >
            Preview & Print
          </Buttons>
        </div>
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          {/* <span>Auto Saved 2s Ago</span> */}
          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={handleReset}
          >
            Cancel
          </Buttons>

          <Buttons
            size="button-medium"
            type="primary-button"
            variant="button"
            onClick={handleFinalizeAndPrint}
          >
            {isSaving ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Buttons>
        </div>
      </div>
    </>
  );
};

export default Footer;
