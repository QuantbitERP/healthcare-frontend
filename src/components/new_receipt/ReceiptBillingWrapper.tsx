"use client"
import React, { useState } from "react";
import Header from "./ReceiptBillingHeader";
import Body from "./ReceiptBillingPanel";
import Footer from "./ReceiptBillingFooter";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";


interface HtmlProps {
  receiptId: string;
}

const Html: React.FC<HtmlProps> = ({ receiptId }) => {
  const [active, setActive] = useState<"company" | "patient">("company");
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] = useState(false);

  return (
    <CancelProvider>
       <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm flex flex-col overflow-hidden items-center fixed">
          <Header 
          />
           <div className="overflow-y-auto no-scrollbar" style={{ height: 'calc(100vh - 110px)'}}>
          <Body 
            receiptId={receiptId}
            active={active} setActive={setActive}
            isRecordPaymentDialogOpen={isRecordPaymentDialogOpen}
            setIsRecordPaymentDialogOpen={setIsRecordPaymentDialogOpen}

          />
          </div>
          <Footer 
           setIsRecordPaymentDialogue={setIsRecordPaymentDialogOpen}
           active={active}
          />
        </div>
    </CancelProvider>
  );
};

export default Html;
