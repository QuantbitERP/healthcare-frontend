import Check from "@/components/checkbox/CheckboxComponent";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/statusTags/Tags";
import FullBodyCheckup from "@/components/fullBodyCheckup/Card";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCancel } from "@/components/IndividualPatientBillingDetailPage/context/Context";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Row } from "@tanstack/react-table";
import { AppDispatch } from "@/store";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { CustomColumnDef } from "../EditableCellsTable/TableTry";
import { fetchServiceRate } from "@/store/opd_bills/thunks";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    noneditable?: boolean;
  }
  interface TableMeta<TData> {
    updateRow: (rowIndex: number, updatedRow: TData) => void;
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
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
export type RowType = GetBillServices & {
  id: string | number;
  tagText?: string;
  type?: string;
  variant?: string;
};

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
function CancelableCell<TData>({
  getValue,
  children,
  row,
}: CancelableCellProps<TData>) {
  const { cancelClicked } = useCancel();

  return <>{children({ cancelClicked, getValue, row })}</>;
}

const ServiceCell = ({
  row,
  getValue,
}: {
  row: Row<RowType>;
  getValue: () => string;
}) => {
  const isCancelled = row?.original?.tagText === "Cancelled";
  const [open, setOpen] = useState(false);
  const selectedService = getValue();

  const displayText =
    selectedService.length > 25
      ? `${selectedService.substring(0, 25)}...`
      : selectedService;

  const selectedTag = (() => {
    if (isCancelled) {
      return { tagText: "Cancelled", type: "danger", variant: "tag" };
    } else if (selectedService === "General Consultation") {
      return { tagText: "Follow Up", type: "primary", variant: "tag" };
    } else if (["Full Body Checkup"].includes(selectedService)) {
      return { tagText: "Package", type: "warning", variant: "tag" };
    } else if (
      ["Sleep Test", "Physiotherapy Session"].includes(selectedService)
    ) {
      return { tagText: "Follow Up", type: "primary", variant: "tag" };
    }
    return row?.original;
  })();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-row items-center justify-between pr-3 border-r border-[#D9D9E0] h-10 w-[300px]">
        <div
          className={`flex flex-row space-x-2 pr-3 items-center ${
            isCancelled ? "line-through text-[#1C2024]" : ""
          }`}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <DialogTrigger asChild>
            <button onClick={() => setOpen(true)}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="mr-2 cursor-pointer">{displayText}</span>
                  </TooltipTrigger>
                  <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
                    <p>{selectedService}</p>
                    <TooltipArrow className="fill-[#0090FF]" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          </DialogTrigger>
        </div>
        {selectedTag?.tagText && (
          <StatusBadge
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
          bg-red z-[350] [&>button]:hidden data-[state=open]:animate-slide-up"
      >
        <VisuallyHidden>
          <DialogTitle>{selectedService}</DialogTitle>
        </VisuallyHidden>
        {open && (
          <FullBodyCheckup
            selectedService={selectedService}
            onClose={() => setOpen(false)}
            size="large"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// const DoctorCell = ({
//   getValue,
//   serviceId,
//   onDoctorSelect,
//   onRateChange,
// }: {
//   getValue: () => string;
//   serviceId?: string;
//   onDoctorSelect?: (doctorId: string) => void;
//   onRateChange?: (rate: number) => void;
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { referredDoctors, loading } = useSelector(
//     (state: RootState) => state.opdFiltersOptions
//   );
//   const initialDoctor = useMemo(() => getValue(), []); 
//   const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor);


//   const handleDoctorChange = (value: string) => {
//     if (value === selectedDoctor) return;
//     setSelectedDoctor(value);
//     onDoctorSelect?.(value);
//   };

//   const doctorOptions =
//     referredDoctors?.data?.items?.map((doc) => ({
//       label: doc.value,
//       value: doc.key,
//     })) || [];

//     useEffect(() => {
//       if (!selectedDoctor || !serviceId) return;
  
//       let isActive = true;
  
//       dispatch(
//         fetchServiceRate({
//           version: "1",
//           tenant: "",
//           requestBody: {
//             hospitalDoctorId: null,
//             companyId: "ab3c3680-9a69-4785-8fe7-4bbbbc1848bc",
//             serviceId,
//             hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
//             patientId: "7740fb19-a64a-4cc4-862c-be40665d0f4b",
//           },
//         })
//       )
//         .unwrap()
//         .then((res) => {
//           if (isActive) {
//             onRateChange?.(res?.data?.serviceRate ?? 0);
//           }
//         });
  
//       return () => {
//         isActive = false; // cancel if unmounted/changed
//       };
//     }, [selectedDoctor, serviceId, dispatch, onRateChange]);

//   const selectedOption = doctorOptions.find(
//     (doc) => doc.value === selectedDoctor
//   );
//   if (loading) {
//     return <Skeleton className="w-full h-6" />;
//   }
//   return (
//     <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
//       <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0 shadow-none">
//         <SelectValue placeholder="Select a Doctor">
//           {selectedOption ? (
//             <div className="flex flex-row items-center gap-1 pl-0">
//               <Avatar
//                 name={
//                   (
//                     selectedOption.label?.split(" ")[1] ||
//                     selectedOption.label?.split(" ")[0]
//                   )?.charAt(0) || ""
//                 }
//                 size="24"
//                 round
//                 textSizeRatio={2}
//               />
//               <span>{selectedOption.label}</span>
//             </div>
//           ) : (
//             "Select a Doctor"
//           )}
//         </SelectValue>
//       </SelectTrigger>

//       <SelectContent className="m-0 [&>div]:!px-0 [&>div]:!py-2 border-[#D9D9E0]">
//         {doctorOptions.map((option, index) => (
//           <SelectItem
//             key={index}
//             value={option.value ?? ""}
//             className="data-[highlighted]:bg-[#E6F4FE] rounded-none"
//           >
//             <div className="flex flex-row items-center gap-1">
//               <Avatar
//                 name={
//                   (
//                     option.label?.split(" ")[1] || option.label?.split(" ")[0]
//                   )?.charAt(0) || ""
//                 }
//                 size="24"
//                 round
//                 textSizeRatio={2}
//               />
//               <span>{option.label}</span>
//             </div>
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// };

const DoctorCell = ({ 
  value, 
  onDoctorSelect, 
  doctorOptions 
}: { 
  value: string; 
  onDoctorSelect: (value: string) => void; 
  doctorOptions: Array<{ label: string; value: string }>; 
}) => {
  return (
    <Select value={value} onValueChange={onDoctorSelect}>
      <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0 shadow-none">
        <SelectValue placeholder="Select a Doctor">
          {doctorOptions.find((d) => d.value === value)?.label || "Select a Doctor"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {doctorOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


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

 const ColumnData = (dispatch: AppDispatch, referredDoctors: any): CustomColumnDef<RowType>[] => {
  return [
    {
      accessorKey: "serviceName",
      header: ({ table, column }) => {
        return (
          <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10 border-r border-[#D9D9E0]">
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
    },
    {
      accessorKey: "hospitaldoctorid",
      header: "Doctor",
      cell: ({ row, table }) => {
        const doctorOptions =
          referredDoctors?.data?.items?.map((doc) => ({
            label: doc.value,
            value: doc.key,
          })) || [];
    
        const handleDoctorSelect = async (doctorId: string) => {
          row.original.hospitaldoctorid = doctorId;
          const serviceId = row.original.serviceid;
    
          // fetch only once per row change
          try {
            const res = await dispatch(
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
            ).unwrap();
    
            const rate = res?.data?.serviceRate ?? 0;
            const mouDiscount = res?.data?.mouDiscountPercentage ?? 0;
            const mouDiscountAmount = (rate * mouDiscount)/100;
            const updatedRow = { ...row.original, rate ,mouDiscountAmount };
            table.options.meta?.updateRow(row.index, updatedRow);
          } catch (err) {
            console.error("Failed to fetch rate", err);
          }
        };
    
        return (
          <DoctorCell
            value={row.original.hospitaldoctorid ?? ""}
            onDoctorSelect={handleDoctorSelect}
            doctorOptions={doctorOptions}
          />
        );
      },
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
      cell: ({row, getValue }) => (
        <CancelableAmountCell<RowType>
          getValue={getValue as () => string}
          row={row as Row<RowType>}
        />
        // <span>{row.original.rate}</span>
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
      enableSorting: true,
    },
    {
      header: "Is Emergency",
      cell: ({ row, column, table }) => {
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
                {Number(value)}%
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

        return <span>₹{Number(concessionAmt.toFixed(2))}</span>;
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
      meta: { isNumeric: true, noneditable: true },
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
      meta: { isNumeric: true, noneditable: true },
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
      meta: { isNumeric: true, noneditable: true },
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
      meta: { isNumeric: true, noneditable: true },
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
      id: "totalamt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="cursor-pointer hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none text-right flex w-full"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Total Amount
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4 cursor-pointer" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4 cursor-pointer" />
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
      meta: { isNumeric: true, noneditable: true },
    },
  ];
};

const columnNames = {
  service: "Service",
  hospitaldoctorid: "Doctor",
  rate: "Rate",
  quantity: "Quantity",
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

export { ColumnData, columnNames };
