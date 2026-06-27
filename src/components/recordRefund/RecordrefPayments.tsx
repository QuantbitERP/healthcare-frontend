import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Buttons from "../buttons/Button";
import { Button } from "@/components/ui/button";
import { DataTable } from "../EditableCellsTable/TableTry";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, ArrowUp } from "lucide-react";
import Tags from "@/components/statusTags/Tags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { RecordRefundDto, RefundsDto } from "@/services/api-client/models/RefundsDto";
import { LabelValue } from "@/store/slices/RefundFilterSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface RecordRefundProps {
  setOpen: Dispatch<SetStateAction<boolean>>
  setSaveRecord: (value: boolean) => void;
  refund: RefundsDto,
  setrefund: React.Dispatch<RefundsDto>
}
const RecordRefund: React.FC<RecordRefundProps> = ({ setOpen, setSaveRecord, refund, setrefund }) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<RecordRefundDto[]>(refund?.recordRefunds || []);


  const paymentModes = useSelector((state: RootState) => state.refundFilter.Paymodes);

  useEffect(() => {
    if (JSON.stringify(refund.recordRefunds) !== JSON.stringify(data)) {
      setrefund({ ...refund, recordRefunds: data });
    }
  }, [data, refund, setrefund]);
  const columns: ColumnDef<RecordRefundDto>[] = [
    {
      accessorKey: "paidAmount",
      header: ({ column }) => (
        <div className="flex flex-row items-center space-x-2 pr-3 w-fit">
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
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Paid Amount
            {column.getIsSorted() &&
              (column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </div>
      ),
      cell: ({ row, getValue }) => {
        const value = getValue() as string;
        const numericValue = parseFloat(value);

        if (!numericValue || isNaN(numericValue) || numericValue <= 0) {
          return null;
        }

        return (
          <div className="flex flex-row items-center">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </div>
            <span
              className={`text-right w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""
                }`}
            >
              ₹{numericValue}
            </span>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: "basic",
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Date
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-center w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""
            }`}
        >
          {getValue() as string}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>(row.original.paymentMode);

        const handlePaymentModeChange = (value: string) => {
          setSelectedPaymentMode(value);
          setData((prevData) =>
            prevData.map((item, idx) =>
              idx === row.index ? { ...item, paymentMode: value } : item
            )
          );
        };

        return (
          <Select
            value={selectedPaymentMode}
            onValueChange={handlePaymentModeChange}
          >
            <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
              <Tags
                variant="tag"
                tagText={
                  paymentModes.find((x: LabelValue) => x.value == selectedPaymentMode)?.label
                }
                type="pink"
              />
            </SelectTrigger>
            <SelectContent className="w-fit py-2 px-0 rounded-lg [&>div]:!px-0 [&>div]:!py-2 border border-[#D9D9E0]">
              {Array.isArray(paymentModes) &&
                paymentModes.map((mode) => (
                  <SelectItem
                    key={mode.value}
                    value={mode.value ?? " "}
                    className="text-sm font-normal text-[#1C2024] data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:text-[#0D74CE] rounded-none"
                  >
                    {mode.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "transactionNo",
      header: ({ column }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold w-[104px]"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                <span className="block truncate w-full">
                  Transaction No/Cheque/Card
                </span>
                {column.getIsSorted() &&
                  (column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
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
          className={`text-center w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""
            }`}
        >
          {getValue() as string}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "bank",
      header: ({ column }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold w-[85px]"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                <span className="block truncate w-full">
                  Bank Name/Branch Name
                </span>
                {column.getIsSorted() &&
                  (column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
              <p>Bank Name/Branch Name</p>
              <TooltipArrow className="fill-[#0090FF]" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      cell: ({ row }) => (
        <span
          className={`text-center w-full block ${row.original.tagText === "Cancelled" ? "line-through" : ""
            }`}
        >
          {row.original.bankName}
        </span>
      ),
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] justify-between flex flex-row">
        <div className="flex flex-row gap-2 items-center">
          <Image src={"assets/icons/CurrencyIcon.svg"} width={24} height={24} alt="Rupee" />
          <p className="text-[#1C2024] text-base font-semibold">Record a Refund</p>
        </div>
        <Buttons
          iconSrc={"assets/icons/ThreeDots.svg"}
          size="button-icon-small"
          type="secondary-button"
          variant="icon"
        />
      </div>

      <div className="w-full px-6">
        <DataTable
          initialData={[]}
          // getRowClassName={getRowClassName}
          columns={columns}
          addButton={true}
          table={table}
          dataProps={{ data, setData }}
        />
      </div>

      <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
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
          onClick={() => {
            setOpen(false);
            setSaveRecord(true);
          }}
        >
          Save Changes
        </Buttons>
      </div>
    </div>
  );
};

export default RecordRefund;
