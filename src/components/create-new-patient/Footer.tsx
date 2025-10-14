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
import { v4 as uuidv4 } from "uuid";

interface FooterProps {
  isAllSelected: boolean;
  data: RowType[];
  setData: React.Dispatch<React.SetStateAction<RowType[]>>;
  onSave: () => void;
  selectedPatient: PatientSearchDto | null;
  setSelectedPatient: React.Dispatch<
    React.SetStateAction<PatientSearchDto | null>
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
    patientBillConcession,
    patientRecordPayment,
    patientServicesTable,
    setPatientServicesTable,
  } = useGlobalTables();
  const { filtersValues, billRemark, gstID } =
    useGlobalTables();

  useEffect(() => {
    setPatientServicesTable([]);
  }, [data, setPatientServicesTable]);

  const handleReset = () => {
    // Reset all states
    setData([]);
    setSelectedPatient(null);
    setShowDilogue(false);
    setIsSaving(false);
    setIsPateintSelected(false);
    // Show confirmation alert
    showCustomAlert({
      heading: "Reset ",
      content: "All form data has been reset",
      variant: "success",
      disappear: true,
    });
  };
  const handleFinalizeAndPrint = async () => {
    try {
      setIsSaving(true);
      const { model } = buildOpdBillPayload({
        existingDraftBillNo: null,
        existingBillId: null,
        visittype: filtersValues?.visitType?.id
          ? Number(filtersValues.visitType.id)
          : 0,
        patientid: selectedPatient?.patientId ?? "",
        hospitalid: selectedPatient?.hospitalid ?? "",
        refferaldoctorid: filtersValues.referralDoctor.id?.trim() ?? null,
        billcompanyid: filtersValues.company.id ?? "",

        services:
          patientServicesTable.map((x) => ({
            ...x,
            hospitaldoctorid:
              !x.hospitaldoctorid || x.hospitaldoctorid.trim() === ""
                ? null
                : x.hospitaldoctorid,
          })) ?? [],
        billConcession: patientBillConcession ?? [],
        receiptPayments: patientRecordPayment ?? [],
        billDiscountPercent: 0,
        billDiscountAmount: 0,
        billGstId: gstID?.key?.trim() === "" ? null : gstID?.key?.trim(),
        billGstAmount: 0,
        billRemark: billRemark,
        paidBy: 0,
        paidByName: "",
        sponsoredbyName: "",
      });
      const command: CreateBillCommand = { model };
      const res = await OpdBillService.postApiVOpdBillOpdbillsSave(
        "1",
        "",
        command
      );
      if (res?.isError) {
        router.push("/opd_bills?status=error");
        setIsSaving(false);
        return;
      }
      setSaveSuccess(true);
      router.push("/opd_bills?status=success");
    } catch (error) {
      router.push("/opd_bills?status=error");
      console.error("Error finalizing bill:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setIsSavingDraft(true);

      const model = {
        visittype: filtersValues?.visitType?.id
          ? Number(filtersValues.visitType.id)
          : 0,
        patientid: selectedPatient?.patientId ?? "",
        hospitalid: selectedPatient?.hospitalid ?? "",
        refferaldoctorid: filtersValues?.referralDoctor?.id ?? null,
        billcompanyid: filtersValues?.company?.id ?? "",

        services: (patientServicesTable ?? []).map((item) => ({
          hospitalServiceId: item.serviceid,
          hospitaldoctorid:
            !item.hospitaldoctorid || item.hospitaldoctorid.trim() === ""
              ? null
              : item.hospitaldoctorid,
          rate: Number(item.rate),
          quantity: Number(item.quantity),
          concessionPercent: Number(item.concessionPercent ?? 0),
          concessionAmount: Number(item.concessionAmount ?? 0),
          mouDiscountAmount: Number(item.mouDiscountAmount ?? 0),
          apportionConcession: Number(item.apportionConcession ?? 0),
          concessionRemark: item.concessionRemark ?? "",
          serviceGstId: "3ab62e77-aa8b-4fcd-b156-995b71181de4",
          serviceGstAmount: Number(item.serviceGstAmount ?? 0),
          editableServiceName: item.editableServiceName,
          isEmergency: !!item.isEmergency,
          isBillLevelGSTApplicable: !!item.isBillLevelGSTApplicable,
        })),

        billConcession: (patientBillConcession ?? []).map((item) => ({
          concessioncategoryid: item.concessioncategoryid,
          applicationuserid: item.applicationuserid,
          concessionamount: Number(item.concessionamount),
          concessionPercent: Number(item.concessionPercent),
          concessionremark: item.concessionremark,
        })),

        receiptPayments: (patientRecordPayment ?? []).map((item) => ({
          amount: Number(item.amount),
          receiptDate: item.receiptDate,
          paymentMode: item.modeOfPaymentId,
          transactionnumber: item.transactionnumber,
          bankname: item.bankname,
          Chequeno: item.chequeno,
          Chequedate: item.chequedate,
          Branchname: item.branchname,
        })),

        billDiscountPercent: 0,
        billDiscountAmount: 0,
        billGstId: gstID?.key?.trim() === "" ? null : gstID?.key?.trim(),
        billGstAmount: 0,
      };

      const command: CreateBillCommand = { model };
      const res = await OpdBillService.postApiVOpdBillOpdbillsDraft(
        "1",
        "",
        command
      );

      if (res?.isError) {
        setIsSavingDraft(false);
        router.push("/opd_bills?status=error");
        return;
      }

      setSaveSuccess(true);
      router.push("/opd_bills?status=success");
    } catch (error) {
      router.push("/opd_bills?status=error");
      console.error("Error saving draft bill:", error);
      console.log(error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCasePapers = () => {
    dispatch(
      downloadCasePaperPdf({
        version: "1",
        billId: selectedPatient?.patientId ?? "",
        tenant: "",
      })
    );
  };

  const handleExportWord = () => {
    dispatch(
      exportToWord({
        version: "1",
        tenant: "",
        requestBody: [selectedPatient?.patientId ?? ""],
      })
    );
  };

  const handlePatientDues = () => {
    dispatch(
      fetchPatientDuesDetails({
        version: "1",
        patientId: selectedPatient?.patientId,
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
        className="w-full h-16 px-6 flex justify-end items-center  border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        
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
              "Save & Create Estimation"
            )}
          </Buttons>
        </div>
      </div>
    </>
  );
};

export default Footer;
