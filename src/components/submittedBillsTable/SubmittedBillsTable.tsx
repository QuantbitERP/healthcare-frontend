"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/utils/CurrencyUtils";

import SelectActions from "../../sections/invoicing/SelectActions";
import { Skeleton } from "@/components/ui/skeleton";
import { BillRow } from "../submitBillModal/BillTableData";
import { TableDataType } from "@/sections/invoicing/tableData";

interface SubmitDataTableProps {
  columns: ColumnDef<BillRow, unknown>[];
  data: BillRow[];
}

export function SubmitDataTable({ data, columns }: SubmitDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [loading] = useState(false);
  const [, setOpenCancelBill] = useState(false);
  const [tableData, setTableData] = useState<BillRow[]>(data);

  // Sync internal state with prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  const selectedRows = table.getSelectedRowModel().rows.map((row) => ({
    ...row.original,
  }));

  const [showRowActions, setShowRowActions] = useState(
    selectedRows.length !== 0
  );

  useEffect(() => {
    setShowRowActions(selectedRows.length !== 0);
  }, [selectedRows.length]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  const handleRemoveRows = (rows: BillRow[] | TableDataType[]) => {
    if (rows.length > 0 && "billId" in rows[0]) {
      const billRows = rows as BillRow[];
      const idsToRemove = new Set(billRows.map((r) => r.billId));
      setTableData((prevData) =>
        prevData.filter((row) => !idsToRemove.has(row.billId))
      );
      deselectRows();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center py-md">
        <span className="text-[#1C2024] text-lg font-semibold">
          Submitted Bills · {table.getCoreRowModel().rows.length}{" "}
        </span>
      </div>
      <div className="w-full rounded-md border border-[#D9D9E0]  flex flex-col overflow-hidden max-h-[70vh]">
        <div className="overflow-y-auto  relative">
          <Table className="table-fixed border-collapse-separate border-spacing-0 !border-[#D9D9E0] min-w-[850px]">
            <TableHeader className="sticky  top-0 z-30 bg-[#FCFCFD] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1px] after:bg-[#D9D9E0] after:bottom-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`text-left px-2 whitespace-nowrap [&>button]:hover:bg-transparent [&>button]:px-0 bg-[#FCFCFD] 
  border border-x-0 border-t-0 border-b-[#CDCED6] 
  ${index === 0 ? "sticky left-0 w-60 z-20" : ""}
  ${index === columns.length - 1 ? "sticky w-35 right-0 z-21" : ""}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                Array(3)
                  .fill(null)
                  .map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {columns.map((_, index) => (
                        <TableCell key={index}>
                          <Skeleton className="h-4 my-2" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap px-lg cursor-pointer py-0 h-10 ${index === 0
                            ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                            : ""
                          } ${index === columns.length - 1
                            ? "sticky right-0 bg-inherit z-10 hover:text-primary"
                            : ""
                          }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:!bg-transparent w-full">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center py-20"
                  >
                    <div className="flex flex-col items-center justify-center w-full space-y-3">
                      <Image
                        src={"assets/icons/alert-circle.svg"}
                        height={24}
                        width={24}
                        alt="no data found"
                      />
                      <span className="block text-base">No results Found.</span>
                      <span className="block text-sm text-[#60646C]">
                        We couldn&apos;t find any result matching your search
                        criteria.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow className="border-t-1 border-b-0 border-[#CDCED6] text-[#1C2024] font-semibold">
                <TableCell
                  colSpan={columns.length - 1}
                  className="sticky left-0 z-10 text-left px-lg py-3 font-bold text-lg"
                >
                  Total Amount
                </TableCell>
                <TableCell className="text-right px-lg py-3 font-bold text-lg">
                  {formatCurrency(
                    table
                      .getRowModel()
                      .rows.reduce(
                        (total, row) => total + (row.original.totalAmount || 0),
                        0
                      ),
                    "INR"
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <SelectActions
          source="submitPage"
          modalProps={{
            open: showRowActions,
            setOpen: deselectRows,
          }}
          deselectRows={deselectRows}
          rows={selectedRows}
          setOpenCancelBill={setOpenCancelBill}
          onRemoveRows={handleRemoveRows}
          setOpenSubmitBill={() => { }}
          totalRowCount={tableData.length}
          setSelectedForSubmit={() => { }}
        />
      </div>
    </div>
  );
}
