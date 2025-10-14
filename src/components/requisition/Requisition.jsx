
import Image from "next/image";
import React, { useState } from "react";
import Buttons from "../buttons/Button";
import { Button } from "@/components/ui/button";
import Building from "@/assets/icons/NotepadTimer.svg";
import { DataTable } from "../EditableCellsTable/TableTry";
import Tags from '@/components/statusTags/Tags';
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import Check from "@/components/checkbox/CheckboxComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Requisition({ setOpen }) {

  const initialData = [
    {
      id: "1",
      Service: "2D Echo",
      moduleName	: "RIS",
      requestNo: "17675",
      saleBillNo: "SB1245",
      status: "Report Pending",
      requestDate: "19-2-2025",
    },
    {
      id: "2",
      Service: "Albumin - Serum",
      moduleName	: "LIS",
      requestNo: "64563",
      saleBillNo: "SB1246",
      status: "Profile Pending",
      requestDate: "02-12-2024",
    },
    {
      id: "3",
      Service: "Alkaline Phosphatase - Serum",
      moduleName	: "LIS",
      requestNo: "322984",
      saleBillNo: "SB1247",
      status: "Profile Pending",
      requestDate: "02-12-2024",
    },
    {
      id: "4",
      Service: "Bilirubin - Serum",
      moduleName	: "LIS",
      requestNo: "64563",
      saleBillNo: "SB1248",
      status: "Profile Pending",
      requestDate: "02-12-2024",
    },
    {
      id: "5",
      Service: "Blood Urea Nitrogen - Serum",
      moduleName	: "LIS",
      requestNo: "64563",
      saleBillNo: "SB1249",
      status: "Profile Pending",
      requestDate: "02-12-2024",
    },
    {
      id: "6",
      Service: "C.R.P. Quantitative - Serum",
      moduleName	: "LIS",
      requestNo: "322984",
      saleBillNo: "SB1250",
      status: "Rejected",
      requestDate: "02-12-2024",
    },
    {
      id: "7",
      Service: "Creatinine - Serum",
      moduleName	: "LIS",
      requestNo: "322984",
      saleBillNo: "SB1251",
      status: "Profile Pending",
      requestDate: "02-12-2024",
    },
    {
      id: "8",
      Service: "Complete Blood Count - EDTA Blood",
      moduleName	: "LIS",
      requestNo: "322984",
      saleBillNo: "SB1252",
      status: "Sample Received",
      requestDate: "17-03-2024",
    },
  ];
  const getRowClassName = (row) =>
    row.original.tag === "Cancelled" ? "line-through opacity-50" : "";

  const columns = [
    {
      accessorKey: "Service",
      header: ({ table, column }) => {
        return (
          <div className="flex flex-row  items-center w-full border-r border-r-[#D9D9E0] h-10 pr-2">
            <div onClick={(e) => e.stopPropagation()}>
              <Check />
            </div>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            >
             Service
            </Button>
          </div>
        );
      },
      cell: ({ row, getValue }) => {
        const isTotalAmount = row.original.description === "Total Amount";
        return (
          <div className="flex flex-row items-center border-r border-[#D9D9E0] h-10 pr-2">
            <div onClick={(e) => e.stopPropagation()}>
              <Check />
            </div>
            <div className="flex flex-row items-center gap-2">
              
              <span
                className={` ${
                  row?.original?.tagText === "Cancelled" ? "line-through" : ""
                } ${isTotalAmount ? "font-semibold" : ""}`} // Apply bold & larger text for Total Amount
              >
                {getValue()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex flex-row items-center">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
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
          "Report Pending",
          "Profile Pending",
          "Rejected",
          "Sample Received",
        ];
  
        // Check if it's a newly added row (for example, if ID is empty or null)
        const isNewRow = !row.original.id;
  
        const [selectedCategory, setSelectedCategory] = React.useState(
          getValue() || ""
        );
  
        React.useEffect(() => {
          if (isNewRow) {
            setSelectedCategory(""); // Ensure new row starts with an empty selection
          }
        }, [isNewRow]);
  
        return (
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              console.log("Selected Category:", value);
              // Handle category change logic here
            }}
            defaultOpen={isNewRow} // Force dropdown to open for new rows
          >
            <SelectTrigger className="w-fit border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0 shadow-none">
            <Tags
                  variant="tag"
                  tagText={selectedCategory}
                  type={(() => {
                    const categoryTypeMap = {
                      "Report Pending": "primary",
                      "Profile Pending": "warning",
                      "Rejected": "danger",
                      "Sample Received": "success",
                    };
                    return categoryTypeMap[selectedCategory] || "warning"; 
                  })()}
                />
            </SelectTrigger>
            <SelectContent className="m-0 px-0 py-2 [&>div]:!px-0 [&>div]:!py-2 border-[#D9D9E0]">
              {categoryOptions.map((option, index) => (
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
      },
      enableSorting: true,
      isDropdown: true,
    },
    {
      accessorKey: "moduleName",
      header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          >
         Module Name
          </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}
        >
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "requestNo",
      header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          >
         Request No.
          </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}
        >
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "saleBillNo",
      header: ({ column }) => (
          <Button
            variant="ghost" 
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          >
          Sale Bill No.
          </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}
        >
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "requestDate",
      header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          >
         Request Date
          </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}
        >
          {getValue()}
        </span>
      ),
    },
  ];
    const [sorting, setSorting] = useState([]);
    const [data, setData] = useState(initialData);
    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      state: { sorting },
    })
  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image src={Building.src} width={24} height={24} alt="Rupee" />
        <p className="text-[#1C2024] text-base font-semibold">
        Requisition
        </p>
      </div>
      <div className="w-full px-6">
        <DataTable
          initialData={initialData}
          getRowClassName={getRowClassName}
          columns={columns}
          table={table}
          addButton={true}
          dataProps={{ data, setData }}
        />
      </div>

      <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
        <Buttons
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Close
        </Buttons>
      </div>
    </div>
  );
}

export default Requisition;

