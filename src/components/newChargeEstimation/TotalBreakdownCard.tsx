import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,

} from "@/components/ui/dialog";

import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import {
  GetDraftBillByIdResponseDTO,
  InsertReceiptPayment,
  KVPairListResultModelResultModel,
  OpdBillService,
} from "@/services/api-client";
import { useGlobalTables } from "@/context/GlobalTablesContext";

interface TotalBreakdownCardProps {
  selectedPatientBill: GetBillDetailsDTO | null;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | undefined;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showDeposit?: boolean;
  setRecordRefundClicked?: (val: boolean) => void;
  setRefundFooterButtons?: (val: boolean) => void;
  dialogTypeAlert?: string;
}

function TotalBreakdownCard({
  selectedPatientBill,
  billData,
}: TotalBreakdownCardProps) {

  const [paidByOptions, setPaidByOptions] = useState<
    { key: string; value: string }[]
  >([]);
 
  const [open, setOpen] = useState(false);
 
  
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [gstList, setGstList] = useState<KVPairListResultModelResultModel>();
  const {
    setPatientBillConcession,
    setPatientRecordPayment,
    setPatientRecordPaymentInUpdate,
    setGSTID,
    patientServicesTable,
    setPaidBy,
    setPaidByName,
    setSponsoredbyName,
    setPendingPaybleAmount,
    
  } = useGlobalTables();

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
    if(selectedPatientBill){
      const selectedOption =
                  paidByOptions.find((item) => item.value === selectedValue) ||
                  null;
      setPaidBy(selectedOption);
      setPaidByName(selectedPatientBill?.paidByName ?? "");
      setSponsoredbyName(selectedPatientBill?.sponsoredbyName ?? "")
      setPendingPaybleAmount(selectedPatientBill?.billPatientPayableAmount ?? 0)
    }
  },[paidByOptions, selectedPatientBill, selectedValue, setPaidBy, setPaidByName, setPendingPaybleAmount, setSponsoredbyName]);



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
                    {gstList?.data?.items?.map((item, idx) => (
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
              Total Estimated Amount
            </p>
            <p className="text-[red] text-base font-bold">
              {billData?.outstandingAmount}
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default TotalBreakdownCard;
