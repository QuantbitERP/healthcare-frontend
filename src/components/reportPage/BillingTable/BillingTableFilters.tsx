"use client";
import React, { SetStateAction, Dispatch, useState, useEffect, useRef } from "react";
import DateRangePicker from "@/components/DateRange/DateRangePicker";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { DateRange } from "react-day-picker";
import BuildReport from "./BuildReport";
import { reportColumns } from './columns';
import { addDays } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import UtilDropDownButton from "@/components/table-util-buttons/UtilDropDownButton";
export interface BillingTableFiltersProps {
  serviceGroup: string[];
  setServiceGroup: Dispatch<SetStateAction<string[]>>;
  department: string[];
  setDepartment: Dispatch<SetStateAction<string[]>>;
  service: string[];
  setService: Dispatch<SetStateAction<string[]>>;
  billingClass: string[];
  setBillingClass: Dispatch<SetStateAction<string[]>>;
  companyName: string[];
  setCompanyName: Dispatch<SetStateAction<string[]>>;
  groupBy: string[];
  setGroupBy: Dispatch<SetStateAction<string[]>>;
  ApplyFilter: () => void;
  dateProps: any;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  loading?: boolean;
  onSuccess?: () => void;
}
export default function BillingTableFilters({
  serviceGroup,
  setServiceGroup,
  department,
  setDepartment,
  service,
  setService,
  billingClass,
  setBillingClass,
  companyName,
  setCompanyName,
  groupBy,
  setGroupBy,
  ApplyFilter,
  visibleColumns,
  setVisibleColumns,
  loading = false,
  onSuccess,
}: BillingTableFiltersProps) {
  const isMountedRef = useRef(true);
  const [openReport, setOpenReport] = useState(false);
  const [filters, setFilters] = useState({});
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  const handleApplyFilter = () => {
    if (!loading) {
      ApplyFilter();
    }
  };

  // const handleDateChange = (newDate: any) => {
  //   setDate(newDate);
  //   ApplyFilter();
  // };

  const [openShowCols, setOpenShowCols] = useState(false);
  const [pendingColumns, setPendingColumns] = useState<string[]>(visibleColumns);

  const [sortedColumn, setSortedColumn] = useState('srNo');
  const [columnsDef, setColumnsDef] = useState<any[]>([]);
  // const table = useReactTable({
  //   data: [],
  //   columns: columnsDef,
  //   state: {},
  //   getCoreRowModel: () => (() => ({ rows: [], flatRows: [], rowsById: {} })),
  // });

  // Focus search field on component mount
  useEffect(() => {
    if (!isMountedRef.current) return;
    const searchInput = document.querySelector('input[placeholder="Search by Column Name"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  // Initialize columns after component mounts
  useEffect(() => {
    if (!isMountedRef.current) return;
    const columns = reportColumns(sortedColumn, setSortedColumn);
    setColumnsDef(columns);
  }, [sortedColumn]);

  // Initialize pending columns when dropdown opens
  useEffect(() => {
    if (!isMountedRef.current) return;
    if (openShowCols && columnsDef.length > 0) {
      setPendingColumns(visibleColumns.length > 0 ? visibleColumns : columnsDef.map(col => col.accessorKey));
    }
  }, [openShowCols, columnsDef, visibleColumns]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-lg py-sm">
      <div className="relative">
        <Image
          src="/assets/icons/Search.svg"
          alt="Search"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder="Search by Column Name"
          className="pl-10 min-w-80"
        />
      </div>
      <div className="filters flex space-x-sm py-xs items-center">
        <BuildReport
          groupByProps={{ groupBy, setGroupBy }}
          dateProps={{ date, setDate }}
          trigger={
            <div className={`w-fit cursor-pointer h-8 flex flex-row gap-2 rounded-full items-center border border-[#B9BBC6] bg-white px-3 py-2 text-xs ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                <Image src="/assets/icons/NotepadTimer.svg" alt="Build Report" width={16} height={16} />
              )}
              <span className="font-medium">{loading ? "Loading..." : "Build Report"}</span>
            </div>
          }
          filterProps={{
            filters,
            setFilters,
          }}
          modalProps={{
            openFilters: openReport,
            setOpenFilters: setOpenReport,
          }}
          serviceGroupProps={{ serviceGroup, setServiceGroup }}
          departmentProps={{ department, setDepartment }}
          serviceProps={{ service, setService }}
          billingClassProps={{ billingClass, setBillingClass }}
          companyNameProps={{ companyName, setCompanyName }}
          ApplyFilter={handleApplyFilter}
          onSuccess={onSuccess}
        />
        <DateRangePicker dateProps={{ date, setDate }} />
        <DropdownMenu open={openShowCols} onOpenChange={setOpenShowCols}>
          <DropdownMenuTrigger asChild>
            <span>
              <UtilDropDownButton
                leadingIcon={"/assets/icons/columns.svg"}
                label={"Show Columns"}
                className="text-xs"
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-0 py-2">
            <span className="text-xs text-text-secondary m-sm">Show/Hide Columns</span>
            {/* ALL checkbox */}
            <div
              className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
              onClick={() => {
                const allSelected = pendingColumns.length === columnsDef.length;
                setPendingColumns(allSelected ? [] : columnsDef.map(col => col.accessorKey));
              }}
            >
              <Checkbox
                checked={pendingColumns.length === columnsDef.length}
                onCheckedChange={checked => {
                  setPendingColumns(checked ? columnsDef.map(col => col.accessorKey) : []);
                }}
                onClick={(e) => e.stopPropagation()}
                id="all-columns"
              />
              <label htmlFor="all-columns" className="pl-2 pr-4 cursor-pointer">All</label>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {columnsDef.map(col => (
                <div
                  key={col.accessorKey}
                  className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                  onClick={() => {
                    setPendingColumns(prev =>
                      prev.includes(col.accessorKey)
                        ? prev.filter(c => c !== col.accessorKey)
                        : [...prev, col.accessorKey]
                    );
                  }}
                >
                  <Checkbox
                    checked={pendingColumns.includes(col.accessorKey)}
                    onCheckedChange={checked => {
                      setPendingColumns(prev =>
                        checked
                          ? [...prev, col.accessorKey]
                          : prev.filter(c => c !== col.accessorKey)
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    id={col.accessorKey}
                  />
                  <label htmlFor={col.accessorKey} className="pl-2 pr-4 cursor-pointer">{col.label}</label>
                </div>
              ))}
            </div>
            <div className="p-sm">
              <button
                type="button"
                className="bg-white flex space-x-sm rounded-lg px-sm py-xs font-medium text-sm items-center border border-[#CDCED6]"
                onClick={() => {
                  setVisibleColumns(pendingColumns);
                  setOpenShowCols(false);
                }}
              >
                Save
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
