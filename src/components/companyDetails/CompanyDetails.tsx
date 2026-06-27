import Image from "next/image";
import React from "react";

// Define the props interface
interface CompanyDetailsProps {
  setOpen: (value: boolean) => void;
  company?: string;
  insuranceNo?: string;
  claimNo?: string;
  approvedAmount?: string;
  companyAmount?: string;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  setOpen,
  company = "Tata Steel",
  insuranceNo = "052763",
  claimNo = "322984",
  approvedAmount = "₹23309",
  companyAmount = "₹1,000"
}) => {
  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Image src={'assets/icons/BuildingDark.svg'} width={24} height={24} alt="Rupee" />
          <p className="text-[#1C2024] text-base font-semibold">
            Company Details
          </p>
        </div>
        <Image
          src={'assets/icons/CloseIcon.svg'}
          width={24}
          height={24}
          alt="Close"
          onClick={() => setOpen(false)}
          className="cursor-pointer"
        />
      </div>
      <div className="p-6 pt-0 flex flex-col gap-4">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[#60646C] text-sm font-normal ">Company</span>
            <span className="text-[#1C2024] text-sm font-medium ">{company}</span>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[#60646C] text-sm font-normal ">Insurance Policy No.</span>
            <span className="text-[#1C2024] text-sm font-medium ">{insuranceNo}</span>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[#60646C] text-sm font-normal ">Claim No</span>
            <span className="text-[#1C2024] text-sm font-medium ">{claimNo}</span>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[#60646C] text-sm font-normal ">Approved Amount (₹)</span>
            <span className="text-[#1C2024] text-sm font-medium ">{approvedAmount}</span>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[#60646C] text-sm font-normal ">Company Amount (₹)</span>
            <span className="text-[#1C2024] text-sm font-medium ">{companyAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;
