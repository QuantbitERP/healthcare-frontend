"use client";
import React, {
  useState,
} from "react";
import Image from "next/image";
import {
  flexRender,
  ColumnDef,
  Table,
} from "@tanstack/react-table";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
// import SelectActions from "@/sections/paymentsReceived/SelectActions";
import { Button } from "../ui/button";
import Buttons from "@/components/buttons/Button";
import BulkAction from "@/components/bulkAction/BulkAction";
import SearchableSelect from "./select";
import { KVPair } from "@/services/api-client";

interface DataPropsType<T> {
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
}

export type CustomColumnDef<T extends { id: string | number }> =
  ColumnDef<T> & {
    isCommand?: boolean;
    isList?: boolean;
  };
interface SubmitDataTableProps<T extends { id: string | number }> {
  columns: CustomColumnDef<T>[];
  table: Table<T>;
  addButton?: boolean;
  dataProps?: DataPropsType<any>;
  dropdownItems?: KVPair[];
  dropdownplaceHolder?: string;
  onselect?: (value: string) => void;
  onSearch?: (value: string) => void;
  onAdd?: (value: string) => void;
}

export function DistributeDataTable<T extends { id: string | number }>({
  table,
  columns,
  addButton,
  dataProps,
  dropdownItems,
  dropdownplaceHolder,
  onselect,
  onSearch,
  onAdd,
}: SubmitDataTableProps<T>) {

  const [showAddButton, setShowAddButton] = useState(true);
  const [_showCommand, setShowCommand] = useState(false);
  const [showInputRow, setShowInputRow] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const [error,] = useState<null | string>(null);
  const setData = dataProps?.setData;
  // Get selected rows for bulk operations
  const selectedRows = table.getSelectedRowModel().rows.map((row) => ({
    ...row.original,
  }));

  const [showRowActions, setShowRowActions] = useState(
    selectedRows.length !== 0
  );

  React.useEffect(() => {
    setShowRowActions(selectedRows.length !== 0);
  }, [selectedRows.length]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  const handleBulkDelete = () => {
    if (!setData) return;

    const selectedIds = new Set(selectedRows.map((row) => row.id));
    setData((prevData) =>
      prevData.filter((row) => !selectedIds.has(row.id))
    );
    deselectRows();
  };



  const showNew = (isCommand: boolean) => {
    setShowAddButton(false);
    setShowCommand(isCommand);
    setShowInputRow(!isCommand);
  };

  const addRow = (values: Partial<T>) => {
    onAdd?.(Object.values(values)[0]);
    // if (!setData) return;
    // setShowInputRow(false);
    // const inputValue = Object.values(values)[0];
    //   setData((prev) => [
    //     ...prev,
    //     {
    //       service: inputValue,
    //       serviceCode: "OPD0002",
    //     } as unknown as T,
    //   ]);
    // setShowAddButton(true);

  }

  const removeRow = () => {
    setShowInputRow(false);
    setShowAddButton(true);
  };



  return (
    <div>
      <div className="relative w-full border  border-[#CDCED6] overflow-x-auto bg-white">
        <div className="relative flex flex-col">
          <UITable
            className={`w-full border-separate rounded-lg border-spacing-0 text-xs whitespace-nowrap 
          ${!showInputRow ? "rounded-none" : "rounded-b-lg"}`}
          >
            <TableHeader className="sticky top-0 z-40 bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`min-h-0 px-3 py-0 bg-[#F9F9FB] hover:bg-[#F9F9FB] border border-x-0 border-t-0   border-b-[#CDCED6] text-[#60646C] hover:text-[#1C2024] font-semibold cursor-pointer
                    ${[
                          "serviceName",
                          "service",
                          "item",
                        ].includes(header.column.id)
                          ? "sticky left-0 z-50 bg-[#F9F9FB] border-r border-r-[#CDCED6]"
                          : ""
                        }
                    ${header.column.id === "totalamt"
                          ? "sticky right-0 z-50 bg-[#F9F9FB]"
                          : ""
                        }`}
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="overflow-auto max-h-[calc(50vh)]">
              {table.getRowModel().rows.length === 0 ? (
                <TableRow className="h-10 text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE]">
                  {table.getAllColumns().map((_, index) => (
                    <TableCell key={index} className="px-3" />
                  ))}
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, _rowIndex) => (
                  <TableRow
                    key={row.id}
                    className="h-10  text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE] border border-b border-[#CDCED6]"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap px-3 cursor-pointer border-b border-[#CDCED6] py-0 h-10 ${index === 0
                            ? "sticky left-0 bg-inherit z-[10] hover:text-primary border-r border-[#CDCED6]"
                            : ""
                          } ${index === columns.length - 1
                            ? "sticky right-0 bg-inherit  hover:text-primary"
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
              )}
            </TableBody>
          </UITable>
        </div>
        <div className="sticky bottom-0 left-0 right-0 z-20">
          {showInputRow && (
            <div className="bg-white">
              <div className="flex items-center justify-between w-full gap-2 pr-2 h-10">
                <TooltipProvider>
                  <Tooltip open={!!error}>
                    <TooltipTrigger asChild>
                      <SearchableSelect
                        searchValue={initialInput}
                        onSearchChange={(value) => { onSearch?.(value); }}
                        onSelectionChange={(value) => { onselect?.(value); setInitialInput(value) }}
                        placeholder={dropdownplaceHolder}
                        items={dropdownItems || []}
                      ></SearchableSelect>

                      {/* <Input
                        placeholder="Type here..."
                        value={initialInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setInitialInput(value);
                          // Check if the first column is numeric
                          const isNumericColumn =
                          columns[0]?.id === "opDisc" ||
                          columns[0]?.id === "maxOpDisc" ||
                          columns[0]?.id === "ipDisc" ||
                          columns[0]?.id === "maxIpDisc" 

                          if (isNumericColumn) {
                            const isValidNumber = /^\d*\.?\d*$/.test(value);
                            if (!isValidNumber) {
                              setError("Enter a valid number");
                            
                            } else {
                              setError(null);
                            }                          
                          } else {
                            // For text fields, just check if it's not empty
                            setError(
                              value.trim() ? null : "Field cannot be empty"
                            );
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const isNumericColumn =
                            columns[0]?.id === "opDisc" ||
                            columns[0]?.id === "maxOpDisc" ||
                            columns[0]?.id === "ipDisc" ||
                            columns[0]?.id === "maxIpDisc" 
                            if (isNumericColumn) {
                              if (
                                initialInput.trim() &&
                                /^\d*\.?\d*$/.test(initialInput)
                              ) {
                                addRow({
                                  [(columns[0]?.id as string) ?? ""]:
                                    initialInput,
                                } as Partial<T>);
                                setShowInputRow(false);
                                setShowAddButton(true);
                                setInitialInput("");
                                setError(null);
                              }
                            } else {
                              if (initialInput.trim()) {
                                addRow({
                                  [(columns[0]?.id as string) ?? ""]:
                                    initialInput,
                                } as Partial<T>);
                                setShowInputRow(false);
                                setShowAddButton(true);
                                setInitialInput("");
                                setError(null);
                              }
                            }
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            removeRow();
                            setError(null);
                          }
                        }}
                        className={`flex-1 border-none shadow-none focus-visible:ring-0 ${
                          error ? "bg-red-100 border border-red-500" : ""
                        }`}
                      /> */}
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#DC3E42] text-white text-sm font-medium flex flex-row gap-1 item">
                      <Image
                        src={'assets/icons/InfoCircleWhite.svg'}
                        alt="Circle"
                        width={16}
                        height={16}
                        className="rounded-lg"
                      />
                      {error}
                      <TooltipArrow className="fill-[#DC3E42]" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center gap-2 shrink-0">
                  <Buttons
                    size="button-xsmall"
                    type="secondary-button"
                    variant="button"
                    onClick={() => {
                      const isNumericColumn =
                        columns[0]?.id === "opDisc" ||
                        columns[0]?.id === "maxOpDisc" ||
                        columns[0]?.id === "ipDisc" ||
                        columns[0]?.id === "maxIpDisc"

                      if (isNumericColumn) {
                        if (
                          initialInput.trim() &&
                          /^\d*\.?\d*$/.test(initialInput)
                        ) {
                          addRow({
                            [(columns[0]?.id as string) ?? ""]: initialInput,
                          } as Partial<T>);
                          setShowInputRow(false);
                          setShowAddButton(true);
                          setInitialInput("");
                        }
                      } else {
                        if (initialInput.trim()) {
                          addRow({
                            [(columns[0]?.id as string) ?? ""]: initialInput,
                          } as Partial<T>);
                          setShowInputRow(false);
                          setShowAddButton(true);
                          setInitialInput("");
                        }
                      }
                    }}
                    disabled={
                      !initialInput.trim() ||
                      (columns[0]?.id === "amount" &&
                        !/^\d*\.?\d*$/.test(initialInput))
                    }
                  >
                    Save
                  </Buttons>
                  <button
                    className="w-fit h-[24px] font-medium text-xs leading-4 pl-3 pr-3 pt-1 pb-1 rounded-[4px]
                    bg-white border-[1px] border-[#D9D9E0] hover:bg-[#E8E8EC] hover:border-[#B9BBC6] active:bg-[#E8E8EC]
                    focus-visible:ring-[#0090FF] disabled:border-[#B9BBC6] disabled:text-[#000000] disabled:bg-white
                    flex flex-row gap-2 justify-center items-center text-[#CE2C31]
                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none whitespace-nowrap"
                    onClick={() => removeRow()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {addButton && showAddButton && (
            <div className="bg-white ">
              <div className="flex items-center justify-start w-full gap-2 pr-2 h-10">
                <div
                  className="flex items-center gap-2 cursor-pointer px-3"
                  onClick={() => {
                    const isCommand = columns.some(
                      (col) => col.isCommand === true
                    );
                    showNew(isCommand);
                    if (isCommand) {
                      setShowInputRow(false);
                    }
                  }}
                >
                  <Image src={'assets/icons/PlusBlue.svg'} width={20} height={20} alt="add" />
                  <Button
                    size="icon"
                    type="button"
                    variant="link"
                    className="text-xs font-semibold text-[#0D74CE]"
                  >
                    Add New
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <BulkAction
          modalProps={{
            open: showRowActions,
            setOpen: deselectRows,
          }}
          deselectRows={deselectRows}
          rows={Array(selectedRows.length).fill(null)}
          onDelete={handleBulkDelete}
          pageName="file(s)"
        />
      </div>
    </div>
  );
}
