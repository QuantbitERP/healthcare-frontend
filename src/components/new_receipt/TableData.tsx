import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { HospitalBillEntry } from "@/store/payments_received/types";
import { formatCurrency } from "@/utils/CurrencyUtils";


type ColumnNames = {
  [key: string]: string;
};
const columnNames:ColumnNames = {
  hospital: "Hospital",
  patient: "Patient",
  referralNo: "Pre-Auth/Referral No.",
  visitNo: "Visit No.",
  billNo: "Bill No.", 
  billDateTime: "Bill Date/Time", 
  claimNo: "Claim No", 
  billAmount: "Bill Amount", 
  companyAmount: "Company Amount", 
  balanceAmount: "Balance Amount", 
  receivedAmount: "Received Amount", 
  concession: "Concession ",
  tdsAmount: "TDS Amount", 
  processingFees: "Processing Fees", 
  disalAmount: "Disallowed Amount", 
  disalRemark: "Disallowed Remark", 
  totalAmount: "Total Amount", 
};

export const hospitalBillEntries = [
  {
    id: "1",
    hospital: "City Care Hospital",
    patient: "Ravi Kumar",
    referralNo: "PA123456",
    visitNo: "V5678",
    billNo: "BILL1023",
    billDateTime: "2025-05-27 14:30",
    claimNo: "CLM9087",
    billAmount: 15000,
    companyAmount: 12000,
    balanceAmount: 3000,
    receivedAmount: 10000,
    concession: 5,
    tdsAmount: 500,
    processingFees: 200,
    disalAmount: 300,
    disalRemark: "Room rent excess",
    totalAmount: 15300,
  },
  {
    id: "2",
    hospital: "Metro Specialty Clinic",
    patient: "Anita Sharma",
    referralNo: "PA789123",
    visitNo: "V1122",
    billNo: "BILL1045",
    billDateTime: "2025-05-26 10:00",
    claimNo: "CLM9021",
    billAmount: 20000,
    companyAmount: 15000,
    balanceAmount: 5000,
    receivedAmount: 14000,
    
    concession: 10,
    tdsAmount: 700,
    processingFees: 300,
    disalAmount: 500,
    disalRemark: "Lab test not covered",
    totalAmount: 20500,
  }
];

const columns: ColumnDef<HospitalBillEntry>[] = [
  {
    accessorKey: "hospital",
    header: ({ table, column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Hospital
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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
        <span className="hover:text-primary ">
          {row.original.hospital}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "patient",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Patient
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <Avatar className="h-4 w-4 ">
            <AvatarFallback className="text-white font-normal text-[10px]">
              {patient?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="group-hover:text-primary">{patient}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "referralNo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row justify-end" // Ensure justify-end for right alignment of header text
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pre-Auth/Referral No.
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-right w-full block pl-3 h-10 py-3">
          {row.original.referralNo}
        </span>
      );
    },
  },
  {
    accessorKey: "visitNo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Visit No.
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.visitNo}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "billNo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bill No.
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const billNo = row.original.billNo;
      return <span>{billNo}</span>;
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "billDateTime",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Bill Date/Time
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.billDateTime}</span>;
    },
    enableSorting: true, // Sorting may not be ideal for combined date/time strings without custom sorter
  },
  {
    accessorKey: "claimNo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Claim No.
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const claimNo = row.original.claimNo;
      return <span>{claimNo}</span>;
    },
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "billAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bill Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.billAmount}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "companyAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.companyAmount}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "balanceAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Balance Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.balanceAmount}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "receivedAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Received Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.receivedAmount}
      </span>
    ),
    enableSorting: true,
  },
 
  {
    accessorKey: "concession",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Concession(%)
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.concession}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tdsAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        TDS Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.tdsAmount}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "processingFees",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Processing Fees
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.processingFees}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "disalAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Disall. Amount
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.disalAmount}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "disalRemark",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Disall. Remark
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.disalRemark}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          className="hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none w-full flex justify-between items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-right flex-1 pr-2">Total Amount</span>
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-2 h-10 py-3 border-l border-[#D9D9E0]">
        {formatCurrency(row.original.totalAmount, "INR")}
      </span>
    ),
    enableSorting: true,
  },
];
export { columnNames, columns };
