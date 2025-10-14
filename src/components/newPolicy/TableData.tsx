import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CustomColumnDef } from "../EditableCellsTable/TableTry";
import { Checkbox } from "@/components/ui/checkbox";

export type initialDataItem = {
  id: string;
  dependentRelation: string;
  maxDependents: number;
  fromAge: number;
  toAge: number;
};

export const initialData = [
  {
    id: "1",
    dependentRelation: "Self",
    maxDependents: 1,
    fromAge: 0,
    toAge: 100,
  },
  {
    id: "2",
    dependentRelation: "Mother",
    maxDependents: 1,
    fromAge: 0,
    toAge: 100,
  },
  {
    id: "3",
    dependentRelation: "Father",
    maxDependents: 1,
    fromAge: 0,
    toAge: 100,
  },
  {
    id: "4",
    dependentRelation: "Son",
    maxDependents: 1,
    fromAge: 0,
    toAge: 100,
  }
];

const columns: CustomColumnDef<initialDataItem>[] = [
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
    accessorKey: "dependentRelation",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center space-x-2 pr-3 w-full h-10">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dependent Relation
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
          {row.original.dependentRelation}
        </span>
      </div>
    ),
    isList: true,
  },
  {
    accessorKey: "maxDependents",
    header: ({  }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">Max Dependents</span>
    ),
    cell: ({ row }) => (
        <span className="text-right w-full block pl-3 h-10 py-3">{row.original.maxDependents}</span>
    ),
  },
  {
    accessorKey: "fromAge",
    header: ({  }) => (
     <span className="text-right w-full block pl-3 h-10 py-3">From Age</span>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">
        {row.original.fromAge}
      </span>
    ),
  },
  {
    accessorKey: "toAge",
    header: ({  }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">To Age</span>
    ),
    cell: ({ row }) => (
      <span className="text-right w-full block pl-3 h-10 py-3">{row.original.toAge}</span>
    ),
  }
];
export { columns };
