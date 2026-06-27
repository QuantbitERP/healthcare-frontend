import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from 'next/navigation';
import Button from "@/components/buttons/Button";
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

import { GetBillsResponseDto } from "@/services/api-client/models/GetBillsResponseDto";
import {
  fetchCancelReasons,
  cancelOpdBill,
  cancelDraftOpdBill,
} from "@/store/opd_bills/thunks";

type ButtonConfig = {
  text: string;
  type: string;
  size: string;
  onClick: () => void;
};

type CloseDialogueBoxProps = {
  title?: string;
  label?: string;
  showDropdown?: boolean;
  dropdownLabel?: string;
  showTextbox?: boolean;
  textboxLabel?: string;
  textboxPlaceholder?: string;
  buttons?: ButtonConfig[];
  open: boolean;
  setOpen: (open: boolean) => void;
  setShowAlert?: (show: boolean) => void;
  deselectRows?: () => void;
  setAlertType?: (type: string) => void;
  data: GetBillsResponseDto[];
  rows?: GetBillsResponseDto[];
};

const CloseDialogueBox: React.FC<CloseDialogueBoxProps> = ({
  title = "Cancel Bill?",
  label = "Bill cancellation is irreversible.",
  showDropdown = false,
  dropdownLabel = "Select a Reason",
  showTextbox = false,
  textboxLabel = "Remarks",
  textboxPlaceholder = "Enter Remarks",
  buttons = [
    {
      text: "Cancel",
      type: "secondary-button",
      size: "button-medium",
      onClick: () => { },
    },
    {
      text: "Cancel Bill(s)",
      type: "danger-button",
      size: "button-medium",
      onClick: () => { },
    },
  ],
  open,
  setOpen,
  setShowAlert,
  deselectRows,
  setAlertType,
  rows,
}: CloseDialogueBoxProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { cancelReasons, isLoading } = useSelector(
    (state: RootState) => state.opdCancelReasons
  );
  const { cancelDraftError } = useSelector(
    (state: RootState) => state.opdCancelDraftBills
  );

  const [selectedReason, setSelectedReason] = useState<{ id: string; label: string } | null>(null);
  const [remark, setRemark] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCancelReasons({ version: "1", tenant: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (cancelReasons.length > 0 && !selectedReason) {
      setSelectedReason({
        id: cancelReasons[0].id ?? "",
        label: cancelReasons[0].reason ?? ""
      });
    }
  }, [cancelReasons, selectedReason]);

  useEffect(() => {
    if (cancelDraftError) {
      setShowAlert?.(true);
      setAlertType?.("error");
    }
  }, [cancelDraftError, setAlertType, setShowAlert]);
  const handleCancelBills = useCallback(async () => {
    if (!rows || rows.length === 0) return;

    setLoading?.(true);
    let hasError = false;

    try {
      const displayDocumentNumbers: string[] = [];
      const billIds: string[] = [];

      for (const row of rows ?? []) {
        if (row.statusString === "Draft") {
          displayDocumentNumbers.push(row.displayDocumentNumber ?? "");
        } else if (
          row.statusString === "Finalized" ||
          row.statusString === "Outstanding"
        ) {
          billIds.push(row.billId ?? "");
        }
      }

      if (displayDocumentNumbers.length > 0) {
        const resultAction = await dispatch(
          cancelDraftOpdBill({
            version: "1",
            tenant: "",
            requestBody: {
              model: {
                tempDocumentNos: displayDocumentNumbers,
              },
            },
          })
        );

        if (cancelDraftOpdBill.rejected.match(resultAction)) {
          hasError = true;
        }
      }

      if (billIds.length > 0) {
        const resultAction = await dispatch(
          cancelOpdBill({
            version: "1",
            tenant: "",
            requestBody: {
              model: {
                billIds,
                user: "233",
                cancelReason: selectedReason?.id,
                cancelRemark: remark,
                receiptAction: 0,
                refundAction: 0,
                refundReceiptPayments: [],
                hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
              },
            },
          })
        ).unwrap();

        if (!resultAction?.data?.items) {
          hasError = true;
        }
      }

      if (!hasError) {
        setAlertType?.("cancel");
        router.replace("/opd_bills");
      } else {
        setAlertType?.("error");
      }

      setShowAlert?.(true);
    } catch (error) {
      console.error("Error cancelling bills:", error);
      setAlertType?.("error");
      // setShowAlert?.(true);
    } finally {
      setLoading?.(false);
      setOpen(false);
      deselectRows?.();
    }
  }, [rows, setShowAlert, dispatch, selectedReason, remark, setAlertType, router, setOpen, deselectRows]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden">
        <DialogTitle className="hidden" />

        <div className="bg-white p-6 flex flex-col gap-4 rounded-lg border border-[#D9D9E0] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="flex justify-between text-[#1C2024] text-base font-semibold">
            <span>{title}</span>
            <Image
              src="assets/icons/x.svg"
              width={24}
              height={24}
              alt="Close Icon"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>

          {/* Description */}
          <span className="w-[464px] text-[#60646C] text-sm font-normal">
            {label}
          </span>

          {/* Form Fields */}
          {(showDropdown || showTextbox) && (
            <div className="flex flex-col gap-4">
              {showDropdown && (
                <div className="flex flex-col gap-2 text-[#1C2024] text-sm font-normal">
                  <span>{dropdownLabel}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative w-full">
                        <button className="w-full h-10 text-left rounded-lg px-4 py-2 bg-white border border-[#CDCED6] text-sm">
                          {selectedReason?.label}
                        </button>
                        <Image
                          src="assets/icons/CaretDownFilled.svg"
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
                              setSelectedReason({ id: reasonObj.id ?? "", label: reasonObj.reason ?? "" })
                            }
                            className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none"
                          >
                            {reasonObj.reason}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-row gap-2 justify-end">
            {buttons.map((btn, idx) =>
              btn.text === "Cancel" ? (
                <DialogClose key={idx} asChild>
                  <Button
                    type={btn.type}
                    size={btn.size}
                    onClick={btn.onClick}
                    disabled={!selectedReason && loading}
                  >
                    {btn.text}
                  </Button>
                </DialogClose>
              ) : (
                <Button
                  key={idx}
                  type={btn.type}
                  size={btn.size}
                  onClick={async () => {
                    await handleCancelBills();
                    btn.onClick();
                  }}
                  disabled={!selectedReason && loading}
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    btn.text
                  )}
                </Button>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CloseDialogueBox;
