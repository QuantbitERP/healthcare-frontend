import React, { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";
import { SaveProvider} from "@/components/IndividualPatientBillingDetailPage/context/saveContext"
import { PatientSearchProvider } from "@/components/newBill/context/Context";

const Html: React.FC = () => {
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  return (
    <CancelProvider>
      <SaveProvider>
      <PatientSearchProvider>
        <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm flex flex-col overflow-hidden items-center fixed">
          <Header />
          <Body isAllSelected={isAllSelected} setIsAllSelected={setIsAllSelected}/>
        </div>
      </PatientSearchProvider>
      </SaveProvider>
    </CancelProvider>
  );
};

export default Html;
