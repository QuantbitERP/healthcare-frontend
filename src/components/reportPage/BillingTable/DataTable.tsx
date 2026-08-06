"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  getGroupedRowModel,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { reportColumns } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import UtilDropDownButton from '@/components/table-util-buttons/UtilDropDownButton';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/buttons/Button';
import ColumnsIcon from '@/assets/icons/columns.svg';


const metricOptions = ["None", "Count", "Total", "Average", "Min.", "Max."];
function MetricDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="font-bold text-[#60646C] px-2 py-1 rounded hover:bg-gray-100 flex items-center text-xs"
          type="button"
        >
          {value}
          <ChevronDown size={14} className="ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[100px]">
        {metricOptions.map(opt => (
          <DropdownMenuItem
            key={opt}
            className={`cursor-pointer ${value === opt ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


interface DataTableProps {
  dateProps: any;
  visibleColumns?: string[];
  groupByColumn: string[];
  filters?: Record<string, any[]>; // Added filters prop
}

export default function DataTable({ visibleColumns, groupByColumn, filters }: DataTableProps) {
  const reportState = useSelector((state: RootState) => state.reportList);
  const rawData = reportState.items;
  const loading = reportState.loading;


  const [sortedColumn, setSortedColumn] = useState("srNo");
  const allColumns = useMemo(() => reportColumns(sortedColumn, setSortedColumn), [sortedColumn]);
  const columns = useMemo(
    () => visibleColumns ? allColumns.filter(col => visibleColumns.includes(col.accessorKey as string)) : allColumns,
    [allColumns, visibleColumns]
  );

  const [grouping, setGrouping] = useState<string[]>([]);
  const [expanded, setExpanded] = useState({});
  const [groupMetrics, setGroupMetrics] = useState<Record<
    string,
    { countMetric: string; countField: string; totalMetric: string; totalField: string }
  >>({});
  const [overallCountMetric, setOverallCountMetric] = useState("Count");
  const [overallTotalMetric, setOverallTotalMetric] = useState("Total");

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [_pendingColumnVisibility, setPendingColumnVisibility] = useState<Record<string, boolean>>({});
  const [openShowCols] = useState(false);

  const [_date, _setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });


  const mapGroupByToColumn = (groupByValue: string): string => {
    const groupByMapping: Record<string, string> = {
      "1": "billType",
      "2": "serviceGroup",
      "3": "consultingDoctor",
      "4": "companyType",
      "5": "companyName",
      "6": "billingClass",
      "7": "financialYear",
    };
    return groupByMapping[groupByValue] || groupByValue;
  };

  useEffect(() => {
    if (groupByColumn?.length) {
      const mapped = groupByColumn.map(mapGroupByToColumn);
      setGrouping(mapped);
    }
  }, [groupByColumn]);

  const table = useReactTable({
    data: rawData,
    columns: columns,
    state: {
      columnVisibility,
      grouping,
      expanded,
      sorting: [],
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: row => row.getIsGrouped(),
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    enableGrouping: true,
    manualGrouping: false,
  });

  useEffect(() => {
    if (openShowCols) {
      const initialVisibilities: Record<string, boolean> = {};
      table.getAllColumns().forEach((col) => {
        initialVisibilities[col.id] = col.getIsVisible();
      });
      setPendingColumnVisibility(initialVisibilities);
    }
  }, [openShowCols, table]);


  // Metric logic
  const computeMetric = (data: any[], metricType: string, field: string) => {
    if (!data) return 0;
    if (!data.length) return 0;
    const values = data.map(item => item[field]);
    switch (metricType) {
      case "Count": return data.length;
      case "Total": return values.reduce((sum, val) => sum + (val || 0), 0);
      case "Average": return values.reduce((sum, val) => sum + (val || 0), 0) / values.length;
      case "Min.": return Math.min(...values);
      case "Max.": return Math.max(...values);
      default: return 0;
    }
  };


  // Update formatValue to remove decimals for all 'Total' metrics
  const formatValue = (value: number, field: string, metricType?: string) => {
    const currencyFields = ["billAmount", "serviceAmount", "taxAmount", "discountAmount", "netAmount"];
    if (currencyFields.includes(field)) {
      if (metricType === "Total") {
        return value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
      }
      return value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value.toString();
  };


  const hasGrouping = grouping.length > 0;

  const hasFilters = filters && Object.values(filters).some(val => val && val.length > 0);


  const overallCountValue = (hasGrouping || hasFilters)
    ? computeMetric(rawData, overallCountMetric, "billAmount")
    : 0;
  const overallTotalValue = (hasGrouping || hasFilters)
    ? computeMetric(rawData, overallTotalMetric, "billAmount")
    : 0;

  const renderCell = (cell: any, index: number) => (
    <TableCell
      key={cell.id}
      className={`text-nowrap px-4 py-1 h-10 ${index === 0 ? "bg-inherit hover:text-primary hover:font-bold" : ""}`}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );



  return (
    <div className="rounded-md border border-[#D9D9E0] mx-lg flex flex-col overflow-hidden">

      <div className="overflow-y-auto relative flex-grow">
        <table className="w-full text-sm text-left border-collapse-separate border-spacing-0 !border-[#D9D9E0]">
          <thead>
            <tr>
              {table.getHeaderGroups().map(headerGroup =>
                headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="sticky top-0 z-30 bg-[#FCFCFD] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1px] after:bg-[#D9D9E0] after:bottom-0 px-4 py-1 h-10 font-semibold text-xs text-[#1C2024]"
                    style={{ background: '#FCFCFD' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <TableBody>
            {/* Remove custom summary row styling, use standard row/cell */}
            <TableRow>
              <TableCell colSpan={table.getAllLeafColumns().length} className="h-10 font-semibold text-[#1C2024] bg-[#FCFCFD] border-b border-[#D9D9E0] px-4 py-1">
                <div className="flex items-center space-x-8 text-xs font-semibold">
                  <div className="flex items-center space-x-1">
                    <MetricDropdown value={overallCountMetric} onChange={setOverallCountMetric} />
                    <span className="text-[#344054] font-bold ml-1">{overallCountValue}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MetricDropdown value={overallTotalMetric} onChange={setOverallTotalMetric} />
                    <span className="text-[#344054] font-bold ml-1">
                      ₹{overallTotalMetric === "Total"
                        ? overallTotalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                        : overallTotalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            {loading && (!rawData || rawData.length === 0) ? (
              <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center py-20">
                </TableCell>
              </TableRow>
            ) : loading ? (
              [...Array(9)].map((_, rowIndex) => (
                <React.Fragment key={`skeleton-${rowIndex}`}>
                  <TableRow>
                    {table.getAllLeafColumns().map((column, colIndex) => (
                      <TableCell key={`skeleton-cell-${colIndex}`}>
                        <div className="h-4 my-2 bg-gray-200 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))
            ) : table.getRowModel().rows.length ? (

              table.getRowModel().rows.map((row) => {
                if (row.getIsGrouped()) {
                  const groupKey = row.id;
                  const metrics = groupMetrics[groupKey] || {
                    countMetric: "Count",
                    countField: "billAmount",
                    totalMetric: "Total",
                    totalField: "billAmount",
                  };
                  const groupItems = rawData.filter(item =>
                    grouping.every(col => (item as any)[col] === row.getValue(col))
                  );
                  const countValue = computeMetric(groupItems, metrics.countMetric, metrics.countField);
                  const totalValue = computeMetric(groupItems, metrics.totalMetric, metrics.totalField);

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow className="hover:bg-[#F5F6FA]">
                        <TableCell
                          className="text-nowrap px-lg py-1 h-10 font-semibold text-[#1C2024] bg-[#FCFCFD] border-b border-[#D9D9E0]"
                          colSpan={table.getAllLeafColumns().length}
                        >
                          <div className="flex items-center space-x-8 text-sm font-normal">
                            <button
                              onClick={() => row.toggleExpanded()}
                              className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded"
                            >
                              {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={16} />}
                              <span className="font-semibold">
                                {grouping.map(col => row.getValue(col)).join(" / ")}
                              </span>
                            </button>
                            <MetricDropdown
                              value={metrics.countMetric}
                              onChange={val =>
                                setGroupMetrics(prev => ({
                                  ...prev,
                                  [groupKey]: { ...metrics, countMetric: val }
                                }))
                              }
                            />
                            <span className="text-[#344054] font-bold ml-1">{countValue}</span>

                            <MetricDropdown
                              value={metrics.totalMetric}
                              onChange={val =>
                                setGroupMetrics(prev => ({
                                  ...prev,
                                  [groupKey]: { ...metrics, totalMetric: val }
                                }))
                              }
                            />
                            <span className="text-[#344054] font-bold ml-1">{formatValue(totalValue, metrics.totalField, metrics.totalMetric)}</span>

                          </div>
                        </TableCell>
                      </TableRow>
                      {row.getIsExpanded() && (
                        <>
                          {row.subRows?.map((subRow) => (
                            <TableRow key={subRow.id} data-state={subRow.getIsSelected() && "selected"}>
                              {subRow.getVisibleCells().map((cell, index) => renderCell(cell, index))}
                            </TableRow>
                          ))}

                        </>
                      )}
                    </React.Fragment>
                  );
                }
              })
            ) : (
              <TableRow className="hover:!bg-transparent">
                <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center py-20">
                  <div className="flex flex-col items-center justify-center w-full space-y-3">
                    <Image src="assets/icons/alert-circle.svg" height={24} width={24} alt="no data found" />
                    <span className="block text-base">No results Found.</span>
                    <span className="block text-sm text-[#60646C]">We could not find any result matching your search criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
// Export ShowColumnsDropdown as a component for use in BillingTableFilters
export function ShowColumnsDropdown({
  table,
  openShowCols,
  setOpenShowCols,
  pendingColumnVisibility,
  setPendingColumnVisibility,
}) {
  // Get all columns with label for show/hide dropdown
  const allLeafColumns = table.getAllLeafColumns();
  const allColumnsWithLabels = allLeafColumns.map(col => ({
    id: col.id,
    label: (col.columnDef as any).label ?? col.id,
  }));
  return (
    <DropdownMenu open={openShowCols} onOpenChange={setOpenShowCols}>
      <DropdownMenuTrigger asChild>
        <UtilDropDownButton
          leadingIcon={ColumnsIcon}
          label={"Show Columns"}
          className={`text-xs`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-0">
        <span className="text-xs text-text-secondary m-sm">Show/Hide Columns</span>
        <div className="cursor-pointer rounded-none w-full h-fit px-4 py-2 flex flex-row text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm">
          <Checkbox
            checked={allColumnsWithLabels.slice(1).every(col => pendingColumnVisibility.hasOwnProperty(col.id) ? pendingColumnVisibility[col.id] : table.getColumn(col.id)?.getIsVisible())}
            onCheckedChange={(checked) => {
              allColumnsWithLabels.forEach((col, idx) => {
                if (idx !== 0) {
                  setPendingColumnVisibility(prev => ({ ...prev, [col.id]: !!checked }));
                }
              });
            }}
            id="all-checkbox"
          />
          <label htmlFor="all-checkbox" className="pl-2 pr-4 cursor-pointer">All</label>
        </div>
        {/* Make columns list scrollable */}
        <div className="max-h-64 overflow-y-auto">
          {allColumnsWithLabels.filter((col, idx) => idx !== 0).map((col) => {
            const isVisible = pendingColumnVisibility.hasOwnProperty(col.id)
              ? pendingColumnVisibility[col.id]
              : table.getColumn(col.id)?.getIsVisible();
            return (
              <div
                key={col.id}
                className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                onClick={() => {
                  setPendingColumnVisibility(prev => ({ ...prev, [col.id]: !isVisible }));
                }}
              >
                <Checkbox
                  checked={isVisible}
                  onChange={e => {
                    setPendingColumnVisibility(prev => ({ ...prev, [col.id]: !!(e.target as HTMLInputElement).checked }));
                  }}
                  id={col.id}
                />
                <label htmlFor={col.id} className="pl-2 pr-4 cursor-pointer">{col.label}</label>
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
              Object.entries(pendingColumnVisibility).forEach(([columnId, isVisible]) => {
                const column = table.getColumn(columnId);
                if (column) {
                  column.toggleVisibility(isVisible as boolean);
                }
              });
              setPendingColumnVisibility({});
              setOpenShowCols(false);
            }}
          >
            Save
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
