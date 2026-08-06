"use client";
import React, { useState } from "react";
import Image from "next/image";
import Buttons from "@/components/buttons/Button";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

interface ServiceData {
  id: string;
  service: string;
  department: string;
  type: string;
  quantity: number;
  total: number;
  tagText?: string;
  tagStyle?: string;
}

interface CostBreakdownCardProps {
  onClose: () => void;
  header?: string;
  patientName?: string;
  gender?: string;
  date?: string;
  amount?: string;
  numberOfRows?: string;
}

const initialData: ServiceData[] = [
  { id: "1", service: "Complete Blood Count (CBC)", department: "Pathology", type: "Item Limit", quantity: 1, total: 500 },
  { id: "2", service: "Blood Sugar Test", department: "Endocrinology", type: "Item Limit", quantity: 1, total: 400 },
  { id: "3", service: "Lipid Profile", department: "Cardiology", type: "Item Limit", quantity: 1, total: 1200 },
  { id: "4", service: "Liver Function Test", department: "Gastroenterology", type: "Item Limit", quantity: 1, total: 1000 },
  { id: "5", service: "Kidney Function Test", department: "Nephrology", type: "Item Limit", quantity: 1, total: 1000 },
  { id: "6", service: "Chest X-Ray", department: "Radiology", type: "Item Limit", quantity: 1, total: 800 },
  { id: "7", service: "ECG", department: "Cardiology", type: "Item Limit", quantity: 1, total: 600 },
];

function CostBreakdownCard({
  onClose,
  header = "BI10011006",
  patientName = "Neha Deshmukh",
  gender = "Female",
  date = "10-03-2025",
  amount = "₹5,500",
  numberOfRows = "10",
}: CostBreakdownCardProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ServiceData[]>(initialData);
  const [, setOpen] = useState(false);

  const columns: ColumnDef<ServiceData>[] = [
    {
      accessorKey: "service",
      header: ({ table, column }) => (
        <div className="flex flex-row  items-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        </div>
      ),
      cell: ({ row, getValue }) => {
        const isCancelled = row?.original?.tagText === "Cancelled";
        return (
          <div className="flex flex-row items-center justify-between">
            <div className={`flex flex-row items-center ${isCancelled ? "line-through text-[#1C2024]" : ""}`}>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(value)}
                aria-label="Select row"
              />
              <button onClick={() => setOpen(true)}>
                <span className="mr-2">{getValue() as string}</span>
              </button>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      ),
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ }) => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
          Type
        </Button>
      ),
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
    },
    {
      accessorKey: "quantity",
      header: ({ }) => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
          Quantity
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span className={`text-right w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <div className="h-10 border-l border-[#D9D9E0] -ml-3">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount
            {column.getIsSorted() &&
              (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
          </Button>
        </div>
      ),
      cell: ({ row, getValue }) => (
        <div className="border-l border-[#D9D9E0] py-0 -ml-3">
          <span className={`text-right w-full h-10 block pl-3 py-3 ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
            ₹{getValue() as number}
          </span>
        </div>
      ),
      enableSorting: true,
      sortingFn: "basic",
    },
  ];

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

  return (
    <div className="w-[640px] max-h-[889px] flex flex-col gap-6 pt-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)] rounded-lg">
      {/* header */}
      <div className="w-full h-fit flex flex-row px-6 gap-2 items-center">
        <Image src={"assets/icons/Hash.svg"} width={24} height={24} alt="" />
        <span className="text-[#1C2024] font-semibold text-base w-full">{header}</span>
        <Buttons iconSrc={"assets/icons/ThreeDots.svg"} size="button-icon-small" type="secondary-button" variant="icon" />
      </div>

      {/* body */}
      <div className="w-full h-fit flex flex-col gap-6 overflow-auto no-scrollbar">
        <div className="flez flex-col w-full h-fit">
          <div className="w-full h-fit flex flex-row">
            <div className="w-full h-fit px-6 py-5 border border-[#D9D9E0] border-l-0 flex flex-row gap-4 text-[#1C2024] text-sm whitespace-nowrap items-center">
              <div className="w-full h-fit flex flex-row gap-1">
                <Image src={"assets/icons/user.svg"} width={16} height={16} alt="" />
                <span className="font-normal">Patient Name</span>
              </div>
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="w-full h-fit px-6 py-5 border-y border-[#D9D9E0] flex flex-row gap-4 text-[#1C2024] text-sm whitespace-nowrap items-center">
              <div className="w-full h-fit flex flex-row gap-1">
                <Image src={"assets/icons/GenderMale.svg"} width={16} height={16} alt="Gender" />
                <span className="font-normal">Gender</span>
              </div>
              <span className="font-medium">{gender}</span>
            </div>
          </div>
          <div className="w-full h-fit flex flex-row">
            <div className="w-full h-fit px-6 py-5 border border-[#D9D9E0] border-l-0 border-t-0 flex flex-row gap-4 text-[#1C2024] text-sm whitespace-nowrap items-center">
              <div className="w-full h-fit flex flex-row gap-1">
                <Image src={"assets/icons/calendar.svg"} width={16} height={16} alt="Calendar" />
                <span className="font-normal">Bill Date</span>
              </div>
              <span className="font-medium">{date}</span>
            </div>
            <div className="w-full h-fit px-6 py-5 border-b border-[#D9D9E0] flex flex-row gap-4 text-[#1C2024] text-sm whitespace-nowrap items-center">
              <div className="w-full h-fit flex flex-row gap-1">
                <Image src={"assets/icons/RupeeIcon.svg"} width={16} height={16} alt="Rupee" />
                <span className="font-normal">Total Amount</span>
              </div>
              <span className="font-medium">{amount}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-fit px-6 flex flex-col gap-4 text-[#1C2024]">
          <span className="text-lg font-semibold">Services · {numberOfRows}</span>
          <DataTable
            table={table}
            columns={columns}
            dataProps={{ data, setData }}
            initialData={initialData}
            addButton={true}
          />
        </div>
      </div>

      {/* footer */}
      <div className="w-full px-6 py-3 flex flex-row justify-end items-center border-t border-[#D9D9E0] overflow-hidden gap-4">
        <Buttons size="button-small" type="secondary-button" variant="button" onClick={onClose}>
          Cancel
        </Buttons>
        <Buttons size="button-small" type="primary-button" variant="button" onClick={onClose}>
          Save Changes
        </Buttons>
      </div>
    </div>
  );
}

export default CostBreakdownCard;
