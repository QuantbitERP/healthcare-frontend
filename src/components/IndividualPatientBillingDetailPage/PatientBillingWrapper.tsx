import React, { useState } from "react";
import Header from "./PatientBillingHeader";
import Body from "./PatientBillingPanel";
import Footer from "./PatientBillingFooter";
import { CancelProvider } from "./context/Context";
import { SaveProvider } from "./context/saveContext";
import { PatientSearchProvider } from "@/components/newBill/context/Context";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { GetDraftBillByIdResponseDTO } from "@/api-client/models/GetDraftBillByIdResponseDTO";

interface HtmlProps {
  billId: string;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | undefined; 
  loading: boolean;
  billStatus: string;
  onBillChange?: (newBill: GetBillDetailsDTO) => void;
}

const Html: React.FC<HtmlProps> = ({ billId,billData, loading,billStatus, onBillChange }) => {
  const [recordRefundClicked, setRecordRefundClicked] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<GetBillDetailsDTO | null>(null); 
  const [refundFooterButtons, setRefundFooterButtons] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [showNoBillAlert, setShowNoBillAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  return (
    <CancelProvider>
      <SaveProvider>
      <PatientSearchProvider>
        <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm flex flex-col overflow-hidden items-center fixed">
          <Header 
            recordRefundClicked={recordRefundClicked} 
            setRecordRefundClicked={setRecordRefundClicked} 
            selectedPatient={selectedPatient} 
            setSelectedPatient={setSelectedPatient}
            billId={billId}
            onBillChange={onBillChange}
            setShowNoBillAlert={setShowNoBillAlert}
            setShowErrorAlert={setShowErrorAlert}
          />
          <Body 
            recordRefundClicked={recordRefundClicked} 
            setRecordRefundClicked={setRecordRefundClicked} 
            selectedPatient={selectedPatient} 
            setSelectedPatient={setSelectedPatient} 
            refundFooterButtons={refundFooterButtons} 
            setRefundFooterButtons={setRefundFooterButtons}
            billId={billId}
            billData={billData}
            loading={loading}
            billStatus={billStatus}
            setIsAllSelected={setIsAllSelected}
            showNoBillAlert={showNoBillAlert}
            showErrorAlert={showErrorAlert}
            setShowNoBillAlert={setShowNoBillAlert}
            setShowErrorAlert={setShowErrorAlert}
          />
          <Footer 
            recordRefundClicked={recordRefundClicked} 
            setRecordRefundClicked={setRecordRefundClicked} 
            refundFooterButtons={refundFooterButtons} 
            setRefundFooterButtons={setRefundFooterButtons}
            isAllSelected={isAllSelected}
            billId={billId}
            billData={billData}
            billStatus={billStatus}
          />
        </div>
      </PatientSearchProvider>
      </SaveProvider>
    </CancelProvider>
  );
};

export default Html;
