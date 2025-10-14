
import React, { useRef, useState } from "react";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import X from "@/assets/icons/x.svg";
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";

interface PosInfoCardDetailsProps {
  onClose?: () => void;
  name: string;
  age: string;
  sex: string;
  phone: string;
  ABHAID: string;
  category: string;
  doctor: string;
  uhid?: string;
  bedno?: string;
  visitNo?: string;
  date?: string;
  time?: string;
  fullName?: string;
  requisitionNo?: string;
  debitNo?: string;
  billNo?: string;
  posProfile?: string;
  postingDate?: string;
  warehouse?: string;
  priceList?: string;
  currency?: string;
  isSelfPaying?: boolean;
  isPos?: boolean;
  updateStock?: boolean;
  isReturn?: boolean;
  company?: string;
  registrationDate?: string;
  address?: string;
  lastVisitDate?: string;
  lastVisitTime?: string;
  visitRemark?: string;
  billingClass?: string;
  showInsuranceDetails?: boolean;
  policyNumber?: string;
  preAuthNo?: string;
  approvedAmount?: string;
  approvedDate?: string;
  approvedBy?: string;
  size?: "small" | "medium" | "large";
  onReturnStatusChange: (status: boolean) => void;
}

const PosInfoCardDetails: React.FC<PosInfoCardDetailsProps> = ({
  onClose,
  name,
  age,
  sex,
  phone,
  ABHAID,
  category,
  doctor,
  uhid,
  bedno,
  visitNo,
  fullName,
  requisitionNo,
  debitNo,
  billNo,
  posProfile,
  postingDate,
  priceList,
  currency,
  isSelfPaying = false,
  isPos = true,
  updateStock = true,
  isReturn = false,
  registrationDate,
  address,
  lastVisitDate,
  lastVisitTime,
  billingClass,
  showInsuranceDetails = false,
  policyNumber,
  preAuthNo,
  approvedAmount,
  approvedDate,
  approvedBy,
  size = "large",
  onReturnStatusChange,
}) => {
  const [activeToggle, setActiveToggle] = useState<string>("General Information");
  const [selfPaying, setSelfPaying] = useState<boolean>(isSelfPaying);
  const [pos, setPos] = useState<boolean>(isPos);
  const [stockUpdate, setStockUpdate] = useState<boolean>(updateStock);
  const [returnStatus, setReturnStatus] = useState<boolean>(isReturn);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const generalRef = useRef<HTMLDivElement>(null);
  const lastVisitRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState<boolean>(true);

  // const { fetchWarehouses, fetchCustomer, fetchCompany, fetchBranch, fetchDepatment, fetchSubDepatment } = useFrappeApi();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleToggleClick = (section: string) => {
    setActiveToggle(section);
    if (section === "General Information") {
      generalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "Last Visit Information") {
      lastVisitRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "Insurance Details") {
      insuranceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClose = () => {
    console.log("onClose triggered");
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => onClose(), 300); // Adjust for animation duration if needed
    } else {
      console.warn("onClose is undefined");
    }
  };


  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}>
      <div className="w-full h-[95%] bg-white rounded-t-sm shadow-xl flex flex-col">
        {/* Header */}
        <div className="w-full flex items-center px-6 py-4 border-b border-[#D9D9E0] gap-2">
          <Avatar name={name.charAt(0)} size="42" round={true} textSizeRatio={2} />
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2 w-[398px]">
              <div className="name text-[#1C2024] font-semibold text-base">{name}</div>
              <div className="text-[#60646C] text-xs font-normal">{uhid || ABHAID}</div>
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
          {showInsuranceDetails && (
            <div className="flex flex-row items-center justify-center gap-4 pt-4">
              {["General Information", "Last Visit Information", "Insurance Details"].map((label) => (
                <Toggle key={label} pressed={activeToggle === label} onClick={() => handleToggleClick(label)}>
                  {label}
                </Toggle>
              ))}
            </div>
          )}

          <div className="max-h-[600px] overflow-auto no-scrollbar flex flex-col gap-6 py-4" onScroll={handleScroll}>
            {/* General */}
            <div
              ref={generalRef}
              className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-[calc((100vw-960px)/2)]"} generalInfo flex flex-col gap-4`}
            >
              <div className="text-[#1C2024] font-semibold text-lg">General Information</div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Name</div>
                  <div className="text-[#1C2024] text-sm font-medium">{fullName || name}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">UHID/ABHA ID</div>
                  <div className="text-[#1C2024] text-sm font-medium">{uhid || ABHAID}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Bed No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{bedno || "N/A"}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Visit No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{visitNo || "N/A"}</div>
                </div>
              </div>

              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Contact No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{phone}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Age/Sex</div>
                  <div className="text-[#1C2024] text-sm font-medium">{age}/{sex}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">ABHA ID</div>
                  <div className="text-[#1C2024] text-sm font-medium">{ABHAID}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Registration Date</div>
                  <div className="text-[#1C2024] text-sm font-medium">{registrationDate || "N/A"}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">POS Profile</div>
                  <div className="text-[#1C2024] text-sm font-medium">{posProfile || "N/A"}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Currency</div>
                  <div className="text-[#1C2024] text-sm font-medium">{currency || "N/A"}</div>
                </div>
              </div>
              <div className="flex flex-row w-[592px]">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Address</div>
                  <div className="text-[#1C2024] text-sm font-medium">{address || "N/A"}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Category</div>
                  <div className="text-[#1C2024] text-sm font-medium">{category}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Doctor</div>
                  <div className="text-[#1C2024] text-sm font-medium">{doctor}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Self Paying</div>
                  <Checkbox checked={selfPaying} onCheckedChange={(checked) => setSelfPaying(!!checked)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Is POS</div>
                  <Checkbox checked={pos} onCheckedChange={(checked) => setPos(!!checked)} />
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Update Stock</div>
                  <Checkbox checked={stockUpdate} onCheckedChange={(checked) => setStockUpdate(!!checked)} />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Is Return</div>
                  <Checkbox checked={returnStatus} onCheckedChange={(checked) => {
                    setReturnStatus(!!checked);
                    onReturnStatusChange(!!checked);
                  }} />
                </div>
              </div>
            </div>

            {/* Last Visit / Requisition Info */}
            <div
              ref={lastVisitRef}
              className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-[calc((100vw-960px)/2)]"} lastInfo flex flex-col gap-4`}
            >
              <div className="text-[#1C2024] font-semibold text-lg">Requisition Information</div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Requisition No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{requisitionNo || "N/A"}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Debit No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{debitNo || "N/A"}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Bill No.</div>
                  <div className="text-[#1C2024] text-sm font-medium">{billNo || "N/A"}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Posting Date</div>
                  <div className="text-[#1C2024] text-sm font-medium">{postingDate || "N/A"}</div>
                </div>



                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Price List</div>
                  <div className="text-[#1C2024] text-sm font-medium">{priceList || "N/A"}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Requisition Date/Time</div>
                  <div className="text-[#1C2024] text-sm font-medium">{lastVisitDate && lastVisitTime ? `${lastVisitDate} ${lastVisitTime}` : "N/A"}</div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Consulting Doctor</div>
                  <div className="text-[#1C2024] text-sm font-medium">{doctor}</div>
                </div>
              </div>
              <div className="flex flex-row gap-6">

                <div className="flex flex-col gap-2 w-full">
                  <div className="text-[#60646C] text-sm font-normal">Billing Class</div>
                  <div className="text-[#1C2024] text-sm font-medium">{billingClass || "N/A"}</div>
                </div>
              </div>
            </div>

            {showInsuranceDetails && (
              <div
                ref={insuranceRef}
                className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-[calc((100vw-960px)/2)]"} insuranceInfo flex flex-col gap-4`}
              >
                <div className="text-[#1C2024] font-semibold text-lg">Insurance Details</div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">Insurance Policy No.</div>
                    <div className="text-[#1C2024] text-sm font-medium">{policyNumber || "N/A"}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">Pre Auth No./Code No./Claim Id</div>
                    <div className="text-[#1C2024] text-sm font-medium">{preAuthNo || "N/A"}</div>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">Prior Auth/Approved Amount</div>
                    <div className="text-[#1C2024] text-sm font-medium">{approvedAmount || "N/A"}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">Approved Date</div>
                    <div className="text-[#1C2024] text-sm font-medium">{approvedDate || "N/A"}</div>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="text-[#60646C] text-sm font-normal">Approved By</div>
                    <div className="text-[#1C2024] text-sm font-medium">{approvedBy || "N/A"}</div>
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
            <Button type={"secondary-button"} size={"button-small"} onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
        {showInsuranceDetails && (
          <div className="footer w-full px-6 py-3 flex flex-row gap-4 justify-end border-t border-[#D9D9E0] relative">
            {showGradient && (
              <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
            )}
            <Button type={"secondary-button"} size={"button-small"} onClick={handleClose}>
              Cancel
            </Button>
            <Button type={"primary-button"} size={"button-small"} onClick={handleClose}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosInfoCardDetails;