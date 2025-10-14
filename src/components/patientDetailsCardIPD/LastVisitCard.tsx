import React, { useRef, useState } from "react";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import X from "@/assets/icons/x.svg";
import Phone from "@/assets/icons/Phone.svg";
import Cake from "@/assets/icons/Cake.svg";
import Location from "@/assets/icons/Icon.svg";
import Clock from "@/assets/icons/Clock.svg";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";


interface PatientDetailsCardProps {
  onClose: () => void;
  name?: string;
  uhid?: string;
  phone?: string;
  age?: string;
  sex?: string;
  aadharNumber?: string;
  date?: string;
  time?: string;
  fullName?: string;
  ipdNumber?: string;
  category?: string;
  company?: string;
  registrationDate?: string;
  address?: string;
  lastVisitDate?: string;
  lastVisitTime?: string;
  drName?: string;
  visitRemark?: string;
  billingClass?: string;
  creator?: string;
  visitType?: string;
  classType?: string;
  showInsuranceDetails?: boolean;
  patientPayable?: string;
  companyPayable?: string;
  policyNumber?: string;
  preAuthNo?: string;
  approvedAmount?: string;
  approvedDate?: string;
  approvedBy?: string;
  size?: "small" | "medium" | "large";
}

const LastVisitCard: React.FC<PatientDetailsCardProps> = ({
  onClose,
  name = "Neha Deshmukh",
  uhid = "70 7463 2446 5247",
  phone = "+91-9096396014",
  age = "23",
  sex = "Female",
  aadharNumber = "1589 2455 2564",
  date = "20/02/2025",
  time = "01:00 PM",
  showInsuranceDetails = true,
  policyNumber = "INS-987654321",
  preAuthNo = "PREAUTH-456789",
  approvedAmount = "₹6,500",
  approvedDate = "27-Mar-2025",
  approvedBy = "Dr. Ramesh Gupta",
  size = "large",
}) => {
  const [activeToggle, setActiveToggle] = useState<string>(
    "General Information"
  );
  const generalRef = useRef<HTMLDivElement>(null);
  const lastVisitRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState<boolean>(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleToggleClick = (section: string) => {
    setActiveToggle(section);
    let ref;
    if (section === "General Information") ref = generalRef;
    if (section === "Last Visit Information") ref = lastVisitRef;
    if (section === "Insurance Details") ref = insuranceRef;
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
      <div className="bg-white animate-slideUp">
        {/* Header */}
        <div className="w-full flex items-center px-6 py-4 border-b border-[#D9D9E0] gap-2">
          <Avatar
            name={name.charAt(0)}
            size="42"
            round={true}
            textSizeRatio={2}
          />
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2 w-[398px]">
              <div className="name text-[#1C2024] font-semibold text-base">
                {name}
              </div>
              <div className="text-[#60646C] text-xs font-normal">{uhid}</div>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                type={"secondary-button"}
                size={"button-small"}
                onClick={onClose}
              >
                Edit Patientssss
              </Button>
              <Button
                iconSrc={X}
                size="button-icon-small"
                type="secondary-button"
                variant="icon"
                onClick={onClose}
              ></Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6 no-scrollbar"
        >
          {/* add content */}
          <div className="Details flex flex-col w-full">
            <div
              className={`${
                size === "large" ? "px-[calc((100vw-960px)/2)]" : ""
              } flex flex-row w-full pt-4`}
            >
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${
                  size === "large"
                    ? "border-l rounded-tl-lg"
                    : "border-r-0 border-l-0"
                } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image src={Phone.src} alt="Phone" width={16} height={16} />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Contact
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {phone}
                </div>
              </div>
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${
                  size === "large" ? "border-l-0 rounded-tr-lg" : "border-r-0"
                } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image src={Cake.src} alt="Cake" width={16} height={16} />
                  <div className="text-[#1C2024] text-sm font-normal">Age</div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {age}/{sex}
                </div>
              </div>
            </div>
            <div
              className={`${
                size === "large" ? "px-[calc((100vw-960px)/2)]" : ""
              } flex flex-row`}
            >
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${
                  size === "large"
                    ? "border-l border-t-0 rounded-bl-lg"
                    : "border-t-0 border-l-0"
                } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image src={Location.src} alt="Location" width={16} height={16} />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Addhar Card
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {aadharNumber}
                </div>
              </div>
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border-b border-[#D9D9E0] ${
                  size === "large" ? "rounded-br-lg border-r" : "border-r-0"
                } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image src={Clock.src} alt="Clock" width={16} height={16} />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Last Visit
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {date} {time}
                </div>
              </div>
            </div>
          </div>

          {showInsuranceDetails && (
            <div className="flex flex-row items-center justify-center gap-4 pt-4">
              {[
                "General Information",
                "Last Visit Information",
                "Insurance Details",
              ].map((label) => (
                <Toggle
                  key={label}
                  pressed={activeToggle === label}
                  onClick={() => handleToggleClick(label)}
                >
                  {label}
                </Toggle>
              ))}
            </div>
          )}
          <div
            className="max-h-[600px] overflow-auto no-scrollbar flex flex-col gap-6 py-4"
            onScroll={handleScroll}
          >



            {showInsuranceDetails && (
              <div
                ref={insuranceRef}
                className={`${
                  size === "small"
                    ? "px-6"
                    : size === "medium"
                    ? "px-8"
                    : "px-[calc((100vw-960px)/2)]"
                } insuranceInfo flex flex-col gap-4`}
              >
                <div className="text-[#1C2024] font-semibold text-lg">
                  Insurance Details
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Patient Payable
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {policyNumber}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Company Payable
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {preAuthNo}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Insurance Policy No.
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {approvedAmount}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Pre Auth No./Code No./Claim Id
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {approvedDate}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Prior Auth/Approved Amount
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {approvedBy}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Approved Date
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {approvedBy}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">
                      Approved By
                    </div>
                    <div className="text-[#1C2024] text-sm font-medium">
                      {approvedBy}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!showInsuranceDetails && (
          <div className="footer w-full px-6 py-3 flex flex-row justify-end border-t border-[#D9D9E0] relative">
            {showGradient && (
              <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
            )}
            <Button
              type={"secondary-button"}
              size={"button-small"}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        )}
        {showInsuranceDetails && (
          <div className="footer w-full px-6 py-3 flex flex-row gap-4 justify-end border-t border-[#D9D9E0] relative">
            {showGradient && (
              <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
            )}
            <Button
              type={"secondary-button"}
              size={"button-small"}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type={"primary-button"}
              size={"button-small"}
              onClick={onClose}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
  );
};

export default LastVisitCard;
