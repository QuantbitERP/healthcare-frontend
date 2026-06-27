import React from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import Tags from "@/components/statusTags/Tags";

interface VisitInformationCardProps {
  visitData?: {
    patientName?: string;
    patientMrn?: string;
    patientAgeYears?: string;
    patientGender?: string;
    category?: string;
    companyName?: string;
    visitCode?: string;
  };
}

const VisitInformationCard: React.FC<VisitInformationCardProps> = ({ visitData }) => {
  return (
    <div className="flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <span className="w-[208px] text-[#60646C] text-xs font-normal">
              Visit Information
            </span>
          </div>

          {/* Display patient info */}
          <div className="flex flex-row gap-2 items-center">
            <Avatar
              name={visitData?.patientName?.charAt(0) ?? "P"}
              size="24"
              round={true}
              textSizeRatio={2}
              className="bg-[#0D74CE] text-white"
            />
            <span className="text-[#0D74CE] text-sm font-semibold">
              {visitData?.patientName || "Select Patient"}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <Tags
            variant="tag"
            tagText="Medical Legal Case"
            type="cyan"
            border
          />
          <Tags
            variant="tag"
            tagText="Insured"
            type="warning"
            border
          />
        </div>
      </div>

      {/* Patient information details */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row h-8 items-center justify-between">
          <div className="flex flex-row gap-1">
            <Image
              src={"assets/icons/Id.svg"}
              width={16}
              height={16}
              alt="UHID"
            />
            <span className="w-full text-[#1C2024] text-xs font-normal">
              UHID
            </span>
          </div>
          <span className="text-[#1C2024] text-xs font-semibold">
            {visitData?.patientMrn || "N/A"}
          </span>
        </div>

        <div className="flex flex-row h-8 items-center justify-between">
          <div className="flex flex-row gap-1">
            <Image
              src={"assets/icons/Cake.svg"}
              width={16}
              height={16}
              alt="Age"
            />
            <span className="w-full text-[#1C2024] text-xs font-normal">
              Age / Gender
            </span>
          </div>
          <span className="text-[#1C2024] text-xs font-semibold">
            {visitData?.patientAgeYears || "N/A"} / {visitData?.patientGender || "N/A"}
          </span>
        </div>

        <div className="flex flex-row h-8 items-center justify-between">
          <div className="flex flex-row gap-1">
            <Image
              src={"assets/icons/Cash.svg"}
              width={16}
              height={16}
              alt="Category"
            />
            <span className="w-full text-[#1C2024] text-xs font-normal">
              Category
            </span>
          </div>
          <span className="text-[#1C2024] text-xs font-semibold">
            {visitData?.category || "N/A"}
          </span>
        </div>

        <div className="flex flex-row h-8 items-center justify-between">
          <div className="flex flex-row gap-1">
            <Image
              src={"assets/icons/Building.svg"}
              width={16}
              height={16}
              alt="Company"
            />
            <span className="w-full text-[#1C2024] text-xs font-normal">
              Company
            </span>
          </div>
          <span className="text-[#1C2024] text-xs font-semibold">
            {visitData?.companyName || "N/A"}
          </span>
        </div>

        <div className="flex flex-row h-8 items-center justify-between">
          <div className="flex flex-row gap-1">
            <Image
              src={"assets/icons/DoorEnter.svg"}
              width={16}
              height={16}
              alt="Visit Code"
            />
            <span className="w-full text-[#1C2024] text-xs font-normal">
              Visit Code
            </span>
          </div>
          <span className="text-[#1C2024] text-xs font-semibold">
            {visitData?.visitCode || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VisitInformationCard;
