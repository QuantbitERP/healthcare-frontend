import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "../ui/select";
import EditableTariffCell from "./EditableTariffCell";



const createColumns = (onUpdateValue?: (rowIndex: number, field: string, value: string) => void) => [
  {
    accessorKey: "service",
    header: ({ table, column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service/Group Name
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
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
        <span className="cursor-pointer hover:text-primary ">
          {row.original.serviceName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "includeExclude",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Exclude/Include
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-nowrap">
          
            <Select
              value={row.original.includeExclude ? row.original.includeExclude.toString() : '0'}
              onValueChange={(value) => {
                if (onUpdateValue) {
                  onUpdateValue(row.index, 'includeExclude', value);
                }
              }}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Select" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select</SelectItem>
                <SelectItem value="1">Include</SelectItem>
                <SelectItem value="2">Exclude</SelectItem>
              </SelectContent>
            </Select>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "Code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row justify-end" // Ensure justify-end for right alignment of header text
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Code
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-right w-full block pl-3 h-10 py-3">
          {row.original.code}
        </span>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Department
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return <span>{row.original.serviceDepartmentName}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "opDiscountPercentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        OP Disc(%)
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <EditableTariffCell
          key={`op-disc-${row.index}`}
          initialValue={row.original.opDiscountPercentage}
          rowIndex={row.index}
          onUpdate={(value) => {
            if (onUpdateValue) {
              onUpdateValue(row.index, 'opDiscountPercentage', value);
            }
          }}
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder="0"
          className="w-25 h-8 text-sm"
        />
      );
    },
    enableSorting: true,
    // sortingFn: "basic",
  },
  {
    accessorKey: "maxOPDiscountPercentage",
    header: () => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Max OP Disc(%)
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <EditableTariffCell
          key={`max-op-disc-${row.index}`}
          initialValue={row.original.maxOPDiscountPercentage}
          rowIndex={row.index}
          onUpdate={(value) => {
            if (onUpdateValue) {
              onUpdateValue(row.index, 'maxOPDiscountPercentage', value);
            }
          }}
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder="0"
          className="w-25 h-8 text-sm"
        />
      );
    },
    enableSorting: true, // Sorting may not be ideal for combined date/time strings without custom sorter
  },
  {
    accessorKey: "ipDiscountPercentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        IP Disc
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <EditableTariffCell
          key={`ip-disc-${row.index}`}
          initialValue={row.original.ipDiscountPercentage}
          rowIndex={row.index}
          onUpdate={(value) => {
            if (onUpdateValue) {
              onUpdateValue(row.index, 'ipDiscountPercentage', value);
            }
          }}
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder="0"
          className="w-25 h-8 text-sm"
        />
      );
    },
    enableSorting: true,
    // sortingFn: "basic",
  },
  {
    accessorKey: "maxIPDiscountPercentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Max IP Disc(%)
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => (
      <EditableTariffCell
        key={`max-ip-disc-${row.index}`}
        initialValue={row.original.maxIPDiscountPercentage}
        rowIndex={row.index}
        onUpdate={(value) => {
          if (onUpdateValue) {
            onUpdateValue(row.index, 'maxIPDiscountPercentage', value);
          }
        }}
        type="number"
        min={0}
        max={100}
        step={0.01}
        placeholder="0"
        className="w-25 h-8 text-sm"
      />
    ),
    enableSorting: true,
  },
];

const exclusionColumns= [
  {
    accessorKey: "serviceId",
    header: ({ table, column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service/Department
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
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
        <span className="cursor-pointer hover:text-primary ">
          {row.original.serviceName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "serviceCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Service/Department Code
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const patient = row.original.serviceCode;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <span className="group-hover:text-primary">{patient}</span>
        </div>
      );
    },
    enableSorting: true,
  },
];  


const pharmacyExclusionColumns = [
  {
    accessorKey: "itemId",
    header: ({ table, column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Item/Category
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
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
        <span className="cursor-pointer hover:text-primary ">
          {row.original.itemId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "itemCategoryId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Item/Category Code
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const itemCode = row.original.itemCategoryId;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          
          <span className="group-hover:text-primary">{itemCode}</span>
        </div>
      );
    },
    enableSorting: true,
  },
]; 

const uploadColumns = [
  {
    accessorKey: "fileName",
    header: ({ table, column }) => {
      return (
        <div className="flex flex-row  items-center space-x-2 pr-3 w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Name
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
      <div className="flex items-center justify-start space-x-2 pr-3  h-10  w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
        <span className="cursor-pointer hover:text-primary ">
          {row.original.fileName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "fileDescription",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        File Description
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const fileDescription = row.original.fileDescription;
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <span className="group-hover:text-primary">{fileDescription}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "fileSize",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        File Size
        {column.getIsSorted() &&
          (column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    ),
    cell: ({ row }) => {
      const fileSize = row.original.fileSize;
      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      return (
        <div className="flex items-center gap-2 text-nowrap">
          <span className="group-hover:text-primary">{formatFileSize(fileSize)}</span>
        </div>
      );
    },
    enableSorting: true,
  },
]; 

export { createColumns, exclusionColumns, pharmacyExclusionColumns, uploadColumns };
