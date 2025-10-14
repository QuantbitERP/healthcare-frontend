import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/StatusBadge/StatusBadge";


export interface ServiceData {
  id: string;
  service: string;
  department: string;
  type: string;
  quantity: number;
  total: number;
  tagText?: string;
  tagStyle?: string;
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

const createColumns = (onOpenModal: (row: ServiceData) => void): ColumnDef<ServiceData>[] => [
  {
    accessorKey: "service",
    header: ({ table, column }) => (
      <div className="flex flex-row items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          {column.getIsSorted() && (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div className={`flex flex-row items-center`}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(value)}
            aria-label="Select row"
          />
            <button onClick={() => onOpenModal(row.original)}>
              <span className="ml-2">{getValue<string>()}</span>
            </button>
          </div>
          {row.original.tagText && (
            <StatusBadge
              text={row.original.tagText}
              // variant={row.original.tagStyle}
            />
          )}
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
        {column.getIsSorted() && (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
      </Button>
    ),
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Type
      </Button>
    ),
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "quantity",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Quantity
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-right w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""}`}>{getValue<number>()}</span>
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
          {column.getIsSorted() && (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="border-l border-[#D9D9E0] py-0 -ml-3">
        <span className={`text-right w-full h-10 block pl-3 py-3 ${row.original.tagText === "Cancelled" ? "line-through" : ""}`}>
          ₹{getValue<number>()}
        </span>
      </div>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
];

export { initialData, createColumns };
