"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns, initialDataItem } from "./TableData";
import { DataTable } from "../EditableCellsTable/TableTry";

interface DistributeDataTableProps {
  tabledata: any[];
  onDataChange: (data: initialDataItem[]) => void;
  initialData: initialDataItem[]; // 👈 new prop
}

export function DistributeDataTable({
  tabledata,
  onDataChange,
  initialData,
}: DistributeDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [data, setData] = useState<initialDataItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    if (initialData && isMounted) {
      setData(initialData);
    }
    
    return () => {
      isMounted = false;
    };
  }, [initialData]);

  // Custom setData function that also calls onDataChange
  const handleDataChange = (newData: React.SetStateAction<initialDataItem[]>) => {
    const resolvedData = typeof newData === 'function' ? newData(data) : newData;
    setData(resolvedData);
    onDataChange(resolvedData);
  };
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    state: {
      columnVisibility,
    },
  });


  
  
  return (
    <div>
      <div className="flex justify-between items-center py-md">
        <span className="text-[#1C2024] text-lg font-semibold">
          Dependent Eligibility · {table.getCoreRowModel().rows.length}{" "}
        </span>
      </div>
      <div className="relative w-full">
        <div className="relative flex flex-col overflow-auto max-h-[calc(50vh)]">
          <DataTable
            columns={columns}
            dataProps={{ data, setData: handleDataChange }}
            initialData={initialData}
            table={table}
            addButton={true}
            dependentRelations={tabledata}
          />
        </div>
      </div>
    </div>
  );
}
