import Image from "next/image";
import React, { useState } from "react";
import Buttons from "../buttons/Button";
import { Button } from "@/components/ui/button";
import Checklist from "@/assets/icons/CheckupList.svg";
import { DataTable } from "../EditableCellsTable/TableTry";
import Tags from "@/components/statusTags/Tags";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  // Table,
} from "@tanstack/react-table";

interface TransferLogProps {
  setOpen: (open: boolean) => void;
}

interface TransferLogRow {
  id: string;
  reqID: string;
  department: string;
  ward: string;
  billingClass: string;
  bedNo: string;
  status: string;
  allocationDateTime: string;
  deallocationDateTime: string;
  tagText?: string;
}

const initialData: TransferLogRow[] = [
  {
    id: "1",
    reqID: "52472",
    department: "Cardiology",
    ward: "Cardiac ICCU",
    billingClass: "Class BB-ICCU",
    bedNo: "ICCU-2",
    status: "Bed Transferred",
    allocationDateTime: "15-May-2025 10:00 AM",
    deallocationDateTime: "15-May-2025 11:00 AM",
  },
  {
    id: "2",
    reqID: "21456",
    department: "Cardiology",
    ward: "Ward C Surgical A",
    billingClass: "",
    bedNo: "WCSA-214-3",
    status: "Bed Allocated",
    allocationDateTime: "15-May-2025 12:00 PM",
    deallocationDateTime: "-",
  },
];

const columns: ColumnDef<TransferLogRow>[] = [
  {
    accessorKey: "reqID",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Req ID
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "department",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Department
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "ward",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Ward
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "billingClass",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Billing Class
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "bedNo",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Bed No
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Status
      </Button>
    ),
    cell: ({ getValue }) => (
      <Tags
        variant="tag"
        tagText={getValue() as string}
        type={(getValue() as string) === "Bed Transferred" ? "warning" : "success"}
        className=""
      />
    ),
  },
  {
    accessorKey: "allocationDateTime",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Allocation Date and Time
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "deallocationDateTime",
    header: () => (
      <Button variant="ghost" className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold">
        Deallocation Date and Time
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <span className={`text-center w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""}`}>
        {getValue() as string}
      </span>
    ),
  },
];

const TransferLog: React.FC<TransferLogProps> = ({ setOpen }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TransferLogRow[]>(initialData);

  const table = useReactTable<TransferLogRow>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  // const getRowClassName = (row: { original: { tag: string; }; }) =>
  //   row.original.tag === "Cancelled" ? "line-through opacity-50" : "";

  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image src={Checklist.src} width={24} height={24} alt="Checklist Icon" />
        <p className="text-[#1C2024] text-base font-semibold">Transfer Log</p>
      </div>

      <div className="w-full px-6">
        <DataTable
          initialData={initialData}
          // getRowClassName={getRowClassName}
          addButton={false}
          columns={columns}
          table={table}
          dataProps={{ data, setData }}
        />
      </div>

      <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
        <Buttons size="button-small" type="secondary-button" variant="button" onClick={() => setOpen(false)}>
          Cancel
        </Buttons>
        <Buttons size="button-small" type="primary-button" variant="button" onClick={() => setOpen(false)}>
          Save Changes
        </Buttons>
      </div>
    </div>
  );
};

export default TransferLog;
