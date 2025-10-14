"use client";
import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import Buttons from "@/components/buttons/Button";
import Tags from "@/components/statusTags/Tags";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { initialData, createColumns } from "./TableData";
import InfoRowItem from "../submitBillModal/InfoRowItem";
import { Switch } from "@/components/ui/switch";
import Service from "../fullBodyCheckup_service/Service";

interface CostBreakdownCardProps {
  onClose: () => void;
  isNestedDialog?: boolean;
  header?: string;
  packageCode?: string;
  gender?: string;
  department?: string;
  packageType?: string;
  visitType?: string;
  duration?: string;
  dateFrom?: string;
  dateTo?: string;
  rate?: string;
  quantity?: string;
  requisitionDate?: string;
  time?: string;
  concession?: string;
  size?: "small" | "medium" | "large";
  selectedService: string;
}

const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({
  onClose,
  isNestedDialog = false,
  packageCode = "FBC-001",
  gender = "Female",
  rate = "₹1,500",
  visitType = "IPD",
  duration = "3 Days",
  dateFrom = "25-03-2025",
  dateTo = "25-05-2025 to 27-03-2025",
  requisitionDate = "26-03-2025 12:00 PM",
  concession = "10%",
  quantity = "1",
  size = "small",
  selectedService,
}) => {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [showGradient, setShowGradient] = useState(true);
  const [modalData, setModalData] = useState<string | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleOpenModal = (rowData: { service: string }) => {
    setModalData(rowData.service);
    setOpen(true);
  };

  const table = useReactTable({
    data,
    columns: createColumns(handleOpenModal),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div
        className={`bg-white shadow-xl rounded-t-xl flex flex-col overflow-hidden animate-slideUp
      ${
        size === "small"
          ? "w-[640px] max-h-[90vh]"
          : size === "medium"
          ? "w-[960px] max-h-[90vh]"
          : "w-[100vw] h-[93%]"
      } 
      ${isNestedDialog ? "z-60" : ""}
    `}
      >
        {/* Header */}
        <div className="w-full flex items-center px-6 py-4 border-b border-[#D9D9E0]">
          <Image
            src={"/assets/icons/Notepad.svg"}
            width={24}
            height={24}
            alt="notepad"
          />
          <span
            className={`${
              open ? "text-[#0D74CE] cursor-pointer" : "text-[#1C2024]"
            } font-semibold text-base flex-1 pl-2`}
            onClick={() => setOpen(false)}
          >
            {selectedService}
            {open && <span className="text-[#1C2024]"> / {modalData}</span>}
          </span>
          <Buttons
            iconSrc={"/assets/icons/x.svg"}
            size="button-icon-small"
            type="secondary-button"
            variant="icon"
            onClick={onClose}
          />
        </div>

        {/* Body Scrollable */}
        <div
          id="cardBody"
          className={`flex-1 overflow-auto no-scrollbar ${
            size === "small"
              ? "px-6"
              : size === "medium"
              ? "px-8"
              : "px-[calc((100vw-960px)/2)] pt-4"
          }`}
          onScroll={handleScroll}
        >
          {!open ? (
            selectedService === "Full Body Checkup" ? (
              <div className="flex flex-col gap-6 w-full h-fit">
                {/* Table Row */}
                <div className="flex flex-col w-full border border-[#D9D9E0] rounded-md text-sm">
                  <div className="flex w-full border-b border-[#D9D9E0]">
                    <InfoRowItem
                      icon={"/assets/icons/LabelIcon.svg"}
                      label="Package Code"
                      value={packageCode}
                    />
                    <InfoRowItem
                      icon={"/assets/icons/GenderMale.svg"}
                      label="Gender"
                      value={gender}
                    />
                  </div>
                  <div className="flex w-full border-b border-[#D9D9E0]">
                    <InfoRowItem
                      icon={"/assets/icons/Company.svg"}
                      label="Department"
                      value={"Cardiology"}
                    />
                    <InfoRowItem
                      icon={"/assets/icons/Packages.svg"}
                      label="Package Type"
                      value={"Health Checkup"}
                    />
                  </div>
                  <div className="flex w-full">
                    <InfoRowItem
                      icon={"/assets/icons/Emergency.svg"}
                      label="Emergency"
                      value={<Switch />}
                    />
                    <div className="w-full px-6 py-5" />
                  </div>
                </div>

                {/* General Information */}
                <div className="text-[#1C2024] text-sm flex flex-col gap-4">
                  <span className="text-lg font-semibold">
                    General Information
                  </span>
                  <div className="flex flex-row gap-2 flex-wrap">
                    <Tags
                      variant="tag"
                      tagText="Multiple Visits"
                      type="pink"
                      border
                    />
                    <Tags
                      variant="tag"
                      tagText="Deactivate"
                      type="secondary"
                      border
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Visit Type", value: visitType },
                      { label: "Duration", value: duration },
                      { label: "Valid Until", value: dateTo },
                      { label: "Effective From", value: dateFrom },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-1">
                        <span className="text-[#60646C] font-normal">
                          {label}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Information */}
                <div className="text-[#1C2024] flex flex-col gap-4 text-sm">
                  <span className="text-lg font-semibold">
                    Package Information
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Rate", value: rate },
                      { label: "Quantity", value: quantity },
                      {
                        label: "Requisition Date/Time",
                        value: requisitionDate,
                      },
                      { label: "Concession", value: concession },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-1">
                        <span className="text-[#60646C] font-normal">
                          {label}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="pb-4 flex flex-col gap-3">
                  <span className="text-lg font-semibold">
                    Services · {table.getCoreRowModel().rows.length}
                  </span>
                  <DataTable
                    table={table}
                    columns={createColumns(handleOpenModal)}
                    dataProps={{ data, setData }}
                    initialData={initialData}
                    addButton={true}
                  />
                </div>
              </div>
            ) : (
              <Service onClose={() => {}} />
            )
          ) : (
            <Service onClose={() => {}} />
          )}
        </div>

        {/* Footer */}
        <div className="relative w-full px-6 py-3 flex justify-end items-center border-t border-[#D9D9E0] gap-4">
          {showGradient && (
            <div className="absolute -top-4 left-0 right-0 h-4 z-50 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent pointer-events-none" />
          )}
          <Buttons
            size="button-small"
            type="secondary-button"
            variant="button"
            onClick={onClose}
          >
            Cancel
          </Buttons>
          <Buttons
            size="button-small"
            type="primary-button"
            variant="button"
            onClick={onClose}
          >
            Save Changes
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownCard;
