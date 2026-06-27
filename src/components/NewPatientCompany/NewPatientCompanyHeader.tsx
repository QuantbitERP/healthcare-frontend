import React from "react";
import { PatientDetails } from "@/store/slices/patientBillDetailsSlice";
import PageHeader from "@/components/PageHeader";
import { t } from "@/utils/languages";

interface HeaderProps {
  recordRefundClicked: boolean;
  setRecordRefundClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatient: PatientDetails | null;
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientDetails | null>>;
  receiptId: string | number;
}

const Header: React.FC<HeaderProps> = ({
  receiptId,
}) => {
  const isEdit = receiptId && receiptId !== "";

  return (
    <PageHeader
      title={isEdit ? t("common.editPatientCompany") : t("common.newPatientCompany")}
      icon="assets/icons/user-heart.svg"
      parentTitle={t("common.patientCompany")}
      parentLink="/patient_company"
    />
  );
};

export default Header;
