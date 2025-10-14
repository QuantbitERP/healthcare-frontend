import React from "react";
import { Button } from "@/components/ui/button";

import { ArrowDown, ArrowUp } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  FundTransferRecord,
  CategoryChangeBillingRecord,
} from "@/store/employee_transfers/types";

const columns: ColumnDef<FundTransferRecord>[] = [
  {
    accessorKey: "employee",
    header: ({ column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Employee
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : null}
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <span className="cursor-pointer hover:text-primary ">
          {row.original.employee}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transaction Date
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.transactionDate;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <span className="group-hover:text-primary">{date}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "transferAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row justify-end" // Ensure justify-end for right alignment of header text
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transfer Amount
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-right w-full block pl-3 h-10 py-3">
          {row.original.transferAmount}
        </span>
      );
    },
  },
  {
    accessorKey: "transferBy",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transfer By
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.transferBy}</span>;
    },
  },
  {
    accessorKey: "transferFrom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transfer From
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.transferFrom}</span>;
    },
  },
  {
    accessorKey: "transferTo",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Transfer To
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.transferTo}</span>;
    },
  },
  {
    accessorKey: "collectedFrom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Collected From
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.collectedFrom}</span>;
    },
  },
];
const categoryColumns: ColumnDef<CategoryChangeBillingRecord>[] = [
  {
    accessorKey: "billType",
    header: ({ column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Bill Type
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <span className="cursor-pointer hover:text-primary ">
          {row.original.billType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.category;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <span className="group-hover:text-primary">{date}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "subCategory",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-center  w-full flex flex-row" // Ensure justify-end for right alignment of header text
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sub Category
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-center w-full block pl-3 h-10 py-3">
          {row.original.subcategory}
        </span>
      );
    },
  },
  {
    accessorKey: "allocatedBalance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Allocated Balance
      </Button>
    ),
    cell: ({ row }) => {
      return  <span className="text-right w-full block pl-3 h-10 py-3">
      {row.original.allocatedBalance}
    </span>
    },
  },
  {
    accessorKey: "utilizedAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Utilized Amount
      </Button>
    ),
    cell: ({ row }) => {
      return <span className="text-right w-full block pl-3 h-10 py-3">
      {row.original.utilizedAmount}
    </span>
    },
  },
  {
    accessorKey: "orgEmpCode",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Org. Emp. Code
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.orgEmpCode}</span>;
    },
  },
  {
    accessorKey: "visitDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Visit Date
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.visitDate}</span>;
    },
  },
];
export { columns, categoryColumns };
