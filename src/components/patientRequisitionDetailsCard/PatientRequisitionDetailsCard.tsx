import React, { useRef, useState } from "react";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import X from "@/assets/icons/x.svg";

interface PosInfoCardDetailsProps {
  onClose?: () => void;
  name?: string; // Ensure patientName is required
  uhid?: string;
  patientCategory?: string;
  visitId?: string;
  visitDateTime?: string;
  registrationDate?: string;
  aadhaarNo?: string;
  size?: "small" | "medium" | "large";
}

const PatientRequisitionDetailsCard: React.FC<PosInfoCardDetailsProps> = ({
  onClose,
  name: patientName,
  uhid,
  patientCategory,
  visitId,
  visitDateTime,
  registrationDate,
  aadhaarNo,
  size = "large",
}) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const generalRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState<boolean>(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleClose = () => {
    console.log("onClose triggered");
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => onClose(), 300);
    } else {
      console.warn("onClose is undefined");
    }
  };

  // Fallback for Avatar name if patientName is undefined or empty
  const avatarInitial = patientName && typeof patientName === 'string' && patientName.length > 0 ? patientName.charAt(0) : '?';

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}>
      <div className="w-full h-[95%] bg-white rounded-t-sm shadow-xl flex flex-col">
        {/* Header */}
        <div className="w-full flex items-center px-6 py-4 border-b border-[#D9D9E0] gap-2">
          <Avatar name={avatarInitial} size="42" round={true} textSizeRatio={2} />
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2 w-[398px]">
              <div className="name text-[#1C2024] font-semibold text-base">{patientName || 'Unknown Patient'}</div>
              <div className="text-[#60646C] text-xs font-normal">{uhid || 'Unknown UHID'}</div>
            </div>
            <div className="flex flex-row gap-2">
              <Button type={"secondary-button"} size={"button-small"} onClick={() => console.log("Edit Patient clicked")}>
                Edit Patient
              </Button>
              <Button
                iconSrc={X}
                size="button-icon-small"
                type="secondary-button"
                variant="icon"
                onClick={handleClose}
              ></Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div onScroll={handleScroll} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6 no-scrollbar">


          <div className="max-h-[600px] overflow-auto no-scrollbar flex flex-col gap-6 py-4" onScroll={handleScroll}>
            {/* General */}
            <div
              ref={generalRef}
              className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-[calc((100vw-960px)/2)]"} generalInfo flex flex-col gap-4`}
            >
              <div className="text-[#1C2024] font-semibold text-lg">General Information</div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Patient Name</div>
                  <div className="text-[#1C2024] text-sm font-medium">{patientName || 'N/A'}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">UHID</div>
                  <div className="text-[#1C2024] text-sm font-medium">{uhid}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Patient Category</div>
                  <div className="text-[#1C2024] text-sm font-medium">{patientCategory}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Visit ID</div>
                  <div className="text-[#1C2024] text-sm font-medium">{visitId}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Visit Date/Time</div>
                  <div className="text-[#1C2024] text-sm font-medium">{visitDateTime}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Registration Date</div>
                  <div className="text-[#1C2024] text-sm font-medium">{registrationDate}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Aadhaar No</div>
                  <div className="text-[#1C2024] text-sm font-medium">{aadhaarNo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer w-full px-6 py-3 flex flex-row justify-end border-t border-[#D9D9E0] relative">
          {showGradient && (
            <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
          )}
          <Button type={"secondary-button"} size={"button-small"} onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientRequisitionDetailsCard;