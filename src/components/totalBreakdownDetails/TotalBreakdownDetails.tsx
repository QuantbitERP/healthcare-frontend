import Image from "next/image";
import React from "react";
import Button from "@/components/buttons/Button";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { useServiceTotals } from "@/hooks/useServiceTotals";

interface TotalBreakdownDetailsProps {
  setOpen: (open: boolean) => void;
  showInsuranceDetails?: boolean;
  InsuranceDeposit?: string;
  selectedPatientBill: GetBillDetailsDTO | null;
  totalAmountforConcession: number;
  selectedValue: string;
  serviceCalculations;
  concessionOnBill: number;
}

const TotalBreakdownDetails: React.FC<TotalBreakdownDetailsProps> = ({
  setOpen,
  showInsuranceDetails = false,
  InsuranceDeposit = "0",
  selectedPatientBill,
  selectedValue,
  serviceCalculations,
  concessionOnBill,
}) => {
  const { totalRate,             
    totalConcessionAmount,   
    totalMouDiscountAmount,  
    totalDiscountAmount,              
    totalGSTAmount,        
    totalCGSTAmount,       
    totalSGSTAmount,     
    totalCGSTPercentage,   
    totalSGSTPercentage,   
    grandTotal,  } = useServiceTotals(serviceCalculations);

  return (
    <div className="w-[640px] bg-white max-h-screen rounded-lg border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)] flex flex-col">
      {/* Header */}
      <div className="w-full px-6 pt-6 pb-6 flex flex-row gap-2 items-center">
        <Image src={ "/assets/icons/RupeeIcon.svg"} width={24} height={24} alt="Rupee" />
        <span className="flex-1 text-[#1C2024] text-base font-semibold">
          Total Breakdown
        </span>
        <Button
          iconSrc={"/assets/icons/DotsHorizontal.svg"}
          size="button-icon-small"
          type="secondary-button"
          variant="icon"
        />
      </div>

      {/* Scrollable body */}
      <div className="w-full flex-1 overflow-auto px-6 pb-6 text-xs text-[#1C2024] font-normal">
        <div className="flex flex-col rounded-lg border border-[#D9D9E0] bg-[#FFF] overflow-hidden">
          {/* Table Header */}
          <div className="w-full h-10 flex bg-[#F9F9FB] items-center border-b border-[#D9D9E0] font-semibold text-[#60646C]">
            <div className="w-[396px] px-3 py-3 border-r border-[#D9D9E0]">
              Description
            </div>
            <div className="w-[196px] px-3 py-2 text-end">Amount</div>
          </div>

 

          {/* Dynamic Rows */}
          {[
            ["Total Service Amount", selectedPatientBill?.totalServiceAmount ? selectedPatientBill?.totalServiceAmount : totalRate],
            ["Total Service Discount", selectedPatientBill?.totalServiceDiscount? selectedPatientBill?.totalServiceDiscount : totalDiscountAmount],
            ["MoU", selectedPatientBill?.totalServiceMouDiscount? selectedPatientBill?.totalServiceMouDiscount : totalMouDiscountAmount],
            ["Inline", selectedPatientBill?.totalServiceInlineDiscount? selectedPatientBill?.totalServiceInlineDiscount: totalConcessionAmount],
            ["Total Service GST Amount", selectedPatientBill?.totalServiceGstAmount? selectedPatientBill?.totalServiceGstAmount : totalGSTAmount.toFixed(2)],
            [`CGST (${totalCGSTPercentage.toFixed(2)}%)`, selectedPatientBill?.totalServiceCGstAmount ? selectedPatientBill?.totalServiceCGstAmount : totalCGSTAmount.toFixed(2)],
            [`SGST (${totalSGSTPercentage.toFixed(2)}%)`, selectedPatientBill?.totalServiceSGstAmount ? selectedPatientBill?.totalServiceSGstAmount : totalSGSTAmount.toFixed(2)],
            ["Net Service Amount", selectedPatientBill?.netServiceAmount? selectedPatientBill?.netServiceAmount : grandTotal],
            ["Bill Concession", selectedPatientBill?.billDiscountAmount? selectedPatientBill?.billDiscountAmount : concessionOnBill],
            ["Bill Level GST", selectedPatientBill?.billGstAmount? selectedPatientBill?.billGstAmount : (((grandTotal - concessionOnBill) * Number(selectedValue))/100).toFixed(2)],
            [`CGST (${Number(selectedValue)/2}%)`, selectedPatientBill?.billCGstAmount? selectedPatientBill?.billCGstAmount : (((grandTotal - concessionOnBill) * Number(selectedValue)/2)/100).toFixed(2)],
            [`SGST (${Number(selectedValue)/2}%)`, selectedPatientBill?.billSGstAmount? selectedPatientBill?.billSGstAmount : (((grandTotal - concessionOnBill) * Number(selectedValue)/2)/100).toFixed(2)],
            ["Patient Payable", selectedPatientBill?.billPatientPayableAmount],
            ["Company Payable", selectedPatientBill?.companyOutstandingAmount],
            ["Total Deposit Before Bill", selectedPatientBill?.totalDepositBeforeBill],
            ["Utilized Deposit", selectedPatientBill?.utilizedDeposit],
            ["Total Deposit After Bill", selectedPatientBill?.totalDepositAfterBill],
            ["Total Received Amount", selectedPatientBill?.billReceiptAmount],
            ["Pending Payable Amount", selectedPatientBill?.patientOutstandingAmount],
            ["Total Outstanding (After Save)", selectedPatientBill?.outstandingAmount],
            ["Patient Outstanding", selectedPatientBill?.patientOutstandingAmount],
            ["Company Outstanding", selectedPatientBill?.companyOutstandingAmount],
            ["Excess Collected Amount", selectedPatientBill?.excessCollectedAmount],
          ].map(([label, value], index) => {
            const isChild = [2, 3, 5,6, 10, 11].includes(index);
            const hasNoBottomBorder = [2,5,10].includes(index)
            return(
            <div
              key={label}
              className={`w-full h-10 flex flex-row items-center ${
                  hasNoBottomBorder ? "" : "border-b border-[#D9D9E0]"
                }`}
              >
              <div
                  className={`px-3 py-3 border-r border-[#D9D9E0] ${
                    isChild ? "pl-6 w-[396px]" : "w-[396px]"
                  }`}
                >
                {label}
              </div>
              <div className="w-[196px] px-3 py-2 text-end">₹{value ?? 0}</div>
            </div>
          )})}

          {showInsuranceDetails && (
            <div className="w-full h-10 flex flex-row items-center border-b border-[#D9D9E0]">
              <div className="w-[396px] px-3 py-3 border-r border-[#D9D9E0]">
                Insurance Deposit
              </div>
              <div className="w-[196px] px-3 py-2 text-end">₹{InsuranceDeposit}</div>
            </div>
          )}

          {/* Total */}
          <div className="w-full h-10 flex flex-row items-center">
            <div className="w-[396px] px-3 py-3 border-r border-[#D9D9E0] font-semibold">
              Total Amount
            </div>
            <div className="w-[196px] px-3 py-2 text-end text-lg font-bold">
              ₹{selectedPatientBill?.finalBillAmount}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-row justify-end items-center w-full px-6 py-3 gap-4 border-t border-[#D9D9E0]">
        <Button
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
        <Button
          size="button-small"
          type="primary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Preview & Print
        </Button>
      </div>
    </div>
  );
};

export default TotalBreakdownDetails;
