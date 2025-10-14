import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Button from "../buttons/Button";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Table } from "@tanstack/react-table";

interface MenuProps<TData> {
  table: Table<TData>;
  columnNames: Record<string, string>;
  title?: string;
  items?: string[];
}

export default function Menu<TData>({
  table,
  columnNames,
  title = "Select Items",
  // items = [
  //   "Bill ID",
  //   "Bill",
  //   "Date",
  //   "Patient",
  //   "Company",
  //   "Net Amount",
  //   "Payment",
  // ],
}: MenuProps<TData>) {
  const [showGradient, setShowGradient] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [open, setOpen] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleRef = (el: HTMLDivElement | null) => {
    if (el) {
      const scrollable = el.scrollHeight > el.clientHeight;
      setIsScrollable(scrollable);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="min-w-[158px] min-h-8 rounded-full">
        <PopoverTrigger>
          <div className="w-fit h-8 flex flex-row gap-2 rounded-full items-center border border-[#B9BBC6] bg-white px-3 py-2">
            <Image src={'/assets/icons/Columns3.svg'} alt="Plus" width={16} height={16} />
            <span className="text-[#1C2024] text-xs font-medium">
              Show Columns
            </span>
            <Image src={'/assets/icons/CaretDownDark.svg'} alt="Right" width={16} height={16} />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-fit h-fit p-0 rounded-lg shadow-none border-none"
          align="end"
        >
          <div className="w-fit h-fit py-2 rounded-lg bg-[#FFFFFF] border border-[#D9D9E0] shadow relative">
            <div className="w-fit px-2 py-1 text-[#60646C] text-xs font-medium">
              {title}
            </div>
            <div
              className="max-h-[200px] overflow-y-auto no-scrollbar"
              onScroll={handleScroll}
              ref={handleRef}
            >
              {/* Select All */}
              <div className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] rounded-none font-normal text-sm">
                <Checkbox
                  checked={table
                    .getAllColumns()
                    .slice(1)
                    .every((column) =>
                      Object.prototype.hasOwnProperty.call(
                        pendingColumnVisibility,
                        column.id
                      )
                        ? pendingColumnVisibility[column.id]
                        : column.getIsVisible()
                    )}
                  onCheckedChange={(checked: boolean) => {
                    table.getAllColumns().forEach((column, index) => {
                      if (index !== 0) {
                        setPendingColumnVisibility((prev) => ({
                          ...prev,
                          [column.id]: checked,
                        }));
                      }
                    });
                  }}
                />
                <label className="pl-2 pr-4 cursor-pointer">All</label>
              </div>

              {/* Individual Checkboxes */}
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .filter((_, index) => index > 0)
                .map((column) => {
                  const isVisible = Object.prototype.hasOwnProperty.call(
                    pendingColumnVisibility,
                    column.id
                  )
                    ? pendingColumnVisibility[column.id]
                    : column.getIsVisible();

                  return (
                    <div
                      key={column.id}
                      className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                      // onClick={() => {
                      //   setPendingColumnVisibility((prev) => ({
                      //     ...prev,
                      //     [column.id]: !isVisible,
                      //   }));
                      // }}
                    >
                      <Checkbox
                        checked={isVisible}
                        onCheckedChange={(checked: boolean) => {
                          setPendingColumnVisibility((prev) => ({
                            ...prev,
                            [column.id]: checked,
                          }));
                        }}
                      />
                      <label className="pl-2 pr-4 cursor-pointer">
                        {columnNames[column.id]}
                      </label>
                    </div>
                  );
                })}
            </div>

            {isScrollable && showGradient && (
              <div
                style={{
                  height: "16px",
                  width: "100%",
                  position: "absolute",
                  bottom: "50px",
                  background:
                    "linear-gradient(0deg, rgba(217, 217, 217, 0.42) 0%, rgba(217, 217, 217, 0.00) 100%)",
                  pointerEvents: "none",
                }}
              />
            )}

            <div className="px-4 pt-2">
              <Button
                size="button-small"
                type="secondary-button"
                variant="button"
                onClick={() => {
                  Object.entries(pendingColumnVisibility).forEach(
                    ([columnId, isVisible]) => {
                      const column = table.getColumn(columnId);
                      if (column) {
                        column.toggleVisibility(isVisible);
                      }
                    }
                  );
                  setPendingColumnVisibility({});
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
