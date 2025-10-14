"use client";
import React from "react";
import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/utils/CurrencyUtils";
import { DropDownWithButton } from "@/components/dropDownMenuWithButtonFooter/DropDownWithButton";

import { ColumnDef } from "@tanstack/react-table";

export interface BillRow {
  billId: string;
  billNo: string;
  billDate: string;
  ipNo: string;
  claimNo: string;
  patientName: string;
  totalAmount: number;
  priorAuthId?: string;
}


const tableActionMenu = [
  {
    title: "",
    items: ["Lab", "RTS", "OTS Notes", "Discharge Summary", "Case Sheet"],
  },
];
export const columns = (onRemoveBill?: (billId: string) => void): ColumnDef<BillRow>[] => [
  {
    accessorKey: "billId",
    header: ({ table }) => (
      <div className="flex items-center text-[#60646C] gap-2 justify-start mr-24 border-r border-[#D9D9E0] w-full h-10">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(value)
          }
          aria-label="Select all"
        />
        <span>Bill No.</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-2 pr-3 border-r h-10 border-[#D9D9E0] w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <span className="hover:text-primary">
          {row.original.billNo}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "billDate",
    header: () => <div>Bill Date</div>,
  },
  {
    accessorKey: "ipNo",
    header: () => <div>IP No</div>,
  },
  {
    accessorKey: "claimNo",
    header: () => <div>Claim No</div>,
  },
  {
    accessorKey: "patientName",
    header: () => (
      <div>
        <span>Patient</span>
      </div>
    ),
    cell: ({ row }) => {
      const patientName = row.original.patientName;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <Avatar className="h-4 w-4">
            <AvatarFallback className="text-white font-normal text-[10px]">
              {patientName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="group-hover:text-primary">{patientName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "billAmount",
    header: () => (
      <div className="h-10 border-l border-[#D9D9E0] pl-5 py-2">
        <span>Total Amount</span>
  
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 border-l border-[#D9D9E0] h-10">
          {formatCurrency(Number(row.original.totalAmount), "INR")}
          {onRemoveBill && (
            <button
              onClick={() => onRemoveBill(row.original.billId)}
              className="p-1 hover:bg-red-50 rounded-md transition-colors"
              title="Remove bill"
            >
              <Image
                src="/assets/icons/Trash.svg"
                alt="Remove"
                width={16}
                height={16}
                className="text-red-500"
              />
            </button>
          )}
          <DropDownWithButton
            trigger={
              <Image
                src="/assets/icons/DotsVertical.svg"
                alt="More"
                width={16}
                height={16}
              />
            }
            menuRendering={tableActionMenu}
          />
        </div>
    ),
     enableSorting: true,
  },
];

export default columns;
