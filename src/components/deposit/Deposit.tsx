"use client";
import Image from "next/image";
import React, { useState } from "react";
import Buttons from "../buttons/Button";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// 1. Define your row type
interface DepositRow {
  id: string;
  service: string;
  paymentDate: string;
  depositType: string;
  utilizedAmount: number | string;
  approvedAmount: number;
  balanceDeposit: string;
  totalamt: string;
  tagText?: string;
}

// 2. Initial data with correct typing
const initialData: DepositRow[] = [
  {
    id: "1",
    service: "HSHD12500252",
    paymentDate: "25-01-2025",
    depositType: "Admission IPD Deposit",
    utilizedAmount: 0,
    approvedAmount: 0,
    balanceDeposit: "₹10,000",
    totalamt: "₹10,000",
  },
  {
    id: "2",
    service: "HSHD12500253",
    paymentDate: "05-02-2025",
    depositType: "Admission IPD Deposit",
    utilizedAmount: 0,
    approvedAmount: 0,
    balanceDeposit: "₹12,000",
    totalamt: "₹12,000",
  },
  {
    id: "3",
    service: "HSHD12500254",
    paymentDate: "10-02-2025",
    depositType: "Admission IPD Deposit",
    utilizedAmount: "0",
    approvedAmount: 0,
    balanceDeposit: "₹15,000",
    totalamt: "₹15,000",
  },
];

// 3. Column definitions with types
const columns: ColumnDef<DepositRow>[] = [
  {
    accessorKey: "service",
    header: () => (
      <div className="w-full h-10 border-r border-[#D9D9E0] pr-3">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Package/Service
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span className="text-left w-full  h-10 flex items-center border-r border-[#D9D9E0] pr-3">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "paymentDate",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Payment Date
      </Button>
    ),
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "depositType",
    header: () => (
      <div className="text-left w-full block p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Deposit Type
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={row.original.tagText === "Cancelled" ? "line-through" : ""}
      >
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "utilizedAmount",
    header: ({ column }) => (
      <div className="text-right w-full block">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Utilized Amount
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={`text-right w-full block h-10 py-3 ${row.original.tagText === "Cancelled" ? "line-through" : ""
          }`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "approvedAmount",
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold w-[104px]"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="block truncate w-full">
                Approved Amount to be Refunded
              </span>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
            <p>Approved Amount to be Refunded</p>
            <TooltipArrow className="fill-[#0090FF]" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={`text-right w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""
          }`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "balanceDeposit",
    header: ({ column }) => (
      <div className="text-right w-full block">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Balance Deposit
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={`text-right w-full block h-10 py-3 ${row.original.tagText === "Cancelled" ? "line-through" : ""
          }`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "totalamt",
    header: ({ column }) => (
      <div className="text-right w-full block border-l border-[#D9D9E0]">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Deposit Amount
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="border-l border-[#D9D9E0]">
        <span
          className={`text-right w-full block h-10 py-3 ${row.original.tagText === "Cancelled" ? "line-through" : ""
            }`}
        >
          {String(getValue())}
        </span>
      </div>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
];

// 4. Component Props type
interface DiscountProps {
  setOpen: (open: boolean) => void;
}

const Discount: React.FC<DiscountProps> = ({ setOpen }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<DepositRow[]>(initialData);

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
    <div className="w-full h-full flex flex-col rounded-lg bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between  px-4 border-b border-b-[#D9D9E0]">
        <div className="w-full px-0 py-4  gap-2 flex flex-row">
          <Image
            src={"assets/icons/Camera.svg"}
            width={24}
            height={24}
            alt="Rupee"
          />
          <p className="text-[#1C2024] text-base font-semibold">Deposit(s)</p>
        </div>
        <Buttons
          iconSrc={"assets/icons/X.svg"}
          size="sm"
          type="secondary-button"
          variant="icon"
          onClick={() => setOpen(false)}
        ></Buttons>
      </div>

      {/* Body (scrollable) */}
      <div className="flex-1 w-full overflow-y-auto p-10">
        <DataTable
          table={table}
          columns={columns}
          dataProps={{ data, setData }}
          initialData={initialData}
        />
      </div>

      {/* Footer */}
      <div className="w-full px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex justify-end">
        <Buttons
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Buttons>
        <Buttons size="button-small" type="primary-button" variant="button">
          Save Changes
        </Buttons>
      </div>
    </div>
  );
};

export default Discount;
