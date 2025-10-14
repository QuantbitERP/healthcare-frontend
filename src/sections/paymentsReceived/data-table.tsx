"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import Button from "@/components/buttons/Button";
import DateRangePicker from "@/components/DateRange/DateRangePicker";
import TableUtilToggle from "@/components/table-util-buttons/TableUtilToggle";
import TableUtilFilterButton from "@/components/table-util-buttons/TableUtilFilterButton";
import UtilDropDownButton from "@/components/table-util-buttons/UtilDropDownButton";
import FilterDialogue from "./FilterDialogue";
import SelectActions from "./SelectActions";
// import CloseDialogueBox from "@/components/dialogueBox/DialogueBox";

import { getCurrencySymbol } from "@/utils/CurrencyUtils";

import type { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { Payment, ColumnConfig } from "@/store/payments_received/types";
import { RootState } from "@/store";
type ColumnNames = {
  [key: string]: string;
};

export const columnNames: ColumnNames = {
  receiptNo: "Receipt No.",
  company_name: "Patient/Company",
  uhid: "UHID",
  payment_mode: "Payment Mode",
  visit_type: "Visit Type",
  date_of_received: "Date/Time Received",
  receivedamount: "Receipt Amount (₹)",
  discount_amount: "Distributed Amount (₹)",
  excess_amount: "Amount in Excess (₹)",
  collected_from_name: "Collected from",
  modified_on: "Modified On",
  modified_by: "Modified By",
  created_on: "Created On",
  created_by: "Created By",
  totalAmount: `Total Amount (${getCurrencySymbol("INR")})`,
};

type MeModeProps = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

type DateProps = {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
};

type AlertProps = {
  alertType: "cancel" | "submit" | false | null;
  setAlertType: (type: "cancel" | "submit" | false | null) => void;
};

// type FilterType = {
//   groupBy?: keyof typeof groupByOptions;
//   [key: string]: string[] | keyof typeof groupByOptions | undefined;
// };

const getRowValue = (row: Payment, key: string): string => {
  const value = row[key as keyof Payment];
  return value?.toString() ?? '';
};

export function DataTable({
  columns,
  data,
  meModeProps: { checked, setChecked },
  dateProps,
  setFilteredData,
  alertProps: { alertType, setAlertType },
}: {
  columns: ColumnDef<Payment>[];
  data: any | null;
  meModeProps: MeModeProps;
  dateProps: DateProps;
  setFilteredData: (
    data: Payment[] | ((prev: Payment[]) => Payment[])
  ) => void;
  alertProps: AlertProps;
}) {
  // const dispatch = useDispatch<AppDispatch>();
  const { all_columns = [], selected_columns = [] } =
    useSelector((state: RootState) => state.columnConfig) || {};

  const [sorting, setSorting] = useState([
    {
      id: "modified_on",
      desc: true,
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [loading] = useState(false);

  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [openFilters, setOpenFilters] = useState(false);
  const [, setOpenCancelBill] = useState(false);
  // const [openSubmitBill, setOpenSubmitBill] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [groupedData] = useState<Record<string, Payment[]>>({});
  // const [selectedRowsForSubmit, setSelectedRowsForSubmit] = useState<ReceiptData[]>([]);

  const { data: receiptData } = useSelector(
    (state: RootState) => state.payments
  );

  const ChevronDownIcon = ChevronDown;

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };
  // useEffect(() => {
  //   dispatch(fetchColumnConfig());
  // }, [dispatch]);

  useEffect(() => {
    if (selected_columns?.length > 0) {
      const initialVisibility: Record<string, boolean> = {};
      all_columns.forEach((col: ColumnConfig) => {
        initialVisibility[col.id] = selected_columns.some((sel: ColumnConfig) => sel.id === col.id);
      });
      setColumnVisibility(initialVisibility);
      setPendingColumnVisibility(initialVisibility);
    }
  }, [selected_columns, all_columns]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });


  const selectedRows = table.getSelectedRowModel().rows.map((row) => ({
    ...row.original,
    id: row.id,
  }));

  const [showRowActions, setShowRowActions] = useState(
    selectedRows.length !== 0
  );
  const [openShowCols, setOpenShowCols] = useState(false);

  useEffect(() => {
    if (openShowCols) {
      const initialVisibilities: Record<string, boolean> = {};
      table
        .getAllColumns()
        .filter((col) => col.getCanHide() && col.id !== "receiptNo")
        .forEach((col) => {
          initialVisibilities[col.id] = col.getIsVisible();
        });
      setPendingColumnVisibility(initialVisibilities);
    }
  }, [openShowCols, table]);

  useEffect(() => {
    setShowRowActions(selectedRows.length !== 0 ? true : false);
  }, [selectedRows]);

  useEffect(() => {
    if (!receiptData?.payments) return;
    
    const { ...filterKeys } = filters || {};
    let filtered = [...receiptData.payments];

    const hasFilters = Object.keys(filterKeys).length > 0;

    if (hasFilters) {
      filtered = filtered.filter((row: Payment) =>
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
  }, [filters, receiptData, setFilteredData]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  useEffect(() => {
    if (alertType) {
      setTimeout(() => {
        setAlertType(false);
      }, 3000);
    }
  }, [alertType, setAlertType]);

  const [placeHolderText, setPlaceHolderText] = useState("Bill No");

  useEffect(() => {
    setTimeout(() => {
      setPlaceHolderText((prev) =>
        prev === "Patient Name" ? "Bill No" : "Patient Name"
      );
    }, 4000);
  }, [placeHolderText]);

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const siblingCount = 1;

  const DOTS = "...";

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return range(0, totalPages - 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - 2
    );

    const showLeftDots = leftSiblingIndex > 1;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 0;
    const lastPageIndex = totalPages - 1;

    const pages: (number | typeof DOTS)[] = [];

    pages.push(firstPageIndex);

    if (showLeftDots) {
      pages.push(DOTS);
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    pages.push(...middleRange);

    if (showRightDots) {
      pages.push(DOTS);
    }

    pages.push(lastPageIndex);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <>
      <div className="flex justify-between items-center px-lg py-sm">
        <div className="relative ">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
       
          />
          {/* change placeholder overtime */}
          <Input
            type="text"
            autoFocus={true}
            placeholder={`Search by ${placeHolderText}`}
            className="pl-10 min-w-80"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const searchTerm = e.target.value;
              setFilteredData(
                searchTerm === "empty"
                  ? []
                  : receiptData?.payments?.filter((row: Payment) =>
                      Object.values(row).some((value) =>
                        String(value)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                    ) ?? []
              );
            }}
          />
        </div>

        <div className="filters flex space-x-sm py-xs">
          <TableUtilToggle
            inputProps={{ checked, setChecked }}
            label={"Me Mode"}
          />

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

          <DateRangePicker dateProps={{ ...dateProps }} />

          <DropdownMenu onOpenChange={setOpenShowCols} open={openShowCols}>
            <DropdownMenuTrigger asChild>
              <UtilDropDownButton
                leadingIcon={"/assets/icons/columns.svg"}
                label={"Show Columns"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="px-0 py-2 max-h-[70vh] overflow-y-auto"
            >
              <span className="text-xs text-text-secondary m-sm">
                Show/Hide Columns
              </span>
              <div className="">
                <div
                  className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                  onClick={() => {
                    const columnsToToggle = table
                      .getAllColumns()
                      .filter(
                        (col) => col.id !== "receiptNo" && col.getCanHide()
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
                        (col) => col.id !== "receiptNo" && col.getCanHide()
                      )
                      .every((col) => pendingColumnVisibility[col.id])}
                    onCheckedChange={(checked) => {
                      const columnsToToggle = table
                        .getAllColumns()
                        .filter(
                          (col) => col.id !== "receiptNo" && col.getCanHide()
                        );

                      const newVisibilities = { ...pendingColumnVisibility };
                      columnsToToggle.forEach((col) => {
                        newVisibilities[col.id] = !!checked;
                      });
                      setPendingColumnVisibility(newVisibilities);
                    }}
                  />
                  <label className="pl-2 pr-4 cursor-pointer">All</label>
                </div>

                {/* Individual Checkboxes */}
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide() && column.id !== "receiptNo"
                  )
                  .map((column) => {
                    return (
                      <div
                        key={column.id}
                        className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounde-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                        onClick={() => {
                          // toggle individual checkbox in pending state
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
                          onClick={(e) => e.stopPropagation()} // prevent double toggling on parent div
                        />

                        <label className="pl-2 pr-4 cursor-pointer">
                        {all_columns.find((col: ColumnConfig) => col.id === column.id)?.name || column.id}
                        </label>
                      </div>
                    );
                  })}
              </div>
              <div className="p-sm">
                <Button
                  size="button-small"
                  type="secondary-button"
                  variant="button"
                  onClick={() => {
                      setColumnVisibility(pendingColumnVisibility);
                      // const selectedColsToSave = all_columns.filter((col: ColumnConfig) => pendingColumnVisibility[col.id]);
                      // dispatch(saveColumnConfig(selectedColsToSave));
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
      <div className="rounded-md border border-[#D9D9E0] mx-lg flex flex-col overflow-hidden max-h-[calc(100vh-100px)]">
        <div className="overflow-y-auto relative flex-grow">
          <Table className="border-collapse-separate border-spacing-0 !border-[#D9D9E0]">
            <TableHeader className="sticky top-0 z-30 bg-[#FCFCFD] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1px] after:bg-[#D9D9E0] after:bottom-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`text-left px-lg [&>button]:hover:bg-transparent [&>button]:px-0 bg-[#FCFCFD] 
                           border border-x-0 border-t-0 border-b-[#CDCED6] 
                          ${index === 0 ? "sticky left-0 z-20" : ""}
                          ${
                            index === columns.length - 1
                              ? "sticky right-0 z-20"
                              : ""
                          }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {filters.groupBy ? (
                Object.keys(groupedData).length ? (
                  Object.entries(groupedData).map(([groupKey, rows]) => (
                    <React.Fragment key={groupKey}>
                      {/* Group Header Row */}
                      <TableRow
                        onClick={() => toggleGroup(groupKey)}
                        className="cursor-pointer bg-[#FCFCFD] hover:bg-[#ECECEC] text-[#1C2024] font-bold text-md"
                      >
                        <TableCell
                          colSpan={columns.length}
                          className="font-medium px-lg"
                        >
                          <div className="flex items-center">
                            <ChevronDownIcon
                              size={16}
                              className={`mr-2 transition-transform ${
                                expandedGroups[groupKey]
                                  ? "-rotate-180"
                                  : "rotate-0"
                              }`}
                            />
                            {`#${groupKey}`}
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedGroups[groupKey] &&
                        rows.map((row) => {
                          const tableRow = table
                            .getRowModel()
                            .rows.find(
                              (r) => r.original.id === row.id
                            );

                          if (!tableRow) return null;

                          return (
                            <TableRow key={row.id} className="group">
                              {tableRow.getVisibleCells().map((cell, index) => (
                                <TableCell
                                  key={cell.id}
                                  className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${
                                    index === 0
                                      ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                                      : ""
                                  }
                                   ${
                                     index === columns.length - 1
                                       ? "sticky right-0 bg-inherit z-10 ml-0 hover:text-primary"
                                       : "pl-6"
                                   }`}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No grouped results.
                    </TableCell>
                  </TableRow>
                )
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${
                          index === 0
                            ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                            : ""
                        }
                         ${
                           index === columns.length - 1
                             ? "sticky right-0 bg-inherit z-10 hover:text-primary"
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
              ) : (
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
              )}
              {loading ? (
                <>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell className="" key={index}>
                        <Skeleton className={`h-4 my-2`} />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell className="" key={index}>
                        <Skeleton className={`h-4 my-2`} />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell className="" key={index}>
                        <Skeleton className={`h-4 my-2`} />
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </div>

        {/* <CloseDialogueBox
          showDropdown
          showTextbox
          open={openCancelBill}
          setOpen={setOpenCancelBill}
          setAlertType={(type: string) => {
            if (type === "submit" || type === "cancel" || type === null) {
              setAlertType(type as "submit" | "cancel" | false | null);
            } else {
              console.warn("Invalid alert type received:", type);
            }
          }}
          deselectRows={deselectRows}
          setShowAlert={() => {}}
        /> */}
        <SelectActions
          source="invoicingPage"
          modalProps={{
            open: showRowActions,
            setOpen: deselectRows,
          }}
          totalRowCount={table.getRowModel().rows.length}
          deselectRows={deselectRows}
          rows={selectedRows}
          setAlertType={(type: string) => {
            if (type === "submit" || type === "cancel" || type === null) {
              setAlertType(type as "submit" | "cancel" | false | null);
            } else {
              console.warn("Invalid alert type received:", type);
            }
          }}
          setOpenCancelBill={setOpenCancelBill}
          setOpenSubmitBill={() => {}}
          setSelectedForSubmit={() => {}}
        />
      </div>
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="button"
            type="secondary-button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          {pageNumbers.map((page, index) =>
            page === DOTS ? (
              <span key={index} className="px-2 text-muted-foreground">
                {DOTS}
              </span>
            ) : (
              <Button
                key={index}
                type={
                  currentPage === page ? "primary-button" : "secondary-button"
                }
                className={`h-8 w-8 p-0 ${
                  currentPage === page ? "bg-primary text-white" : ""
                }`}
                onClick={() =>
                  typeof page === "number" && table.setPageIndex(page)
                }
              >
                {typeof page === "number" ? page + 1 : page}
              </Button>
            )
          )}

          <Button
            variant="button"
            type="secondary-button"
            onClick={() => {
              if (table.getCanNextPage()) {
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
