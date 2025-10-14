"use client"
import React from "react";
import Header from "./EmployeeTransferDetailsHeader";
import Body from "./EmployeeTransferDetailsPanel";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";

interface HtmlProps {
  employeeData: any;
}

const Html: React.FC<HtmlProps> = ({ employeeData }) => {
  return (
    <CancelProvider>
        <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm overflow-hidden flex flex-col items-center fixed">
          <Header  
            employeeData={employeeData}
          />
          
          <Body 
            employeeData={employeeData}
          />
          {/* <Footer /> */}
        </div>
    </CancelProvider>
  );
};

export default Html;
