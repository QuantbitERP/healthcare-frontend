"use client";

import React, {useState } from "react";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tags from "@/components/statusTags/Tags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { format, isValid } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import Alerts from "../alerts/Alerts";
import Payments from "@/assets/icons/Payments.svg";
import { DataTable } from "../EditableCellsTable/TableTry";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { KVPair } from "@/services/api-client/models/KVPair"; 
import { GetBillReceiptPaymentDetails } from "@/services/api-client/models/GetBillReceiptPaymentDetails";

type RowType = GetBillReceiptPaymentDetails & { id: any; tagText?: string };
const RequisitionDateTimeCell = ({ getValue}:{ getValue: () => string }) => {
  const [date, setDate] = useState(
    getValue() ? new Date(getValue()) : new Date()
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center w-full h-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "w-full justify-start text-left font-normal hover:bg-transparent p-0 h-10",
              !date && "text-muted-foreground"
            )}
          >
            {date && isValid(date) ? (
              <span className="text-[#1C2024] text-sm font-normal w-full">
                {format(date, "dd/MM/yy")}
              </span>
            ) : (
              <span className="text-[#1C2024] text-sm font-normal w-full">
                Pick Date 
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[275px] p-0" align="center">
          <div className="flex flex-col">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  const newDateTime = new Date(newDate);
                  if (date) {
                      setDate(newDateTime);
                  }
                
                }
              }}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

type PaymentModeType = "Cheque" | "Debit Card / POS" | "PNB";
type TagType = "pink" | "cyan" | "secondary" | "primary" | "danger" | "warning" | "success" | "info" | "teal" | undefined;

const PaymentModeSelect = ({ row }: { row: { original: GetBillReceiptPaymentDetails } }) => {
  const { paymentModes } = useSelector((state: RootState) => state.opdFiltersOptions);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>(
    row.original.modeOfPayment as PaymentModeType
  );

  const handlePaymentModeChange = (value: string) => {
    setSelectedPaymentMode(value);
    row.original.modeOfPayment = value;
  };

  return (
    <Select
      value={selectedPaymentMode}
      onValueChange={handlePaymentModeChange}
    >
      <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
        <Tags
          variant="tag"
          tagText={selectedPaymentMode}
          type={(() => {
            const categoryTypeMap: Record<string, TagType> = {
              "Cheque": "success",
              "Debit Card / POS": "pink",
              "PNB": "warning",
            };
            return categoryTypeMap[selectedPaymentMode] || "pink";
          })()}
        />
      </SelectTrigger>
      <SelectContent className="w-fit py-2 px-0 rounded-lg [&>div]:!px-0 [&>div]:!py-2 border border-[#D9D9E0]">
        {paymentModes?.data?.items?.map((mode: KVPair) => (
          <SelectItem
            key={mode.key ?? mode.value ?? ""}
            value={mode.value ?? ""}
            className="text-sm font-normal text-[#1C2024] data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:text-[#0D74CE] rounded-none"
          >
            {mode.value ?? ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const getColumns = (): 
ColumnDef<RowType>[] => [
  {
    accessorFn: row => row.amount,
    id: "paidAmount",
    header: ({ column }) => (
      <div className="flex flex-row items-center w-fit">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid Amount
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="flex flex-row items-center">
        <span
          className={`text-right w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          ₹{String(getValue())}
        </span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorFn: row => row.receiptDate,
    id: "paymentDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment Date
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : null}
      </Button>
    ),
    cell: ({ getValue }) => (
      // <span
      //   className={`text-center w-full block ${
      //     row?.original?.tagText === "Cancelled" ? "line-through" : ""
      //   }`}
      // >
      //   {String(getValue())}
      // </span>
      <RequisitionDateTimeCell getValue={getValue as () => string}/>
    ),
    enableSorting: true,
  },
  {
    accessorFn: row => row.modeOfPayment,
    id: "paymentMode",
    header: "Payment Mode",
    cell: ({ row }) => <PaymentModeSelect row={row} />,
  },
  {
    accessorFn: row => row.transactionnumber,
    id: "transactionNo",
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
                Transaction No/Cheque/Card
              </span>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
            <p>Transaction No/Cheque/Card</p>
            <TooltipArrow className="fill-[#0090FF]" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={`text-center w-full block ${
          row?.original?.tagText === "Cancelled" ? "line-through" : ""
        }`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorFn: row => row.bankname,
    id: "bank",
    header: ({ column }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold w-[85px]"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="block truncate w-full">
                Bank Name/Branch Name
              </span>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
            <p>Bank Name/Branch Name</p>
            <TooltipArrow className="fill-[#0090FF]" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    cell: ({ row, getValue }) => (
      <span
        className={`text-center w-full block ${
          row?.original?.tagText === "Cancelled" ? "line-through" : ""
        }`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
  },
];
export default function RecordPayments({selectedPatientBillReceipts}:{selectedPatientBillReceipts: GetBillReceiptPaymentDetails[] | null | undefined;}) {
  const [showNotification] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(
    (selectedPatientBillReceipts ?? []).map((item) => ({
      ...item,
      id: item.id , 
    }))
  );

  const table = useReactTable({
    data,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="w-full h-full rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image src={Payments.src} width={24} height={24} alt="Rupee" />
        <p className="text-[#1C2024] text-base font-semibold">
          Payment Received
        </p>
      </div>
      <div className="px-6">
        <Alerts
          buttonText="Record Payment"
          content="Pending payments need to be recorded."
          open={showNotification}
        />
      </div>
      <div className="px-6 pb-6">
        <DataTable<RowType>
          table={table}
          columns={getColumns()}
          initialData={(selectedPatientBillReceipts ?? []).map((item) => ({
            ...item,
            id: item.id , 
          }))}
          addButton={false}
          dataProps={{ data, setData }}
        />
      </div>
    </div>
  );
}
