import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { useSave } from "./context/saveContext";
import Image from "next/image";
import Dialogue from "@/components/dialogWithDropdownButton/Dialog";
import Buttons from "@/components/buttons/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchPatientDuesDetails,
  downloadCasePaperPdf,
} from "@/store/opd_bills/thunks";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import {
  GetBillDetailsDTO,
  GetDraftBillByIdResponseDTO,
  OpdBillService,
} from "@/services/api-client";
import { buildOpdBillPayload } from "@/utils/buildOpdBillNonDraftSavePayload";
import { CreateBillCommand } from "@/services/api-client/models/CreateBillCommand";
import axios from "axios";

interface FooterProps {
  recordRefundClicked: boolean;
  setRecordRefundClicked: React.Dispatch<React.SetStateAction<boolean>>;
  refundFooterButtons: boolean;
  setRefundFooterButtons: React.Dispatch<React.SetStateAction<boolean>>;
  isAllSelected: boolean;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | undefined;
  billId: string | null;
  billStatus: string;
}

function PatientBillingFooter({
  recordRefundClicked,
  setRecordRefundClicked,
  refundFooterButtons,
  setRefundFooterButtons,
  isAllSelected,
  billData,
  billId,
  billStatus,
}: FooterProps) {
  const baseApiUrl = process.env.NEXT_PUBLIC_BASEAPI_URL;
  const router = useRouter();
  const {
    setSaveSuccess,
    setIsSaving,
    isSaving,
    isSavingDraft,
    setIsSavingDraft,
  } = useSave();
  const dispatch = useDispatch<AppDispatch>();
  const [showDilogue, setShowDilogue] = useState(false);
  const [showCancelButtons, setShowCancelButtons] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    patientBillConcession,
    patientRecordPayment,
    patientServicesTable,
    billRemark,
    paidBy,
    paidByName,
    sponsoredbyName,
    filtersValues,
  } = useGlobalTables();

  const existingDraftBillNo =
    billStatus !== "Draft"
      ? (billData as any)?.billDocumentNumber ?? null
      : (billData as any)?.tempDocumentNo ?? null;

  const handleFinalizeAndPrint = async () => {
    try {
      setIsSaving(true);
      const { model } = buildOpdBillPayload({
        existingDraftBillNo,
        existingBillId: billId ?? null,
        visittype: billData?.visittype ?? 0,
        patientid: billData?.patientid ?? "",
        hospitalid: billData?.hospitalid ?? "",
        refferaldoctorid:
          (billData as any)?.refferalDoctorid ??
          (billData as any)?.refferalDoctorId ??
          filtersValues?.referralDoctor.id ??
          null,

        billcompanyid:
          (billData as any)?.schemeCompanyTypeId ??
          (billData as any)?.billcompanyid ??
          null,
        services: patientServicesTable ?? [],
        billConcession: patientBillConcession ?? [],
        receiptPayments: patientRecordPayment ?? [],
        billDiscountPercent: billData?.billDiscountAmount ?? 0,
        billDiscountAmount: billData?.billDiscountAmount ?? 0,
        billGstId: billData?.billGstId ?? null,
        billGstAmount: billData?.billGstAmount ?? 0,
        billRemark: billRemark,
        paidBy: paidBy?.key ? Number(paidBy.key) : undefined,
        paidByName: paidByName ?? "",
        sponsoredbyName: sponsoredbyName ?? "",
      });

      const command: CreateBillCommand = { model };
      await OpdBillService.postApiVOpdBillOpdbillsSave("1", "", command);
      setSaveSuccess(true);
      router.push(
        `/opd_bills?status=success&billNumber=${(billData as any)?.billDocumentNumber
        }`
      );
    } catch (error) {
      console.error("Error finalizing bill:", error);
      router.push(
        `/opd_bills?status=error&billNumber=${(billData as any)?.billDocumentNumber
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setIsSavingDraft(true);
      const { model } = buildOpdBillPayload({
        existingDraftBillNo: (billData as any)?.tempDocumentNo ?? null,
        existingBillId: billId ?? null,
        visittype: billData?.visittype ?? 0,
        patientid: billData?.patientid ?? "",
        hospitalid: billData?.hospitalid ?? "",
        refferaldoctorid:
          (billData as any)?.refferalDoctorId ??
          (billData as any)?.refferalDoctorid ??
          null,
        billcompanyid: (billData as any)?.billcompanyid ?? null,
        services: patientServicesTable ?? [],
        billConcession: patientBillConcession ?? [],
        receiptPayments: patientRecordPayment ?? [],
        billDiscountPercent: billData?.billDiscountAmount ?? 0,
        billDiscountAmount: billData?.billDiscountAmount ?? 0,
        billGstId: billData?.billGstId ?? null,
        billGstAmount: billData?.billGstAmount ?? 0,
        billRemark: billRemark,
        paidBy: billData?.paidBy ? Number(billData.paidBy) : undefined,
        paidByName: billData?.paidByName ?? "",
        sponsoredbyName: billData?.sponsoredbyName ?? "",
      });

      const command: CreateBillCommand = { model };
      await OpdBillService.postApiVOpdBillOpdbillsDraft("1", "", command);
      setSaveSuccess(true);
      router.push(
        `/opd_bills?status=success&billNumber=${(billData as any)?.tempDocumentNo
        }`
      );
    } catch (error) {
      console.error("Error finalizing bill:", error);
      router.push(
        `/opd_bills?status=error&billNumber=${(billData as any)?.tempDocumentNo
        }`
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCasePapers = () => {
    dispatch(
      downloadCasePaperPdf({
        version: "1",
        billId: billData?.id ?? "",
        tenant: "",
      })
    );
  };

  const handleExportWord = async () => {
    const billIds = [billData?.id];
    try {
      const response = await axios.post(
        `${baseApiUrl}OPDBill/opdbills/word`,
        billIds,
        {
          headers: {
            "Content-Type": "application/json",
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bills_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error downloading file: " + (error as Error).message);
    }
  };

  const handlePatientDues = () => {
    dispatch(
      fetchPatientDuesDetails({
        version: "1",
        patientId: billData?.patientid,
        tenant: "",
      })
    );
  };

  const handlePrintBills = async () => {
    const billIds = [billId];
    setIsSaving(true);
    try {
      const response = await axios.post(
        `${baseApiUrl}OPDBill/opdbills/pdf`,
        billIds,
        {
          headers: {
            "Content-Type": "application/json",
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bills_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error downloading file: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full h-k4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

      <Dialogue
        open={showDilogue}
        setOpen={setShowDilogue}
        label="This action cannot be undone, and all associated transactions will be voided."
        showTextbox
        showDropdown
        textboxLabel="Remarks"
        textboxPlaceholder="Enter remarks"
        title="Cancel Bill?"
        recordRefundClicked={recordRefundClicked}
        setRecordRefundClicked={setRecordRefundClicked}
        setShowCancelButtons={setShowCancelButtons}
        setRefundFooterButtons={setRefundFooterButtons}
        billData={billData}
        setLoading={setLoading}
      />

      <div
        id="footer"
        className="w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Image
                src="assets/icons/DotsVertical.svg"
                alt="Dots"
                width={50}
                height={50}
                className="cursor-pointer border rounded-md px-3 py-2 border-[#D9D9E0]"
              />
            </PopoverTrigger>
            <PopoverContent className="bg-white mx-3 border shadow-md rounded p-0 space-y-2 w-40">
              <div
                onClick={handleCasePapers}
                className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer"
              >
                Case Papers
              </div>
              <div
                onClick={handleExportWord}
                className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer"
              >
                Export to Word
              </div>
              <div
                onClick={handlePatientDues}
                className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer"
              >
                Patient Dues Details
              </div>
            </PopoverContent>
          </Popover>
          {showCancelButtons && (
            <Buttons
              size="button-medium"
              type="danger-button"
              variant="button"
              onClick={() => setShowDilogue(true)}
              disabled={loading} // Disable while loading
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Cancel Bill"
              )}
            </Buttons>
          )}

          {refundFooterButtons && (
            <Buttons
              size="button-medium"
              type="danger-button"
              variant="button"
              onClick={() => setShowDilogue(true)}
            >
              Delete Refund
            </Buttons>
          )}
        </div>

        {showCancelButtons ? (
          <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
            <Buttons
              size="button-medium"
              type="secondary-button"
              variant="button"
              disabled={billStatus !== "Draft"}
              className={
                billStatus !== "Draft"
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : ""
              }
            >
              Reset
            </Buttons>
            <Buttons
              size="button-medium"
              type="primary-outlined-button"
              variant="button"
              disabled={billStatus !== "Draft"}
              className={
                billStatus !== "Draft"
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : ""
              }
              onClick={handleSaveAsDraft}
            >
              {isSavingDraft ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="h-5 w-5 border-2 border-[#0588F0] border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Save as Draft"
              )}
            </Buttons>

            <Buttons
              size="button-medium"
              type="primary-button"
              variant="button"
              disabled={!isAllSelected}
              className={""}
              onClick={
                billStatus === "Draft"
                  ? handleFinalizeAndPrint
                  : handlePrintBills
              }
            >
              {isSaving ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {billStatus === "Draft" ? "Saving..." : ""}
                </div>
              ) : billStatus === "Draft" ? (
                "Finalize & Print"
              ) : (
                "Print"
              )}
            </Buttons>
          </div>
        ) : (
          <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
            <Buttons
              size="button-medium"
              type="primary-button"
              variant="button"
              disabled={billStatus !== "Draft" || !isAllSelected}
              className={
                billStatus !== "Draft" || !isAllSelected
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : ""
              }
            >
              Save & Print
            </Buttons>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientBillingFooter;
