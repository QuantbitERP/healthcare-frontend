import React, {useState, useEffect} from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tags from "@/components/statusTags/Tags";
import Avatar from "react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { ColumnDef, Row } from "@tanstack/react-table";


export interface TableOneRow {
  id: string;
  description: string;
  amount: string;
}

export interface TableTwoRow {
  id: string;
  authorizedBy: string;
  category: string;
  concession: number;
  total: number;
}

type CategorySelectProps = {
  row: Row<TableTwoRow>;
  getValue: () => string;
  categoryOptions: string[];
};
const initialData = [
  {
    id: "1",
    description: "Rate",
    amount: "₹7500",
  },
  {
    id: "2",
    description: "Quantity",
    amount: "1",
  },
  {
    id: "3",
    description: "Amount",
    amount: "₹7500",
  },
  {
    id: "4",
    description: "GST (18%)",
    amount: "₹1500",
  },
  {
    id: "5",
    description: "Concession",
    amount: "-₹1000",
  },
  {
    id: "6",
    description: "Total Amount",
    amount: "₹8850",
  },
];

const columns: ColumnDef<TableOneRow>[] = [
  {
    accessorKey: "description",
    header: ({  }) => (
      <Button
        variant="ghost"
        className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
      >
        Description
      </Button>
    ),
    cell: ({ getValue }) => {
      return (
        <span>
          {String(getValue())}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ }) => (
      <div className="text-right w-full block border-l border-[#D9D9E0] -ml-3 p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10"
        >
          Amount
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const isTotalAmount = row.original.description === "Total Amount";
      return (
        <div className="border-l border-[#D9D9E0] -ml-3">
          <span
            className={`text-right w-full block h-10 py-3 ${
              isTotalAmount ? "font-bold text-lg" : ""
            }`}
          >
            {String(getValue())}
          </span>
        </div>
      );
    },
  },
];

const tableTwoData = [
  {
    id: "1",
    authorizedBy: "Dr. Rajesh",
    category: "MRI Scan",
    concession: 15,
    total: 1000,
  },
];

export const CategorySelect = ({ row, getValue, categoryOptions }: CategorySelectProps) => {
  const isNewRow = !row.original.id;

  const [selectedCategory, setSelectedCategory] = useState<string>(getValue() || "");

  useEffect(() => {
    if (isNewRow) {
      setSelectedCategory(""); // Ensure new row starts with an empty selection
    }
  }, [isNewRow]);

  return (
    <Select
      value={selectedCategory}
      onValueChange={(value) => {
        setSelectedCategory(value);
      }}
      defaultOpen={isNewRow}
    >
      <SelectTrigger className="w-fit border-none shadow-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
        {/* Render custom Tags only when selectedCategory exists */}
        {selectedCategory ? (
          <Tags variant="tag" type="success" tagText={selectedCategory} />
        ) : (
          <SelectValue placeholder="Select Category" />
        )}
      </SelectTrigger>

      <SelectContent className="m-0 [&>div]:!px-0 [&>div]:!py-2 border-[#D9D9E0]">
        {categoryOptions.map((option : string, index: number) => (
          <SelectItem
            key={index}
            value={option}
            className="data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:text-[#0D74CE] rounded-none"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const tableTwoColumn: ColumnDef<TableTwoRow>[] =  [
  {
    accessorKey: "authorizedBy",
    header: ({ table,column }) => (
      <div className="flex flex-row items-center space-x-2 pr-3">
        <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
        </div>
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Authorized By
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
    cell: ({ row, getValue }) => (
      <div className="flex flex-row items-center gap-2">
        <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        </div>
        <Avatar
          name={
            String(getValue())?.split(" ")[1]?.charAt(0) ||
            String(getValue())?.split(" ")[0]?.charAt(0)
          }
          size="24"
          round={true}
          textSizeRatio={2}
        />
        <span>
          {String(getValue())}
        </span>
      </div>
    ),
    enableSorting: true,
    // isList: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <div className="flex flex-row items-center">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
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
    cell: ({ row, getValue }) => {
      const categoryOptions = [
        "Blood Test",
        "MRI Scan",
        "General Consultation",
        "Physiotherapy Session",
      ];
      const categoryValue = getValue() as string;
      return (
        <CategorySelect
          row={row}
          getValue={() => categoryValue}
          categoryOptions={categoryOptions}
        />
      );
    },
    enableSorting: true,
    // isDropdown: true,
  },
  {
    accessorKey: "concession",
    header: ({ column }) => (
      <div className="text-right w-full block p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession (%)
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <span className="text-right w-full block h-10 py-3 pl-3">
        {String(getValue())}%
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <div className="text-right w-full block border-l border-[#D9D9E0] -ml-3 p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount (₹)
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="border-l border-[#D9D9E0] -ml-3">
        <span className="text-right w-full block h-10 py-3 pl-3">
          ₹{String(getValue())}
        </span>
      </div>
    ),
    enableSorting: true,
  },
];

export { initialData, columns, tableTwoData, tableTwoColumn };
