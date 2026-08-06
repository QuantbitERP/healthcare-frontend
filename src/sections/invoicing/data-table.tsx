"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
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
import SubmitBillModal from "../../components/submitBillModal/SubmitBillModal";

import { TableDataType } from "./tableData";
import { getCurrencySymbol } from "@/utils/CurrencyUtils";
import { groupByFn } from "../../utils/InvoicingListGroupByUtils";
import { t } from "@/utils/languages";

import type { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

type ColumnNames = {
  [key: string]: string;
};

export const columnNames: ColumnNames = {
  billId: t("table.billId"),
  patient: t("table.patient"),
  company: t("table.company"),
  authId: t("table.authId"),
  uhid: t("table.uhid"),
  associateCompany: t("table.associateCompany"),
  billType: t("table.billType"),
  billStatus: t("table.status"),
  claimSendNo: t("table.claimSendNo"),
  submittedBy: t("table.submittedBy"),
  companyAmount: t("table.companyAmount"),
  patientAmount: t("table.patientAmount"),
  referralLetterNo: t("table.referralLetterNo"),
  modifiedOn: t("table.modifiedOn"),
  priorAuthDoneBy: t("table.priorAuthDoneBy"),
  billFinalizedBy: t("table.billFinalizedBy"),
  submitDate: t("table.submitDate"),
  billAmount: `Bill (${getCurrencySymbol("INR")})`,
};

type GroupByOptions = {
  [key: string]: string; // This is a flexible key-value mapping, ensure all keys are strings
};

const groupByOptions: GroupByOptions = {
  "Claim Send No.": "claimSendNo",
  Company: "company",
  "Bill Type": "billType",
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
  alertType: "cancel" | "submit" | "delete" | "error" | "exportSuccess" | "printSuccess" | false | null;
  setAlertType: (type: "cancel" | "submit" | "delete" | "error" | "exportSuccess" | "printSuccess" | false | null, message?: string) => void;
};



export function DataTable({
  columns,
  data,
  meModeProps: { checked, setChecked },
  dateProps,
  setFilteredData,
  alertProps: { alertType, setAlertType },
  loading = false,
  refetch: _refetch,
  metadata,
  onDelete,
  onFiltersChange,
  onValidationError,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
}: {
  columns: ColumnDef<TableDataType>[];
  data: TableDataType[];
  meModeProps: MeModeProps;
  dateProps: DateProps;
  setFilteredData: (
    data: TableDataType[] | ((prev: TableDataType[]) => TableDataType[])
  ) => void;
  alertProps: AlertProps;
  loading?: boolean;
  refetch?: () => void;
  metadata?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  onDelete?: (rows: TableDataType[]) => void;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
  onValidationError?: (message: string | null) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) {
  const [sorting, setSorting] = useState([
    {
      id: "modifiedOn",
      desc: true,
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  // Use the loading prop from parent component

  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [openFilters, setOpenFilters] = useState(false);

  // Communicate filter changes back to parent
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);
  const [, setOpenCancelBill] = useState(false);
  const [openSubmitBill, setOpenSubmitBill] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [groupedData, setgroupedData] = useState<
    Record<string, TableDataType[]>
  >({});
  const [selectedRowsForSubmit, setSelectedRowsForSubmit] = useState<TableDataType[]>([]);

  const ChevronDownIcon = ChevronDown;
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const table = useReactTable({
    data,
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

  // Pagination state and logic (same as OPD bills)
  const currentPage = metadata ? metadata.currentPage - 1 : table.getState().pagination.pageIndex; // Convert to 0-based for display
  const totalPages = metadata ? metadata.totalPages : table.getPageCount();
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
        .filter((col) => col.getCanHide() && col.id !== "billId")
        .forEach((col) => {
          initialVisibilities[col.id] = col.getIsVisible();
        });
      setPendingColumnVisibility(initialVisibilities);
    }
  }, [openShowCols, table]);

  useEffect(() => {
    setShowRowActions(selectedRows.length !== 0 ? true : false);
  }, [selectedRows]);

  // Handle grouping only (filtering is now done server-side)
  useEffect(() => {
    const { groupBy } = filters || {};
    const hasGroupBy = groupBy !== undefined;

    if (hasGroupBy && groupBy != null) {
      const groupKey = groupByOptions[groupBy as keyof typeof groupByOptions];
      const grouped = groupByFn(data, groupKey as keyof TableDataType);
      setgroupedData(grouped);
    } else {
      setFilteredData(data);
    }
  }, [filters, data, setFilteredData]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  const handleValidationError = (message: string) => {
    onValidationError?.(message);
    // Auto-hide the error after 5 seconds
    setTimeout(() => {
      onValidationError?.(null);
    }, 5000);
  };


  useEffect(() => {
    if (alertType) {
      setTimeout(() => {
        setAlertType(false);
      }, 3000);
    }
  }, [alertType, setAlertType]);

  const [placeHolderText, setPlaceHolderText] = useState(t("actionLabels.billNo"));

  useEffect(() => {
    setTimeout(() => {
      setPlaceHolderText((prev) =>
        prev === t("actionLabels.patientName") ? t("actionLabels.billNo") : t("actionLabels.patientName")
      );
    }, 4000);
  }, [placeHolderText]);


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
            ref={searchInputRef}
            type="text"
            placeholder={`Search by ${placeHolderText}`}
            className="pl-10 min-w-80"
            tabIndex={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const searchTerm = e.target.value;

              // Trigger API call with search term
              if (onFiltersChange) {
                onFiltersChange({ searchTerm });
              }

              // Also do client-side filtering for immediate UI response
              setFilteredData(
                searchTerm === "empty"
                  ? []
                  : data.filter((row) =>
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

        <div className="filters flex space-x-sm py-xs">
          <TableUtilToggle
            inputProps={{ checked, setChecked }}
            label={t("actionLabels.meMode")}
          />

          <FilterDialogue
            trigger={
              <TableUtilFilterButton
                icon={"assets/icons/FilterIcon.svg"}
                label={t("actionLabels.filters")}
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
                leadingIcon={"assets/icons/columns.svg"}
                label={t("actionLabels.showColumns")}
                tabIndex={5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="px-0 py-2 max-h-[70vh] overflow-y-auto">
              <span className="text-xs text-text-secondary m-sm">
                {t("actionLabels.showHideColumns")}
              </span>
              <div className="">
                <div
                  className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                  onClick={() => {
                    const columnsToToggle = table
                      .getAllColumns()
                      .filter((col) => col.id !== "billId" && col.getCanHide());

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
                      .filter((col) => col.id !== "billId" && col.getCanHide())
                      .every((col) => pendingColumnVisibility[col.id])}
                    onCheckedChange={(checked) => {
                      const columnsToToggle = table
                        .getAllColumns()
                        .filter((col) => col.id !== "billId" && col.getCanHide());

                      const newVisibilities = { ...pendingColumnVisibility };
                      columnsToToggle.forEach((col) => {
                        newVisibilities[col.id] = !!checked;
                      });
                      setPendingColumnVisibility(newVisibilities);
                    }}
                  />
                  <label className="pl-2 pr-4 cursor-pointer">{t("actionLabels.all")}</label>
                </div>

                {/* Individual Checkboxes */}
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide() && column.id !== "billId"
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
                          {columnNames[column.id]}
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
                    setOpenShowCols(false);
                  }}
                >
                  {t("actionLabels.save")}
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
                          ${index === columns.length - 1
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
                              className={`mr-2 transition-transform ${expandedGroups[groupKey]
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
                            .rows.find((r) => r.original.billId === row.billId); // Replace with unique key

                          if (!tableRow) return null;

                          return (
                            <TableRow key={row.billId} className="group">
                              {tableRow.getVisibleCells().map((cell, index) => (
                                <TableCell
                                  key={cell.id}
                                  className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${index === 0
                                    ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                                    : ""
                                    }
                                   ${index === columns.length - 1
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
                table.getRowModel().rows.map((row, _rowIndex) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${index === 0
                          ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                          : ""
                          }
                         ${index === columns.length - 1
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
                        src={"assets/icons/alert-circle.svg"}
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
            }
          }}
          deselectRows={deselectRows}
          setShowAlert={() => {}}
        /> */}
        {openSubmitBill && (
          <SubmitBillModal
            onClose={() => setOpenSubmitBill(false)}
            setAlertType={(type) =>
              setAlertType(type as "submit" | "cancel" | null)
            }
            selectedBills={selectedRowsForSubmit} // Pass all selected bills
          />
        )}

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
            }
          }}
          setOpenCancelBill={setOpenCancelBill}
          setOpenSubmitBill={setOpenSubmitBill}
          setSelectedForSubmit={setSelectedRowsForSubmit}
          onDelete={onDelete}
          onValidationError={handleValidationError}
        />
      </div>

      {/* Pagination UI (same as OPD bills) */}
      {!loading && table.getRowModel().rows.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {metadata ? (
              `${t("common.page")} ${metadata.currentPage} ${t("common.of")} ${metadata.totalPages}`
            ) : (
              `${t("common.page")} ${currentPage + 1} ${t("common.of")} ${totalPages}`
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="button"
              type="secondary-button"
              onClick={() => {
                if (metadata && metadata.currentPage > 1) {
                  onPageChange?.(metadata.currentPage - 1);
                }
              }}
              disabled={!metadata || metadata.currentPage <= 1}

            >
              {t("common.previous")}
            </Button>

            {pageNumbers.map((page, index) =>
              page === DOTS ? (
                <span key={index} className="px-2 text-muted-foreground">
                  {DOTS}
                </span>
              ) : (
                <Button
                  key={index}
                  type={metadata && metadata.currentPage === (typeof page === "number" ? page + 1 : page) ? "primary-button" : "secondary-button"}
                  className={`h-8 w-8 p-0 ${metadata && metadata.currentPage === (typeof page === "number" ? page + 1 : page) ? "bg-primary text-white" : ""
                    }`}
                  onClick={() =>
                    typeof page === "number" && onPageChange?.(page + 1)
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
                if (metadata && metadata.currentPage < metadata.totalPages) {
                  onPageChange?.(metadata.currentPage + 1);
                }
              }}
              disabled={!metadata || metadata.currentPage >= metadata.totalPages}

            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
