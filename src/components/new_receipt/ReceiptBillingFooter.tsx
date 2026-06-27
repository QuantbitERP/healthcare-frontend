// import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Buttons from "@/components/buttons/Button";

interface FooterProps {
  active: "company" | "patient";
  setIsRecordPaymentDialogue: (val: boolean) => void;
}

function PatientBillingFooter({
  active,
  setIsRecordPaymentDialogue,
}: FooterProps) {

  const router = useRouter();
  return (
    <div
      id="footer"
      className="z-[20] bg-white w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 "
    >
      <div className="w-fit h-fit flex items-center gap-4">
        {/* Kebab Menu Button */}
        <Buttons
          variant="icon"
          size="button-small"
          type="secondary-button"
          iconSrc="assets/icons/DotsVertical.svg"
          alt="More options"

        />
      </div>
      <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
        <Buttons size="button-medium" type="secondary-button" variant="button" onClick={() => router.push("/payments_received")}>
          Cancel
        </Buttons>
        {active === "patient" && (
          <Buttons
            size="button-medium"
            type="primary-outlined-button"
            variant="button"
            onClick={() => setIsRecordPaymentDialogue(true)}
          >
            Record Payment
          </Buttons>
        )}
        <Buttons size="button-medium" type="primary-button" variant="button">
          Save Changes
        </Buttons>
      </div>
    </div>
  );
}

export default PatientBillingFooter;
