import React, { useRef, useState } from "react";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import InfoRowItem from "../submitBillModal/InfoRowItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";
import { formatVisitDateTime } from "@/utils/formatVisitDateTime";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { useGlobalTables } from "@/context/GlobalTablesContext";

interface PatientDetailsCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  patient: GetBillDetailsDTO | null;
  showInsuranceDetails?: boolean;
  size?: "small" | "medium" | "large";
  columns: ColumnDef<GetBillServices>[];
  initialData: GetBillServices[] | null | undefined;
  table: Table<GetBillServices>;
  dataProps: {
    data: (GetBillServices & { id: string | number })[];
    setData: React.Dispatch<
      React.SetStateAction<(GetBillServices & { id: string | number })[]>
    >;
  };
}

const PatientDetailsCard: React.FC<PatientDetailsCardProps> = ({
  setOpen,
  patient,
  showInsuranceDetails = true,
  size = "medium",
  columns,
  initialData,
  table,
  dataProps: { data, setData },
}) => {
  const { filtersValues, setFiltersValues } = useGlobalTables();
  const { patientCategories, schemeCompanies } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );
  const [activeToggle, setActiveToggle] = useState<string>(
    "General Information"
  );
  const generalRef = useRef<HTMLDivElement | null>(null);
  const lastVisitRef = useRef<HTMLDivElement | null>(null);
  const insuranceRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCompanyDropdown, setShowCompanyDropdown] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; value: string } | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; value: string } | null>(null);


  const [isClosing, setIsClosing] = useState(false);

  const formattedVisit = formatVisitDateTime(
    patient?.visitDate ?? "",
    patient?.visitTime ?? ""
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false); // Parent unmounts this component
    }, 300); // Match animation duration
  };
  const handleSave = () => {
    setFiltersValues((prev) => ({
      ...prev,
      company: {
        id: selectedCompany?.id ?? prev.company.id,
        value: selectedCompany?.value ?? prev.company.value,
      },
      category: {
        id: selectedCategory?.id ?? prev.category.id,
        value: selectedCategory?.value ?? prev.category.value,
      },
    }));

    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };
  const ipd_bills = false;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleToggleClick = (section: string) => {
    setActiveToggle(section);
    let ref;
    if (section === "General Information") ref = generalRef;
    if (section === "Last Visit Information") ref = lastVisitRef;
    if (section === "Insurance Details") ref = insuranceRef;
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // const handleEditPatient = () => {
  //   // Remove spaces from UHID for the URL
  //   const formattedUHID = patient?.uhid.replace(/\s+/g, "");
  //   router.push(`/initiate_cancel/${formattedUHID}`);
  // };

  return (
    <>
      {ipd_bills && (
        <div
          className={`${size === "small"
            ? "w-[640px] pt-6"
            : size === "medium"
              ? "w-[960px] pt-6"
              : "w-screen pt-4"
            } flex flex-col bg-[#FFF] rounded-lg border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),_0px_10px_10px_0px_rgba(0,0,0,0.04)]`}
        >
          <div
            className={`${size === "large" ? "pb-4 border-b border-[#D9D9E0]" : ""
              } name flex flex-row px-6 gap-2 w-full`}
          >
            <Avatar
              name={patient?.patientName?.charAt(0)}
              size="48"
              round={true}
              textSizeRatio={2}
            />
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-col gap-2 w-[398px]">
                <div className="name text-[#1C2024] font-semibold text-base">
                  {patient?.patientName}
                </div>
                <div className="text-[#60646C] text-xs font-normal">
                  {patient?.patientMrn}
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  type={"secondary-button"}
                  size={"button-small"}
                // onClick={handleEditPatient}
                >
                  Edit Patient
                </Button>
                <Button
                  iconSrc={"assets/icons/x.svg"}
                  size="button-icon-small"
                  type="secondary-button"
                  variant="icon"
                  onClick={() => setOpen(false)}
                ></Button>
              </div>
            </div>
          </div>
          <div className="Details flex flex-col w-full pb-4">
            <div
              className={`${size === "large" ? "px-[calc((100vw-960px)/2)]" : ""
                } flex flex-row w-full pt-4`}
            >
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${size === "large"
                  ? "border-l rounded-tl-lg"
                  : "border-r-0 border-l-0"
                  } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image
                    src={"assets/icons/Phone.svg"}
                    alt="Phone"
                    width={16}
                    height={16}
                  />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Contact
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {patient?.patientMobileno}
                </div>
              </div>
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${size === "large" ? "border-l-0 rounded-tr-lg" : "border-r-0"
                  } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image
                    src={"assets/icons/Cake.svg"}
                    alt="Cake"
                    width={16}
                    height={16}
                  />
                  <div className="text-[#1C2024] text-sm font-normal">Age</div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {patient?.patientAgeYears}/
                  {patient?.patientGender
                    ? patient?.patientGender.charAt(0).toUpperCase()
                    : "N/A"}
                </div>
              </div>
            </div>
            <div
              className={`${size === "large" ? "px-[calc((100vw-960px)/2)]" : ""
                } flex flex-row`}
            >
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border border-[#D9D9E0] ${size === "large"
                  ? "border-l border-t-0 rounded-bl-lg"
                  : "border-t-0 border-l-0"
                  } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image
                    src={"assets/icons/Icon.svg"}
                    alt="Location"
                    width={16}
                    height={16}
                  />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Addhar Card
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {patient?.patientid}
                </div>
              </div>
              <div
                className={`flex flex-row gap-1 text w-full h-fit px-6 py-5 border-b border-[#D9D9E0] ${size === "large" ? "rounded-br-lg border-r" : "border-r-0"
                  } items-center justify-between`}
              >
                <div className="gap-1 flex flex-row">
                  <Image
                    src={"assets/icons/Clock.svg"}
                    alt="Clock"
                    width={16}
                    height={16}
                  />
                  <div className="text-[#1C2024] text-sm font-normal">
                    Last Visit
                  </div>
                </div>
                <div className="text-[#1C2024] text-sm font-medium">
                  {/* {patient?.billTime} */}
                </div>
              </div>
            </div>
          </div>

          {showInsuranceDetails && (
            <div className="flex flex-row items-center justify-center gap-4 pt-4">
              {[
                "General Information",
                "Last Visit Information",
                "Insurance Details",
              ].map((label) => (
                <Toggle
                  key={label}
                  pressed={activeToggle === label}
                  onClick={() => handleToggleClick(label)}
                >
                  {label}
                </Toggle>
              ))}
            </div>
          )}

          <div
            className={`${size === "large" ? "h-[calc(100vh-300px)]" : "max-h-[600px]"
              } overflow-auto no-scrollbar flex flex-col gap-6 pb-4`}
            onScroll={handleScroll}
          >
            <div
              ref={generalRef}
              className={`${size === "small"
                ? "px-6"
                : size === "medium"
                  ? "px-8"
                  : "px-[calc((100vw-960px)/2)]"
                } generalInfo flex flex-col gap-4`}
            >
              <span className="text-[#1C2024] font-semibold text-lg">
                General Information
              </span>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    UHID
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.patientid}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    Bill No
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.bilReceiptId}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    IPD No
                  </span>
                  <span className="text-[#1C2024] text-sm">{patient?.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    Date
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.patientRegistrationDate
                      ? format(
                        new Date(patient.patientRegistrationDate),
                        "dd/MM/yyyy hh:mm a"
                      )
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
            <div
              ref={lastVisitRef}
              className={`${size === "small"
                ? "px-6"
                : size === "medium"
                  ? "px-8"
                  : "px-[calc((100vw-960px)/2)]"
                } lastVisit flex flex-col gap-4`}
            >
              <span className="text-[#1C2024] font-semibold text-lg">
                Last Visit Information
              </span>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    Date
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {/* {patient?.billTime} */}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#1C2024] text-sm font-semibold">
                    Time
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {/* {patient?.billTime} */}
                  </span>
                </div>
              </div>
            </div>

            {showInsuranceDetails && (
              <div
                ref={insuranceRef}
                className={`${size === "small"
                  ? "px-6"
                  : size === "medium"
                    ? "px-8"
                    : "px-[calc((100vw-960px)/2)]"
                  } insuranceDetails flex flex-col gap-4`}
              >
                <span className="text-[#1C2024] font-semibold text-lg">
                  Insurance Details
                </span>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C2024] text-sm font-semibold">
                      Policy Number
                    </span>
                    <span className="text-[#1C2024] text-sm">
                      {patient?.patientMrn}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C2024] text-sm font-semibold">
                      Pre-Auth No
                    </span>
                    <span className="text-[#1C2024] text-sm">
                      {patient?.patientMrn}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C2024] text-sm font-semibold">
                      Approved Amount
                    </span>
                    <span className="text-[#1C2024] text-sm">
                      {patient?.billTotalAmount}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C2024] text-sm font-semibold">
                      Approved Date
                    </span>
                    <span className="text-[#1C2024] text-sm">
                      {patient?.patientRegistrationDate}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C2024] text-sm font-semibold">
                      Approved By
                    </span>
                    <span className="text-[#1C2024] text-sm">
                      {patient?.doctorName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showInsuranceDetails && (
            <div className="footer w-full px-6 py-3 flex flex-row justify-end border-t border-[#D9D9E0] relative items-center">
              {showGradient && (
                <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
              )}
              <Button
                type={"secondary-button"}
                size={"button-small"}
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
          {showInsuranceDetails && (
            <div className="footer w-full px-6 py-3 flex flex-row gap-4 justify-end border-t border-[#D9D9E0] relative">
              {showGradient && (
                <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent rounded-b-none pointer-events-none bg-transparent" />
              )}
              <Button
                type={"secondary-button"}
                size={"button-small"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type={"primary-button"}
                size={"button-small"}
                onClick={() => setOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}
      <div
        className={`fixed inset-0 z-50 bg-black/30 flex items-end justify-center  ${isClosing ? "animate-slideDown" : "animate-slideUp"
          }`}
      >
        <div
          className={`${size === "small"
            ? "w-[640px]"
            : size === "medium"
              ? "w-[960px]"
              : "w-full"
            } h-[93%] bg-white rounded-t-2xl shadow-xl overflow-hidden flex flex-col transition-transform duration-300 
              ${isClosing ? "animate-slideDown" : "animate-slideUp"}  `}
        >
          {/* Header Section */}
          <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar
                name={patient?.patientName?.charAt(0)}
                size="48"
                round
                textSizeRatio={2}
              />
              <div>
                <div className="font-semibold text-lg text-[#1C2024]">
                  {patient?.patientName}
                </div>
                <div className="text-sm text-[#60646C]">
                  {patient?.patientid}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="secondary-button"
                size="button-small"
              // onClick={handleEditPatient}
              >
                Edit Patient
              </Button>
              <Button
                iconSrc={"assets/icons/DotsVertical.svg"}
                size="button-icon-small"
                type="secondary-button"
                variant="icon"
                onClick={handleClose}
              />
            </div>
          </div>
          <div
            className="overflow-y-auto flex-1 py-4 space-y-6 px-[calc((100vw-960px)/2)]"
            onScroll={handleScroll}
          >
            <div className="flex flex-col w-full border border-[#D9D9E0] rounded-md text-sm">
              <div className="flex w-full border-b border-[#D9D9E0]">
                <InfoRowItem
                  icon={"assets/icons/Phone.svg"}
                  label="Contact"
                  value={patient?.patientMobileno}
                />
                <InfoRowItem
                  icon={"assets/icons/Cake.svg"}
                  label="Age"
                  value={`${patient?.patientAgeYears}/${patient?.patientGender
                    ? patient?.patientGender.charAt(0).toUpperCase()
                    : "N/A"
                    }
                 `}
                />
              </div>
              <div className="flex w-full border-b border-[#D9D9E0]">
                <InfoRowItem
                  icon={"assets/icons/Icon.svg"}
                  label="Aadhar Card"
                  value={patient?.adharCardNo}
                />
                <InfoRowItem
                  icon={"assets/icons/Clock.svg"}
                  label="Last Visit"
                  value={formattedVisit}
                />
              </div>
            </div>
            <div id="tableData" className="flex w-full flex-col gap-3">
              <div
                className={`${size === "small"
                  ? "px-6"
                  : size === "medium"
                    ? "px-8"
                    : "px-2"
                  } flex flex-col gap-4`}
              >
                <span className="text-[#1C2024] text-lg font-semibold flex items-center">
                  Services · {table.getCoreRowModel().rows.length}
                </span>
              </div>
              <div
                className={`${size === "small"
                  ? "px-6"
                  : size === "medium"
                    ? "px-8"
                    : "px-2"
                  }`}
              >
                <DataTable
                  table={
                    table as unknown as Table<
                      GetBillServices & { id: string | number }
                    >
                  }
                  columns={
                    columns as unknown as ColumnDef<
                      GetBillServices & { id: string | number }
                    >[]
                  }
                  initialData={
                    initialData as (GetBillServices & { id: string | number })[]
                  }
                  dataProps={{ data, setData }}
                  addButton={false}
                />
              </div>
            </div>
            <div
              ref={insuranceRef}
              className="px-2 flex flex-col gap-4 text-[#1C2024]  text-sm pb-4 w-[640px]"
            >
              <span className="text-[#1C2024] font-semibold text-lg">
                Bill Information
              </span>

              {/* Bill Number & UHID */}
              <div className="flex flex-row gap-2 items-start w-full ">
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="text-[#60646C] text-sm font-normal">
                    Bill Number
                  </span>
                  <span className="text-[#1C2024] text-sm">{patient?.id}</span>
                </div>
                <div className="flex flex-col gap-1 pr-5">
                  <span className="text-[#60646C] text-sm font-normal">
                    UHID
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.patientMrn}
                  </span>
                </div>
              </div>


              <div className="flex flex-row items-start  w-full gap-2">
                {/* IPD No. */}
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="text-[#60646C] text-sm font-normal">
                    Visit No.
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.visittype}
                  </span>
                </div>

                {/* Patient Category */}
                <div className="flex flex-col gap-1 pr-9 relative align-left">
                  <span className="text-[#60646C] text-sm font-normal">
                    Patient Category
                  </span>
                  <div
                    className="text-[#1C2024] font-medium flex flex-row gap-2 items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="text-[#1C2024] text-sm">
                      {selectedCategory?.value
                        ? selectedCategory.value
                        : filtersValues.category?.value || ""}
                    </span>
                    <Image
                      src="assets/icons/CaretDownFilled.svg"
                      width={16}
                      height={16}
                      alt="Caret"
                    />
                  </div>

                  {showDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-[174px] bg-white border border-[#D9D9E0] rounded-lg shadow-sm z-10 overflow-auto no-scrollbar">
                      {patientCategories?.data?.items?.map(
                        (category, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-[#E6F4FE] cursor-pointer overflow-hidden"
                            onClick={() => {
                              setShowDropdown(false);
                              setSelectedCategory({
                                id: String(category.key ?? ""),
                                value: category.value ?? "",
                              });
                            }}
                          >
                            {category.value}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Company & Registration Date */}
              <div className="flex flex-row items-center  w-full gap-2">
                <div className="relative inline-block w-1/2">
                  <div className="flex flex-col gap-1 ">
                    <span className="text-[#60646C] text-sm font-normal">
                      Patient Company
                    </span>
                    <div
                      className="text-[#1C2024] font-medium flex flex-row gap-2 items-center cursor-pointer"
                      onClick={() =>
                        setShowCompanyDropdown(!showCompanyDropdown)
                      }
                    >
                      <span className="text-[#1C2024] text-sm">
                        {selectedCompany?.value
                          ? selectedCompany.value
                          : filtersValues.company?.value || ""}
                      </span>
                      <Image
                        src="assets/icons/CaretDownFilled.svg"
                        width={16}
                        height={16}
                        alt="Caret"
                      />
                    </div>
                  </div>

                  {showCompanyDropdown && (
                    <div className="absolute left-0 top-full mt-2 max-h-48 w-[174px] bg-white border border-[#D9D9E0] rounded-lg shadow-sm z-10 overflow-auto no-scrollbar">
                      {schemeCompanies?.data?.items?.map((company, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-[#E6F4FE] cursor-pointer overflow-hidden"
                          onClick={() => {
                            setShowCompanyDropdown(false);
                            setSelectedCompany({
                              id: String(company.key ?? ""),
                              value: company.value ?? "",
                            });
                          }}
                        >
                          {company.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[#60646C] text-sm font-normal">
                    Registration Date
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.patientRegistrationDate
                      ? format(
                        new Date(patient.patientRegistrationDate),
                        "dd/MM/yyyy hh:mm a"
                      )
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[#60646C] text-sm font-normal">
                    Address
                  </span>
                  <span className="text-[#1C2024] text-sm">
                    {patient?.patientAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#D9D9E0] px-6 py-3 flex justify-end relative bg-white">
            {showGradient && (
              <div className="absolute -top-4 left-0 right-0 h-4 z-10 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent pointer-events-none" />
            )}
            <div className="flex gap-3">
              <Button
                type="secondary-button"
                size="button-small"
                onClick={handleClose}
              >
                {showInsuranceDetails ? "Cancel" : "Close"}
              </Button>
              {showInsuranceDetails && (
                <Button
                  type="primary-button"
                  size="button-small"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDetailsCard;
