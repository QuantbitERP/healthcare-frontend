"use client";
import React from "react";
import Image from "next/image";

import { Separator } from "@/components/ui/SeparatorModified";

interface SelectActionsProps<T> {
  source: "invoicingPage" | "receiptDetailsPage";
  modalProps: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  rows: T[];
  totalRowCount: number;
  deselectRows: () => void;
  setAlertType?: (type: string) => void;
  setSelectedForSubmit: (rows: T[]) => void;
  setOpenCancelBill: (open: boolean) => void;
  setOpenSubmitBill: (open: boolean) => void;
  onRemoveRows?: (rows: T[]) => void;
  setShowAlert?: (show: boolean) => void;
}

function SelectActions<T>({
  source,
  modalProps: { open, setOpen },
  rows,
  // totalRowCount,
  deselectRows,
  // setSelectedForSubmit,
  setOpenSubmitBill,
  onRemoveRows,
  // setAlertType,
  // setShowAlert,
}: SelectActionsProps<T>) {
  return (
    <div
      className={`fixed z-30 bg-black text-white mx-auto w-[780px] rounded-lg px-md py-sm left-1/2 -translate-x-1/2 bottom-16 flex justify-between items-center ${open ? "" : "hidden"
        } `}
    >
      <div>
        <button
          className="bg-none ring-1 ring-white px-md py-sm rounded-lg text-xs flex items-center space-x-2"
          onClick={deselectRows}
        >
          <span>{`${rows.length} Selected`}</span>
          <Image
            src={"assets/icons/x-white.svg"}
            height={16}
            width={16}
            alt="close-icon"
          />
        </button>
      </div>

      <div
        className="flex space-x-6 text-xs"
      >
        <div className="flex items-center space-x-2 cursor-pointer"
          onClick={() => {
            setOpenSubmitBill(true);
            setOpen(false);
          }}>
          <Image
            src={"assets/icons/amount.svg"}
            height={16}
            width={16}
            alt="export-icon"
          />
          <span>Distribute Amount</span>
        </div>

        {/* {source === "invoicingPage" && (
          <>
            {rows.length < totalRowCount && (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  setSelectedForSubmit(rows);
                  setOpenSubmitBill(true);
                  setOpen(false);
                }}
              >
                <Image
                  src={"assets/icons/Submit.svg"}
                  height={18}
                  width={18}
                  alt="submit-icon"
                />
                <span>Submit</span>
              </div>
            )}
            <Separator orientation="vertical" className="h-5" />
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => {
                deselectRows?.();
                setShowAlert?.(false);
                setAlertType?.("null");
              }}
            >
              <Image
                src={"assets/icons/trash.svg"}
                height={16}
                width={16}
                alt="delete-icon"
              />
              <span className="text-text-destructive">Delete</span>
            </div>
          </>
        )} */}

        {source === "receiptDetailsPage" && (
          <>
            <Separator orientation="vertical" className="h-5" />
            <div
              className="flex items-center space-x-1 cursor-pointer text-text-destructive"
              onClick={() => {
                setOpenSubmitBill(false);
                onRemoveRows?.(rows);
              }}
            >
              <Image
                src={"assets/icons/Remove.svg"}
                height={16}
                width={16}
                alt="remove-icon"
              />
              <span>Remove</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SelectActions;
