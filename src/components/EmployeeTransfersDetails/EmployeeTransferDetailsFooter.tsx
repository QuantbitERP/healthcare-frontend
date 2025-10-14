import { useRouter } from "next/navigation";
import Buttons from "@/components/buttons/Button";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import SubmitBillModal from "./BillLogsModal";


function PatientBillingFooter() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsPopoverOpen(false);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };
  

  return (
    <>
      <div className="z-[20] w-full h-k4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

      <div
        id="footer"
        className="z-[20] w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Image src="/assets/icons/DotsVertical.svg" alt="Dots" width={50} height={50} className="cursor-pointer border rounded-md px-3 py-2 border-[#D9D9E0]" />
            </PopoverTrigger>
            <PopoverContent className="bg-white mx-4 border shadow-md rounded p-0 space-y-2 w-60">
              <div className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-3  py-2 rounded cursor-pointer"
              onClick={() => openModal("Transfer Log")}>
                Transfer Data Log
              </div>
              <div className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-3  py-2 rounded cursor-pointer"
              onClick={() => openModal("Employee Category Change Log")}>
                Employee Category Change Log
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {isModalOpen && (<SubmitBillModal type={modalType} onClose={closeModal} />)}
          <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          <Buttons size="button-medium" type="secondary-button" variant="button" onClick={() => router.push("/payments_received")}>
          Cancel
        </Buttons>
            <Buttons
              size="button-medium"
              type="primary-button"
              variant="button"
            >
              Save Changes
            </Buttons>
          </div>
      </div>
    </>
  );
}

export default PatientBillingFooter;
