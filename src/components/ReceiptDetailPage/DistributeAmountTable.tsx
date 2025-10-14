"use client";
import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import Image from "next/image";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/buttons/Button";
import UtilDropDownButton from "@/components/table-util-buttons/UtilDropDownButton";
import { HospitalBillEntry } from "@/store/payments_received/types";
import { formatCurrency } from "@/utils/CurrencyUtils";
import SelectActions from "@/sections/paymentsReceived/SelectActions";
import FilterDialogue from "./FilterDialogue";
import TableUtilFilterButton from "../table-util-buttons/TableUtilFilterButton";
import { Checkbox } from "../ui/checkbox";
import { columnNames } from "./tableData";
import DateRangePicker from "../DateRange/DateRangePicker";
import { DateRange } from "react-day-picker";
import DistributeAmount from "../distributeAmount/DistributeAmount";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface LabelValue {
  label: string;
  value: string;
}
const dataAmountAccumulated: LabelValue[] = [
  { label: "Total Distributed", value: "₹19,046" },
  { label: "Total Bill", value: "₹19,046" },
  { label: "Total Balance", value: "₹5,000" },
  { label: "Amount Received", value: "₹8,000" },
  { label: "Disallowed Amount", value: "₹3,000" },
  { label: "Total TDS", value: "₹2,500" },
  { label: "Total Concession", value: "₹1,500" },
  { label: "Total Processing Fee", value: "₹1,500" },
];

interface SubmitDataTableProps {
  columns: ColumnDef<HospitalBillEntry, unknown>[];
  data: HospitalBillEntry[];
  dateProps: {
    date: DateRange | undefined;
    setDate: Dispatch<SetStateAction<DateRange | undefined>>;
  };
  setFilteredData: (
    data:
      | HospitalBillEntry[]
      | ((prev: HospitalBillEntry[]) => HospitalBillEntry[])
  ) => void;
}
const getRowValue = (row: HospitalBillEntry, key: string): string => {
  return String(row[key as keyof HospitalBillEntry]);
};
export function DistributeDataTable({
  data,
  columns,
  dateProps,
  setFilteredData,
}: SubmitDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [openFilters, setOpenFilters] = useState(false);
  const [tableData, setTableData] = useState<HospitalBillEntry[]>(data);
  const [openDistribute, setOpenDistribute] = useState(false);
  const [openShowActions, setOpenShowActions] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleBlur = () => {
    setShowSearch(false);
    setTimeout(() => {
      setShowIcon(true);
    }, 200); 
  };
  
  const handleSearchClick = () => {
    setShowIcon(false);
    setShowSearch(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50); 
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  const selectedRows = table.getSelectedRowModel().rows.map((row) => ({
    ...row.original,
  }));

  const [showRowActions, setShowRowActions] = useState(
    selectedRows.length !== 0
  );

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setDropdownOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    setShowRowActions(selectedRows.length !== 0);
  }, [selectedRows.length]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  const handleRemoveRows = (rows: HospitalBillEntry[]) => {
    if (rows.length > 0 && "id" in rows[0]) {
      const billRows = rows as HospitalBillEntry[];
      const idsToRemove = new Set(billRows.map((r) => r.id));
      setTableData((prevData) =>
        prevData.filter((row) => !idsToRemove.has(row.id))
      );
      deselectRows();
    } else {
      console.warn("Rows passed are not of type BillRow.");
    }
  };
  const [openShowCols, setOpenShowCols] = useState(false);
  useEffect(() => {
    if (openShowCols) {
      const initialVisibilities: Record<string, boolean> = {};
      table
        .getAllColumns()
        .filter((col) => col.getCanHide() && col.id !== "hospital")
        .forEach((col) => {
          initialVisibilities[col.id] = col.getIsVisible();
        });
      setPendingColumnVisibility(initialVisibilities);
    }
  }, [openShowCols, table]);

  useEffect(() => {
    const { ...filterKeys } = filters || {};
    let filtered = [...tableData];
    const hasFilters = Object.keys(filterKeys).length > 0;

    if (hasFilters) {
      filtered = filtered.filter((row) =>
        Object.entries(filterKeys).every(
          ([key, values]) =>
            Array.isArray(values) &&
            values
              .map((v: string) => v.toLowerCase())
              .includes(getRowValue(row, key).toLowerCase())
        )
      );
    }
    setFilteredData(filtered);
  }, [filters, setFilteredData, tableData]);

  const [placeHolderText, setPlaceHolderText] = useState("Hospital");

  useEffect(() => {
    setTimeout(() => {
      setPlaceHolderText((prev) =>
        prev === "Patient Name" ? "Hospital" : "Patient Name"
      );
    }, 4000);
  }, [placeHolderText]);

  useEffect(() => {
    setFilteredData(data);
  }, [data, setFilteredData]);

  return (
    <div>
      {openDistribute && (
        <DistributeAmount open={openDistribute} setOpen={setOpenDistribute} />
      )}
      <div className="flex justify-between items-center py-md">
        <span className="text-[#1C2024] text-lg font-semibold">
          Bills · {table.getCoreRowModel().rows.length}{" "}
        </span>
        <div className="filters flex flex-wrap gap-sm items-center py-xs">
          <div className=" flex items-center relative ">
            {showIcon && (
              <Search
                className="cursor-pointer text-black-400"
                size={21}
                onClick={handleSearchClick}
              />
            )}
            <div
              className={`transition-all duration-300 ease-in-out  ${
                showSearch ? "w-64 opacity-100 ml-2" : "w-0 opacity-0"
              }`}
            >
              <div className="w-full">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={`Search by ${placeHolderText}`}
                  className="pl-4 w-full h-10"
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const searchTerm = e.target.value;
                    setFilteredData(
                      searchTerm.trim() === "empty"
                        ? []
                        : tableData.filter((row) =>
                            Object.values(row).some((value) =>
                              String(value)
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                          )
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <FilterDialogue
            trigger={
              <TableUtilFilterButton
                icon={"/assets/icons/FilterIcon.svg"}
                label={"Filters"}
                badgeCount={Object.keys(filters).length}
              />
            }
            modalProps={{ openFilters, setOpenFilters }}
            filterProps={{ filters, setFilters }}
          />
          <DropdownMenu
            onOpenChange={setOpenShowActions}
            open={openShowActions}
          >
            <DropdownMenuTrigger asChild>
              <UtilDropDownButton
                className="flex flex-row gap-1"
                leadingIcon="/assets/icons/upload.svg"
                label=""
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="px-0 py-2 max-h-[20vh]">
              <div className="flex flex-col">
                {/* Upload */}
                <div
                  className="cursor-pointer px-4 py-2 text-sm text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                  onClick={() => {
                    // Call your upload function here
                    console.log("Upload selected");
                  }}
                >
                  Upload
                </div>

                {/* Download */}
                <div
                  className="cursor-pointer px-4 py-2 text-sm text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                  onClick={() => {
                    // Call your download function here
                    console.log("Download selected");
                  }}
                >
                  Download
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DateRangePicker dateProps={{ ...dateProps }} />

          <DropdownMenu onOpenChange={setOpenShowCols} open={openShowCols}>
            <DropdownMenuTrigger asChild>
              <UtilDropDownButton
                leadingIcon={"/assets/icons/columns.svg"}
                label={""}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="p-0 max-h-[50vh] w-64 flex flex-col z-[100]"
            >
              {/* Header (fixed) */}
              <div className="sticky top-0 bg-white z-10 px-4 py-2 border-0">
                <span className="text-xs text-text-secondary">
                  Show/Hide Columns
                </span>
              </div>

              {/* Scrollable Column List */}
              <div className="overflow-y-auto flex-1">
                <div
                  className="cursor-pointer px-4 py-2 flex items-center text-sm hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                  onClick={() => {
                    const columnsToToggle = table
                      .getAllColumns()
                      .filter(
                        (col) => col.id !== "hospital" && col.getCanHide()
                      );
                    const allVisible = columnsToToggle.every(
                      (col) => pendingColumnVisibility[col.id]
                    );
                    const newState = !allVisible;
                    const newVisibilities = { ...pendingColumnVisibility };
                    columnsToToggle.forEach((col) => {
                      newVisibilities[col.id] = newState;
                    });
                    setPendingColumnVisibility(newVisibilities);
                  }}
                >
                  <Checkbox
                    checked={table
                      .getAllColumns()
                      .filter(
                        (col) => col.id !== "hospital" && col.getCanHide()
                      )
                      .every((col) => pendingColumnVisibility[col.id])}
                    onCheckedChange={(checked) => {
                      const columnsToToggle = table
                        .getAllColumns()
                        .filter(
                          (col) => col.id !== "hospital" && col.getCanHide()
                        );
                      const newVisibilities = { ...pendingColumnVisibility };
                      columnsToToggle.forEach((col) => {
                        newVisibilities[col.id] = !!checked;
                      });
                      setPendingColumnVisibility(newVisibilities);
                    }}
                  />
                  <label className="pl-2">All</label>
                </div>

                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide() && column.id !== "hospital"
                  )
                  .map((column) => (
                    <div
                      key={column.id}
                      className="cursor-pointer px-4 py-2 flex items-center text-sm hover:text-[#0D74CE] hover:bg-[#E6F4FE]"
                      onClick={() => {
                        setPendingColumnVisibility((prev) => ({
                          ...prev,
                          [column.id]: !prev[column.id],
                        }));
                      }}
                    >
                      <Checkbox
                        checked={pendingColumnVisibility[column.id]}
                        onCheckedChange={(checked) => {
                          setPendingColumnVisibility((prev) => ({
                            ...prev,
                            [column.id]: !!checked,
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label className="pl-2">{columnNames[column.id]}</label>
                    </div>
                  ))}
              </div>

              {/* Save Button (fixed) */}
              <div className="sticky bottom-0 bg-white px-4 py-2 border-0">
                <Button
                  size="button-small"
                  type="secondary-button"
                  variant="button"
                  onClick={() => {
                    setColumnVisibility(pendingColumnVisibility);
                    setOpenShowCols(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative w-full border border-[#CDCED6] rounded-t-lg overflow-x-auto bg-white rounded-lg">
        <div className="relative flex flex-col">
          <UITable
            className={`w-full border-collapse rounded-lg border-spacing-0 text-xs whitespace-nowrap 
         "rounded-none"`}
          >
            <TableHeader className="sticky top-0  bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`min-h-0 px-2 py-0 bg-[#F9F9FB] hover:bg-[#F9F9FB] border border-x-0 border-t-0 border-b-[#CDCED6] text-[#60646C] hover:text-[#1C2024] font-semibold cursor-pointer
                    ${
                      ["hospitals", "hospital", "Hospital"].includes(
                        header.column.id
                      )
                        ? "sticky left-0 z-50 bg-[#F9F9FB]"
                        : ""
                    }
                    ${
                      header.column.id === "totalAmount"
                        ? "sticky right-0 z-50 bg-[#F9F9FB]"
                        : ""
                    }`}
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="overflow-auto max-h-[calc(50vh)]">
              {table.getRowModel().rows.length === 0 ? (
                <TableRow className="hover:!bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center py-20"
                  >
                    <div className="flex flex-col items-center justify-center w-full space-y-3">
                      <Image
                        src={"/assets/icons/alert-circle.svg"}
                        height={24}
                        width={24}
                        alt="no data found"
                      />
                      <span className="block text-base">No results Found.</span>
                      <span className="block text-sm text-[#60646C]">
                        We couldn&apos;t find any result matching your search
                        criteria.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-10 text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE] border-b border-[#CDCED6]"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap px-lg cursor-pointer py-0 h-10 ${
                          index === 0
                            ? "sticky left-0 bg-inherit z-[10] hover:text-primary"
                            : ""
                        } ${
                          index === columns.length - 1
                            ? "sticky right-0 bg-inherit  hover:text-primary"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
            {table.getRowModel().rows.length !== 0 ? (
              <TableFooter className="bg-white z-30">
                <TableRow className="border-t-1 border-b-0 border-[#CDCED6] text-[#1C2024] font-semibold">
                  {/* Loop to generate empty cells before Total label */}

                  {/* Sticky "Total Amount" label cell */}
                  <TableCell className="text-left px-lg py-3 sticky left-0 z-30 bg-white">
                    Total Amount
                  </TableCell>
                  {columns.slice(0, columns.length - 2).map((col, index) => (
                    <TableCell key={col.id || index} className="bg-white" />
                  ))}

                  {/* Sticky "Total Amount" value cell */}
                  <TableCell className="text-right px-lg py-3 sticky right-0 z-30 bg-white">
                    {formatCurrency(
                      table
                        .getRowModel()
                        .rows.reduce(
                          (total, row) =>
                            total + (row.original.totalAmount || 0),
                          0
                        ),
                      "INR"
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            ) : (
              <></>
            )}
          </UITable>
        </div>
        <SelectActions
          source="receiptDetailsPage"
          modalProps={{
            open: showRowActions,
            setOpen: deselectRows,
          }}
          deselectRows={deselectRows}
          rows={selectedRows}
          setOpenCancelBill={() => false}
          onRemoveRows={handleRemoveRows}
          setOpenSubmitBill={setOpenDistribute}
          totalRowCount={tableData.length}
          setSelectedForSubmit={() => {}}
        />
      </div>
      <div className="w-[344px] h-[280px] bg-[#F9F9FB] mt-8 rounded-md p-4 flex flex-col justify-between ml-auto">
        {dataAmountAccumulated.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-[#1C2024]"
          >
            <span>{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
