import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HospitalDataTable({ data }: any) {
  const columns = () => {
    return [
      {
        accessorKey: "hospital_name",
        header: ({ }: any) => {
          return (
            <div className="flex items-center justify-start mr-24 h-10 w-full pr-3 border-r border-[#D9D9E0]">
              Hospital Name
            </div>
          );
        },
        cell: ({ row }: any) => (
          <div className="flex items-center justify-start space-x-2 pr-3 group/nested h-10 border-r  border-[#D9D9E0]">
            <span className="group-hover/nested:text-primary cursor-pointer ">
              {row.original.hospital_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "Total_Permissions",
        header: ({ }: any) => {
          return (
            <div className="flex items-center justify-start mr-24 h-10 w-full pr-3 border-r border-[#D9D9E0]">
              Total permissions
            </div>
          );
        },
        cell: ({ row }: any) => {
          const total =
            Object.values(row?.original?.permissions || {}).filter((e) => !!e).length;
          return (
            <div className="flex items-center justify-start space-x-2 pr-3 group/nested h-10 border-r border-[#D9D9E0]">
              {total > 1 && (
                <span className="group-hover/nested:text-primary cursor-pointer text-xs">
                  {total - 1}
                </span>
              )}
            </div>
          );
        },
      },
    ];
  };

  const table = useReactTable({
    data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    // state: {
    //   sorting,
    //   columnVisibility,
    // },
  });
  return (
    <div className="rounded-md border border-[#D9D9E0] mx-lg flex flex-col overflow-hidden max-h-[70vh]">
      <div className="overflow-y-auto relative">
        <Table className="border-collapse-separate border-spacing-0 !border-[#D9D9E0]">
          <TableHeader className="sticky top-0 z-0 bg-[#FCFCFD] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1px] after:bg-[#D9D9E0] after:bottom-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-left px-lg [&>button]:hover:bg-transparent [&>button]:px-0 bg-[#FCFCFD] 
                       border border-x-0 border-t-0 border-b-[#CDCED6] 
                      ${index === 0 ? "sticky left-0 z-20" : ""}`}
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
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`text-nowrap px-lg cursor-pointer py-0 h-10 ${index === 0
                        ? "sticky left-0 bg-inherit z-10 hover:text-primary"
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
                <TableCell colSpan={columns().length} className="p-0 border-0">
                  <div className="relative w-full h-[300px]">
                    {" "}
                    {/* or use h-full if parent supports it */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                      <Image
                        src={"assets/icons/alert-circle.svg"}
                        height={24}
                        width={24}
                        alt="no data found"
                      />
                      <span className="text-base">No results Found.</span>
                      <span className="text-sm text-[#60646C] text-center">
                        We couldn&apos;t find any result matching your search
                        criteria.
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
