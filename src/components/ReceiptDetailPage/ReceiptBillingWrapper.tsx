"use client"
import React, { useState } from "react";
import Header from "./ReceiptBillingHeader";
import Body from "./ReceiptBillingPanel";
import Footer from "./ReceiptBillingFooter";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";
import {PatientDetails} from "@/store/slices/patientBillDetailsSlice";

interface HtmlProps {
  receiptId: string;
}

const Html: React.FC<HtmlProps> = ({ receiptId }) => {
  const [recordRefundClicked, setRecordRefundClicked] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null); 
  const [active, setActive] = useState<"company" | "patient">("company");
  const [isRecordPaymentDialogOpen, setIsRecordPaymentDialogOpen] = useState(false);

  return (
    <CancelProvider>
        <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm overflow-hidden flex flex-col items-center fixed">
          <Header 
            recordRefundClicked={recordRefundClicked} 
            setRecordRefundClicked={setRecordRefundClicked} 
            selectedPatient={selectedPatient} 
            setSelectedPatient={setSelectedPatient}
            receiptId={receiptId}
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
