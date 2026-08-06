"use client";
import React, { useState } from "react";
import Image from "next/image";

import { Separator } from "@/components/ui/SeparatorModified";
import { InvoicingApiService } from "@/services/invoicing/invoicingApiService";
import { t } from "@/utils/languages";


interface SelectActionsProps<T> {
  source: "invoicingPage" | "submitPage";
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
  onDelete?: (rows: T[]) => void; // New prop for delete functionality
  onRemoveRows?: (rows: T[]) => void;
  setShowAlert?: (show: boolean) => void;
  onValidationError?: (message: string) => void; // New prop for validation errors
}

function SelectActions<T>({
  source,
  modalProps: { open, setOpen },
  rows,
  totalRowCount,
  deselectRows,
  setSelectedForSubmit,
  setOpenCancelBill,
  setOpenSubmitBill,
  onDelete,
  onRemoveRows,
  setAlertType,
  setShowAlert,
  onValidationError,
}: SelectActionsProps<T>) {
  const [exportLoading, setExportLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = async () => {
    if (rows.length === 0) {
      onValidationError?.('Please select at least one record to print.');
      return;
    }

    try {
      setPrintLoading(true);

      // Extract invIds from selected rows
      const invIds = rows.map((row: any) => row.invId).filter(Boolean);

      if (invIds.length === 0) {
        onValidationError?.('No valid invoice IDs found in selected records.');
        return;
      }

      // Call the print API
      const blobs = await InvoicingApiService.printInvoicingRecords(invIds);

      // Open each PDF in a new window for printing
      blobs.forEach((blob, _index) => {
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');

        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            // Clean up the URL after printing
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 1000);
          };
        }
      });

      // Show success message
      setAlertType?.('printSuccess');
      setOpen(false);

    } catch (error: any) {
      onValidationError?.(`Print failed: ${error.message || 'Unknown error'}`);
    } finally {
      setPrintLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    if (rows.length === 0) {
      onValidationError?.('Please select at least one record to export.');
      return;
    }

    try {
      setExportLoading(true);

      // Extract invIds from selected rows
      const invIds = rows.map((row: any) => row.invId).filter(Boolean);

      if (invIds.length === 0) {
        onValidationError?.('No valid invoice IDs found in selected records.');
        return;
      }

      // Call the export API
      const blob = await InvoicingApiService.exportToExcel(invIds);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoicing_Export_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      setAlertType?.('exportSuccess');
      setOpen(false);

    } catch (error: any) {
      onValidationError?.(`Export failed: ${error.message || 'Unknown error'}`);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div
      className={`fixed z-30 bg-black text-white mx-auto w-[800px] rounded-lg px-md py-sm left-1/2 -translate-x-1/2 bottom-16 flex justify-between items-center ${open ? "" : "hidden"
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

      <div className="flex space-x-6 text-xs">
        {source === "invoicingPage" && (
          <>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handlePrint}
            >
              <Image
                src={"assets/icons/printer.svg"}
                height={18}
                width={18}
                alt="print-icon"
              />
              <span>{printLoading ? t("actionLabels.printing") : t("actionLabels.print")}</span>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleExportToExcel}
            >
              <Image
                src={"assets/icons/Export.svg"}
                height={16}
                width={16}
                alt="export-icon"
              />
              <span>{exportLoading ? t("actionLabels.exporting") : t("buttons.exportToExcel")}</span>
            </div>
          </>
        )}

        {source === "invoicingPage" && (
          <>
            {rows.length < totalRowCount && (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  // Validate that all selected bills have the same company
                  const firstBill = rows[0] as any;
                  const allSameCompany = rows.every((row: any) => row.company === firstBill.company);

                  if (!allSameCompany) {
                    onValidationError?.('All selected bills must be from the same company to submit together.');
                    return;
                  }

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
                if (onDelete) {
                  onDelete(rows);
                } else {
                  deselectRows?.();
                  setShowAlert?.(false);
                  setAlertType?.("null");
                }
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
        )}

        {source === "submitPage" && (
          <div
            className="flex items-center space-x-1 cursor-pointer text-text-destructive"
            onClick={() => {
              setOpenCancelBill(true);
              onRemoveRows?.(rows);
            }}
          >
            <Image
              src={"assets/icons/Trash.svg"}
              height={16}
              width={16}
              alt="delete-icon"
            />
            <span>Delete</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectActions;
