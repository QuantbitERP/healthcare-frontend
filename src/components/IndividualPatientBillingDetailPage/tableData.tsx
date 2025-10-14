import { RootState } from "@/store";
import { useEffect, useState } from "react";
import Check from "@/components/checkbox/CheckboxComponent";
import { Button } from "@/components/ui/button";
import FullBodyCheckup from "@/components/fullBodyCheckup/Card";
import BillDetailsCard from "./billDetailsCard";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tags from "@/components/statusTags/Tags";
import Avatar from "react-avatar";

import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { useCancel } from "./context/Context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { fetchServiceRate } from "@/store/opd_bills/thunks";
import { Skeleton } from "@/components/ui/skeleton";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    noneditable?: boolean;
  }
}

// Interface for each row in the refundData
export interface RefundDataItem {
  id: string;
  billNo: string;
  amount: number;
  dateTime: string;
  totalamt: number;
  tagText?: string; // if you want to support Cancelled refunds in future
}
interface CancelableAmountCellProps<TData extends { tagText?: string }> {
  getValue: () => string;
  row: Row<TData>;
}

interface CancelableCellProps<TData> {
  getValue: () => string;
  row: Row<TData>;
  children: (args: {
    cancelClicked: boolean;
    getValue: () => string;
    row: Row<TData>;
  }) => ReactNode;
}

const columnNames = {
  serviceName: "Service",
  hospitaldoctorid: "Doctor",
  rate: "Rate",
  quantity: "Quantity",
  billRequisiionDetailId: " Requisition No",
  requisitionDateTime: "Requisition Date/Time",
  "Is Emergency": "Is Emergency",
  concessionPercent: "Concession (%)",
  concessionAmount: "Concession Amt.",
  apportionConcession: "Custom Concession",
  mouDiscountAmount: "Mou Discount",
  transDiscount: "Trans. Discount",
  totalServiceDiscount: "Total Service Discount",
  totalamt: "Total Amount",
  includeInPackage: "Include In Package",
  outOfPackage: "Out Of Package",
  editableServiceName: "Editable Service Name",
  cancelRemark: "Cancel Remark",
  concessionRemark: "Concession Remark",
};
const columnNamesBills = {
  billNumber: "Bill # / Deposit",
  amount: "Amount",
  dateTime: "Date/Time",
  totalamt: "Total Amount",
};
const refundData: RefundDataItem[] = [
  {
    id: "1",
    billNo: "#BI10011006",
    amount: 1770,
    dateTime: "15-May-2025 10:15 AM",
    totalamt: 1770,
  },
  {
    id: "2",
    billNo: "#DP10011789",
    amount: 5000,
    dateTime: "15-May-2025 10:30 AM",
    totalamt: 5000,
  },
];

function CancelableCell<TData>({
  getValue,
  children,
  row,
}: CancelableCellProps<TData>) {
  const { cancelClicked } = useCancel();

  return <>{children({ cancelClicked, getValue, row })}</>;
}

export default CancelableCell;

// BillNoCell Component (already a valid React component)
const BillNoCell = ({ getValue }: { getValue: () => string }) => {
  const [openService, setOpenService] = useState(false);
  const selectedService = getValue();

  return (
    <Dialog open={openService} onOpenChange={setOpenService}>
      <div className="flex flex-row items-center justify-between pr-3 h-10">
        <div className="flex flex-row items-center">
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <span className="mr-2">{selectedService}</span>
            </div>
          </DialogTrigger>
        </div>
        {/* This logic might need to be dynamic based on row data if more complex */}
        {getValue() === "#BI10011006" ? (
          <Tags tagText="Cancelled" type="danger" variant="tag" />
        ) : (
          <Tags tagText="Deposit" type="secondary" variant="tag" />
        )}
      </div>
      <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden">
        {openService && (
          <BillDetailsCard
            onClose={() => setOpenService(false)}
            // billDetails="BI10011006" // This billDetails is static, may need to be dynamic
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// CancelableAmountCell - an example of using CancelableCell
function CancelableAmountCell<TData extends { tagText?: string }>({
  getValue,
  row,
}: CancelableAmountCellProps<TData>) {
  return (
    <CancelableCell getValue={getValue} row={row}>
      {({
        cancelClicked,
        getValue: cellGetValue,
        row: cellRow,
      }: {
        cancelClicked: boolean;
        getValue: () => unknown;
        row: Row<TData>;
      }) => {
        let value = cellGetValue();

        if (typeof value === "string") {
          value = parseFloat(value);
        }

        if (typeof value !== "number" || isNaN(value) || value <= 0) {
          return <span className="text-right w-full block"></span>;
        }
        const isStruckThrough =
          cellRow.original?.tagText === "Cancelled" && !cancelClicked;

        return (
          <span
            className={`text-right w-full block ${
              isStruckThrough ? "line-through" : ""
            }`}
          >
            ₹{value}
          </span>
        );
      }}
    </CancelableCell>
  );
}

const refundColumn: ColumnDef<RefundDataItem>[] = [
  {
    accessorKey: "billNo",
    header: () => (
      <div className="flex flex-row items-center w-full h-10">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Bill # / Deposit
        </Button>
      </div>
    ),
    cell: ({ getValue }: CellContext<RefundDataItem, unknown>) => (
      <BillNoCell getValue={getValue as () => string} />
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row justify-end"
      >
        Amount
      </Button>
    ),
    // Pass row for CancelableAmountCell if its line-through logic depends on row.original.tagText
    cell: ({ row, getValue }: CellContext<RefundDataItem, unknown>) => (
      <CancelableAmountCell<RefundDataItem>
        getValue={getValue as () => string}
        row={row}
      />
    ),
    sortingFn: "basic",
  },
  {
    accessorKey: "dateTime",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold flex-row justify-center text-start block w-full"
      >
        Date/Time
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="text-start w-full block">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "totalamt",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none text-right block w-full"
      >
        Total Amount
      </Button>
    ),
    // Pass row for CancelableAmountCell
    cell: ({ getValue, row }: CellContext<RefundDataItem, unknown>) => (
      <CancelableAmountCell<RefundDataItem>
        getValue={getValue as () => string}
        row={row}
      />
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
];

const DoctorCell = ({
  getValue,
  serviceId,
  onDoctorSelect,
}: {
  getValue: () => string;
  serviceId?: string;
  onDoctorSelect?: (doctorId: string) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { referredDoctors, loading } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );
  const [selectedDoctor, setSelectedDoctor] = useState(getValue());

  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value);
    onDoctorSelect?.(value); 
  };

  const doctorOptions =
    referredDoctors?.data?.items?.map((doc) => ({
      label: doc.value,
      value: doc.key,
    })) || [];

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(
        fetchServiceRate({
          version: "1",
          tenant: "",
          requestBody: {
            hospitalDoctorId: null,
            companyId: "ab3c3680-9a69-4785-8fe7-4bbbbc1848bc",
            serviceId: serviceId,
            hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
            patientId: "7740fb19-a64a-4cc4-862c-be40665d0f4b",
          },
        })
      );
    }
  }, [selectedDoctor, dispatch, getValue, serviceId]);

  const selectedOption = doctorOptions.find(
    (doc) => doc.value === selectedDoctor
  );
  if (loading) {
    return <Skeleton className="w-full h-6" />;
  }
  return (
    <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
      <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0 shadow-none">
        <SelectValue placeholder="Select a Doctor">
          {selectedOption ? (
            <div className="flex flex-row items-center gap-1 pl-0">
              <Avatar
                name={
                  (
                    selectedOption.label?.split(" ")[1] ||
                    selectedOption.label?.split(" ")[0]
                  )?.charAt(0) || ""
                }
                size="24"
                round
                textSizeRatio={2}
              />
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            "Select a Doctor"
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="m-0 [&>div]:!px-0 [&>div]:!py-2 border-[#D9D9E0]">
        {doctorOptions.map((option, index) => (
          <SelectItem
            key={index}
            value={option.value ?? ""}
            className="data-[highlighted]:bg-[#E6F4FE] rounded-none"
          >
            <div className="flex flex-row items-center gap-1">
              <Avatar
                name={
                  (
                    option.label?.split(" ")[1] || option.label?.split(" ")[0]
                  )?.charAt(0) || ""
                }
                size="24"
                round
                textSizeRatio={2}
              />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// RequisitionDateTimeCell (already a valid React component that uses useCancel)
const RequisitionDateTimeCell = ({
  getValue,
  row,
}: {
  row: Row<RowType>;
  getValue: () => string;
}) => {
  const { cancelClicked } = useCancel();
  const [date, setDate] = useState(
    getValue() ? new Date(getValue()) : new Date()
  );
  const [open, setOpen] = useState(false);

  const isCancelled = row?.original?.tagText === "Cancelled";
  const isStruckThrough = isCancelled && !cancelClicked;

  return (
    <div className="flex items-center justify-center w-full h-10">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "w-full justify-start text-left font-normal hover:bg-transparent p-0 h-10",
              isStruckThrough ? "line-through" : "",
              !date && "text-muted-foreground"
            )}
          >
            {date ? (
              <span className="text-[#1C2024] text-sm font-normal w-full">
                {format(date, "dd/MM/yy hh:mm a")}
              </span>
            ) : (
              <span className="text-[#1C2024] text-sm font-normal w-full">
                Pick Date and Time
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
                    newDateTime.setHours(date.getHours());
                    newDateTime.setMinutes(date.getMinutes());
                  }
                  setDate(newDateTime);
                }
              }}
              initialFocus
            />
            <div className="border-t border-[#D9D9E0]">
              <TimePicker value={date} onChange={setDate} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ServiceCell = ({
  row,
  getValue,
}: {
  row: Row<RowType>;
  getValue: () => string;
}) => {
  const [openFBC, setOpenFBC] = useState(false);
  const { cancelClicked } = useCancel();
  const isItemCancelled = row?.original?.tagText === "Cancelled"; // Check if the item itself is marked as cancelled
  const selectedService = getValue();

  const displayLineThrough = isItemCancelled && !cancelClicked;

  const selectedTag = (() => {
    if (isItemCancelled && !cancelClicked) {
      return { tagText: "Cancelled", type: "danger", variant: "tag" };
    } else if (isItemCancelled && cancelClicked) {
      // If item is Cancelled and we are in cancel mode, still show Cancelled tag
      return { tagText: "Cancelled", type: "danger", variant: "tag" };
    }
    switch (selectedService) {
      case "General Consultation":
        return { tagText: "Follow Up", type: "primary", variant: "tag" };
      case "Full Body Checkup":
        return { tagText: "Package", type: "warning", variant: "tag" };
      case "Blood Test":
        return { tagText: "Follow Up", type: "primary", variant: "tag" };
      case "Sleep Test":
      case "Physiotherapy Session":
        return { tagText: "Follow Up", type: "primary", variant: "tag" };
      default:
        // If row has its own tag data not covered above (and isn't 'Cancelled')
        if (row?.original?.tagText && row.original.tagText !== "Cancelled") {
          return {
            tagText: row.original.tagText,
            type: row.original.type,
            variant: row.original.variant,
          };
        }
        return null; // No specific tag otherwise
    }
  })();

  return (
    <Dialog open={openFBC} onOpenChange={setOpenFBC}>
      <div className="flex flex-row items-center justify-between pr-3 border-r border-[#D9D9E0] h-10 sticky left-0 z-10 bg-inherit">
        <div
          className={`flex flex-row items-center space-x-2 pr-3 ${
            displayLineThrough ? "line-through text-[#1C2024]" : ""
          }`}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(value)}
            aria-label="Select row"
          />
          <DialogTrigger asChild>
            <button onClick={() => setOpenFBC(true)}>
              <span className="mr-2 cursor-pointer">{selectedService}</span>
            </button>
          </DialogTrigger>
        </div>
        {selectedTag?.tagText && (
          <Tags
            tagText={selectedTag.tagText}
            type={
              selectedTag?.type as
                | "danger"
                | "primary"
                | "warning"
                | "secondary"
                | "success"
                | "info"
                | "pink"
                | "teal"
                | "cyan"
                | undefined
            }
            variant="tag"
          />
        )}
      </div>
      <DialogContent
        className="w-full max-w-none h-full max-h-none p-0 shadow-none border-none mx-auto 
         transition-transform duration-300 
          bg-red z-[10000] [&>button]:hidden data-[state=open]:animate-slide-up"
      >
        <VisuallyHidden>
          <DialogTitle>Full Body Checkup</DialogTitle>
        </VisuallyHidden>
        {openFBC && (
          <FullBodyCheckup
            selectedService={selectedService}
            onClose={() => setOpenFBC(false)}
            size="large"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

type CustomColumnDef<T> = ColumnDef<T> & {
  isCommand?: boolean;
  isList?: boolean;
  accessorKey?: string;
};

type RowType = GetBillServices & {
  id: string | number;
  tagText?: string;
  type?: string;
  variant?: string;
};

const ColumnData = (): CustomColumnDef<RowType>[] => {
  return [
    {
      accessorKey: "serviceName",
      header: ({ table, column }) => {
        return (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10 border-r border-[#D9D9E0] sticky left-0 z-20 bg-[#FCFCFD]">
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
              Service
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
      cell: ({ row, getValue }) => (
        <ServiceCell row={row} getValue={getValue as () => string} />
      ),
      meta: { noneditable: true },
    },
    {
      accessorKey: "hospitaldoctorid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const hospitalDoctorId = row.original.hospitaldoctorid ?? "";
        const serviceId = row.original.serviceid ?? "";
        return (
          <DoctorCell getValue={() => hospitalDoctorId} serviceId={serviceId} onDoctorSelect={(newDoctorId) => {
            row.original.hospitaldoctorid = newDoctorId; 
          }} />
        );
      },
      enableSorting: true,
    },

    {
      accessorKey: "rate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row justify-end" // Ensure justify-end for right alignment of header text
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rate
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <CancelableAmountCell<RowType>
          getValue={getValue as () => string}
          row={row as Row<RowType>}
        />
      ),
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <CancelableCell getValue={getValue as () => string} row={row}>
          {({
            cancelClicked,
            // getValue: cellGetValue,
            row: cellRow,
          }: {
            cancelClicked: boolean;
            getValue: () => string;
            row: Row<RowType>;
          }) => {
            const value = cellRow.original.quantity;
            const isStruckThrough =
              cellRow?.original?.tagText === "Cancelled" && !cancelClicked;
            return (
              <span
                className={`text-right w-full block ${
                  isStruckThrough ? "line-through" : ""
                }`}
              >
                {value}
              </span>
            );
          }}
        </CancelableCell>
      ),
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "billRequisiionDetailId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requisition No
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const requisitionNo = row.original.billRequisiionDetailId;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            {requisitionNo}
          </span>
        );
      },
      enableSorting: true,
      sortingFn: "basic",
      meta: { noneditable: true },
    },
    {
      accessorKey: "requisitionDateTime",
      header: () => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Requisition Date/Time
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <RequisitionDateTimeCell
          getValue={getValue as () => string}
          row={row}
        />
      ),
      enableSorting: true, // Sorting may not be ideal for combined date/time strings without custom sorter
    },
    {
      header: "Is Emergency",
      cell: (
        { row, column, table } // Added row prop in case selection is per row
      ) => {
        const columnIndex = table
          .getAllColumns()
          .findIndex((c) => c.id === column.id);
        return (
          <div className="flex justify-center items-center">
            <Check
              id={`cell-${row.index}-${columnIndex}`}
              tabIndex={0}
              label=""
            />
          </div>
        );
      },
      // ischeckbox: true, // Custom property
    },
    {
      accessorKey: "concessionPercent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession (%)
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <CancelableCell getValue={getValue as () => string} row={row}>
          {({ cancelClicked, getValue: cellGetValue, row: cellRow }) => {
            const value = cellGetValue();
            const isStruckThrough =
              cellRow?.original?.tagText === "Cancelled" && !cancelClicked;
            return (
              <span
                className={`text-right w-full block ${
                  isStruckThrough ? "line-through" : ""
                }`}
              >
                {value}%
              </span>
            );
          }}
        </CancelableCell>
      ),
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "concessionAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold  text-right  w-full flex flex-row justify-end" // Ensure justify-end
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession Amt.
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const rate = row.original.rate || 0;
        const concessionPercentage = row.original.concessionPercent || 0;

        // Calculate on the fly
        const concessionAmt = (concessionPercentage / 100) * rate;

        return <span>₹{concessionAmt.toFixed(2)}</span>;
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "apportionConcession",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apportion Concession
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const apportionConcession = row.original.apportionConcession;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{apportionConcession}
          </span>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "mouDiscountAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mou Discount
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const mouDiscountAmount = row.original.mouDiscountAmount;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{mouDiscountAmount}
          </span>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "transDiscount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Trans. Discount
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const transDiscount = row.original.totalServiceDiscount;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{transDiscount}
          </span>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "totalServiceDiscount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Service Discount
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const totalServiceDiscount = row.original.totalServiceDiscount;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{totalServiceDiscount}
          </span>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "includeInPackage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Include in Package
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const includeInPackage = row.original.includeInPackage;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
            aria-readonly="true"
            aria-disabled="true"
          >
            ₹{includeInPackage}
          </span>
        );
      },
      enableSorting: true,
      meta: { noneditable: true, isNumeric: true },
    },
    {
      accessorKey: "outOfPackage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Out of Package
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const outOfPackage = row.original.outOfPackage;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
            aria-readonly="true"
            aria-disabled="true"
          >
            ₹{outOfPackage}
          </span>
        );
      },
      enableSorting: true,
      meta: { noneditable: true, isNumeric: true },
    },
    {
      accessorKey: "editableServiceName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Editable Service Name
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const editableServiceName = "";
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            {editableServiceName}
          </span>
        );
      },
      enableSorting: true,
      sortingFn: "basic",
    },
    {
      accessorKey: "cancelRemark",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cancel Remark
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const cancelRemark = row.original.cancelRemark;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            {cancelRemark}
          </span>
        );
      },
      enableSorting: true,
      sortingFn: "basic",
    },
    {
      accessorKey: "concessionRemark",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession Remark
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row }) => {
        const concessionRemark = row.original.concessionRemark;
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            {concessionRemark}
          </span>
        );
      },
      enableSorting: true,
      sortingFn: "basic",
    },
    // {
    //   accessorKey: "totalamt",
    //   header: ({ column }) => (
    //     <div>
    //       <Button
    //         variant="ghost"
    //         className="hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none flex  text-right w-full"
    //         onClick={() => column.toggleSorting()}
    //       >
    //         Total Amount
    //         {column.getIsSorted() === "asc" ? (
    //           <ArrowUp className="ml-2 h-4 w-4" />
    //         ) : (
    //           <ArrowDown className="ml-2 h-4 w-4" />
    //         )}
    //       </Button>
    //     </div>
    //   ),

    //   cell: ({ row }) => {
    //     // Get values with defaults
    //     const rate = row.original.rate || 0;
    //     const quantity = row.original.quantity || 0;
    //     const concessionAmt = row.original.concessionAmount || 0;

    //     // Calculate total with validation
    //     const total = rate * quantity - concessionAmt;

    //     return (
    //       <CancelableCell getValue={() => total.toString()} row={row}>
    //         {({ cancelClicked, getValue, row }) => {
    //           let value = parseFloat(getValue());
    //           if (isNaN(value)) value = 0;
    //           if (value === 0) {
    //             return (
    //               <span
    //                 className={`text-right w-full block pl-3 h-10 py-3 border-l border-[#D9D9E0] ${
    //                   row?.original?.tagText === "Cancelled" && !cancelClicked
    //                     ? "line-through"
    //                     : ""
    //                 }`}
    //               >
    //                 ₹0.00
    //               </span>
    //             );
    //           }
    //           // Don't show negative values
    //           if (typeof value !== "number" || isNaN(value) || value < 0) {
    //             return null;
    //           }
    //           return (
    //             <span
    //               className={`text-right w-full block pl-3 h-10 py-3 border-l border-[#D9D9E0] ${
    //                 row?.original?.tagText === "Cancelled" && !cancelClicked
    //                   ? "line-through"
    //                   : ""
    //               }`}
    //             >
    //               ₹{value.toFixed(2)}
    //             </span>
    //           );
    //         }}
    //       </CancelableCell>
    //     );
    //   },
    //   enableSorting: true,
    // },
    {
      accessorFn: (row) => {
        const rate = row.rate || 0;
        const quantity = row.quantity || 0;
        const mouDiscount = row.mouDiscountAmount || 0;
        const concessionPercentage = row.concessionPercent || 0;

        // Calculate concession amount from percentage
        const concessionAmount = (concessionPercentage / 100) * rate;

        const total = rate * quantity - mouDiscount - concessionAmount;

        return total;
      },
      id: "totalamt", // important to provide id when using accessorFn
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none text-right flex w-full"
          onClick={() => column.toggleSorting()}
        >
          Total Amount
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("totalamt") as number;
        if (value <= 0) {
          return (
            <span className="text-right block pl-3 h-10 py-3 border-l border-[#D9D9E0]">
              ₹0.00
            </span>
          );
        }
        return (
          <span className="text-right block pl-3 h-10 py-3 border-l border-[#D9D9E0]">
            ₹{Number(value).toFixed(2)}
          </span>
        );
      },
      enableSorting: true,
    },
  ];
};

export { columnNames, columnNamesBills, refundData, refundColumn, ColumnData };
