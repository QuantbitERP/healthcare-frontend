/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchPatients } from "@/store/patients/thunks";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Avatar from "react-avatar";
import Close from "@/assets/icons/x.svg";
import Sad from "@/assets/icons/Emoji.svg";
import { usePatientSearch } from "../newBill/context/Context";
import Button from "../buttons/Button";
import { PatientSearchDto } from "@/services/api-client/models/PatientSearchDto";


interface PatientCardSkeletonProps {
  onPatientSelect?: (patient: PatientSearchDto | null) => void;
  handleAssignPatientClick?: () => void;
  focusOnClick?: boolean;
}

const PatientCardSkeleton: React.FC<PatientCardSkeletonProps> = ({
  onPatientSelect,
  handleAssignPatientClick,
  focusOnClick = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const context = usePatientSearch();
  const patientInputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPatients, setFilteredPatients] = useState<PatientSearchDto[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showAvatar, setShowAvatar] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchDto | null>(null);
  const [placeholderText, setPlaceholderText] =
    useState<string>("Search by UHID");

  const inputRef = context?.patientInputRef || patientInputRef;

  const placeholderTexts = [
    "Search by UHID",
    "Search by Name",
    "Search by Phone",
    "Search by ABHA ID",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText((current) => {
        const currentIndex = placeholderTexts.indexOf(current);
        const nextIndex = (currentIndex + 1) % placeholderTexts.length;
        return placeholderTexts[nextIndex];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredPatients([]);
      return;
    }

    if (term.length < 3) {
      setFilteredPatients([]);
      return;
    }

    try {
      const patients = await dispatch(fetchPatients({
        version: "1",
        tenant: "",
        requestBody: {
          hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
          searchTerm: searchTerm,
          pageNumber: 1,
          pageSize: 10,
        },
      })).unwrap();
      if (!Array.isArray(patients.data?.items)) {
        setFilteredPatients([]);
        return;
      }

      setFilteredPatients(patients.data?.items);
      setSelectedIndex(-1);
    } catch {
      setFilteredPatients([]);
    }
  };

  const handlePatientClick = (patient: PatientSearchDto) => {
    setShowAvatar(true);
    setSearchTerm("");
    setFilteredPatients([]);
    if (onPatientSelect) {
      onPatientSelect(patient);
    }
  };

  // Focus the input when the component is mounted if focusOnClick is true
  useEffect(() => {
    if (focusOnClick && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnClick]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Get the dropdown container
      const dropdown = document.querySelector(".patient-dropdown");

      // Check if click is outside both the input and dropdown
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (!dropdown || !dropdown.contains(event.target as Node))
      ) {
        setFilteredPatients([]);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!filteredPatients.length) return;

      if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredPatients.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        handlePatientClick(filteredPatients[selectedIndex]);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredPatients, selectedIndex]);

  return (
    <div className="w-[256px] h-fit rounded-lg bg-white flex-shrink-0 gap-6 border border-[#D9D9E0] p-4 shadow-sm">
      {/* Search input field */}
      <div className="flex flex-col gap-2">
        <span className="text-[#60646C] text-sm font-normal">Patient</span>
        <div className="mb-4 flex flex-row items-center relative">
          <Image
            src={"assets/icons/Search.svg"}
            alt="Search"
            width={20}
            height={20}
            className="absolute left-3 items-center"
          />
          <input
            type="text"
            className="w-full h-10 rounded-lg border border-[#CDCED6] bg-white flex items-center pr-3 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-[#0090FF] text-sm"
            placeholder={placeholderText}
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() =>
              handleAssignPatientClick && handleAssignPatientClick()
            }
          />
          {showAvatar && selectedPatient && (
            <div className="flex flex-row gap-2 items-center absolute rounded-full bg-[#DEF7F9] p-1 pr-2 ml-11">
              <Avatar
                name={selectedPatient?.patientName?.charAt(0) ?? ""}
                size="20"
                round={true}
                textSizeRatio={2}
              />
              <span className="text-[#1C2024] text-xs font-medium">
                {selectedPatient?.patientName}
              </span>
              <Image
                src={Close}
                alt="Close"
                width={14}
                height={14}
                className="cursor-pointer"
                onClick={() => {
                  setShowAvatar(false);
                  setSearchTerm("");
                  setSelectedPatient(null);
                  if (onPatientSelect) onPatientSelect(null);
                }}
              />
            </div>
          )}

          {/* Dropdown for search results */}
          {filteredPatients.length > 0 ? (
            filteredPatients[0].status === "dead" ? (
              <div className="w-[304px] z-50 h-fit rounded-lg border border-[#CDCED6] bg-white pb-3 flex flex-col-reverse absolute top-12 overflow-hidden patient-dropdown">
                <div className="w-full h-[120px] px-4 py-2 flex flex-col gap-2 items-center justify-center">
                  <Image
                    src={Sad}
                    alt="Sad"
                    width={24}
                    height={24}
                    className="flex"
                  />
                  <span className="text-[#1C2024] text-sm font-semibold">
                    Patient is Deceased
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-[304px] z-50 h-fit whitespace-nowrap max-h-[240px] rounded-lg border border-[#CDCED6] bg-white pb-3 flex flex-col-reverse absolute top-12 overflow-hidden patient-dropdown">
                <div className="overflow-y-auto max-h-[240px]">
                  {filteredPatients.map((patient, index) => (
                    <div
                      key={patient.patientId}
                      className={`flex flex-row w-full h-9 px-4 py-1 hover:bg-[#E6F4FE] cursor-pointer text-sm font-normal justify-between items-center z-20 ${index === selectedIndex
                        ? "bg-[#E6F4FE] text-[#0D74CE]"
                        : "text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE]"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling up
                        handlePatientClick(patient);
                      }}
                    >
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                        {patient.patientName}
                      </span>
                      <span className="whitespace-nowrap text-[#60646C]">
                        {patient.patientMobileNo || patient.patientMrn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : filteredPatients.length > 0 && searchTerm.length > 0 ? (
            <div className="w-[304px] z-50 h-fit rounded-lg border border-[#CDCED6] bg-white pb-3 flex flex-col-reverse absolute top-12 overflow-hidden patient-dropdown">
              <div className="w-full h-[120px] px-4 py-2 flex flex-col gap-2 items-center justify-center">
                <Image
                  src={Sad}
                  alt="Sad"
                  width={24}
                  height={24}
                  className="flex"
                />
                <span className="text-[#1C2024] text-sm font-semibold">
                  No Patient Found!
                </span>
                <Button
                  size="button-small"
                  type="secondary-button"
                  variant="button"
                  className="w-full"
                >
                  Add a Patient
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Skeleton Placeholder */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-1" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-2"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-3" className="w-[46px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-4" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-5"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-6" className="w-[81px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-7" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-8"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-9" className="w-[97px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-10" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-11"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-12" className="w-[73px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-13" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-14"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-15" className="w-[85px] h-6 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-16" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-17"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-18" className="w-[53px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <Skeleton key="skeleton-19" className="w-4 h-3 rounded-full" />
              <Skeleton
                key="skeleton-20"
                className="w-[73px] h-3 rounded-full"
              />
            </div>
            <Skeleton key="skeleton-21" className="w-[73px] h-3 rounded-full" />
          </div>
          <div className="flex flex-row justify-between">
            <Skeleton key="skeleton-22" className="w-[73px] h-3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCardSkeleton;
