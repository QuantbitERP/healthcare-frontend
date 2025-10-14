import React, { useState } from "react";
import Header from "@/components/ipdDetails/Header";
import Footer from "@/components/ipdDetails/Footer";
import Body from "@/components/ipdDetails/Body";

function Html({ billId }) {
  const [recordRefundClicked, _setRecordRefundClicked] = useState(false);
  const [selectedPatient, _setSelectedPatient] = useState(null);
  return (
    <div className="w-full h-screen gap-4 border-l border-[#D9D9E0] bg-[#F9F9FB] shadow-sm flex flex-col overflow-hidden items-center fixed">
      <Header
        selectedPatient={selectedPatient}
        recordRefundClicked={recordRefundClicked}
        billId={billId}
      />
      <Body
        selectedPatient={selectedPatient}
        billId={billId}
      />
      <Footer />
    </div>
  );
}

export default Html;
