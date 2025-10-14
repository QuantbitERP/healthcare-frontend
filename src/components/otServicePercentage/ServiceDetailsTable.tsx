"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns, ServiceDetailItem } from "./ServiceDetailsTableData";
import { DataTable } from "../EditableCellsTable/TableTry";

interface ServiceDetailsTableProps {
  onDataChange: (data: ServiceDetailItem[]) => void;
  initialData: ServiceDetailItem[];
  onServiceNameClick?: (service: ServiceDetailItem) => void;
  billingClasses?: any[];
}


export function ServiceDetailsTable({
  onDataChange,
  initialData,
  onServiceNameClick,
  billingClasses,
}: ServiceDetailsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [data, setData] = useState<ServiceDetailItem[]>([]);

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
  const handleDataChange = (newData: React.SetStateAction<ServiceDetailItem[]>) => {
    const resolvedData = typeof newData === 'function' ? newData(data) : newData;
    setData(resolvedData);
    onDataChange(resolvedData);
  };

  // Override the DataTable's internal handleUpdate by creating a custom dataProps
  const customDataProps = {
    data,
    setData: (newData: React.SetStateAction<ServiceDetailItem[]>) => {
      // Check if this is a direct field update (not a function call)
      if (typeof newData !== 'function') {
        // This is a direct data replacement, handle normally
        handleDataChange(newData);
        return;
      }

      // For function calls, we need to intercept room category updates
      const updatedData = newData(data);
      
      // Process each service to handle room category field updates
      const processedData = updatedData.map(service => {
        const roomCategoryFields = Object.keys(service).filter(key => key.startsWith('roomCategory_'));
        
        if (roomCategoryFields.length > 0) {
          // Update roomCategorys array based on room category fields
          const updatedRoomCategorys = service.roomCategorys?.map((rc: any) => {
            const fieldKey = `roomCategory_${rc.roomCategoryId}`;
            const fieldValue = (service as any)[fieldKey];
            
            if (fieldValue !== undefined) {
              return { ...rc, amountorPercentage: parseFloat(fieldValue) || 0 };
            }
            return rc;
          }) || [];

          // Remove room category fields from the service object
          const cleanedService = { ...service };
          roomCategoryFields.forEach(field => {
            delete (cleanedService as any)[field];
          });

          return {
            ...cleanedService,
            roomCategorys: updatedRoomCategorys
          };
        }
        
        return service;
      });
      
      handleDataChange(processedData);
    }
  };



  const table = useReactTable({
    data,
    columns: columns(onServiceNameClick, billingClasses),
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
          Service Details · {table.getCoreRowModel().rows.length}
        </span>
      </div>
      <div className="relative w-full">
        <div className="relative flex flex-col overflow-auto max-h-[calc(50vh)]">
          <DataTable
            columns={table.getAllColumns()}
            dataProps={customDataProps}
            initialData={initialData}
            table={table}
            addButton={false}
          />
        </div>
      </div>
    </div>
  );
}
