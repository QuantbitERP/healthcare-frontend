import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import Dropdown from "../dropdownForPatientCard/Dropdown";
import PatientDetailsCard from "../patientDetailsCardWithTable/PatientDetailsCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tags from "@/components/statusTags/Tags";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@/store/slices/patientSlice";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ColumnDef, Table } from "@tanstack/react-table";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOpdFilters,
  fetchOpdBillingClass,
} from "@/store/opd_bills/thunks";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { getLabelByKey } from "@/utils/getLabelByKey";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import { PatientSearchDto } from "@/services/api-client/models/PatientSearchDto";
import { GetDraftBillByIdResponseDTO } from "@/services/api-client/models/GetDraftBillByIdResponseDTO";

interface PatientCardProps {
  patient:
  | GetBillDetailsDTO
  | GetDraftBillByIdResponseDTO
  | PatientSearchDto
  | null;
  onPatientSelect?: (patient: Patient | null) => void;
  handleAssignPatientClick?: () => void;
  focusOnClick?: boolean;
  columns: ColumnDef<GetBillServices>[];
  initialData: GetBillServices[] | null | undefined;
  table: Table<GetBillServices>;
  dataProps: {
    data: GetBillServices[];
    setData: React.Dispatch<
      React.SetStateAction<(GetBillServices & { id: string | number })[]>
    >;
  };
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  onCompanyChange?: (companyId: string) => void;
  onCategoryChange?: (categoryId: string) => void;
}

function PatientCard({
  patient,
  focusOnClick = false,
  columns,
  initialData,
  table,
  dataProps: { data, setData },
  setIsAllSelected,
  onCompanyChange,
}: PatientCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    patientCategories,
    schemeCompanies,
    visitTypes,
    referredDoctors,
    loading,
  } = useSelector((state: RootState) => state.opdFiltersOptions);
  const { data: billingClass } = useSelector(
    (state: RootState) => state.opdBillingClass
  );

  const { filtersValues, setFiltersValues } = useGlobalTables();
  const [Open, setOpen] = useState(false);
  const patientInputRef = useRef<HTMLInputElement>(null);

  const [category, _setCategory] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [visitType, _setVisitType] = useState<string | null>(null);
  const [referralDoctor, _setReferralDoctor] = useState<string | null>(null);
  const [billingClasses, _setBillingClasses] = useState<string | null>(null);

  useEffect(() => {
    if (
      patientCategories?.data?.items &&
      schemeCompanies?.data?.items &&
      visitTypes?.data?.items &&
      referredDoctors?.data?.items &&
      billingClass?.data
    ) {
      const opdType = visitTypes.data.items.find((item) => item.name === "IPD");

      const visittypeId = String(
        (patient as GetBillDetailsDTO)?.visittype ?? ""
      );
      const isValidVisitType = visitTypes.data.items.some(
        (item) => String(item.id) === visittypeId
      );

      const finalVisitTypeId = isValidVisitType
        ? visittypeId
        : String(opdType?.id ?? "");
      const finalVisitTypeValue = isValidVisitType
        ? getLabelByKey(visitTypes.data.items, visittypeId, "id", "name")
        : opdType?.name || "";

      setFiltersValues((prev) => ({
        ...prev,
        category: {
          id: (patient as GetBillDetailsDTO)?.schemeCompanyTypeId ?? "",
          value: (patient as GetBillDetailsDTO)?.schemeCompanyTypeName ?? "",
        },
        company: {
          id: (patient as GetBillDetailsDTO)?.schemeCompanyId ?? "",
          value: (patient as GetBillDetailsDTO)?.schemeCompanyName ?? "",
        },
        visitType: {
          id: finalVisitTypeId,
          value: finalVisitTypeValue,
        },
        referralDoctor: {
          id:
            patient && "refferalDoctorId" in patient
              ? patient.refferalDoctorId ?? ""
              : (patient as GetBillDetailsDTO)?.refferalDoctorid ?? "",
          value:
            patient && "referredDr" in patient
              ? patient.referredDr ?? ""
              : (patient as GetBillDetailsDTO)?.doctorName ?? "",
        },
        billingClasses: {
          id: "",
          value: "",
        },
      }));
    }
  }, [
    schemeCompanies,
    visitTypes,
    referredDoctors,
    patient,
    patientCategories?.data?.items,
    setFiltersValues,
    billingClasses,
    billingClass?.data,
  ]);

  useEffect(() => {
    if (
      filtersValues.category &&
      filtersValues.company &&
      filtersValues.visitType &&
      filtersValues.referralDoctor &&
      filtersValues.billingClasses
    ) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [
    category,
    company,
    visitType,
    referralDoctor,
    setIsAllSelected,
    filtersValues,
  ]);

  useEffect(() => {
    if (focusOnClick && patientInputRef.current) {
      patientInputRef.current.focus();
    }
  }, [focusOnClick]);

  useEffect(() => {
    dispatch(
      fetchAllOpdFilters({
        version: "1",
        tenant: "",
        hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
        schemeCompaniesBody: {
          schemeCompanyTypeIds: [],
        },
      })
    );
    dispatch(
      fetchOpdBillingClass({
        version: "1",
        tenant: "",
        patientHospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
      })
    );
  }, [dispatch]);

  const handleCompanySelect = (companyId: string) => {
    const selected = schemeCompanies?.data?.items
      ?.filter(
        (comp) => typeof comp.key === "string" && typeof comp.value === "string"
      )
      .map((comp) => ({
        key: comp.key as string,
        value: comp.value as string,
      }))
      .find((option) => option.value === companyId);

    if (selected) {
      setCompany(selected?.value ?? "");
      setFiltersValues((prev) => ({
        ...prev,
        company: { id: selected?.key ?? "", value: companyId },
      }));
      if (selected.key !== undefined && selected.key !== null) {
        onCompanyChange?.(String(selected.key));
      }
    }
  };

  const patientMobile =
    patient && typeof patient === "object"
      ? "patientMobileno" in patient && patient.patientMobileno
        ? String(patient.patientMobileno)
        : "patientMobileNo" in patient && patient.patientMobileNo
          ? String(patient.patientMobileNo)
          : "-"
      : "-";

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <div className="flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <span className="w-[208px] text-[#60646C] text-xs font-normal">
                Visit Information
              </span>
            </div>

            {/* Display selected patient info */}
            <div className="flex flex-row gap-2 items-center">
              <Avatar
                name={patient?.patientName?.charAt(0) ?? ""}
                size="24"
                round={true}
                textSizeRatio={2}
              />
              <span className="text-[#0D74CE] text-sm font-semibold">
                {patient?.patientName}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Tags
              variant="tag"
              tagText="Medical Legal Case"
              type="cyan"
              border
            />
            <Tags variant="tag" tagText="No Coverage" type="warning" border />
          </div>
        </div>

        {/* Rest of the patient information */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1">
              <Image
                src={"assets/icons/Cake.svg"}
                width={16}
                height={16}
                alt="Cake"
              />
              <span className="w-full text-[#1C2024] text-xs font-normal">
                Age / Gender
              </span>
            </div>
            <span className="text-[#1C2024] text-xs font-semibold">
              {patient?.patientAgeYears} /{" "}
              {patient?.patientGender
                ? patient?.patientGender.charAt(0).toUpperCase()
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1">
              <Image
                src={"assets/icons/Phone.svg"}
                width={16}
                height={16}
                alt="Phone"
              />
              <span className="w-full text-[#1C2024] text-xs font-normal">
                Contact
              </span>
            </div>
            <span className="text-[#1C2024] text-xs font-semibold">
              {patientMobile}
            </span>
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1">
              <Image
                src={"assets/icons/Id.svg"}
                width={16}
                height={16}
                alt="ID"
              />
              <span className="w-full text-[#1C2024] text-xs font-normal">
                ABHA ID
              </span>
            </div>
            <span className="text-[#1C2024] text-xs font-semibold">
              {patient && "abhaId" in patient ? patient.abhaId : "-"}
            </span>
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1">
              <Image
                src={"assets/icons/Cash.svg"}
                width={16}
                height={16}
                alt="Cash"
              />
              <span className="w-full text-[#1C2024] text-xs font-normal">
                Category
              </span>
            </div>

            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <Dropdown
                reasons={
                  patientCategories?.data?.items
                    ?.filter(
                      (cat) =>
                        typeof cat.key === "string" &&
                        typeof cat.value === "string"
                    )
                    .map((cat) => ({
                      key: cat.key as string,
                      value: cat.value as string,
                    })) ?? []
                }
                value={filtersValues.category?.value ?? ""}
                onChange={(val) => {
                  const selected = patientCategories?.data?.items
                    ?.filter(
                      (cat) =>
                        typeof cat.key === "string" &&
                        typeof cat.value === "string"
                    )
                    .map((cat) => ({
                      key: cat.key as string,
                      value: cat.value as string,
                    }))
                    .find((option) => option.value === val);

                  setFiltersValues((prev) => ({
                    ...prev,
                    category: { id: selected?.key ?? "", value: val },
                  }));
                }}
                placeholder="Select"
              />
            )}
          </div>

          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1 w-[142px]">
              <Image
                src={"assets/icons/Building.svg"}
                width={16}
                height={16}
                alt="Cash"
              />
              <span className=" text-[#1C2024] text-xs font-normal">
                Company
              </span>
            </div>
            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <Dropdown
                reasons={
                  schemeCompanies?.data?.items
                    ?.filter(
                      (comp) =>
                        typeof comp.key === "string" &&
                        typeof comp.value === "string"
                    )
                    .map((comp) => ({
                      key: comp.key as string,
                      value: comp.value as string,
                    })) ?? []
                }
                buttonText="New Company"
                showButton
                showSearch
                placeholder="Select"
                value={filtersValues.company?.value ?? ""}
                onChange={(val) => {
                  handleCompanySelect(val);
                }}
              />
            )}
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1 w-[142px]">
              <Image
                src={"assets/icons/DoorEnter.svg"}
                width={16}
                height={16}
                alt="DoorEnter"
              />
              <span className=" text-[#1C2024] text-xs font-normal">
                Visit Type
              </span>
            </div>
            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <Dropdown
                reasons={
                  visitTypes?.data?.items
                    ?.filter(
                      (type) =>
                        typeof type.id === "number" &&
                        typeof type.name === "string"
                    )
                    .map((type) => ({
                      key: String(type.id),
                      value: type.name as string,
                    })) ?? []
                }
                value={filtersValues.visitType?.value ?? ""}
                placeholder="Select"
                onChange={(val) => {
                  const selected = visitTypes?.data?.items
                    ?.filter(
                      (type) =>
                        typeof type.id === "number" &&
                        typeof type.name === "string"
                    )
                    .map((type) => ({
                      key: String(type.id),
                      value: type.name as string,
                    }))
                    .find((option) => option.value === val);

                  setFiltersValues((prev) => ({
                    ...prev,
                    visitType: { id: selected?.key ?? "", value: val },
                  }));
                }}
              />
            )}
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1 w-fit whitespace-nowrap items-center">
              <Image
                src={"assets/icons/FirstAidKit.svg"}
                width={16}
                height={16}
                alt="FirstAidKit"
              />
              <span className=" text-[#1C2024] text-xs font-normal">
                Referral Doctor
              </span>
            </div>
            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <Dropdown
                reasons={
                  referredDoctors?.data?.items
                    ?.filter(
                      (doctor) =>
                        typeof doctor.key === "string" &&
                        typeof doctor.value === "string"
                    )
                    .map((doctor) => ({
                      key: doctor.key as string,
                      value: doctor.value as string,
                    })) ?? []
                }
                placeholder="Select"
                buttonText="New Doctor"
                showButton
                showSearch
                value={filtersValues.referralDoctor?.value ?? ""}
                onChange={(val) => {
                  const selected = referredDoctors?.data?.items
                    ?.filter(
                      (doctor) =>
                        typeof doctor.key === "string" &&
                        typeof doctor.value === "string"
                    )
                    .map((doctor) => ({
                      key: doctor.key as string,
                      value: doctor.value as string,
                    }))
                    .find((option) => option.value === val);

                  setFiltersValues((prev) => ({
                    ...prev,
                    referralDoctor: { id: selected?.key ?? "", value: val },
                  }));
                }}
              />
            )}
          </div>
          <div className="flex flex-row h-8 items-center justify-between">
            <div className="flex flex-row gap-1">
              <Image
                src={"assets/icons/DoorEnter.svg"}
                width={16}
                height={16}
                alt="Cash"
              />
              <span className="w-full text-[#1C2024] text-xs font-normal">
                Billing Class
              </span>
            </div>

            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <Dropdown
                reasons={
                  billingClass?.data
                    ? [
                      {
                        key: billingClass.data.key ?? "",
                        value: billingClass.data.value ?? "",
                      },
                    ]
                    : []
                }
                value={filtersValues.billingClasses?.value ?? ""}
                onChange={(val) => {
                  if (billingClass?.data && billingClass.data.value === val) {
                    setFiltersValues((prev) => ({
                      ...prev,
                      billingClasses: {
                        id: billingClass.data?.key ?? "",
                        value: billingClass.data?.value ?? "",
                      },
                    }));
                  }
                }}
                placeholder="Select"
              />
            )}
          </div>
          <DialogTrigger asChild>
            <div className="w-fit h-fit flex justify-start">
              <Button
                size="link-size"
                type="link-secondary"
                variant="link-button"
                className="cursor-pointer"
              >
                Show more
              </Button>
            </div>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent
        className="w-full max-w-none h-full max-h-none p-0 rounded-t-lg shadow-none border-none 
             mx-auto transition-transform duration-300 
             data-[state=open]:animate-slide-up 
             bg-n z-50 [&>button]:hidden"
      >
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <PatientDetailsCard
          columns={columns}
          initialData={initialData}
          table={table}
          dataProps={{
            data: data as unknown as (GetBillServices & {
              id: string | number;
            })[],
            setData,
          }}
          patient={patient}
          setOpen={setOpen}
          size="large"
        />
      </DialogContent>
    </Dialog>
  );
}

export default PatientCard;
