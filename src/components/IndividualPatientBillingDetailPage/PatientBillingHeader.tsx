import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { OpdBillService } from "@/services/api-client/services/OpdBillService";
import { Checkbox } from "../ui/checkbox";
import { useGlobalTables } from "@/context/GlobalTablesContext";


interface HeaderProps {
  recordRefundClicked: boolean;
  setRecordRefundClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatient: GetBillDetailsDTO | null;
  setSelectedPatient: React.Dispatch<
    React.SetStateAction<GetBillDetailsDTO | null>
  >;
  billId: string | undefined;
  onBillChange?: (newBill: GetBillDetailsDTO) => void;
  setShowNoBillAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setShowErrorAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  recordRefundClicked,
  selectedPatient,
  billId,
  onBillChange,
  setShowNoBillAlert,
  setShowErrorAlert,
}) => {
  const [onlyForSamePatient, setOnlyForSamePatient] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { billList } = useGlobalTables();

  const currentIndex = useMemo(() => {
    if (!billList || !billId) return -1;
    return billList.findIndex((id) => id === billId);
  }, [billList, billId]);

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === billList.length - 1;

  const handleNavigation = async (direction: number) => {
    if ((direction === 1 && isFirst) || (direction === -1 && isLast)) return;

    setLoading(true);
    try {
      const res = await OpdBillService.getApiVOpdBillOpdbillsSingleOpdBill(
        "1",
        billId,
        direction,
        onlyForSamePatient,
        ""
      );
      if (!res?.id) {
        setShowNoBillAlert(true);
        return;
      }
      onBillChange?.(res);
    } catch (error) {
      console.error("Failed to navigate bill: ", error);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="relative" className="w-full">
      <div
        id="header"
        className="w-full h-16 p-4 flex justify-between items-center flex-shrink-0 border-b border-[#D9D9E0]"
      >
        <div className="w-fit h-fit flex flex-row items-center gap-2">
          <Image
            src="assets/icons/receipt-rupee.svg"
            alt="Icon"
            width={24}
            height={24}
          />
          <div className="flex gap-1 text-base font-semibold">
            <span
              className="text-[#0D74CE] cursor-pointer"
              onClick={() => router.push("/opd_bills")}
            >
              OPD Bills
            </span>
            <span className="text-[#1C2024]">/</span>
          </div>
          {!recordRefundClicked ? (
            <span className="font-semibold text-base text-[#1C2024]">
              {selectedPatient?.billDocumentNumber ||
                selectedPatient?.tempDocumentNo}
            </span>
          ) : (
            <span className="font-semibold text-base text-[#1C2024]">
              Record Refund
            </span>
          )}
        </div>

        <div className="flex flex-row gap-3 text-[#60646C] text-xs font-normal items-center">
          <div className="flex flex-row gap-2 items-center">
            <Checkbox
              checked={onlyForSamePatient}
              onCheckedChange={(checked) => setOnlyForSamePatient(!!checked)}
            />
            <span>Navigate Patient&apos;s Bills</span>
          </div>
          <button
            disabled={loading || isFirst}
            onClick={() => handleNavigation(1)}
            className={`w-fit h-fit rounded-lg px-2 py-2 flex justify-center border border-[#D9D9E0] bg-white shadow
            ${loading || isFirst
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-50 cursor-pointer"
              }`}
          >
            <Image src="assets/icons/Up.svg" alt="Up" width={24} height={24} />
          </button>
          <button
            disabled={loading || isLast}
            onClick={() => handleNavigation(-1)}
            className={`w-fit h-fit rounded-lg px-2 py-2 flex justify-center border border-[#D9D9E0] bg-white shadow
            ${loading || isLast
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-50 cursor-pointer"
              }`}
          >
            <Image
              src="assets/icons/Down.svg"
              alt="Down"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <Image
            src="/loaderAnimation.gif"
            alt="Loading"
            width={106}
            height={106}
            priority
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
