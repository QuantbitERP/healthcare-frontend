import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Buttons from "@/components/buttons/Button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// import { fetchConcessions } from "@/store/payments_received/slice";
import { fetchAllOpdFilters } from "@/store/opd_bills/thunks";
import SetLimitsEditableTable from "./SetLimitsEditableTable";

import { DistributeDataTable } from "./DistributeAmountTable";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Image from "next/image";
import SubmitBillModal from "./BillLogsModal";
import { useRouter } from "next/navigation";
import { updateTransferLimit } from "@/store/employee_transfers/thunks";
import { API_VERSION } from "@/utils/constants";
import Alerts from "../alerts/Alerts";
import { extractApiErrorMessage } from "@/utils/errorHandler";
import { t } from "@/utils/languages";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface BodyProps {
  employeeData: any;
}

const ReceiptDetailPanel: React.FC<BodyProps> = ({ employeeData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [changeEmployeeBalance, setChangeEmployeeBalance] = useState(true);

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);

  // Alert state management
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);

  const [formState, setFormState] = useState<any[]>([]);

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsPopoverOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  useEffect(() => {
    dispatch(fetchAllOpdFilters({ version: "1", tenant: "" }));
  }, [dispatch]);

  const onSave = async () => {
    if (formState && formState.length > 0) {
      setLoading(true);
      
      try {
        await dispatch(
          updateTransferLimit({
            version: API_VERSION,
            request: {
              model: {
                employeeId: employeeData.id,
                opdLimit: formState.find((e) => e.id == "opd").amount,
                ipdLimit: formState.find((e) => e.id == "ipd").amount,
                allLimit: formState.find((e) => e.id == "total").amount,
              },
            },
          })
        ).unwrap();
        
        // Success case
        setAlertMessage(t("success.employeeTransferUpdated"));
        setAlertType("success");
        setShowAlert(true);
        
        // Redirect to listing page with success message
        setTimeout(() => {
          router.push("/employee_transfers?success=updated");
        }, 0);
        
      } catch (error: any) {
        // Extract actual error message from API response using utility function
        const errorMessage = extractApiErrorMessage(error);
        
        setAlertMessage(errorMessage);
        setAlertType("danger");
        setShowAlert(true);
        // Don't redirect on error - stay on same page to show error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className="overflow-y-auto no-scrollbar"
        style={{ height: "calc(100vh - 110px)" }}
      >
        <div className="space-y-4 flex flex-col max-w-5xl mx-auto pb-10 pt-4">
          {showAlert && (
            <Alerts
              heading={alertType === "success" ? t("common.success") + "!" : t("common.error") + "!"}
              variant={alertType}
              content={alertMessage}
              showCloseIcon
              disappear
              className="mb-5"
              onClick={() => setShowAlert(false)}
            />
          )}
          <div className="w-full max-w-3xl p-6 bg-white shadow-xs border border-[#D9D9E0] rounded-xl space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t("success.employeeDetails")}</h2>
              <p className="text-sm text-gray-500">
                {t("success.employeeDetailsDescription")}
              </p>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-2">
                  <Label className="text-[#60646C] text-sm">
                    {t("success.employeeName")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-white font-normal text-xs">
                        {employeeData?.employeeName?.charAt(0)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[#1C2024] font-medium text-sm">
                      {employeeData?.employeeName}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-[#60646C] text-sm">
                    {t("success.employeeCode")}
                  </Label>
                  <span className="text-[#1C2024] font-medium text-sm">
                    {employeeData?.employeeCode}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-[#60646C] text-sm">
                    {t("success.employeeCategory")}
                  </Label>
                  <span className="text-[#1C2024] font-medium text-sm">
                    {employeeData?.employeeCategoryName}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-[#60646C] text-sm">
                    {t("success.employeeDesignation")}
                  </Label>
                  <span className="text-[#1C2024] font-medium text-sm">
                    {employeeData?.employeeDesignation}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-[#60646C] text-sm">
                    {t("success.dateAndTimeOfTransfer")}
                  </Label>
                  <span className="text-[#1C2024] font-medium text-sm">
                    {employeeData?.transferDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-3xl p-6 bg-white shadow-xs border border-[#D9D9E0] rounded-xl space-y-4">
            <DistributeDataTable employeeData={employeeData} />
          </div>
          <div className="w-full max-w-3xl p-6 bg-white shadow-xs border border-[#D9D9E0] rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-md font-semibold">
                {t("success.changeEmployeeBalance")}
              </Label>
              <Switch
                checked={changeEmployeeBalance}
                onCheckedChange={setChangeEmployeeBalance}
              />
            </div>
            <div className="min-h-[100px]">
              {changeEmployeeBalance && (
                <SetLimitsEditableTable
                  tdata={{
                    ipd: employeeData?.ipdLimit,
                    opd: employeeData?.opdLimit,
                    total: employeeData?.totalLimit,
                  }}
                  onDataChange={(cData) => {
                    setFormState(cData);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="z-[20] w-full h-k4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

      <div
        id="footer"
        className="z-[20] w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Image
                src="/assets/icons/DotsVertical.svg"
                alt="Dots"
                width={50}
                height={50}
                className="cursor-pointer border rounded-md px-3 py-2 border-[#D9D9E0]"
              />
            </PopoverTrigger>
            <PopoverContent className="bg-white mx-4 border shadow-md rounded p-0 space-y-2 w-60">
              <div
                className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-3  py-2 rounded cursor-pointer"
                onClick={() => openModal("Transfer Log")}
              >
                {t("success.transferDataLog")}
              </div>
              <div
                className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-3  py-2 rounded cursor-pointer"
                onClick={() => openModal("Employee Category Change Log")}
              >
                {t("success.employeeCategoryChangeLog")}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {isModalOpen && (
          <SubmitBillModal type={modalType} onClose={closeModal} />
        )}
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={() => router.push("/employee_transfers")}
          >
            Cancel
          </Buttons>
          <Buttons
            size="button-medium"
            type="primary-button"
            variant="button"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Buttons>
        </div>
      </div>
    </>
  );
};
export default ReceiptDetailPanel;
