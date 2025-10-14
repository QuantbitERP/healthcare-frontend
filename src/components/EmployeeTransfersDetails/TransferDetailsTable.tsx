import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";

const TransferDetailsTable = ({data,columns,loading}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-md border border-[#D9D9E0] mx-lg flex flex-col overflow-hidden max-h-[calc(100vh-100px)]">
      <div className="overflow-y-auto relative flex-grow">
        <Table className="border-collapse-separate border-spacing-0 !border-[#D9D9E0]">
          <TableHeader className="sticky top-0 z-30 bg-[#FCFCFD] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1px] after:bg-[#D9D9E0] after:bottom-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-left px-lg [&>button]:hover:bg-transparent [&>button]:px-0 bg-[#FCFCFD] 
                       border border-x-0 border-t-0 border-b-[#CDCED6] 
                      ${index === 0 ? "sticky left-0 z-20" : ""}
                      ${
                        index === columns.length - 1
                          ? "sticky right-0 z-20"
                          : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${
                        index === 0
                          ? "sticky left-0 bg-inherit z-10 hover:text-primary"
                          : ""
                      }
                     ${
                       index === columns.length - 1
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
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center py-20"
                >
                  <div className="flex flex-col items-center justify-center w-full space-y-3">
                    <Image
                      src={"/assets/icons/alert-circle.svg"}
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
            {loading ? (
              <>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell className="" key={index}>
                      <Skeleton className={`h-4 my-2`} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell className="" key={index}>
                      <Skeleton className={`h-4 my-2`} />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell className="" key={index}>
                      <Skeleton className={`h-4 my-2`} />
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransferDetailsTable;
