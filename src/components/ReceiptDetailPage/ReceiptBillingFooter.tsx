// import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Buttons from "@/components/buttons/Button";


interface FooterProps {
  active: "company" | "patient";
  setIsRecordPaymentDialogue: (val: boolean) => void;
}


function PatientBillingFooter({ active,setIsRecordPaymentDialogue }: FooterProps) {
  const router = useRouter();

  return (
    <>
      <div className="z-[20] w-full h-k4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

      <div
        id="footer"
        className="z-[20] w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4">
        </div>
          <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          <Buttons size="button-medium" type="secondary-button" variant="button" onClick={() => router.push("/payments_received")}>
          Cancel
        </Buttons>
           {active === "patient" &&  <Buttons
              size="button-medium"
              type="primary-outlined-button"
              variant="button"
              onClick={() => setIsRecordPaymentDialogue(true)}
            >
              Record Payment
            </Buttons>}
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
