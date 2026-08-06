import React, { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import Avatar from "react-avatar";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  initialData,
  columns,
  tableTwoData,
  tableTwoColumn,
} from "./TableData";
import InfoRowItem from "../submitBillModal/InfoRowItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import _Buttons from "../buttons/Button";

export interface ServiceProps {
  onClose: () => void;
  showHeader?: boolean;
  isNestedDialog?: boolean;
  header?: string;
  subHeader?: string;
  serviceCode?: string;
  rate?: string;
  packageType?: string;
  dateAdded?: string;
  unit?: string;
  serviceName?: string;
  serviceRemark?: string;
  doctor?: string[];
  size?: "small" | "medium" | "large";
}

const Service: React.FC<ServiceProps> = ({
  serviceCode = "0000016",
  rate = "₹7,500",
  packageType = "Health Checkup",
  dateAdded = "31-Dec-2024 12:30 PM",
  unit = "Cardiology Department",
  serviceName = "ECG",
  serviceRemark = "Urgent Test",
  size = "large",
}) => {
  const { referredDoctors = [] } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );
  const [selectedDoctor, _setSelectedDoctor] = useState<string>(
    referredDoctors?.[0]?.value || ""
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(initialData);
  const [twoData, setTwoData] = useState(tableTwoData);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const tableTwo = useReactTable({
    data: twoData,
    columns: tableTwoColumn,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col h-full gap-4">
        {/* ---------- Header ---------- */}
        {/* <div className="w-full flex items-center px-6 py-4 border-b border-[#D9D9E0]">
          <Image
            src={"assets/icons/Notepad.svg"}
            width={24}
            height={24}
            alt="notepad"
          />
          <span className="text-[#1C2024] font-semibold text-base flex-1">
            Service Name
          </span>
        </div> */}
        <div className="flex-1 p-4 px-30 gap-3 flex flex-col">
          <div className="flex flex-col w-full border border-[#D9D9E0] rounded-md text-sm">
            <div className="flex w-full border-b border-[#D9D9E0]">
              <InfoRowItem
                icon="assets/icons/Hashtag.svg"
                label="Service Code"
                value={serviceCode}
              />
              <InfoRowItem
                icon="assets/icons/RupeeIcon.svg"
                label="Rate"
                value={rate}
              />
            </div>
            <div className="flex w-full border-b border-[#D9D9E0]">
              <InfoRowItem
                icon="assets/icons/DateAdded.svg"
                label="Date Added"
                value={dateAdded}
              />
              <InfoRowItem
                icon="assets/icons/Packages.svg"
                label="Package"
                value={packageType}
              />
            </div>
            <div className="flex w-full">
              <InfoRowItem
                icon="assets/icons/Emergency.svg"
                label="Emergency"
                value={<Switch />}
              />
              <div className="w-full px-6 py-5" />
            </div>
          </div>
          {/* Cost Breakdown */}
          <div
            className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-2"
              } flex flex-col gap-4`}
          >
            <span className="text-[#1C2024] text-lg font-semibold">
              Cost Breakdown
            </span>
          </div>
          <div
            className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-2"
              }`}
          >
            <DataTable
              table={table}
              columns={columns}
              initialData={initialData}
              dataProps={{ data, setData }}
              addButton={false}
            />
          </div>

          {/* Service Concession */}
          <div
            className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-2"
              } flex flex-col gap-4`}
          >
            <span className="text-lg font-semibold">Service Concession</span>
          </div>
          <div
            className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-2"
              }`}
          >
            <DataTable
              table={tableTwo}
              columns={tableTwoColumn}
              initialData={tableTwoData}
              dataProps={{ data: twoData, setData: setTwoData }}
              addButton={true}
            />
          </div>
          <div
            className={`${size === "small" ? "px-6" : size === "medium" ? "px-8" : "px-2"
              } flex flex-col gap-4 text-[#1C2024] text-sm pb-4`}
          >
            <span className="text-lg font-semibold">General Information</span>
            <div className="flex w-full relative">
              <div className="w-full flex flex-col gap-2">
                <span className="text-[#60646C]">Doctor</span>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="cursor-pointer flex gap-2 items-center"
                >
                  <Avatar
                    name={selectedDoctor.charAt(0)}
                    size="24"
                    round
                    textSizeRatio={2}
                  />
                  <span>Dr. {selectedDoctor}</span>
                  <Image
                    src="assets/icons/CaretDownFilled.svg"
                    width={16}
                    height={16}
                    alt="Caret"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <span className="text-[#60646C]">Unit</span>
                <span className="text-[#1C2024] font-medium">{unit}</span>
              </div>
              {showDropdown && (
                <div className="absolute w-[174px] bg-white border border-[#D9D9E0] rounded-lg shadow-sm z-10 mt-14 overflow-auto no-scrollbar">
                  {/* dropdown items */}
                </div>
              )}
            </div>

            <div className="flex w-full">
              <div className="w-full flex flex-col gap-2">
                <span className="text-[#60646C]">Service Remark</span>
                <span className="text-[#1C2024] font-medium">
                  {serviceRemark}
                </span>
              </div>
              <div className="w-full flex flex-col gap-2">
                <span className="text-[#60646C]">Service Name</span>
                <span className="text-[#1C2024] font-medium">{serviceName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
