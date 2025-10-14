import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Button from "../buttons/Button";
import RecordPayments from "../recordPayments/RecordPayments";
import TotalBreakdownDetails from "@/components/totalBreakdownDetails/TotalBreakdownDetails";
import PaymentReceipt from "@/components/paymentReceipt/Receipt";
import EditableAmountTable from "@/components/totalBreakdownCardComponents/BalanceUtilizedNonEditable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tags from "../statusTags/Tags";
import Concession from "@/components/concession/Concession";
import Discount from "@/components/totalBreakdownCardComponents/Discount";
import DiscountTable from "@/components/discount/Discount";
import Deposit from "@/components/deposit/Deposit";
import Transactions from "@/components/totalBreakdownCardComponents/PaymentsReceived";
import RecordRefund from "@/components/recordRefund/RecordPayments";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import {
  GetDraftBillByIdResponseDTO,
  InsertReceiptPayment,
  KVPairListResultModelResultModel,
  OpdBillService,
} from "@/services/api-client";
import { useGlobalTables } from "@/context/GlobalTablesContext";

export type ServiceCalculation = {
  rate: number;
  gstPercentage: number;
};


interface TotalBreakdownCardProps {
  selectedPatientBill: GetBillDetailsDTO | null;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | null;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showDeposit?: boolean;
  setRecordRefundClicked?: (val: boolean) => void;
  setRefundFooterButtons?: (val: boolean) => void;
  dialogTypeAlert?: string;
  serviceCalculations?: Record<string, { rate: number; gstPercentage: number; concessionPercent: number; mouDiscountAmt: number }>;
}

function TotalBreakdownCard({
  selectedPatientBill,
  billData,
  primaryButtonText = "Record Payment",
  secondaryButtonText = "View Payment Receipt",
  showDeposit = false,
  setRecordRefundClicked,
  setRefundFooterButtons,
  dialogTypeAlert,
  serviceCalculations,
}: TotalBreakdownCardProps) {

  const initialBalanceAmount =
    (selectedPatientBill?.totalDepositAfterBill ?? 0) +
    0 -
    (selectedPatientBill?.utilizedDeposit ?? 0) -
    0;
  // (0) -  selectedPatientBill?.employeeBalance
  // (selectedPatientBill?.employeeBalanceUtilized ?? 0); to add later
  const [paidByOptions, setPaidByOptions] = useState<
    { key: string; value: string }[]
  >([]);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [balanceUtilizedAmount, setBalanceUtilizedAmount] = useState<
    number | null
  >(initialBalanceAmount);
  const [, setSavedRecord] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [gstList, setGstList] = useState<KVPairListResultModelResultModel>();
  const {
    patientBillConcession,
    setPatientBillConcession,
    setPatientRecordPayment,
    setPatientRecordPaymentInUpdate,
    setGSTID,
    patientServicesTable,
    setPaidBy,
    setPaidByName,
    setSponsoredbyName,
    setPendingPaybleAmount,
    setRemainingPaybleAmount,
    
  } = useGlobalTables();

  console.log(serviceCalculations,patientServicesTable);

  useEffect(() => {
    OpdBillService.getApiVOpdBillOpdbillsPatientPaidby("1", "")
      .then((res) => {
        setPaidByOptions(
          res.data?.items?.map((item) => ({
            key: item.key ?? "",
            value: item.value ?? "",
          })) ?? []
        );
      })
      .catch((err) => {
        console.error("Failed to fetch paid by options", err);
      });
  }, []);

  useEffect(() => {
    if(selectedPatientBill || billData){
      const selectedOption =
                  paidByOptions.find((item) => item.value === selectedValue) ||
                  null;
      setPaidBy(selectedOption);
      setPaidByName(selectedPatientBill?.paidByName ?? billData?.paidByName ?? "");
      setSponsoredbyName(selectedPatientBill?.sponsoredbyName ?? billData?.sponsoredbyName ?? "")

      // Calculate pending payable amount from current selected services
      const currentTotalAmount = calculateTotalAmount(patientServicesTable);
      setPendingPaybleAmount(currentTotalAmount);
      setRemainingPaybleAmount(currentTotalAmount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[paidByOptions, selectedPatientBill, billData, selectedValue, setPaidBy, setPaidByName, setPendingPaybleAmount, setSponsoredbyName, patientServicesTable]);

  // Update pending payable amount whenever patient services table changes
  useEffect(() => {
    const currentTotalAmount = calculateTotalAmount(patientServicesTable);
    setPendingPaybleAmount(currentTotalAmount);
    setRemainingPaybleAmount(currentTotalAmount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientServicesTable, setPendingPaybleAmount]);

  // Also update when serviceCalculations change (for real-time updates)
  useEffect(() => {
    const currentTotalAmount = calculateTotalAmount(patientServicesTable);
    setPendingPaybleAmount(currentTotalAmount);
    setRemainingPaybleAmount(currentTotalAmount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceCalculations, patientServicesTable, setPendingPaybleAmount]);

  useEffect(() => {
    if (selectedPatientBill?.billConcessionDetails) {
      setPatientBillConcession(selectedPatientBill.billConcessionDetails);
    }
  }, [selectedPatientBill?.billConcessionDetails, setPatientBillConcession]);

  useEffect(() => {
    if (selectedPatientBill?.receiptPayments) {
      setPatientRecordPayment(selectedPatientBill?.receiptPayments);
      setPatientRecordPaymentInUpdate(
        (selectedPatientBill?.receiptPayments ?? []).map((item) => ({
          ...item,
          amount: item.amount ?? 0,     // convert null → 0 (or undefined, depending on what you want)
        })) as InsertReceiptPayment[]
      );
      
    }
  }, [selectedPatientBill?.receiptPayments, setPatientRecordPayment, setPatientRecordPaymentInUpdate]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSaveAmount = (finalAmount: number) => {
    setBalanceUtilizedAmount(finalAmount);
  };

  useEffect(() => {
    if (gstList?.data?.items && selectedPatientBill?.billGstId) {
      const item = gstList.data.items.find((i) => i.key === selectedPatientBill?.billGstId);
      if (item) {
        setSelectedValue(item.value?.toString().replace("%", "") ?? "");
        setGSTID({ key: item.key ?? null, value: item.value ?? null });
      }
    }
  }, [gstList, selectedPatientBill?.billGstId, setGSTID]);
  

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    const selectedItem = gstList?.data?.items?.find(
      (item) => item.value?.toString().replace("%", "") === value
    );

    if (selectedItem) {
      setGSTID({
        key: selectedItem.key?.trim() === "" ? null : selectedItem.key ?? null,
        value:
          selectedItem.value?.trim() === "" ? null : selectedItem.value ?? null,
      });
    } else {
      setGSTID({
        key: null,
        value: null,
      });
    }
  };

  useEffect(() => {
    OpdBillService.getApiVOpdBillOpdbillsGstList("1", "")
      .then((res) => {
        setGstList(res);
      })
      .catch((error) => {
        console.error("Failed to fetch GST list", error);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTotalConcessionAmount = (entries: any[]) => {
    return entries.reduce((sum, item) => {
      const amount = Number(item.concessionamount) || 0;
      return sum + amount;
    }, 0);
  };
 const calculateTotalAmount = (patientServicesTable: any[]) => {
    return patientServicesTable.reduce((total, row) => {
      const rate = parseFloat(row.rate) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const mouDiscount = parseFloat(row.mouDiscountAmount) || 0;
      const concessionPercentage = parseFloat(row.concessionPercent) || 0;

      const concessionAmount = (concessionPercentage / 100) * rate;

      const rowTotal = rate * quantity - mouDiscount - concessionAmount;

      return total + rowTotal;
    }, 0);
  };

  const totalAmountforConcession = calculateTotalAmount(patientServicesTable);
  const concessionOnBill = getTotalConcessionAmount(
   patientBillConcession
  );

  // Extract unique GST percentages from serviceCalculations
  const applicableGstPercentages = useMemo(() => {
    const gstPercentages = new Set<number>();
    const services = serviceCalculations as Record<string, { rate: number; gstPercentage: number; concessionPercent: number; mouDiscountAmt: number }> || {};
    Object.values(services).forEach(service => {
      if (service.gstPercentage > 0) {
        gstPercentages.add(service.gstPercentage);
      }
    });
    const result = Array.from(gstPercentages).sort((a, b) => a - b);
    return result;
  }, [serviceCalculations]);

  // Check if any services have GST applicable
  const hasGstApplicableServices = applicableGstPercentages.length > 0;

  // Filter GST list to show only applicable rates
  const filteredGstList = useMemo(() => {
    if (!gstList?.data?.items) return [];

    return gstList.data.items.filter(item => {
      const gstPercentage = parseFloat(item.value?.toString().replace("%", "") || "0");
      return applicableGstPercentages.includes(gstPercentage);
    });
  }, [gstList, applicableGstPercentages]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <div
        className="w-[256px] h-fit flex flex-col rounded-lg p-4 gap-3 border border-[#D9D9E0] shadow-sm bg-[linear-gradient(135deg,#E5DCFF_0%,rgba(255,255,255,0.50)_37.73%),#FFF]"
        style={{
          background:
            "linear-gradient(135deg, #E5DCFF 0%, rgba(255, 255, 255, 0.50) 37.73%), #FFF",
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="text-[#60646C] text-xs font-normal">
            Total Breakdown
          </div>
          <div>
            <div className="flex flex-row justify-between items-center h-8">
              <p className="text-[#1C2024] text-sm font-medium">Total</p>
              <p className="text-[#1C2024] text-xs font-semibold">
                {billData && "finalBillAmount" in billData
                  ? billData.finalBillAmount : billData && "billTotalAmount" in billData ? billData?.billTotalAmount
                  : calculateTotalAmount(patientServicesTable)}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center h-8 ">
              <TooltipProvider>
                <div className="flex items-center space-x-1">
                  <DialogTrigger>
                    <div>
                      <p
                        className="text-[#0D74CE] text-sm font-medium cursor-pointer"
                        onClick={() => setDialogType("Concession")}
                      >
                        Concession
                      </p>
                    </div>
                  </DialogTrigger>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image
                        src={"/assets/icons/ExclamationCircle.svg"}
                        width={16}
                        height={16}
                        alt="Exclaim"
                        className="cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="bg-red-500 text-white text-xs px-3 py-2 rounded-md shadow-lg"
                    >
                      <p>Concession approval is pending</p>
                      <TooltipArrow className="fill-[#ff2200]" />
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <p className="text-[#8B8D98] text-xs font-semibold">
                {getTotalConcessionAmount(patientBillConcession)}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center h-8 ">
              <DialogTrigger>
                <div>
                  <p
                    className="text-[#0D74CE] text-sm font-medium cursor-pointer"
                    onClick={() => setDialogType("Balance")}
                  >
                    Balance Utilized
                  </p>
                </div>
              </DialogTrigger>
              <p className="text-[#8B8D98] text-xs font-semibold">
                {balanceUtilizedAmount}
              </p>
            </div>
            {showDeposit && (
              <div className="flex flex-row justify-between items-center h-8">
                <DialogTrigger>
                  <div>
                    <p
                      className="text-[#0D74CE] text-sm font-medium cursor-pointer"
                      onClick={() => setDialogType("Deposit")}
                    >
                      Deposit
                    </p>
                  </div>
                </DialogTrigger>
                <p className="text-[#8B8D98] text-xs font-semibold">
                  {selectedPatientBill?.totalDepositBeforeBill}
                </p>
              </div>
            )}
            {hasGstApplicableServices && (
              <div className="flex flex-row justify-between items-center h-8 ">
                <div
                  className="relative inline-block text-left "
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-[#0D74CE] text-sm font-medium border-none shadow-none focus:ring-0 focus:outline-none pl-0 h-8 cursor-pointer"
                  >
                    <p className="text-[#0D74CE] text-sm font-medium">
                      {selectedValue ? `GST (${selectedValue}%)` : "GST"}
                    </p>
                    <Image
                      src={"/assets/icons/CaretDownDark.svg"}
                      width={16}
                      height={16}
                      alt="Caret"
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute w-fit min-w-[94px] bg-white rounded-lg py-2 border border-[#D9D9E0] shadow-sm text-sm font-normal text-[#1C2024]">
                      <div
                        className="px-4 py-2 cursor-pointer hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                        onClick={() => handleSelect("0")}
                      >
                        None
                      </div>
                      {filteredGstList.map((item, idx) => (
                        <div
                          key={item.value ?? idx}
                          className="px-4 py-2 cursor-pointer hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                          onClick={() =>
                            handleSelect(
                              item?.value?.toString().replace("%", "") ?? ""
                            )
                          }
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[#8B8D98] text-xs font-semibold">{`${selectedValue}%`}</p>
              </div>
            )}
            {/* <div className="flex flex-row justify-between items-center h-8 ">
              <DialogTrigger>
                <div>
                  <p
                    className="text-[#0D74CE] text-sm font-medium cursor-pointer"
                    onClick={() => setDialogType("Discount")}
                  >
                    Discount
                  </p>
                </div>
              </DialogTrigger>
              <p className="text-[#8B8D98] text-xs font-semibold ">
                {discount}%
              </p>
            </div> */}
            <DialogTrigger asChild>
              <div
                className="text-[#1C2024] font-medium text-xs w-full h-6 flex items-center cursor-pointer"
                onClick={() => setDialogType("Details")}
              >
                Show More
              </div>
            </DialogTrigger>
          </div>
          <div>
            <Image
              src={"/assets/icons/DividerHorizontal.svg"}
              width={224}
              height={220}
              alt="Divider"
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="w-full text-[#1C2024] text-sm font-medium">
              Outstanding Amount
            </p>
            <p className="text-[red] text-base font-bold">
              {billData?.outstandingAmount}
            </p>
          </div>
          <div className="w-full h-fit flex flex-row gap-2 items-center text-[#0D74CE] text-xs font-medium ">
            <DialogTrigger>
              <div>
                <p
                  className="text-[#0D74CE] text-sm font-medium cursor-pointer"
                  onClick={() => setDialogType("Transactions")}
                >
                  Transactions
                </p>
              </div>
            </DialogTrigger>
            <Tags
              tagText={`${selectedPatientBill?.receiptPayments?.length ?? 0}`}
              type="primary"
              variant="tag"
              border
            />
          </div>
          <DialogTrigger asChild>
            <Button
              size="button-medium"
              type="primary-button"
              variant="button"
              className={"!w-full cursor-pointer"}
              onClick={() => setDialogType("Record")}
            >
              {primaryButtonText}
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              size="button-medium"
              type="secondary-button"
              variant="button"
              className={"!w-full cursor-pointer"}
              onClick={() => setDialogType("Receipt")}
            >
              {secondaryButtonText}
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden max-w-none z-[250]">
        {dialogType === "Concession" && (
          <Concession
            selectedPatientBillConcession={
              selectedPatientBill?.billConcessionDetails
            }
            setOpen={setOpen}
            totalAmountforConcession={totalAmountforConcession}
          />
        )}
        {dialogTypeAlert === "Concession" && (
          <Concession
            selectedPatientBillConcession={
              selectedPatientBill?.billConcessionDetails
            }
            setOpen={setOpen}
            totalAmountforConcession={totalAmountforConcession}
          />
        )}
        {dialogType === "Balance" && (
          <EditableAmountTable
            onSave={handleSaveAmount}
            selectedPatientBill={selectedPatientBill}
            setOpen={setOpen}
          />
        )}
        {dialogType === "Deposit" && <Deposit setOpen={setOpen} />}
        {dialogType === "Discount" && !showDeposit && (
          <Discount setOpen={setOpen} />
        )}
        {dialogType === "Discount" && showDeposit && (
          <DiscountTable setOpen={setOpen} />
        )}
        {dialogType === "Transactions" && (
          <Transactions
            selectedPatientBillReceipts={selectedPatientBill?.receiptPayments}
          />
        )}
        {dialogType === "Details" && (
          <TotalBreakdownDetails
            selectedPatientBill={selectedPatientBill}
            setOpen={setOpen}
            totalAmountforConcession={totalAmountforConcession}
            selectedValue={selectedValue}
            serviceCalculations={serviceCalculations}
            concessionOnBill={concessionOnBill}
          />
        )}
        {dialogType === "Refund" && (
          <RecordRefund setOpen={setOpen} setSaveRecord={setSavedRecord} />
        )}
        {dialogType === "Record" && <RecordPayments setOpen={setOpen} />}
        {dialogType === "Receipt" && (
          <PaymentReceipt
            selectedPatientBillReceipts={selectedPatientBill?.receiptPayments}
            selectedPatientBill={selectedPatientBill}
            setDialogType={setDialogType}
            setRecordRefundClicked={setRecordRefundClicked}
            setRefundFooterButtons={setRefundFooterButtons}
            setOpen={setOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TotalBreakdownCard;
