"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPackageBillConversionLogFilterSearchList } from "@/store/package_bill_conversion_log/thunks";
import TableUtilFilterButton from "@/components/table-util-buttons/TableUtilFilterButton";
import FilterDialogue from "./FilterDialogue";
import { Search } from "lucide-react";

import Image from "next/image";
import { Input } from "../ui/input";
import Buttons from "../buttons/Button";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PackageBillConversionLogSerachFilterRequestDto, PackageBillConversionLogSerachFilterResponseDto } from "@/services/api-client";



const columns: ColumnDef<PackageBillConversionLogSerachFilterResponseDto & { id: string | number }>[] = [
  {
    accessorKey: "serviceName",
    header: () => (
      <div className="w-full h-10 border-r border-[#D9D9E0] pr-3">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Service
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span className="text-left w-full  h-10 flex items-center border-r border-[#D9D9E0] pr-3">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "changeType",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Change Type
      </Button>
    ),
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "sourcePackage",
    header: () => (
      <div className="text-left w-full block p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Source Package
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "targetPackage",
    header: ({ column }) => (
      <div className="text-right w-full block">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Target Package
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span
        className={`w-full block h-10 py-3 `}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
  {
    accessorKey: "requisitionDate",
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
                Requisition Date/Time
              </span>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white text-sm font-medium bg-[#0090FF]">
            <p>Requisition Date/Time</p>
            <TooltipArrow className="fill-[#0090FF]" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    cell: ({ getValue }) => (
      <span
        className={`w-full block`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modifiedDate",
    header: ({ column }) => (
      <div className="w-full block">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Modified Date/Time
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span
        className={`text-right w-full block h-10 py-3`}
      >
        {String(getValue())}
      </span>
    ),
    enableSorting: true,
    sortingFn: "basic",
  },
];


interface DiscountProps {
  setOpen: (open: boolean) => void;
}

const PackageBillConversionLog: React.FC<DiscountProps> = ({ setOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filterSearchList,
    loading: _loading,
    error: _error,
  } = useSelector((state: RootState) => state.packageBillConversionLog);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<(PackageBillConversionLogSerachFilterResponseDto & { id: string | number })[]>(
    (filterSearchList?.data?.items || []).map((item, index) => ({ ...item, id: index }))
  );
  const [openFilters, setOpenFilters] = useState(false);
  const [filterCounts, setFilterCounts] = useState<Record<string, unknown>>({});
  const filters = useSelector(
    (state: RootState) => state.packageBillConversionFilters
  );

  // build API payload (always include all fields)
  const buildPackageBillConversionPayload = (
    filters: Partial<PackageBillConversionLogSerachFilterRequestDto>,
    pageNumber: number,
    pageSize: number
  ): PackageBillConversionLogSerachFilterRequestDto => ({
    patientVisitId: filters.patientVisitId ?? undefined,
    sourcePackage: filters.sourcePackage ?? [],
    targetPackage: filters.targetPackage ?? [],
    changeType: filters.changeType ?? [],
    modifiedByList: filters.modifiedByList ?? [],
    searchTerm: filters.searchTerm ?? "",
    pageNumber,
    pageSize,
  });

  // build applied filters (for badge count, UI display)
  const getAppliedFilters = (
    filters: PackageBillConversionLogSerachFilterRequestDto
  ) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([
        _key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value.trim() !== "";
        if (value === null || value === undefined) return false;
        return true;
      })
    );
  };

  useEffect(() => {

    const payload = buildPackageBillConversionPayload(
      filters,
      1,
      20
    );

    dispatch(
      fetchPackageBillConversionLogFilterSearchList({
        version: "1",
        tenant: "",
        requestBody: payload,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  useEffect(() => {
    if (!filters) return;

    const payload = buildPackageBillConversionPayload(filters, 1, 20);
    dispatch(
      fetchPackageBillConversionLogFilterSearchList({
        version: "1",
        tenant: "",
        requestBody: payload,
      })
    );
    const appliedFilters = getAppliedFilters(payload);
    console.log("Filters", appliedFilters);
  }, [dispatch, filters]);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);


    const payload = buildPackageBillConversionPayload(
      { ...filters, searchTerm: value },
      1,
      20
    );
    dispatch(
      fetchPackageBillConversionLogFilterSearchList({
        version: "1",
        tenant: "",
        requestBody: payload,
      })
    );
  };




  return (
    <div className="w-full h-full flex flex-col rounded-lg bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between  px-4 border-b border-b-[#D9D9E0]">
        <div className="w-full px-0 py-4  gap-2 flex flex-row">
          <Image
            src={"assets/icons/Camera.svg"}
            width={24}
            height={24}
            alt="Rupee"
          />
          <p className="text-[#1C2024] text-base font-semibold">
            Package Bill Conversion Log
          </p>
        </div>
        <Buttons
          iconSrc={"assets/icons/X.svg"}
          size="sm"
          type="secondary-button"
          variant="icon"
          onClick={() => setOpen(false)}
        ></Buttons>
      </div>

      {/* Body (scrollable) */}
      <div className="flex-1 w-full overflow-y-auto px-30 py-4">
        <div className="flex justify-between items-center py-3">
          <div className="text-lg font-semibold flex justify-center">
            Conversion Log
          </div>
          <div className="filters flex space-x-sm py-xs">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder={`Search`}
                className="pl-10 min-w-80"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <FilterDialogue
              trigger={
                <TableUtilFilterButton
                  icon={"assets/icons/FilterIcon.svg"}
                  label={"Filters"}
                  badgeCount={Object.keys(filterCounts).length}
                />
              }
              modalProps={{ openFilters, setOpenFilters }}
              filterProps={{ filterCounts, setFilterCounts }}
            />
          </div>
        </div>
        <DataTable
          table={table}
          columns={columns}
          dataProps={{ data, setData }}
          initialData={data}
        />
      </div>

      {/* Footer */}
      <div className="w-full px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex justify-end">
        <Buttons size="button-small" type="primary-button" variant="button">
          Done
        </Buttons>
      </div>
    </div>
  );
};

export default PackageBillConversionLog;
