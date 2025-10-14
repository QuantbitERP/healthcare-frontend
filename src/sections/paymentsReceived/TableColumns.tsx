"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
// import { useDispatch } from "react-redux";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrencySymbol } from "@/utils/CurrencyUtils";
import SortableHeaderButton from "@/components/table-util-buttons/SortableHeaderButton";
import { Payment } from "@/store/payments_received/types";
// import { fetchCompanies } from "@/store/slices/paymentCompaniesSlice";

import {
  Tooltip,
  // TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { AppDispatch } from "@/store";



export const Columns = (): ColumnDef<Payment>[] => {
  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>();
  const [sortedColumn, setSortedColumn] = useState<keyof Payment>("modified_on");
  const handleSetSortedColumn = (columnId: string) => {
    setSortedColumn(columnId as keyof Payment);
  };
  // const { data: companies, loading: companiesLoading } = useSelector(
  //   (state: RootState) => state.paymentMetaData
  // );
  // useEffect(() => {
  //   dispatch(fetchCompanies());
  // },[dispatch])

  return [
    {
      accessorKey: "ID",
      header: ({  column }) => (
        <div className="flex items-center text-[#60646C] gap-2 justify-start mr-24 border-r border-[#D9D9E0] w-full h-10">
          <SortableHeaderButton
            column={column}
            label="Receipt No."
            sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn}}
            className=""
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 border-r h-10 border-[#D9D9E0] w-full">
          <span className="hover:text-primary" onClick={() =>
              router.push(`/payments_received/${row.original.id}/`)
            }>
            {row.original.id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "Company Name",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Patient/Company"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-nowrap">
            <span className="group-hover:text-primary">{row.original.company_name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "UHID",
      header: () => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate w-[106px] cursor-pointer">
                UHID
              </span>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "Payment Mode",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Payment Mode"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
    },
    {
      accessorKey: "visit_type",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Visit Type"
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Date/Time Received"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({row}) => {
        const date = row.original.payment_date ? row.original.payment_date : "";
        return(
          <div>
            {date ? format(date, "dd/MM/yyyy") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "Amount Received",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={`Receipt Amount (${getCurrencySymbol("INR")})`}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <span>{row.original.amount_received}</span>
        </div>
      ),
    },
    {
      accessorKey: "Discount Amount",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={`Distributed Amount (${getCurrencySymbol("INR")})`}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <span>{row.original.discount_amount}</span>
        </div>
      ),
    },
    {
      accessorKey: "Excess Amount",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={`Amount in Excess (${getCurrencySymbol("INR")})`}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <span>{row.original.excess_amount}</span>
        </div>
      ),
    },
    {
      accessorKey: "Balance Deposit",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={`Balance Deposit (${getCurrencySymbol("INR")})`}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <span>{row.original.balance_amount}</span>
        </div>
      ),
    },
    {
      accessorKey: "collected_from_name",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Collected From"
          className="justify-start w-full"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.collected_from_name;
        return (
          <div className="flex items-center justify-start gap-1">
            <span className="text-nowrap">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Modified On",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Modified On"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
    },
    {
      accessorKey: "Modified On",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Modified By"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const name = row.original.modified_by;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            {/* {name && name.length > 1 && (
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-white font-normal text-[10px]">
                  {name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )} */}
            <span className="group-hover:text-primary">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Created On",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Created On"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
    },
    {
      accessorKey: "Created By",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label="Created By"
          sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const name = row.original.created_by;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            {/* <Avatar className="h-4 w-4">
              <AvatarFallback className="text-white font-normal text-[10px]">
                {name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar> */}
            <span className="group-hover:text-primary">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <div className="h-10 border-l border-[#D9D9E0] pl-3">
          <SortableHeaderButton
            column={column}
            label={`Total Amount (${getCurrencySymbol("INR")})`}
            className="justify-end w-full"
            sortedProps={{ sortedColumn, setSortedColumn:handleSetSortedColumn }}
          />
        </div>
      ),
      cell: ({ row }) => {
        const parseAmount = (value: string | undefined): number => {
          return Number((value ?? "0").replace(/[^0-9.-]+/g, ""));
        };
        
        const total = parseAmount(row.original.receivedamount) + parseAmount(row.original.discount_amount);
        
        return (
          <div className="flex items-center justify-end gap-0 border-l border-[#D9D9E0] h-10">
            <span>{total.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
          </div>
        );
      },
    },
  ] as ColumnDef<Payment>[];
};
