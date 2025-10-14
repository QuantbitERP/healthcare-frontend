"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface HeaderProps {
  policyData: any;
}
const Header: React.FC<HeaderProps> = ({ policyData }) => {
  const router = useRouter();

  return (
    <div
      id="header"
      className="w-full h-16 p-4 flex justify-between items-center flex-shrink-0 border-b border-[#D9D9E0] bg-white"
    >
      <div className="w-fit h-fit flex flex-row items-center gap-2">
        <Image
          src={"/assets/icons/receipt-rupee.svg"}
          alt="Icon"
          width={24}
          height={24}
        />
         <div className="flex gap-1 text-base font-semibold">
           <span
             className="font-semibold text-lg text-[#0D74CE] cursor-pointer"
             onClick={() => router.push("/employee_policies")}
           >
             Employee Policies
           </span>
           <span className="font-semibold text-lg text-[#1C2024]">/</span>
         </div>
         {policyData ? (
           <span className="font-semibold text-lg text-[#1C2024]">
             {policyData.id}
           </span>
         ) : (
           <span className="font-semibold text-lg text-[#1C2024]">
             New Employee Policy
           </span>
         )}
      </div>
    </div>
  );
};

export default Header;
