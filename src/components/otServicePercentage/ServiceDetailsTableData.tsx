import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CustomColumnDef } from "../EditableCellsTable/TableTry";
import { Checkbox } from "@/components/ui/checkbox";

export type ServiceDetailItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  baseHrs: number;
  opd: number;
  classASPR: number;
  classASTD: number;
  classAA: number;
  classBAC: number;
  classBCo: number;
  // Additional fields for existing data
  cappingRoomCategorys?: any[];
  roomCategorys?: any[];
  isCapping?: boolean;
  cappingHours?: number;
  servicePercentageId?: string; // For update API
};

export const initialServiceData = [
  {
    id: "1",
    serviceId: "",
    serviceName: "",
    serviceCode: "",
    baseHrs: 0,
    opd: 0,
    classASPR: 0,
    classASTD: 0,
    classAA: 0,
    classBAC: 0,
    classBCo: 0,
  },
];

const createColumns = (onServiceNameClick?: (service: ServiceDetailItem) => void, billingClasses?: any[]): CustomColumnDef<ServiceDetailItem>[] => {
  // Create dynamic room category columns based on billing classes
  const createRoomCategoryColumns = () => {
    // Always use billing classes for dynamic column creation
    if (!billingClasses || billingClasses.length === 0) {
      // Return empty array if no billing classes available
      return [];
    }

    // Create dynamic columns based on billing classes
    return billingClasses.map((billingClass) => {
      const accessorKey = `roomCategory_${billingClass.key}`;
      const displayName = billingClass.value || billingClass.label || billingClass.name;
      
      return {
        accessorKey,
        // Custom accessor to get/set room category values
        accessorFn: (row: ServiceDetailItem) => {
          const roomCategory = row.roomCategorys?.find(
            (rc: any) => rc.roomCategoryId === billingClass.key
          );
          return roomCategory?.amountorPercentage || 0;
        },
        header: ({ column }) => (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10">
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {displayName}
              {column.getIsSorted() ? (
                column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                )
              ) : null}
            </Button>
          </div>
        ),
        cell: ({ row, table: _table }) => {
          // Get the value from the service's room category data
          const roomCategoryValue = row.original.roomCategorys?.find(
            (rc: any) => rc.roomCategoryId === billingClass.key
          )?.amountorPercentage || 0;
          
          return (
            <div className="flex items-center justify-start space-x-2 pr-3 h-10 w-full">
              <span className="cursor-pointer hover:text-primary">
                ₹{roomCategoryValue.toLocaleString()}
              </span>
            </div>
          );
        },
        meta: { isNumeric: true, editable: true },
      };
    });
  };

  return [
    {
      accessorKey: "select",
      header: ({ table }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={table?.getIsAllPageRowsSelected?.()}
            onCheckedChange={(value) =>
              table?.toggleAllPageRowsSelected?.(!!value)
            }
            aria-label="Select all"
            className="mr-2"
          />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="mr-3"
            />
          </div>
        );
      },
      meta: { 
        isNumeric: true,
      },
    },
    {
      accessorKey: "serviceName",
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10 sticky left-0 z-30 bg-white">
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Service Name
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
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 h-10 w-full sticky left-0 z-30 bg-white">
          <span 
            className="cursor-pointer hover:text-[#0D74CE] text-[#0D74CE] hover:underline hover:font-bold"
            onClick={() => onServiceNameClick?.(row.original)}
          >
            {row.original.serviceName}
          </span>
        </div>
      ),
      meta: {
        noneditable: true,
      },
    },
    {
      accessorKey: "serviceCode",
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10">
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Service Code
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
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 h-10 w-full">
          <span className="cursor-pointer hover:text-primary">
            {row.original.serviceCode}
          </span>
        </div>
      ),
      meta: {
        isNumeric: false,
        noneditable: true,
      },
    },
    {
      accessorKey: "baseHrs",
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10">
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Base Hrs.
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
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 h-10 w-full">
          <span className="cursor-pointer hover:text-primary">
            {row.original.baseHrs}
          </span>
        </div>
      ),
      meta: {
        isNumeric: true,
      },
    },
    {
      accessorKey: "opd",
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10">
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              OPD
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
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 h-10 w-full">
          <span className="cursor-pointer hover:text-primary">
            {row.original.opd}
          </span>
        </div>
      ),
      meta: {
        isNumeric: true,
      },
    },
    // Add dynamic room category columns
    ...createRoomCategoryColumns(),
  ];
};

export { createColumns as columns };
