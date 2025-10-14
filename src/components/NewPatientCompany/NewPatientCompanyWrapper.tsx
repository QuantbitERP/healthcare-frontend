"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPatientCompanyById } from "@/store/patientCompany/thunks";
import Header from "./NewPatientCompanyHeader";
import Body from "./NewPatientCompanyPanel";
import Footer from "./NewPatientCompanyMasterFooter";
import { CancelProvider } from "@/components/IndividualPatientBillingDetailPage/context/Context";
import { PatientDetails } from "@/store/slices/patientBillDetailsSlice";
import { SaveProvider } from "@/components/IndividualPatientBillingDetailPage/context/saveContext";
import Loader from "@/components/loader";
import Alerts from "@/components/alerts/Alerts";
import { t } from "@/utils/languages";
import { extractApiErrorMessage } from "@/utils/errorHandler";

interface HtmlProps {
  receiptId: string;
}

type AlertType = "create" | "update" | "delete"; // extend as needed
type AlertColor = "success" | "error" | "warning" | "info";

interface AlertState {
  open: boolean;
  type: AlertType;
  color: AlertColor;
  message?: string;
}

const Html: React.FC<HtmlProps> = ({ receiptId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [recordRefundClicked, setRecordRefundClicked] =
    useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(
    null
  );
  const [alerts, setAlerts] = useState<AlertState>({
    open: false,
    type: "create",
    color: "success",
  });

  const { fetchLoading, fetchError } = useSelector(
    (state: RootState) => state.patientCompanySave
  );
  const isEdit = receiptId && receiptId !== "";

  useEffect(() => {
    if (isEdit && receiptId) {
      dispatch(
        fetchPatientCompanyById({
          id: receiptId,
          version: "1",
          tenant: "",
        })
      );
    }
  }, [dispatch, isEdit, receiptId]);

  return (
    <CancelProvider>
      <SaveProvider>
        <div className="w-full h-screen bg-[#F9F9FB] shadow-sm overflow-hidden relative">
          <Header
            recordRefundClicked={recordRefundClicked}
            setRecordRefundClicked={setRecordRefundClicked}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            receiptId={receiptId}
          />
          {fetchLoading ? (
            <div className="flex items-center justify-center h-screen">
              <Loader loading={true} />
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <Alerts 
                  variant="danger" 
                  open={true} 
                  heading={t("common.error")}
                  content={extractApiErrorMessage(fetchError)} 
                />
              </div>
            </div>
          ) : (
            <div
              className="overflow-y-auto no-scrollbar w-full px-4 pt-18 pb-4"
              style={{ height: "calc(100vh - 64px)" }}
            >
              <div className="max-w-4xl mx-auto">
                {alerts.open && (
                  <Alerts
                    heading={
                      alerts.color === "success"
                        ? t("common.success")
                        : alerts.color === "error"
                        ? t("common.error")
                        : t("common.info")
                    }
                    className="mb-4"
                    variant={alerts.color == "success" ? "success" : "danger"}
                    content={
                      alerts.message ||
                      (alerts.type === "create"
                        ? t("success.patientCompanyCreated")
                        : alerts.type === "update"
                        ? t("success.patientCompanyUpdated")
                        : alerts.type === "delete"
                        ? t("success.patientCompanyDeleted")
                        : t("common.actionCompleted"))
                    }
                    showCloseIcon
                    onClick={() =>
                      setAlerts({
                        open: false,
                        color: alerts.color,
                        type: alerts.type,
                      })
                    }
                  />
                )}

                <Body />
              </div>
            </div>
          )}
          <Footer receiptId={receiptId} openAlert={setAlerts} />
        </div>
      </SaveProvider>
    </CancelProvider>
  );
};

export default Html;
