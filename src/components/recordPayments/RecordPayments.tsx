import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Buttons from "../buttons/Button";
import { Button } from "@/components/ui/button";
import { DataTable } from "../EditableCellsTable/TableTry";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "../ui/input";
import { ArrowDown, ArrowUp } from "lucide-react";
import Tags from "@/components/statusTags/Tags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { format, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { RootState } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { GetBillReceiptPaymentDetails } from "@/services/api-client/models/GetBillReceiptPaymentDetails";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import { OpdBillService } from "@/services/api-client";

interface RecordPaymentsProps {
  setOpen: (value: boolean) => void;
}

type PaymentModeType = "Cheque" | "Debit Card / POS" | "PNB";
type TagType =
  | "success"
  | "primary"
  | "secondary"
  | "pink"
  | "danger"
  | "warning"
  | "info"
  | "teal"
  | "cyan"
  | "indigo";

type RowType = GetBillReceiptPaymentDetails & { id: any };

function RecordPayments({ setOpen }: RecordPaymentsProps) {
  const { patientRecordPayment, setPatientRecordPayment } = useGlobalTables();
  const [showNotification, setShowNotification] = useState(true);
  const { paymentModes } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );

  const initialData = [];

  type RequisitionDateTimeCellProps = {
    getValue: () => string;
    onChange: (newDate: Date) => void;
  };

  const RequisitionDateTimeCell = ({
    getValue,
    onChange,
  }: RequisitionDateTimeCellProps) => {
    const rawDate = getValue();
    const [date, setDate] = useState<Date | null>(
      rawDate ? new Date(rawDate) : null
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (rawDate) {
        setDate(new Date(rawDate));
      }
    }, [rawDate]);

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
                selected={date ?? undefined}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    onChange(newDate); // Notify parent (table row data)
                    setOpen(false);
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

  const PaymentModeCell = ({
    row,
  }: {
    row: { original: GetBillReceiptPaymentDetails };
  }) => {
    const [selectedPaymentMode, setSelectedPaymentMode] =
      useState<PaymentModeType>(
        (row.original.modeOfPayment as PaymentModeType) || ""
      );

    const handlePaymentModeChange = (value: PaymentModeType) => {
      setSelectedPaymentMode(value);
      row.original.modeOfPayment = value;

      const selectedMode = paymentModes?.data?.items?.find(
        (mode) => mode.value === value
      );
      if (selectedMode) {
        row.original.modeOfPaymentId = selectedMode.key;
      }
    };
    console.log("value", paymentModes);
    return (
      <Select
        value={selectedPaymentMode || "SELECT"}
        onValueChange={handlePaymentModeChange}
      >
        <SelectTrigger className="w-fit border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
          <Tags
            variant="tag"
            tagText={
              selectedPaymentMode && selectedPaymentMode.trim() !== ""
                ? selectedPaymentMode
                : "Select a value"
            }
            type={(() => {
              const categoryTypeMap: Record<PaymentModeType, TagType> = {
                Cheque: "success",
                "Debit Card / POS": "pink",
                PNB: "warning",
              };
              return (
                categoryTypeMap[selectedPaymentMode as PaymentModeType] ||
                "pink"
              );
            })()}
          />
        </SelectTrigger>
        <SelectContent className="m-0 px-0 py-2 border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-2">
          {paymentModes?.data?.items?.map((mode, index) => (
            <SelectItem
              key={`${mode.value}-${index}`}
              value={mode.value ?? ""}
              className="text-sm font-normal text-[#1C2024] data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:text-[#0D74CE] rounded-none"
            >
              {mode.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const columns: ColumnDef<RowType>[] = [
    {
      accessorFn: (row) => row.amount,
      id: "amount",
      header: ({ column }) => (
        <div className="flex sticky h-10 left-0 z-30 flex-row items-center space-x-2  border-r border-[#D9D9E0] pr-3 w-fit">
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
      cell: ({ row }) => {
        let numericValue = row.original.amount;

        // Convert string numbers to actual numbers (if necessary)
        if (typeof numericValue === "string") {
          numericValue = parseFloat(numericValue);
        }

        // Ensure it's a valid number greater than 0
        if (!numericValue || isNaN(numericValue) || numericValue <= 0) {
          return null; // Don't display anything if invalid
        }

        return (
          <div className="flex flex- h-10 sticky left-0 z-20 items-center pr-2 border-r border-[#D9D9E0]">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </div>
            <span className="text-right w-full block">
              ₹{numericValue.toLocaleString()}
            </span>
          </div>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorFn: (row) => row.receiptDate,
      id: "receiptDate",
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
        <RequisitionDateTimeCell
          getValue={() => String(getValue())}
          onChange={(newDate) => {
            // Update your main table data
            setData((prev) =>
              prev.map((item) =>
                item.id === row.original.id
                  ? { ...item, receiptDate: newDate.toISOString() }
                  : item
              )
            );
          }}
        />
      ),
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.modeOfPayment,
      id: "modeOfPayment",
      header: "Payment Mode",
      cell: ({ row }) => <PaymentModeCell row={row} />,
    },
    {
      accessorFn: (row) => row.transactionnumber,
      id: "transactionnumber",
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
              <TooltipArrow className="fill-[#0090FF] " />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      cell: ({ row }) => (
        <span className="text-center w-full block">
          {row.original.transactionnumber}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.bankname,
      id: "bankname",
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
                <span className="block truncate w-full">Bank Name</span>
                {column.getIsSorted() &&
                  (column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white text-sm font-medium bg-[#0090FF] ">
              <p>Bank Name</p>
              <TooltipArrow className="fill-[#0090FF] " />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      cell: ({ row }) => <span>{row.original.bankname}</span>,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.branchname,
      id: "branchname",
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
                <span className="block truncate w-full">Branch Name</span>
                {column.getIsSorted() &&
                  (column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white text-sm font-medium bg-[#0090FF] ">
              <p>Branch Name</p>
              <TooltipArrow className="fill-[#0090FF] " />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      cell: ({ row }) => <span>{row.original.branchname}</span>,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.approvalNumber,
      id: "approvalNumber",
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
                <span className="block truncate w-full">Approval No</span>
                {column.getIsSorted() &&
                  (column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
              <p>Approval No</p>
              <TooltipArrow className="fill-[#0090FF] " />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      cell: ({ row }) => <span>{row.original.approvalNumber}</span>,
      enableSorting: true,
    },
  ];
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(
    (patientRecordPayment ?? []).map((item) => ({
      ...item,
      id: item.id,
    }))
  );

  const {
    paidBy,
    setPaidBy,
    paidByName,
    setPaidByName,
    sponsoredbyName,
    setSponsoredbyName,
    setRemainingPaybleAmount,
    pendingPaybleAmount,
  } = useGlobalTables();

  // Calculate total paid amount from the data
  const totalPaidAmount = data.reduce((total, item) => {
    const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
    return total + (amount || 0);
  }, 0);

  // Calculate pending payable amount
  const calculatedPendingAmount = Math.max(0, pendingPaybleAmount - totalPaidAmount);


  useEffect(() => {
    setRemainingPaybleAmount(pendingPaybleAmount - totalPaidAmount);
  }, [pendingPaybleAmount, totalPaidAmount, setRemainingPaybleAmount]);

  const [paidByOptions, setPaidByOptions] = useState<
    { key: string; value: string }[]
  >([]);
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });
  useEffect(() => {
    OpdBillService.getApiVOpdBillOpdbillsPatientPaidby("1", "")
      .then((res) => {
        setPaidByOptions(
          res.data?.items?.map((item) => ({
            key: item.key ?? "",
            value: item.value ?? "",
          })) ?? []
        );
      })
      .catch((err) => {
        console.error("Failed to fetch paid by options", err);
      });
  }, []);

  // Update data when patientRecordPayment changes
  useEffect(() => {
    setData(
      (patientRecordPayment ?? []).map((item) => ({
        ...item,
        id: item.id,
      }))
    );
  }, [patientRecordPayment]);

  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image
          src={"assets/icons/CurrencyIcon.svg"}
          width={24}
          height={24}
          alt="Rupee"
        />
        <p className="text-[#1C2024] text-base font-semibold">
          Record Payments
        </p>
      </div>
      {showNotification && (
        <div className="w-[592px] h-12 rounded-lg mx-auto px-2 py-3 bg-[#F9F9FB] flex flex-row border border-[#B9BBC6]">
          <Image
            src={"assets/icons/CashRegister.svg"}
            width={24}
            height={24}
            alt="Cash"
          />
          <div className="w-full flex flex-row items-center justify-between text-[#1C2024] text-sm">
            <div className="flex flex-row  gap-2 px-2">
              <span className="font-medium">Tip!</span>
              <span className="W-[474px] font-normal">
                Capture payment via POS Machine.
              </span>
            </div>
            <div className="px-2">Record Payment</div>
          </div>
          <Image
            src={"assets/icons/Cross.svg"}
            width={16}
            height={16}
            alt="Close"
            className="mr-2 ml-auto cursor-pointer"
            onClick={() => setShowNotification(false)}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 px-6 w-full">
        {/* First Row: Paid by, Payer's Name, Sponsored By */}
        <div className="flex flex-row gap-4 w-full">
          {/* Paid by Dropdown */}
          <div className="flex flex-col w-1/3">
            <label className="block font-normal text-sm mb-1 text-[#1C2024]">
              Paid by
            </label>
            <Select
              value={paidBy?.value ?? paidByOptions[0]?.value ?? ""}
              onValueChange={(selectedValue) => {
                const selectedOption =
                  paidByOptions.find((item) => item.value === selectedValue) ||
                  null;
                setPaidBy(selectedOption);
              }}
            >
              <SelectTrigger className="w-full border border-[#D9D9E0] rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Select payer" />
                <Image src={"assets/icons/CaretDownFilled.svg"} width={16} height={16} alt="Caret" />
              </SelectTrigger>
              <SelectContent className="border border-[#D9D9E0]">
                {paidByOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm cursor-pointer"
                  >
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payer's Name (if Other) */}
          {paidBy?.value === "Other" && (
            <div className="flex flex-col w-1/3">
              <label className="block font-normal text-sm mb-1 text-[#1C2024]">
                Name of Person
              </label>
              <Input
                value={paidByName}
                onChange={(e) => setPaidByName(e.target.value)}
                placeholder="Enter payer's name"
              />
            </div>
          )}

          {/* Sponsored By (Payee) */}
          <div className="flex flex-col w-1/3">
            <label className="block font-normal text-sm mb-1 text-[#1C2024]">
              Sponsored By (Payee)
            </label>
            <Input
              value={sponsoredbyName}
              onChange={(e) => setSponsoredbyName(e.target.value)}
              placeholder="Enter payee name"
            />
          </div>
        </div>

        {/* Second Row: Pending Payable Amount */}
        <div className="flex flex-col w-1/3">
          <label className="block font-normal text-sm mb-1 text-[#1C2024]">
            Pending Payable Amount
          </label>
          <div className="w-full border border-[#D9D9E0] rounded-md px-3 py-2 text-sm bg-[#F9F9FB] text-[#60646C] h-10 flex items-center">
            ₹{calculatedPendingAmount?.toLocaleString() || "0"}
          </div>
        </div>
      </div>

      <div className="w-full px-6">
        <DataTable<RowType>
          initialData={initialData}
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
            setPatientRecordPayment(data);
            setOpen(false);
          }}
        >
          Done
        </Buttons>
      </div>
    </div>
  );
}

export default RecordPayments;
