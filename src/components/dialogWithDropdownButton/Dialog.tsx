import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { useCancel } from "../IndividualPatientBillingDetailPage/context/Context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  cancelDraftOpdBill,
  cancelOpdBill,
  fetchCancelReasons,
} from "@/store/opd_bills/thunks";
import {
  GetBillDetailsDTO,
  GetDraftBillByIdResponseDTO,
  OpdBillService,
} from "@/services/api-client";
import { buildOpdBillPayload } from "@/utils/buildOpdBillNonDraftSavePayload";
import { useGlobalTables } from "@/context/GlobalTablesContext";

type CloseDialogueBoxProps = {
  title?: string;
  label?: string;
  showDropdown?: boolean;
  dropdownLabel?: string;
  reasons?: string[];
  showTextbox?: boolean;
  textboxLabel?: string;
  textboxPlaceholder?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setShowCancelButtons: (value: boolean) => void;
  recordRefundClicked: boolean;
  setRecordRefundClicked: (value: boolean) => void;
  setRefundFooterButtons: (value: boolean) => void;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | undefined;
  setLoading: (load: boolean) => void;
};

export default function CloseDialogueBox({
  title = "Cancel Bill?",
  label = "Bill cancellation is irreversible.",
  showDropdown = false,
  dropdownLabel = "Select a Reason",
  showTextbox = false,
  textboxLabel = "Remarks",
  textboxPlaceholder = "Error in patient name",
  open,
  setOpen,
  setShowCancelButtons,
  setRecordRefundClicked,
  setRefundFooterButtons,
  billData,
  setLoading,
}: CloseDialogueBoxProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { setCancelClicked } = useCancel();
  const { cancelReasons, isLoading } = useSelector(
    (state: RootState) => state.opdCancelReasons
  );

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<
    "cancel" | "refund" | null
  >(null);
  const [reasonError, setReasonError] = useState(false);
  const [remarkError, setRemarkError] = useState(false);

  useEffect(() => {
    dispatch(fetchCancelReasons({ version: "1", tenant: "" }));
  }, [dispatch]);

  const {
    patientBillConcession,
    patientRecordPayment,
    patientServicesTable,
    billRemark,
    paidBy,
    paidByName,
    sponsoredbyName,
  } = useGlobalTables();

  const handleCancel = async () => {
    let hasError = false;

    if (showDropdown && !selectedReason) {
      setReasonError(true);
      hasError = true;
    } else {
      setReasonError(false);
    }

    if (showTextbox && !remark.trim()) {
      setRemarkError(true);
      hasError = true;
    } else {
      setRemarkError(false);
    }

    if (hasError) return;
    if (billData && "tempDocumentNo" in billData) {
      try {
        setLoading(true);
        setLoadingAction("cancel");
    
        const response = await dispatch(
          cancelDraftOpdBill({
            version: "1",
            tenant: "",
            requestBody: {
              model: {
                tempDocumentNos: [billData?.tempDocumentNo ?? ""],
              },
            },
          })
        ).unwrap();

        const cancelled = response?.data?.cancelled ?? [];
    
        if (cancelled.length > 0) {
          
          setCancelClicked(true);
          setOpen(false);
          setShowCancelButtons(false);
          console.log(response?.data?.message ?? "Draft bill cancelled");
        } else {
          // optional: handle failed case
          console.warn("Draft bill not cancelled:", response?.data?.message);
        }
      } catch (error) {
        console.error("Error cancelling draft bill:", error);
      } finally {
        setLoading(false);
        setLoadingAction(null);
        setTimeout(() => {
          document.body.style.pointerEvents = "auto";
        }, 100);
      }
    }
     else if (billData?.id) {
      try {
        setLoading(true);
        setLoadingAction("cancel");

        const response = await dispatch(
          cancelOpdBill({
            version: "1",
            tenant: "",
            requestBody: {
              model: {
                billIds: [billData.id],
                user: "233",
                cancelReason: selectedReason,
                cancelRemark: remark,
                receiptAction: 0,
                refundAction: 0,
                refundReceiptPayments: [],
                hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
              },
            },
          })
        ).unwrap();

        if (response?.data?.items?.[0]) {
          setCancelClicked(true);
          setOpen(false);
          setShowCancelButtons(false);
        }
      } catch (error) {
        console.error("Error cancelling bill:", error);
      } finally {
        setLoading(false);
        setLoadingAction(null);
        setTimeout(() => {
          document.body.style.pointerEvents = "auto";
        }, 100);
      }
    }
  };
  const handleCancelBillandDuplicate = async () => {
    console.log(billData);
    if (!billData) return;

    const payload = buildOpdBillPayload({
      existingDraftBillNo:
        "billDocumentNumber" in billData
          ? billData.billDocumentNumber
          : "tempDocumentNo" in billData
          ? billData.tempDocumentNo
          : undefined,
      existingBillId: billData?.id,
      visittype: billData?.visittype,
      patientid: billData?.patientid ?? "",
      hospitalid: billData?.hospitalid ?? "",
      refferaldoctorid:
        (billData as any)?.refferalDoctorid ??
        (billData as any)?.refferalDoctorId ??
        null,

      billcompanyid:
        (billData as any)?.schemeCompanyId ??
        (billData as any)?.billcompanyid ??
        null,
      services: patientServicesTable ?? [],
      billConcession: patientBillConcession ?? [],
      receiptPayments: (patientRecordPayment ?? []).map((item) => ({
        ...item,
        billReceiptPaymentDetailId: item.id,    
      })),
      
      billDiscountPercent: billData?.billDiscountAmount ?? 0,
      billDiscountAmount: billData?.billDiscountAmount ?? 0,
      billGstId: billData?.billGstId ?? null,
      billGstAmount: billData?.billGstAmount ?? 0,
      billRemark: billRemark,
      paidBy: paidBy?.key ? Number(paidBy.key) : undefined,
      paidByName: paidByName ?? "",
      sponsoredbyName: sponsoredbyName ?? "",
    });

    try {
      setLoading(true);
      setLoadingAction("cancel");
      const res = await OpdBillService.putApiVOpdBillOpdbills("1", "", payload);
      if (!res.isError) {
        router.push(
          `/opd_bills?status=cancel&Duplicate&billNumber=${
            (billData as any)?.billDocumentNumber
          }`
        );
      } else {
      }
    } catch (error) {
      console.error("Failed to duplicate bill:", error);
    } finally {
      setLoading(false);
      setLoadingAction(null);
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 100);
    }
  };

  const handleRefund = () => {
    setRecordRefundClicked(true);
    setOpen(false);
    setShowCancelButtons(false);
    setRefundFooterButtons(true);
    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden">
        <DialogTitle className="hidden" />
        <div className="bg-[#FFFFFF] w-fit h-fit p-6 flex flex-col gap-4 rounded-lg border border-[#D9D9E0] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="text-[#1C2024] text-base font-semibold leading-6 flex justify-between">
            <span>{title}</span>
            <Image
              src={"/assets/icons/x.svg"}
              width={24}
              height={24}
              alt="Close Icon"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>

          {/* Description */}
          <span className="w-[464px] text-[#60646C] text-sm font-normal leading-5">
            {label}
          </span>

          {/* Conditional Form Fields */}
          {(showDropdown || showTextbox) && (
            <div className="flex flex-col gap-4">
              {showDropdown && (
                <div className="flex flex-col gap-2 text-[#1C2024] text-sm font-normal">
                  <span>{dropdownLabel}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative w-full">
                        <button className="w-full h-10 text-left rounded-lg px-4 py-2 bg-white border border-[#CDCED6] text-sm">
                          {cancelReasons.find((r) => r.id === selectedReason)
                            ?.reason ?? dropdownLabel}
                        </button>
                        <Image
                          src="/assets/icons/CaretDownFilled.svg"
                          width={16}
                          height={16}
                          alt="Caret Down Icon"
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[464px] px-0 py-2 border-[#D9D9E0]">
                      {isLoading ? (
                        <div>Loading Reasons...</div>
                      ) : (
                        cancelReasons.map((reasonObj) => (
                          <DropdownMenuItem
                            key={reasonObj.id}
                            onClick={() =>
                              setSelectedReason(reasonObj.id ?? "")
                            }
                            className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none"
                          >
                            {reasonObj.reason}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {reasonError && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select a reason.
                    </p>
                  )}
                </div>
              )}

              {showTextbox && (
                <div className="flex flex-col gap-2 text-[#1C2024] text-sm font-normal">
                  <span>{textboxLabel}</span>
                  <input
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={textboxPlaceholder}
                    className="w-full h-16 rounded-lg px-4 py-2 bg-white border border-[#CDCED6] placeholder:text-[#1C2024] placeholder:text-sm"
                  />
                  {remarkError && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a remark.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 justify-end">
            <DialogClose asChild>
              <Button
                size="button-medium"
                type="secondary-button"
                variant="button"
              >
                Cancel
              </Button>
            </DialogClose>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="button danger-button button-medium flex items-center gap-2 cursor-pointer">
                  {loadingAction ? (
                    <>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    </>
                  ) : (
                    <>
                      Cancel Bill
                      <Image
                        src={"/assets/icons/CarretDownWhite.svg"}
                        width={16}
                        height={16}
                        alt="Caret Down Icon"
                      />
                    </>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                alignOffset={0}
                sideOffset={8}
                align="end"
                className="shadow-none w-fit h-fit rounded-lg py-2 px-0 border-[#D9D9E0]"
              >
                <DropdownMenuItem
                  className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "cancel" ? (
                    <svg
                      className="animate-spin h-4 w-4 text-[#0D74CE]"
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
                  ) : null}
                  Cancel Bill
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none flex items-center gap-2"
                  onClick={handleRefund}
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "refund" ? (
                    <svg
                      className="animate-spin h-4 w-4 text-[#0D74CE]"
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
                  ) : null}
                  Cancel Bill & Record Refund
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none flex items-center gap-2"
                  onClick={handleCancelBillandDuplicate}
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "cancel" ? (
                    <svg
                      className="animate-spin h-4 w-4 text-[#0D74CE]"
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
                  ) : null}
                  Cancel Bill & Duplicate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
