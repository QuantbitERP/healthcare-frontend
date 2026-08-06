import React from 'react'
import Rupee from "@/assets/icons/receipt-rupee.svg";
import Check from "@/components/checkbox/CheckboxComponent";
import Up from "@/assets/icons/Up.svg";
import Down from "@/assets/icons/Down.svg";
import Image from 'next/image';
import { useRouter } from "next/navigation";

function Header({ recordRefundClicked, selectedPatient, billId }) {
  const router = useRouter();
  return (
    <div
      id="header"
      className="w-full h-16 p-4 flex justify-between items-center flex-shrink-0 border-b border-[#D9D9E0]"
    >
      <div className="w-fit h-fit flex flex-row items-center gap-2">
        <Image src={Rupee.src} alt="Icon" width={24} height={24} />
        <div className="flex gap-1 text-base font-semibold">
          <span className="text-[#0D74CE] cursor-pointer" onClick={() => router.push(`/ipd_bills`)}>IPD Bills</span>
          <span className="text-[#1C2024] cursor-pointer">/</span>
        </div>
        {!recordRefundClicked && (
          <span className="font-semibold text-base text-[#1C2024]">
            {selectedPatient ? selectedPatient.billNumber : `#${billId}`}
          </span>
        )}
        {recordRefundClicked && (
          <span className="font-semibold text-base text-[#1C2024]">
            Record Refund
          </span>
        )}
      </div>
      <div className="flex flex-row gap-3 text-[#60646C] text-xs font-normal items-center">
        <div className="flex flex-row gap-2z items-center">
          <Check label={''} />
          <span>Navigate Patient&apos;s Bills</span>
        </div>
        <button className="w-fit h-fit rounded-lg px-2 py-2 flex justify-center border border-[#D9D9E0] bg-white shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
          <Image src={Up.src} alt="Up" width={24} height={24} />
        </button>
        <button className="w-fit h-fit rounded-lg px-2 py-2 flex justify-center border border-[#D9D9E0] bg-white shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
          <Image src={Down.src} alt="Up" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}

export default Header
