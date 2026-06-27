"use client";
import { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  // getPaginationRowModel,
  getGroupedRowModel,
  GroupingState,
  ExpandedState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Button from "../buttons/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import SortableHeaderButton from "../table-util-buttons/SortableHeaderButton";
import TableUtilToggle from "../table-util-buttons/TableUtilToggle";
import DateRangePicker from "../DateRange/DateRangePicker";
import UtilDropDownButton from "../table-util-buttons/UtilDropDownButton";
import BulkAction from "../bulkAction/BulkAction";
import Tags from "../statusTags/Tags";
import TableUtilFilterButton from "../table-util-buttons/TableUtilFilterButton";
import { formatCurrency } from "@/utils/CurrencyUtils";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { getExpandedRowModel } from "@tanstack/react-table";

// Utility function for pinned column styles
const getCommonPinningStyles = (column: any, autoSize: boolean | undefined) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  const styleTable = {
    background: isFirstRightPinnedColumn ? "#FFF" : "inherit",
    boxShadow: isLastLeftPinnedColumn
      ? "-1px 0px 0px 0px #D9D9E0 inset"
      : isFirstRightPinnedColumn
        ? "1px 0px 0px 0px #D9D9E0 inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: !autoSize ? column.getSize() + "px" : "auto",
    zIndex: isPinned ? 50 : 0,
  } as any;
  if (isPinned === "left") {
    styleTable.paddingRight = "12px";
  }
  if (isLastLeftPinnedColumn || isFirstRightPinnedColumn) {
    styleTable.borderBottom = "1px solid #D9D9E0";
  }

  return styleTable;
};

interface DataTableComponentProps {
  groupColumn?: string;
  pageName?: string;
  isRowSelectable?: boolean;
  searchPlaceholder?: string;
  data: any[];
  columns: any[];
  columnNames: any;
  onSearch?: (searchTerm: string) => void;
  onToggleMe?: (meMode: boolean) => void;
  onFilterClick?: () => void;
  stickyColumn?: any;
  onDelete?: any;
  height?: string;
  hideFilters?: boolean;
  autoSize?: boolean;
  defaultSort?: any;
  meKeyAccesser?: string;
  SearchPlaceholder?: string;
  filterCount?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: { id: string; desc: boolean }) => void;
  paginationMeta?: {
    current_page: number;
    per_page: number;
    sort_by?: string;
    sort_order?: string;
    total_count: number;
    total_pages: number;
  };
  loading?: boolean; // Assuming loading is passed as a prop
  onDataChange?: (date: DateRange | undefined) => void;
  children?: ReactNode;
  // hidePagination?: boolean;
  hideMeFilter?: boolean;
  totalPages?: number;
  hideDatePicker?: boolean;
  hideShowColumns?: boolean;
  className?: string;
  isSearchFocus?: boolean;
}

export default function GroupedDataTableComponent({
  className,
  isRowSelectable = false,
  data,
  columns,
  columnNames,
  onSearch,
  onToggleMe,
  stickyColumn,
  onDelete,
  onFilterClick,
  hideFilters = false,
  defaultSort,
  meKeyAccesser = "created_by",
  filterCount = 0,
  searchPlaceholder = "Search",
  paginationMeta,
  loading = false, // Assuming loading is passed as a prop
  onDataChange,
  children,
  autoSize = false,
  hideMeFilter = false,
  onSortChange,
  hideDatePicker = false,
  pageName,
  hideShowColumns = false,
  isSearchFocus = false,
  groupColumn,
}: DataTableComponentProps) {
  const [tableData, setTableData] = useState(data);
  const [sorting, setSorting] = useState(defaultSort || []);
  const [columnPinning] = useState(stickyColumn || { left: [], right: [] });
  const [columnVisibility, setColumnVisibility] = useState({});
  // const [loading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [openShowCols, setOpenShowCols] = useState(false);
  const [meMode, setMeMode] = useState(false);

  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const [date, setDate] = useState<DateRange | undefined>();
  const memoizedData = useMemo(() => tableData, [tableData]);


  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [grouping, setGrouping] = useState<GroupingState>(
    groupColumn ? [groupColumn] : []
  );

  useEffect(() => {
    setTableData(data)
  }, [data, data.length])

  const memoizedColumns = useMemo(() => {
    if (!columns || columns.length === 0) return [];
    const updatedColumns = [...columns];
    updatedColumns[0] = {
      ...updatedColumns[0],
      enableHiding: false,
    };

    return updatedColumns;
  }, [columns]);

  useEffect(() => {
    if (groupColumn) {
      setGrouping([groupColumn]);
    }
  }, [groupColumn]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting as any,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // // getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onGroupingChange: setGrouping,
    // debugTable: true,
    state: {
      grouping: grouping,
      expanded: expanded,
      sorting,
      columnVisibility,
      globalFilter,
      columnPinning,
    },
  });

  // useEffect(() => {
  //   setTableData(data);
  // }, [data]);

  useEffect(() => {
    if (!date?.from || !date?.to) return;
    console.log(date);
    onDataChange?.(date);
    // const timeout = setTimeout(() => {
    //   onDataChange?.(date);
    // }, 2000);
    // return () => clearTimeout(timeout);
  }, [date, onDataChange]);

  const toggleMeMode = () => {
    const newMeMode = !meMode;
    setTableData(
      newMeMode
        ? data.filter(
          (e) => e[meKeyAccesser || "created_by"]?.toLowerCase() === "me"
        )
        : data
    );
    setMeMode(newMeMode);
    onToggleMe?.(newMeMode);
  };
  // useEffect(() => {
  //   if (openShowCols) {
  //     const initialVisibilities: Record<string, boolean> = {};
  //     table
  //       .getAllColumns()
  //       .filter((col) => col.getCanHide() && col.id !== "package")
  //       .forEach((col) => {
  //         initialVisibilities[col.id] = col.getIsVisible();
  //       });
  //     setPendingColumnVisibility(initialVisibilities);
  //   }
  // }, [openShowCols, table]);

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  const renderTableFilters = () => (
    <div className="flex justify-between items-center px-lg py-sm">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder={searchPlaceholder || "Search"}
          className="pl-10 min-w-80"
          autoFocus={isSearchFocus}
          onFocus={(e) => {
            e.target.value = "";
          }}
          onChange={(e) => {
            const searchTerm = e.target.value;
            if (onSearch) {
              onSearch?.(searchTerm);
            } else {
              table.setGlobalFilter(searchTerm);
            }
          }}
        />
      </div>
      <div className="filters flex space-x-sm py-xs">
        {!hideMeFilter && (
          <TableUtilToggle
            inputProps={{ checked: meMode, setChecked: toggleMeMode }}
            label="Me Mode"
          />
        )}
        <TableUtilFilterButton
          icon={"assets/icons/FilterIcon.svg"}
          label="Filter"
          badgeCount={filterCount || 0}
          onClick={onFilterClick}
        />
        {!hideDatePicker && (
          <DateRangePicker dateProps={{ date: date, setDate: setDate }} />
        )}

        {!hideShowColumns && !isEmptyObject(columnNames) && (
          <DropdownMenu onOpenChange={setOpenShowCols} open={openShowCols}>
            <DropdownMenuTrigger asChild>
              <UtilDropDownButton
                leadingIcon={"assets/icons/columns.svg"}
                label="Show Columns"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="px-0 py-2 z-[100]">
              <span className="text-xs text-text-secondary m-sm">
                Show/Hide Columns
              </span>
              {/* ALL Column */}
              <div className="max-h-[200px] overflow-auto ">
                <div
                  className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                  onClick={() => {
                    const columnsToToggle = table
                      .getAllColumns()
                      .filter(
                        (col) => col.id !== "package" && col.getCanHide()
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
                      .filter((col) => col.id !== "package" && col.getCanHide())
                      .every((col) => pendingColumnVisibility[col.id])}
                    onCheckedChange={(checked) => {
                      const columnsToToggle = table
                        .getAllLeafColumns()
                        .filter((col) => {
                          const isPinned =
                            table
                              .getState()
                              .columnPinning.left?.includes(col.id) ||
                            table
                              .getState()
                              .columnPinning.right?.includes(col.id);
                          return col.getCanHide() && !isPinned;
                        });
                      const newVisibilities = { ...pendingColumnVisibility };
                      columnsToToggle.forEach((col) => {
                        newVisibilities[col.id] = !!checked;
                      });
                      setPendingColumnVisibility(newVisibilities);
                    }}
                  />
                  <label className="pl-2 pr-4 cursor-pointer">All</label>
                </div>

                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .filter((column: any) => {
                    if (columnNames[column.columnDef.accessorKey]) {
                      return true;
                    }
                    return false;
                  })
                  .map((column) => (
                    <div
                      key={column.id}
                      className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounde-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                      onClick={() => {
                        setPendingColumnVisibility((prev) => ({
                          ...prev,
                          [column.id]: !prev[column.id],
                        }));
                      }}
                    >
                      <Checkbox checked={pendingColumnVisibility[column.id]} />
                      <label className="pl-2 pr-4 cursor-pointer">
                        {columnNames[column.id as keyof typeof columnNames]}
                      </label>
                    </div>
                  ))}
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
                  Save
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  const onSort = (columnId: string, nextOrder: "asc" | "desc") => {
    if (onSortChange) {
      onSortChange({
        id: columnId,
        desc: nextOrder === "desc",
      });
    }
  };

  const renderTableHeader = () => (
    <TableHeader className="sticky top-0 z-40 bg-[#FCFCFD]">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="hover:bg-transparent !border-0  "
        >
          {headerGroup.headers.map((header, index) => {
            const columnId = header.column.id;
            const isSorted = paginationMeta?.sort_by === columnId;
            const currentOrder = paginationMeta?.sort_order;
            const nextOrder =
              isSorted && currentOrder === "asc" ? "desc" : "asc";

            const headerPinStyles = getCommonPinningStyles(header.column, autoSize) as any;
            headerPinStyles.background = "#F8F9FA";
            return (
              <TableHead
                key={header.id}
                className={`text-left px-6 py-3 h-10 font-medium text-sm text-[#1C2024] [&>button]:hover:bg-transparent [&>button]:px-0 border-0 bg-[#F8F9FA] whitespace-nowrap overflow-hidden border-b border-[#E5E7EB]
                  ${["package"].includes(header.column.id)
                    ? "sticky left-0 z-[60] bg-[#F8F9FA]"
                    : ""
                  } `}
                style={{ ...headerPinStyles, height: '40px', maxHeight: '40px', minHeight: '40px' }}
              >
                <div className="flex items-center text-sm font-medium gap-2 h-full overflow-hidden">
                  {isRowSelectable && index === 0 && (
                    <Checkbox
                      checked={table.getIsAllRowsSelected()}
                      className="mr-4"
                      onCheckedChange={() => table.toggleAllRowsSelected()}
                    />
                  )}
                  <div
                    className={cn({
                      "flex items-center cursor-pointer select-none": true,
                      "text-black":
                        header.column.getIsSorted() === "asc" ||
                        header.column.getIsSorted() === "desc",
                    })}
                    onClick={() => {
                      if (onSortChange) {
                        onSort(columnId, nextOrder);
                      } else {
                        header.column.getToggleSortingHandler();
                      }
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null}
                  </div>
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
      <TableRow>
        {table.getFooterGroups()[0].headers.map((header) => (
          <TableHead
            key={header.id}
            className={`text-left px-0 py-0 [&>button]:hover:bg-transparent [&>button]:px-0 border-0 bg-white border-t border-border `}
            style={getCommonPinningStyles(header.column, autoSize) as any}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.footer, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => {
    if (table.getRowModel().rows.length) {
      return table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className="group"
        >
          {row.getVisibleCells().map((cell, index) => {
            // if (cell.getIsAggregated()) {
            // }
            return (
              <TableCell
                key={cell.id}
                className={`text-nowrap px-4 py-2  ${index === 0
                    ? "bg-inherit hover:text-primary hover:font-bold "
                    : ""
                  }
                         `}
                style={getCommonPinningStyles(cell.column, autoSize) as any}
              >
                <div className="flex items-center gap-2">
                  {isRowSelectable && index === 0 && (
                    <Checkbox
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      onCheckedChange={row.getToggleSelectedHandler()}
                      className="mr-2"
                    />
                  )}
                  <div
                    className={cn({
                      "flex-1": true,
                      "text-black font-medium":
                        cell.column.getIsSorted() === "asc" ||
                        cell.column.getIsSorted() === "desc",
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {/* {flexRender(
                          cell.column.columnDef.aggregatedCell,
                          cell.getContext()
                        )} */}

                    {/* {cell.getIsAggregated()
                      ? flexRender(
                          cell.column.columnDef.aggregatedCell,
                          cell.getContext()
                        )
                      : cell.getIsGrouped()
                      ? flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )} */}
                    {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                  </div>
                </div>
              </TableCell>
            );
          })}
        </TableRow>
      ));
    }

    // return (
    //   <TableRow className="hover:!bg-transparent">
    //     <TableCell colSpan={columns.length} className="h-24 text-center py-20">
    //       <div className="flex flex-col items-center justify-center w-full space-y-3">
    //         <Image
    //           src={"assets/icons/alert-circle.svg"}
    //           height={24}
    //           width={24}
    //           alt="no data found"
    //         />
    //         <span className="text-base">No results Found.</span>
    //         <span className="text-sm text-[#60646C]">
    //           We could not find any result matching your search criteria.
    //         </span>
    //       </div>
    //     </TableCell>
    //   </TableRow>
    // );
  };

  const renderLoadingSkeletons = () =>
    [...new Array(10)].map((_, i) => (
      <TableRow key={i}>
        {columns.map((_, index) => (
          <TableCell key={index}>
            <Skeleton className="h-4 my-2" />
          </TableCell>
        ))}
      </TableRow>
    ));

  const visibleColumns = table.getVisibleFlatColumns();
  if (visibleColumns.length < 3) {
    autoSize = true;
  }

  return (
    <div>
      {!hideFilters && renderTableFilters()}
      <div
        className={
          "rounded-md border border-[#D9D9E0] mx-lg flex flex-col overflow-hidden " +
          className
        }
      >
        <div className=" overflow-y-auto relative flex-grow ">
          <Table
            className="border-collapse-separate border-spacing-0 !border-[#D9D9E0]"
            style={{ width: !autoSize ? table.getTotalSize() : "100%" }}
          >
            {renderTableHeader()}
            <TableBody>
              {loading ? renderLoadingSkeletons() : renderTableBody()}
            </TableBody>
          </Table>
        </div>
        {children}
        <BulkAction
          pageName={pageName || ""}
          modalProps={{
            open: table.getSelectedRowModel().rows.length > 0,
            setOpen: () => { },
          }}
          deselectRows={() => table.resetRowSelection()}
          rows={table.getSelectedRowModel().rows as any[]}
          onDelete={() => {
            if (onDelete) {
              onDelete(table.getSelectedRowModel().rows);
            }

            table.resetRowSelection();
          }}
        />
      </div>
      {/* {!hidePagination && renderTablePagination()} */}
    </div>
  );
}

export function TableCellComponents({
  type,
  value,
}: {
  type: "status" | "date" | "user" | "currency";
  value: string;
}) {
  // Safety check to prevent rendering Error objects
  // if (!value || typeof value !== 'string') return null;
  if (type == "status") {
    return (
      <Tags type={value == "Active" ? "success" : "danger"} tagText={value} />
    );
  } else if (type == "user") {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return <span>-</span>;
    }
    const initial = (value as string)?.trim()?.[0]?.toUpperCase() || "";
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-4 w-4">
          <AvatarFallback className="text-white font-normal text-[10px]">
            {initial}
          </AvatarFallback>
        </Avatar>
        <span className="text-md  ">{value}</span>
      </div>
    );
  } else if (type == "date") {
    if (!value) {
      return <div>-</div>;
    }
    let dateObj: Date | null = null;
    try {
      dateObj = parseISO(value);
    } catch {
      return <div>-</div>;
    }

    return (
      <div className="">
        <span>{format(dateObj, "dd/MM/yyyy hh:mm a")}</span>
      </div>
    );
  } else if (type == "currency") {
    return (
      <div className="justify-end text-right">
        {formatCurrency(Number(value), "INR")}
      </div>
    );
  }

  return value;
}
