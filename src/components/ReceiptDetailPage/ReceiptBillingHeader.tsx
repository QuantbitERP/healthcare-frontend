import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PatientDetails } from "@/store/slices/patientBillDetailsSlice";


// Define prop types for Header
interface HeaderProps {
  recordRefundClicked: boolean;
  setRecordRefundClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatient: PatientDetails | null;
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientDetails | null>>;
  receiptId: string | number;
}

const Header: React.FC<HeaderProps> = ({
  recordRefundClicked,
  selectedPatient,
  receiptId,
}) => {
  const router = useRouter();

  return (
    <div
      id="header"
      className="w-full h-16 p-4 flex justify-between items-center flex-shrink-0 border-b border-[#D9D9E0]"
    >
      <div className="w-fit h-fit flex flex-row items-center gap-2">
        <Image src={"assets/icons/receipt-rupee.svg"} alt="Icon" width={24} height={24} />
        <div className="flex gap-1 text-base font-semibold">
          <span
            className="text-[#0D74CE] cursor-pointer"
            onClick={() => router.push("/payments_received")}
          >
            Payment Received
          </span>
          <span className="text-[#1C2024] cursor-pointer">/</span>
        </div>
        {!recordRefundClicked && (
          <span className="font-semibold text-base text-[#1C2024]">
            {selectedPatient?.billNumber || `#${receiptId}`}
          </span>
        )}
        {recordRefundClicked && (
          <span className="font-semibold text-base text-[#1C2024]">
            Record Refund
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;
