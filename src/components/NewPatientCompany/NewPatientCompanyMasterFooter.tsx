import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Buttons from "@/components/buttons/Button";
// import { CreatePatientCompanyCommand } from "@/services/api-client/models/CreatePatientCompanyCommand";
import {
  savePatientCompany,
  updatePatientCompany,
} from "@/store/patientCompany/thunks";
import { useSave } from "../IndividualPatientBillingDetailPage/context/saveContext";
import {
  setValidationError,
  clearAllValidationErrors,
} from "@/store/patientCompany/patientCompanySlice";
import { t } from "@/utils/languages";
import { API_VERSION } from "@/utils/constants";
import { extractApiErrorMessage } from "@/utils/errorHandler";

type AlertType = "create" | "update" | "delete"; // extend as needed
type AlertColor = "success" | "error" | "warning" | "info";

interface AlertState {
  open: boolean;
  type: AlertType;
  color: AlertColor;
  message?: string;
}
interface FooterProps {
  receiptId: string;
  openAlert: React.Dispatch<React.SetStateAction<AlertState>>;
}

function PatientBillingFooter({ receiptId, openAlert }: FooterProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = receiptId && receiptId !== "";

  const {
    setSaveSuccess,
    setIsSaving,
    isSaving,
    isSavingDraft,
    setIsSavingDraft,
  } = useSave();

  const formData = useSelector(
    (state: RootState) => state.patientCompanySave.data
  );

  const validateForm = (): boolean => {
    dispatch(clearAllValidationErrors());
    const errors: Record<string, string> = {};
    let isValid = true;

    // Required field validations
    if (!formData.hospitalIds || formData.hospitalIds.length === 0) {
      errors.hospitalIds = t("error.requiredField", { field: "Hospital" });
      isValid = false;
    }

    if (!formData.name || formData.name.trim() === "") {
      errors.name = t("error.requiredField", { field: "Name" });
      isValid = false;
    }

    if (
      !formData.schemeCompanyTypeId ||
      formData.schemeCompanyTypeId.trim() === ""
    ) {
      errors.schemeCompanyTypeId = t("error.requiredField", {
        field: "Patient Category",
      });
      isValid = false;
    }

    if (
      !formData.scheduleOfChargesTypeId ||
      formData.scheduleOfChargesTypeId.trim() === ""
    ) {
      errors.scheduleOfChargesTypeId = t("error.requiredField", {
        field: "Rate Name",
      });
      isValid = false;
    }

    // Mobile number validation (if present)
    if (formData.mobileNo && formData.mobileNo.trim() !== "") {
      const mobileNo = formData.mobileNo.trim();
      // Check if mobile number is exactly 10 digits
      if (!/^\d{10}$/.test(mobileNo)) {
        errors.mobileNo = t("error.invalidMobile");
        isValid = false;
      }
    }

    // Email validation (if present)
    if (formData.emailAddress && formData.emailAddress.trim() !== "") {
      const email = formData.emailAddress.trim();
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.emailAddress = t("error.invalidEmail");
        isValid = false;
      }
    }

    // Website validation (if present)
    if (formData.website && formData.website.trim() !== "") {
      const website = formData.website.trim();
      // Basic URL validation regex
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        errors.website = t("error.invalidUrl");
        isValid = false;
      }
    }

    // Pincode validation (if present)
    if (formData.pincode && formData.pincode.trim() !== "") {
      const pincode = formData.pincode.trim();
      // Check if pincode is exactly 6 digits
      if (!/^\d{6}$/.test(pincode)) {
        errors.pincode = t("error.invalidPincode");
        isValid = false;
      }
    }

    // Person's Mobile No. validation (if present)
    if (formData.emergencyContactNo && formData.emergencyContactNo.trim() !== "") {
      const emergencyContactNo = formData.emergencyContactNo.trim();
      // Check if mobile number is exactly 10 digits
      if (!/^\d{10}$/.test(emergencyContactNo)) {
        errors.emergencyContactNo = t("error.invalidMobile");
        isValid = false;
      }
    }

    // Date range validation (if both dates are present)
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      
      if (toDate <= fromDate) {
        errors.toDate = t("error.toDateMustBeAfterFromDate");
        isValid = false;
      }
    }

    // Set validation errors in Redux
    Object.entries(errors).forEach(([field, error]) => {
      dispatch(setValidationError({ field, error }));
    });

    return isValid;
  };

  const handleSaveAddNew = async () => {
    if (!validateForm()) {
      return;
    }
    const _formData = { ...formData } as any;
    _formData["visitType"] = ["0"];
    _formData["emergencyPackageApplicableDate"] =
      _formData.emergencyPackageApplicableDate
        ? new Date(_formData.emergencyPackageApplicableDate).toISOString()
        : new Date().toISOString();
    try {
      setIsSavingDraft(true);
      const resultAction = await dispatch(
        savePatientCompany({
          version: API_VERSION,
          data: {
            model: _formData as any,
          },
        })
      );

      if (savePatientCompany.fulfilled.match(resultAction)) {
        setSaveSuccess(true);
        openAlert({
          open: true,
          type: "create",
          color: "success",
        });
        console.log("Saved successfully:", resultAction.payload);
      } else {
        const errorMessage = extractApiErrorMessage(resultAction.payload);
        openAlert({
          open: true,
          type: "create",
          color: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      openAlert({
        open: true,
        type: "create",
        color: "error",
        message: errorMessage,
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const _formData = { ...formData } as any;
    _formData["visitType"] = ["0"];
    _formData["emergencyPackageApplicableDate"] =
      _formData.emergencyPackageApplicableDate
        ? new Date(_formData.emergencyPackageApplicableDate).toISOString()
        : new Date().toISOString();

    try {
      setIsSaving(true);
      if (isEdit) {
        _formData["countryId"] = _formData["countryId"] || null;
        _formData["stateId"] = _formData["stateId"] || null;
        _formData["cityId"] = _formData["cityId"] || null;
        _formData["areaId"] = _formData["areaId"] || null;
        _formData["discountCategory"] = _formData["discountCategory"] || null;

        const resultAction = await dispatch(
          updatePatientCompany({
            version: API_VERSION,
            data: {
              model: _formData,
            },
          })
        );
        if (updatePatientCompany.fulfilled.match(resultAction)) {
          setSaveSuccess(true);
          openAlert({
            open: true,
            type: "update",
            color: "success",
          });
          console.log("Saved successfully:", resultAction.payload);
        } else {
          const errorMessage = extractApiErrorMessage(resultAction.payload);
          openAlert({
            open: true,
            type: "create",
            color: "error",
            message: errorMessage,
          });
        }
      } else {
        const resultAction = await dispatch(
          savePatientCompany({
            version: API_VERSION,
            data: {
              model: _formData,
            },
          })
        );
        if (savePatientCompany.fulfilled.match(resultAction)) {
          setSaveSuccess(true);
          openAlert({
            open: true,
            type: "create",
            color: "success",
          });
          console.log("Saved successfully:", resultAction.payload);
        } else {
          const errorMessage = extractApiErrorMessage(resultAction.payload);
          openAlert({
            open: true,
            type: "create",
            color: "error",
            message: errorMessage,
          });
        }
      }
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      openAlert({
        open: true,
        type: "create",
        color: "error",
        message: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="z-[20] w-full h-k4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

      <div
        id="footer"
        className="z-[20] w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
      >
        <div className="w-fit h-fit flex items-center gap-4"></div>
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          <Buttons
            size="button-medium"
            type="secondary-button"
            variant="button"
            onClick={() => router.push("/patient_company")}
          >
            Cancel
          </Buttons>
          {/* Save & Add New button - only show for create mode */}
          {!isEdit && (
            <Buttons
              size="button-medium"
              type="primary-outlined-button"
              variant="button"
              onClick={handleSaveAddNew}
            >
              {isSavingDraft ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="h-5 w-5 border-2 border-[#0588F0] border-t-transparent rounded-full animate-spin"></div>
                  {t("common.saving")}
                </div>
              ) : (
                t("common.saveAndAddNew")
              )}
            </Buttons>
          )}
          <Buttons
            size="button-medium"
            type="primary-button"
            variant="button"
            onClick={handleSubmit}
          >
            {isSaving ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("common.saving")}
              </div>
            ) : (
              t("buttons.saveChanges")
            )}
          </Buttons>
        </div>
      </div>
    </>
  );
}

export default PatientBillingFooter;
