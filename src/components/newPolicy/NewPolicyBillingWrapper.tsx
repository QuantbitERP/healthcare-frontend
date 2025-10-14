"use client";
import React from "react";
import Header from "./NewPolicyHeader";
import Body from "./NewPolicyBillingPanel";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";

const Wrapper = ({ policyData }: { policyData?: any }) => {
  return (
    <CancelProvider>
      <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm flex flex-col overflow-hidden items-center fixed">
        <Header policyData={policyData} />
        <Body policyData={policyData} />
      </div>
    </CancelProvider>
  );
};

export default Wrapper;
