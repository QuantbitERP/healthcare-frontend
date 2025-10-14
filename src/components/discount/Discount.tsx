"use client";
import Image from "next/image";
import React, { useState } from "react";
import Buttons from "../buttons/Button";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tags from "@/components/statusTags/Tags";
import Avatar from "react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  // SelectValue,
} from "@/components/ui/select";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
// import { ColumnSort, SortingState } from "@tanstack/react-table";

// const [sorting, setSorting] = useState<SortingState>([]);

type DiscountRow = {
  id: string;
  services: string;
  department: string;
  discount: number;
  discountAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdBy: string;
  approvedBy: string;
};

const initialData: DiscountRow[] = [
  {
    id: "1",
    services: "Coronary Angiography",
    department: "Cardiology",
    discount: 10,
    discountAmount: 1200,
    status: "Pending",
    createdBy: "Dr. Priya Iyer",
    approvedBy: "Dr. Mahesh Kapoor",
  },
  {
    id: "2",
    services: "Kidney Function Test (KFT)",
    department: "Pathology",
    discount: 15,
    discountAmount: 500,
    status: "Approved",
    createdBy: "Dr. Rajesh Sharma",
    approvedBy: "Dr. Sameer Singh",
  },
  {
    id: "3",
    services: "OT Charges",
    department: "Surgery",
    discount: 5,
    discountAmount: 750,
    status: "Rejected",
    createdBy: "Dr. Arvind Mehta",
    approvedBy: "Dr. Arshad Mehta",
  },
];
const statusTypes = ["warning", "success", "danger"] as const;
const statusLabels = ["Pending", "Approved", "Rejected"] as const;

function Discount({ setOpen }: { setOpen: (value: boolean) => void }) {
  const [data, setData] = useState<DiscountRow[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleStatusChange = (value: DiscountRow["status"], id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: value } : item
      )
    );
  }

  const columns: ColumnDef<DiscountRow>[] = [
    {
      accessorKey: "services",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
          Package/Service
        </Button>
      ),
      cell: ({ getValue }) => <span className="text-left block h-10 flex items-center border-r border-[#D9D9E0] pr-3">{getValue<string>()}</span>,
    },
    {
      accessorKey: "department",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
          Department
        </Button>
      ),
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    },
    {
      accessorKey: "discount",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right">
          Discount (%)
        </Button>
      ),
      cell: ({ getValue }) => {
        const value = Number(getValue());
        return value > 0 ? <span className="text-right w-full block">{value}%</span> : null;
      },
    },
    {
      accessorKey: "discountAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount Amount
          {column.getIsSorted() && (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      ),
      cell: ({ getValue }) => {
        const value = Number(getValue());
        return value > 0 ? <span className="text-right w-full block">₹{value}</span> : null;
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() && (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      ),
      cell: ({ row }) => {
        const currentStatus = row.original.status;
        const id = row.original.id;
        return (
          <Select
            value={currentStatus}
            onValueChange={(value) => handleStatusChange(value as "Pending" | "Approved" | "Rejected", id)}
          >
            <SelectTrigger className="w-fit border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
              <Tags
                variant="tag"
                tagText={currentStatus}
                type={statusTypes[statusLabels.indexOf(currentStatus as (typeof statusLabels)[number])] ?? "warning"}
                className=""
              />
            </SelectTrigger>
            <SelectContent>
              {["Pending", "Approved", "Rejected"].map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdBy",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">Created By</Button>
      ),
      cell: ({ getValue }) => {
        const name = getValue<string>();
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar name={name} size="24" round textSizeRatio={2} />
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "approvedBy",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">Approved By</Button>
      ),
      cell: ({ getValue }) => {
        const name = getValue<string>();
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar name={name} size="24" round textSizeRatio={2} />
            <span>{name}</span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col bg-white border border-[#D9D9E0] shadow-md">
      <div className="w-full px-6 py-4 border-b border-[#D9D9E0] flex flex-row gap-2">
        <Image src={'/assets/icons/Discount.svg'} width={24} height={24} alt="Rupee" />
        <p className="text-[#1C2024] text-base font-semibold">Discount</p>
      </div>

      <div className="w-full flex p-6">
        <DataTable
          table={table}
          columns={columns}
          dataProps={{ data, setData }}
          initialData={initialData}
          addButton
        />
      </div>

      <div className="w-full px-6 py-3 border-t border-[#D9D9E0] flex flex-row justify-end gap-4">
        <Buttons
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Buttons>
        <Buttons
          size="button-small"
          type="primary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Save Changes
        </Buttons>
      </div>
    </div>
  );
}

export default Discount;
