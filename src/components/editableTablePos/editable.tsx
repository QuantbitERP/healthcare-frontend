"use client";
import React, { useState, useEffect, useRef } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { Button as UIButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAuthHeaders } from "@/utils/sessionAuth";
import BulkAction from "../bulkAction/BulkAction";
import AlternativeItemsPopover from "../itemAlternative/ItemAlternative";

interface Item {
  id: string;
  alternateBatches: string;
  substituteItem: string;
  itemCode: string;
  itemName: string;
  uom: string;
  stockQty: number;
  orderedQty: number;
  saleQty: number;
  returnQty?: number; // Add returnQty field for return invoices
  alreadyReturnedQty?: number; // Add alreadyReturnedQty field for tracking already returned quantity
  batch: string;
  batchNo: string;
  expiryDate: string;
  batchStockQty: number;
  rate: number | null;
  taxTemplate: string;
  description: string;
  itemAmount: number;
  discountPercent: number;
  discountAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  igstPercent: number;
  igstAmt: number;
  totalAmt: number;
  kitName: string;
  totalPckgAmt: number;
  packageName: string;
  binLocation: string;
  coPayPercentage?: number; // Add co-pay percentage field
  patientAmount?: number; // Add patient amount field
  payerAmount?: number; // Add payer amount field
  covered?: boolean; // Add covered checkbox field
  preAuthRequired?: boolean; // Add pre-auth required field
  preAuthStatus?: string; // Add pre-auth status field (Rejected, Pending, Initiated, Approved)
  preAuthNo?: string; // Add pre-auth number field
  preAuthDateTime?: string; // Add pre-auth date and time field
  marginType?: string; // Add marginType as optional property
  includedInPrintRate?: boolean; // Add includedInPrintRate as optional property
  mrp?: number; // Add MRP field for batch custom_mrp
  custom_allow_sale_days?: number; // Add custom_allow_sale_days field
  hasStock?: boolean; // Add hasStock field to track if item has stock
  max_discount?: number; // Add max_discount field for discount validation
  saleBillNo?: string; // Add saleBillNo field to track source invoice
  // Critical category fields
  custom_is_hazardous?: number;
  custom_reserved_antibiotic?: number;
  custom_stent?: number;
  custom_consignment_items?: number;
  custom_narcotic_drug?: number;
  custom_tb_drug?: number;
  custom_lasa?: number;
  custom_emergency_drug?: number;
  custom_ndps?: number;
  custom_controled_drug?: number;
  custom_high_risk_drug?: number;
  custom_banned_drug?: number;
  custom_edrug?: number;
  custom_is_prescribed?: number;
  _skipHighAlertCheck?: boolean; // Add flag to bypass high-alert check in confirmation flow
}

// Helper function to truncate to 2 decimal places (not round)
const truncateToTwoDecimals = (value: number): number => {
  return Math.ceil(value * 100) / 100;
};

const EditableCell = ({
  value: initialValue,
  row,
  column,
  table,
  type = 'text'
}: {
  value: any;
  row: any;
  column: any;
  table: any;
  type?: 'text' | 'number' | 'date';
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onBlur = () => {
    (table.options.meta)?.updateCell(row.index, column.id, value);
    setIsEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (isEditing) {
    return (
      <input
        value={value || ''}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        type={type}
        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-h-[32px] flex items-center"
    >
      {type === 'number' && typeof value === 'number'
        ? (column.id.includes('Amt') || column.id.includes('rate') || column.id === 'itemAmount' || column.id === 'totalAmt' || column.id === 'totalPckgAmt' || column.id === 'mrp')
          ? `﷼${truncateToTwoDecimals(value).toFixed(2)}`
          : value.toString()
        : value || '-'
      }
    </div>
  );
};

const Button = ({
  onClick,
  children,
  size = "button-small",
  type = "secondary-button",
  className = "",
  disabled
}: {
  onClick: () => void;
  children: React.ReactNode;
  size?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses = "px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClasses = size === "button-small" ? "text-xs px-2 py-1" : "px-3 py-2";
  const typeClasses = type === "secondary-button"
    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
    : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${typeClasses} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const STORAGE_KEY = 'table_column_order';
const DEFAULT_COLUMN_ORDER = [
  'select', 'alternateBatches', 'substituteItem', 'itemCode', 'itemName', 'batchNo',
  'expiryDate', 'stockQty', 'orderedQty', 'saleQty', 'returnQty', 'alreadyGivenQty', 'rate', 'mrp', 'uom', 'itemAmount',
  'discountPercent', 'discountAmt', 'cgstPercent', 'cgstAmt', 'sgstPercent', 'sgstAmt',
  'igstPercent', 'igstAmt', 'taxableAmount', 'totalAmt', 'coPayPercentage', 'patientAmount', 'payerAmount', 'covered', 'preAuthRequired', 'preAuthStatus', 'preAuthNo', 'preAuthDateTime', 'kitName', 'totalPckgAmt',
  'packageName', 'binLocation', 'actions'
];

const ColumnVisibilityDropdown = ({ table }: { table: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);

  const columnLabels: { [key: string]: string } = {
    select: "Select",
    alternateBatches: "Alternate Batches",
    substituteItem: "Substitute Item",
    itemCode: "Item Code",
    itemName: "Item Name",
    batchNo: "Batch No.",
    expiryDate: "Expiry Date",
    stockQty: "Stock Qty",
    orderedQty: "Ordered Qty",
    saleQty: "Sale Qty",
    returnQty: "Return Qty",
    alreadyGivenQty: "Already Given Qty",
    rate: "Unit Sale Rate",
    mrp: "MRP",
    uom: "UOM",
    itemAmount: "Item Amount",
    discountPercent: "Discount (%)",
    discountAmt: "Discount Amt.",
    cgstPercent: "CGST (%)",
    cgstAmt: "CGST Amt.",
    sgstPercent: "SGST (%)",
    sgstAmt: "SGST Amt.",
    igstPercent: "IGST (%)",
    igstAmt: "IGST Amt.",
    taxableAmount: "Item Amt",
    totalAmt: "Total Amt.",
    coPayPercentage: "Co-Pay %",
    patientAmount: "Patient Payer",
    payerAmount: "Customer Payer",
    covered: "Covered",
    preAuthRequired: "Pre-auth Req.",
    preAuthStatus: "Pre-auth Status",
    preAuthNo: "Pre-auth No.",
    preAuthDateTime: "Pre-auth Date & Time",
    kitName: "Kit Name",
    totalPckgAmt: "Total Pckg Amt.",
    packageName: "Package Name",
    binLocation: "Bin Location",
    actions: "Actions"
  };

  // Load column order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        setColumnOrder(JSON.parse(savedOrder));
      } catch {
        setColumnOrder(DEFAULT_COLUMN_ORDER);
      }
    } else {
      setColumnOrder(DEFAULT_COLUMN_ORDER);
    }
  }, []);

  // Apply column order to table
  useEffect(() => {
    if (columnOrder.length > 0) {
      table.setColumnOrder(columnOrder);
    }
  }, [columnOrder, table]);

  const saveColumnOrder = (newOrder: string[]) => {
    setColumnOrder(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    table.setColumnOrder(newOrder);
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndexRef.current = index;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedColumn) return;

    const draggedIndex = columnOrder.indexOf(draggedColumn);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...columnOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedColumn);

    saveColumnOrder(newOrder);
    setDraggedColumn(null);
    dragOverIndexRef.current = null;
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    dragOverIndexRef.current = null;
  };

  const toggleAllColumns = (visible: boolean) => {
    table.getAllLeafColumns().forEach((column: any) => {
      if (column.id !== 'actions' && column.id !== 'select') {
        column.toggleVisibility(visible);
      }
    });
  };

  const resetToDefault = () => {
    saveColumnOrder(DEFAULT_COLUMN_ORDER);
    // Reset visibility to show all except actions
    table.getAllLeafColumns().forEach((column: any) => {
      if (column.id !== 'actions' && column.id !== 'select') {
        column.toggleVisibility(true);
      }
    });
  };

  // const visibleColumns = columnOrder.filter(colId => {
  //   const column = table.getAllLeafColumns().find((col: any) => col.id === colId);
  //   return column && column.getIsVisible();
  // });

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        type="secondary-button"
        className="w-fit h-8 cursor-pointer flex flex-row items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-blue-600 focus:ring-blue-500"
      >
        <span>Show Columns</span>
        <span className="ml-1 text-gray-500">{isOpen ? '▲' : '▼'}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
            <div className="text-sm font-medium text-gray-700 mb-2">Manage Columns</div>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleAllColumns(true)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex-1"
                >
                  Show All
                </button>
                <button
                  onClick={() => toggleAllColumns(false)}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex-1"
                >
                  Hide All
                </button>
              </div>
              <button
                onClick={resetToDefault}
                className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 w-full"
              >
                Reset to Default
              </button>
            </div>
          </div>

          <div className="p-2 space-y-1">
            {columnOrder.map((columnId, index) => {
              const column = table.getAllLeafColumns().find((col: any) => col.id === columnId);
              if (!column || columnId === 'actions' || columnId === 'select') return null;

              const isBeingDragged = draggedColumn === columnId;
              const isDragOver = dragOverIndexRef.current === index;

              return (
                <div
                  key={columnId}
                  draggable
                  onDragStart={() => handleDragStart(columnId)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center space-x-2 py-2 px-2 rounded cursor-move transition-all ${isBeingDragged
                    ? 'opacity-50 bg-blue-50 border-2 border-blue-300'
                    : isDragOver
                      ? 'bg-blue-100 border-2 border-blue-400'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                >
                  <div className="text-gray-400 cursor-grab active:cursor-grabbing">⋮⋮</div>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {columnLabels[columnId] || columnId}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
/* eslint-disable */
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateCell: (rowIndex: number, columnId: string, value: any) => void;
    // updateRow?: () => void; // Added Optional
    // updateData?: () => void; // Added Optional
  }
}
interface EditableTableProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  fetchItemBatches?: (itemCode: string) => Promise<any[]>;
  fetchSubstituteItems?: (itemCode: string) => Promise<any[]>;
  fetchItemPrice?: (itemCode: string, batchNo: string | null, priceList: string) => Promise<number | null>;
  getBatchQty?: (itemCode: string, batchNo: string, warehouse: string) => Promise<number>;
  fetchBinLocationFromItem?: (itemCode: string) => Promise<string>;
  selectedWarehouse?: string;
  calculateItemTaxAndTotals?: (item: Item, includedInPrintRate: boolean) => Item;
  recalculateTotals?: (itemsList: Item[]) => void;
  fetchTaxDetails?: (itemCode: string, rate: number, qty: number, uom: string) => Promise<any>;
  // apiKey?: string;
  // apiSecret?: string;
  showAlert?: (variant: "success" | "warning" | "danger" | "primary" | "secondary", heading: string, content: string) => void;
  barcode?: string;
  setBarcode?: (value: string) => void;
  reqId?: string;
  setReqId?: (value: string) => void;
  isReqIdReadonly?: boolean;
  setIsReqIdReadonly?: (value: boolean) => void;
  isComplete?: boolean;
  setIsComplete?: (value: boolean) => void;
  canChangeRate?: boolean; // Add permission flag for rate changes
  isReturnMode?: boolean; // Add prop to enable return mode
  isReturnInvoice?: boolean; // Add prop to track when invoice is loaded from return bill
  isDirectReturn?: boolean; // Add prop to distinguish direct returns (hide Sale Qty column)
  hideTaxFields?: boolean; // Add prop to hide tax fields (CGST/SGST/IGST columns)
  applyPricingRules?: (items: Item[], customer: string) => Promise<Item[]>; // Add pricing rules function
  selectedCustomer?: string; // Add selected customer for pricing rules
  hideInsuranceFields?: boolean; // Add prop to hide insurance related fields
  showInsuranceFields?: boolean; // Add prop to show insurance related fields (for sales bill)
  showPreAuthFields?: boolean; // Add prop to show pre-auth fields (for sale_bill page)
  isLoadingFromPosInvoice?: boolean; // Add prop to prevent recalculation when loading invoice data
}

const EditableTable = ({
  items,
  setItems,
  fetchItemBatches,
  fetchSubstituteItems,
  fetchItemPrice,

  fetchBinLocationFromItem,

  calculateItemTaxAndTotals,
  recalculateTotals,
  fetchTaxDetails,
  // apiKey,
  // apiSecret,
  showAlert, // Added showAlert callback
  barcode,
  setBarcode,
  reqId,
  setReqId,
  isReqIdReadonly,
  setIsReqIdReadonly,
  isComplete,
  setIsComplete,
  canChangeRate = false, // Default to false (readonly)
  isReturnMode = false, // Default to false (normal mode)
  isReturnInvoice = false, // Default to false (not loaded from return bill)
  isDirectReturn = false, // Default to false (not direct return)
  hideTaxFields = false, // Default to false (show tax fields)
  applyPricingRules, // Pricing rules function
  selectedCustomer, // Selected customer for pricing rules
  hideInsuranceFields = false, // Default to false (show insurance fields)
  showInsuranceFields = false, // Default to false (hide insurance fields)
  showPreAuthFields = false, // Default to false (hide pre-auth fields)
  isLoadingFromPosInvoice = false, // Default to false (allow recalculation)
}: EditableTableProps) => {
  // const { apiKey: authApiKey, apiSecret: authApiSecret } = useAuth();
  // const effectiveApiKey = apiKey || authApiKey;
  // const effectiveApiSecret = apiSecret || authApiSecret;

  const [rowSelection, setRowSelection] = useState({});
  const [showRowActions, setShowRowActions] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    mrp: false, // Hide MRP column by default
    itemAmount: false, // Show Item Amount column by default
    totalAmt: true, // Hide Total Amount column by default
  });
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // Initialize column order from localStorage or default
  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        // Ensure returnQty and alreadyGivenQty are in the right position
        const updatedOrder = [...parsedOrder];
        const saleQtyIndex = updatedOrder.indexOf('saleQty');

        // Remove returnQty and alreadyGivenQty from wherever they are
        const returnQtyIndex = updatedOrder.indexOf('returnQty');
        const alreadyGivenQtyIndex = updatedOrder.indexOf('alreadyGivenQty');
        if (returnQtyIndex !== -1) updatedOrder.splice(returnQtyIndex, 1);
        if (alreadyGivenQtyIndex !== -1) updatedOrder.splice(alreadyGivenQtyIndex, 1);

        // Insert them right after saleQty
        if (saleQtyIndex !== -1) {
          updatedOrder.splice(saleQtyIndex + 1, 0, 'returnQty', 'alreadyGivenQty');
        }

        setColumnOrder(updatedOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrder));
      } catch {
        setColumnOrder(DEFAULT_COLUMN_ORDER);
      }
    } else {
      setColumnOrder(DEFAULT_COLUMN_ORDER);
    }
  }, []);

  const handleRemoveItemFromDetails = (itemId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      if (recalculateTotals) {
        recalculateTotals(updated);
      }
      return updated;
    });
  };

  const updateCell = (rowIndex: number, columnId: string, value: any) => {
    setItems(old => {
      const updated = old.map((row, index) => {
        if (index === rowIndex) {
          let parsedValue = value;

          if (['stockQty', 'orderedQty', 'saleQty', 'returnQty', 'rate', 'mrp', 'itemAmount', 'discountPercent', 'discountAmt',
            'cgstPercent', 'cgstAmt', 'sgstPercent', 'sgstAmt', 'igstPercent', 'igstAmt', 'totalAmt', 'totalPckgAmt', 'coPayPercentage', 'patientAmount', 'payerAmount'].includes(columnId)) {
            parsedValue = parseFloat(value) || 0;
          }

          // Validate co-pay percentage range (0-100)
          if (columnId === 'coPayPercentage') {
            parsedValue = Math.min(Math.max(parsedValue, 0), 100);
          }

          // Stock validation for saleQty
          if (columnId === 'saleQty') {
            const availableStock = row.batchStockQty !== undefined && row.batchStockQty !== null ? row.batchStockQty : row.stockQty;
            if (parsedValue > availableStock) {
              if (showAlert) {
                showAlert("warning", "Stock Warning", "You Dont have enough stock for this batch, Please Select alternate batch");
              } else {
                alert('You Dont have enough stock for this batch, Please Select alternate batch');
              }
              return row; // Return original row without changes
            }
          }

          // Return quantity validation - only apply when data is populated from invoice return
          if (columnId === 'returnQty' && row.alreadyReturnedQty !== undefined) {
            const alreadyReturned = row.alreadyReturnedQty || 0;
            const maxReturnQty = row.saleQty - alreadyReturned;

            if (parsedValue > maxReturnQty) {
              if (showAlert) {
                showAlert("danger", "Return Quantity Error", `You can add max ${maxReturnQty} qty as return qty. (Sale Qty: ${row.saleQty}, Already Returned: ${alreadyReturned})`);
              } else {
                alert(`You can add max ${maxReturnQty} qty as return qty. (Sale Qty: ${row.saleQty}, Already Returned: ${alreadyReturned})`);
              }
              return row; // Return original row without changes
            }
          }

          // Duplicate validation for itemCode or batchNo changes
          if (columnId === 'itemCode' || columnId === 'batchNo') {
            const newItemCode = columnId === 'itemCode' ? parsedValue : row.itemCode;
            const newBatchNo = columnId === 'batchNo' ? parsedValue : row.batchNo;

            // Check for duplicate (excluding current row)
            const duplicateIndex = old.findIndex((existingItem, existingIndex) =>
              existingIndex !== rowIndex && // Exclude current row
              existingItem.itemCode === newItemCode &&
              existingItem.batchNo === newBatchNo &&
              newBatchNo !== '' // Only check if batchNo is not empty
            );

            if (duplicateIndex !== -1) {
              const duplicateRow = duplicateIndex + 1; // Convert to 1-based row number
              const currentRow = rowIndex + 1;
              if (showAlert) {
                showAlert("danger", "Duplicate Item", `Item ${newItemCode} with batch ${newBatchNo} already exists in grid at row number ${duplicateRow}. Current row: ${currentRow}.`);
              } else {
                alert(`Item ${newItemCode} with batch ${newBatchNo} already exists in grid at row number ${duplicateRow}. Current row: ${currentRow}.`);
              }
              return row; // Return original row without changes
            }
          }

          // Batch expiry validation when expiry date is changed
          if (columnId === 'expiryDate' && parsedValue) {
            const daysUntilExpiry = Math.round((new Date(parsedValue).getTime() - Date.now()) / (1000 * 3600 * 24));
            const customAllowSaleDays = row.custom_allow_sale_days || 0; // Default to 0 if undefined

            if (customAllowSaleDays > 0) {
              if (daysUntilExpiry > 0 && daysUntilExpiry <= customAllowSaleDays) {
                if (showAlert) {
                  showAlert("warning", "Batch Expiry Warning", `Batch ${row.batchNo} of item ${row.itemName} will expire in ${daysUntilExpiry} days (Expiry Date: ${parsedValue}). This is within the allowed sale period of ${customAllowSaleDays} days.`);
                } else {
                  alert(`Batch ${row.batchNo} of item ${row.itemName} will expire in ${daysUntilExpiry} days (Expiry Date: ${parsedValue}). This is within the allowed sale period of ${customAllowSaleDays} days.`);
                }
                // Allow the change but show warning
              } else if (daysUntilExpiry <= 0) {
                if (showAlert) {
                  showAlert("danger", "Batch Expired", `Batch ${row.batchNo} of item ${row.itemName} has already expired (Expiry Date: ${parsedValue}). Cannot add to bill.`);
                } else {
                  alert(`Batch ${row.batchNo} of item ${row.itemName} has already expired (Expiry Date: ${parsedValue}). Cannot add to bill.`);
                }
                return row; // Return original row without changes
              }
            } else if (daysUntilExpiry <= 0) {
              // If no custom allow sale days, check if already expired
              if (showAlert) {
                showAlert("danger", "Batch Expired", `Batch ${row.batchNo} of item ${row.itemName} has already expired (Expiry Date: ${parsedValue}). Cannot add to bill.`);
              } else {
                alert(`Batch ${row.batchNo} of item ${row.itemName} has already expired (Expiry Date: ${parsedValue}). Cannot add to bill.`);
              }
              return row; // Return original row without changes
            }
          }

          let updatedRow = {
            ...row,
            [columnId]: parsedValue,
          };

          if (columnId === 'covered' && !parsedValue) {
            updatedRow.preAuthStatus = 'Pending';
          }

          if (columnId === 'discountAmt') {
            const rate = updatedRow.rate !== null ? updatedRow.rate : 0;
            // Use returnQty for return invoices, saleQty for regular invoices
            const quantity = updatedRow.returnQty && updatedRow.returnQty > 0 ? updatedRow.returnQty : updatedRow.saleQty;
            const baseAmount = quantity * rate;
            if (baseAmount > 0) {
              const discountPercent = (parsedValue / baseAmount) * 100;

              // Validate against max discount
              if (updatedRow.max_discount && discountPercent > updatedRow.max_discount) {
                if (showAlert) {
                  showAlert("danger", "Discount Limit Exceeded", `Maximum discount allowed for ${updatedRow.itemName} is ${updatedRow.max_discount}%. You cannot give more than ${updatedRow.max_discount}% discount.`);
                }
                return row; // Return original row without changes
              }

              updatedRow = {
                ...updatedRow,
                discountPercent: discountPercent,
              };
            }
          }

          // Validate discount percentage against max discount
          if (columnId === 'discountPercent') {
            if (updatedRow.max_discount && parsedValue > updatedRow.max_discount) {
              if (showAlert) {
                showAlert("danger", "Discount Limit Exceeded", `Maximum discount allowed for ${updatedRow.itemName} is ${updatedRow.max_discount}%. You cannot give more than ${updatedRow.max_discount}% discount.`);
              }
              return row; // Return original row without changes
            }
          }

          const rate = updatedRow.rate !== null ? updatedRow.rate : 0;
          // Use returnQty for return invoices, saleQty for regular invoices
          const quantity = updatedRow.returnQty && updatedRow.returnQty > 0 ? updatedRow.returnQty : updatedRow.saleQty;
          const baseAmount = quantity * rate;
          
          // Only recalculate discount amount if not loading from POS invoice
          // This preserves the original discount amount from loaded invoices
          let discountAmount = updatedRow.discountAmt || 0;
          if (!isLoadingFromPosInvoice) {
            discountAmount = baseAmount * (updatedRow.discountPercent / 100);
          }
          
          const itemAmountAfterDiscount = baseAmount - discountAmount;

          // For tax-inclusive rates, calculate percentage based on taxable amount, not total amount
          if (columnId === 'cgstAmt' || columnId === 'sgstAmt' || columnId === 'igstAmt') {
            // Since we're using tax-inclusive rates, we need to calculate the taxable amount first
            const totalTaxRate = (updatedRow.cgstPercent + updatedRow.sgstPercent + updatedRow.igstPercent) / 100;
            const taxableAmount = totalTaxRate > 0 ? itemAmountAfterDiscount / (1 + totalTaxRate) : itemAmountAfterDiscount;

            if (taxableAmount > 0) {
              if (columnId === 'cgstAmt') {
                updatedRow.cgstPercent = (parsedValue / taxableAmount) * 100;
              } else if (columnId === 'sgstAmt') {
                updatedRow.sgstPercent = (parsedValue / taxableAmount) * 100;
              } else if (columnId === 'igstAmt') {
                updatedRow.igstPercent = (parsedValue / taxableAmount) * 100;
              }
            }
          }

          if (['rate', 'orderedQty', 'saleQty', 'returnQty', 'discountPercent', 'discountAmt',
            'cgstPercent', 'cgstAmt', 'sgstPercent', 'sgstAmt', 'igstPercent', 'igstAmt', 'totalAmt', 'totalPckgAmt', 'coPayPercentage', 'patientAmount', 'payerAmount', 'covered', 'preAuthStatus'].includes(columnId)) {
            if (calculateItemTaxAndTotals) {
              return calculateItemTaxAndTotals(updatedRow, true);
            }
          }

          return updatedRow;
        }
        return row;
      });

      if (recalculateTotals) {
        recalculateTotals(updated);
      }

      // Apply pricing rules when batchNo or rate changes
      console.log('updateCell called - columnId:', columnId, 'applyPricingRules:', !!applyPricingRules, 'selectedCustomer:', selectedCustomer);

      if (applyPricingRules && selectedCustomer && (columnId === 'batchNo' || columnId === 'rate')) {
        console.log('Applying pricing rules for column:', columnId, 'customer:', selectedCustomer);
        console.log('Updated items count:', updated.length);

        const applyPricingRulesAsync = async () => {
          try {
            const updatedItemsWithPricing = await applyPricingRules(updated, selectedCustomer);
            console.log('Pricing rules applied, updated items:', updatedItemsWithPricing?.length);
            if (updatedItemsWithPricing && updatedItemsWithPricing.length > 0) {
              console.log('Setting items with pricing rules applied');
              setItems(updatedItemsWithPricing);
            }
          } catch (error) {
            console.error('Error applying pricing rules:', error);
          }
        };
        applyPricingRulesAsync();
      }

      return updated;
    });
  };

  // Create dynamic columns array based on return mode
  const dynamicColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all rows"
          className="flex items-center justify-center"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full h-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 40,
    },
    {
      accessorKey: "alternateBatches",
      header: "Alternate Batches",
      cell: ({ row }) => {
        const item = row.original as Item;
        const [batches, setBatches] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);
        const [isOpen, setIsOpen] = useState(false);
        const [selectedBatches, setSelectedBatches] = useState<{ [key: string]: boolean }>({});
        const [batchQuantities, setBatchQuantities] = useState<{ [key: string]: number }>({});
        const [itemTaxDetails, setItemTaxDetails] = useState<any>(null);
        const [batchMRPs, setBatchMRPs] = useState<{ [key: string]: number }>({});

        const fetchBatchMRP = async (batchName: string) => {
          try {
            // Use the same authentication logic as other functions
            const authHeaders = getAuthHeaders();
            // Convert HeadersInit to plain object for fetch compatibility
            const headers = typeof authHeaders === 'string' ?
              JSON.parse(authHeaders) :
              Array.isArray(authHeaders) ?
                Object.fromEntries(authHeaders) :
                authHeaders;

            const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/Batch/${batchName}`, {
              method: 'GET',
              headers,
              credentials: 'include',
            });

            if (response.ok) {
              const data = await response.json();
              return data.data?.custom_mrp || 0;
            }
          } catch (error) {
            console.error('Error fetching batch MRP:', error);
          }
          return 0;
        };

        const loadBatches = async () => {
          if (!fetchItemBatches || !item.itemCode) return;
          setLoading(true);
          try {
            const fetchedBatches = await fetchItemBatches(item.itemCode);
            setBatches(fetchedBatches);

            // Fetch tax details for the item
            if (fetchTaxDetails) {
              const taxDetails = await fetchTaxDetails(item.itemCode, item.rate || 0, 1, item.uom);
              setItemTaxDetails(taxDetails);
            }

            // Fetch MRP for each batch
            const mrpPromises = fetchedBatches.map(async (batch: any) => {
              const mrp = await fetchBatchMRP(batch.name);
              return { batchName: batch.name, mrp };
            });

            const mrpResults = await Promise.all(mrpPromises);
            const mrpMap: { [key: string]: number } = {};
            mrpResults.forEach(result => {
              mrpMap[result.batchName] = result.mrp;
            });
            setBatchMRPs(mrpMap);

            // Check which batches are already in the grid and pre-select them
            const preSelectedBatches: { [key: string]: boolean } = {};
            const preSelectedQuantities: { [key: string]: number } = {};

            items.forEach(gridItem => {
              // Check if this item is the same as the current item (by itemCode)
              if (gridItem.itemCode === item.itemCode && gridItem.batchNo) {
                preSelectedBatches[gridItem.batchNo] = true;
                preSelectedQuantities[gridItem.batchNo] = gridItem.saleQty || 0;
              }
            });

            setSelectedBatches(preSelectedBatches);
            setBatchQuantities(preSelectedQuantities);

          } catch (error) {
            console.error('Error fetching batches:', error);
          } finally {
            setLoading(false);
          }
        };

        const handleBatchSelection = (batchName: string, isSelected: boolean) => {
          setSelectedBatches(prev => ({
            ...prev,
            [batchName]: isSelected
          }));
        };

        const handleQuantityChange = (batchName: string, quantity: number) => {
          setBatchQuantities(prev => ({
            ...prev,
            [batchName]: quantity
          }));
        };

        const handleApplyBatches = async () => {
          const selectedBatchNames = Object.keys(selectedBatches).filter(name => selectedBatches[name]);
          if (selectedBatchNames.length === 0) return;

          try {
            const newBatchItems: Item[] = [];

            for (const batchName of selectedBatchNames) {
              const quantity = batchQuantities[batchName];
              const selectedBatch = batches.find(b => b.name === batchName);
              if (!selectedBatch) continue;

              const newBatchQty = selectedBatch.batch_qty || 0;
              const batchMRP = batchMRPs[batchName] || 0; // Get MRP from fetched batch MRP
              const safeRate = batchMRP > 0 ? batchMRP : (item.rate !== null ? item.rate : 0); // Use batch MRP if available, otherwise use item rate

              // Check batch expiry
              const expiryDate = selectedBatch.expiry_date;
              if (expiryDate) {
                const daysUntilExpiry = Math.round((new Date(expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
                const allowSaleDays = item.custom_allow_sale_days || 0;
                if (allowSaleDays > 0 && daysUntilExpiry > 0 && daysUntilExpiry <= allowSaleDays) {
                  console.warn(`Batch ${batchName} expires within ${allowSaleDays} days. Please verify.`);
                }
              }

              // Fetch bin_location for this item
              let binLocation = "";
              if (fetchBinLocationFromItem) {
                binLocation = await fetchBinLocationFromItem(item.itemCode);
              }

              const newItem: Item = {
                ...item,
                id: `${item.id}-${batchName}-${Date.now()}`, // Create unique ID for each batch row
                batchNo: batchName,
                batch: batchName,
                expiryDate: selectedBatch.expiry_date,
                batchStockQty: newBatchQty,
                stockQty: newBatchQty,
                rate: safeRate, // Use batch MRP as rate
                mrp: batchMRP, // Set MRP from fetched batch MRP
                saleQty: quantity,
                binLocation: binLocation // Set bin_location from Item doctype
              };

              const itemWithTax = calculateItemTaxAndTotals ? calculateItemTaxAndTotals(newItem, true) : newItem;
              newBatchItems.push(itemWithTax);
            }

            // Replace the original item row with new batch item rows
            if (newBatchItems.length > 0) {
              setItems(prev => {
                // Filter out the original item and add the new batch items
                const updatedItems = prev.filter(i => i.id !== item.id);
                updatedItems.splice(prev.findIndex(i => i.id === item.id), 0, ...newBatchItems);
                if (recalculateTotals) recalculateTotals(updatedItems);

                // Apply pricing rules after batches are applied
                if (applyPricingRules && selectedCustomer) {
                  console.log('Applying pricing rules after batch selection');
                  const applyPricingRulesAsync = async () => {
                    try {
                      const updatedItemsWithPricing = await applyPricingRules(updatedItems, selectedCustomer);
                      if (updatedItemsWithPricing && updatedItemsWithPricing.length > 0) {
                        console.log('Setting items with pricing rules applied after batch selection');
                        setItems(updatedItemsWithPricing);
                      }
                    } catch (error) {
                      console.error('Error applying pricing rules after batch selection:', error);
                    }
                  };
                  applyPricingRulesAsync();
                }

                return updatedItems;
              });
            }

            setIsOpen(false);
          } catch (error) {
            console.error('Error applying batches:', error);
          }
        };

        return (
          <div className="min-w-[120px]">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <UIButton
                  onClick={loadBatches}
                  disabled={!fetchItemBatches || !item.itemCode}
                  className="w-full text-xs font-semibold border-2 border-white bg-white text-black px-3 py-2 rounded-md hover:bg-blue-100 hover:border-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Alternate Batch
                </UIButton>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Alternative Batches - {item.itemName}</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                  {loading ? (
                    <div className="text-center py-4">Loading batches...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">Select</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">Batch No</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">Expiry Date</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">MRP</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">Batch Qty</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">CGST Rate</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">SGST Rate</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">IGST Rate</th>
                            <th className="border border-gray-300 px-2 py-2 text-left text-xs font-medium">Input Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batches.map((batch: any, index: number) => {
                            const isInGrid = items.some(gridItem => gridItem.itemCode === item.itemCode && gridItem.batchNo === batch.name);
                            return (
                              <tr key={batch.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-2 py-2">
                                  <Checkbox
                                    checked={selectedBatches[batch.name] || false}
                                    onCheckedChange={(checked) => handleBatchSelection(batch.name, checked === true)}
                                  />
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span>{batch.name}</span>
                                    {isInGrid && (
                                      <span className="text-green-600 font-bold text-sm" title="Already in grid">✓</span>
                                    )}
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">{batch.expiry_date || '-'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">﷼{batchMRPs[batch.name] || item.rate || 0}</td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">{batch.batch_qty || 0}</td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">{itemTaxDetails?.cgstRate || '0.00'}%</td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">{itemTaxDetails?.sgstRate || '0.00'}%</td>
                                <td className="border border-gray-300 px-2 py-2 text-xs">{itemTaxDetails?.igstRate || '0.00'}%</td>
                                <td className="border border-gray-300 px-2 py-2">
                                  <Input
                                    type="number"
                                    value={batchQuantities[batch.name] || ''}
                                    onChange={(e) => handleQuantityChange(batch.name, parseInt(e.target.value) || 0)}
                                    className="w-20 h-8 text-xs"
                                    placeholder="Qty"
                                    min="0"
                                    max={batch.batch_qty}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {batches.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No alternative batches available for this item.
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-4">
                        <UIButton
                          onClick={() => setIsOpen(false)}
                          className="border border-red-300 text-red-600 bg-red-50 px-4 py-2 rounded-md hover:bg-red-100 hover:border-red-400 transition-colors duration-200"
                        >
                          Close
                        </UIButton>

                        <UIButton
                          onClick={handleApplyBatches}
                          disabled={Object.keys(selectedBatches).filter(name => selectedBatches[name]).length === 0}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          Apply Selected Batches
                        </UIButton>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
    {
      accessorKey: "substituteItem",
      header: "Substitute Item",
      cell: ({ row }) => {
        const item = row.original as Item;
        const [isAlternativeOpen, setIsAlternativeOpen] = useState(false);
        const [alternativeItems, setAlternativeItems] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        const loadAlternativeItems = async () => {
          if (!fetchSubstituteItems || !item.itemCode) return;
          setLoading(true);
          try {
            const fetchedSubstitutes = await fetchSubstituteItems(item.itemCode);
            // Transform substitutes to match ItemAlternative format
            const transformedItems = await Promise.all(
              fetchedSubstitutes.map(async (sub: any) => {
                const batches = await fetchItemBatches?.(sub.alternative_item_code) || [];
                return {
                  item_code: sub.alternative_item_code,
                  item_name: sub.alternative_item_name || sub.alternative_item_code,
                  batches: batches.map((b: any) => ({
                    batch_no: b.name,
                    expiry_date: b.expiry_date,
                    qty: b.batch_qty || 0
                  }))
                };
              })
            );
            setAlternativeItems(transformedItems);
            setIsAlternativeOpen(true);
          } catch (error) {
            console.error('Error fetching alternative items:', error);
          } finally {
            setLoading(false);
          }
        };

        const [processedBatches, setProcessedBatches] = useState<Set<string>>(new Set());

        const handleSelectAlternativeBulk = async (batches: Array<{ itemCode: string; batchNo: string; expiryDate: string; qty: number }>) => {
          if (!fetchItemPrice) return;

          try {
            const newItems: Item[] = [];

            for (let index = 0; index < batches.length; index++) {
              const { itemCode, batchNo, expiryDate, qty } = batches[index];
              const newRate = await fetchItemPrice(itemCode, batchNo, 'Standard Selling');
              const selectedAlternative = alternativeItems.find(a => a.item_code === itemCode);

              // Fetch MRP for the selected batch
              let batchMRP = 0;
              try {
                // Use the same authentication logic as other functions
                const authHeaders = getAuthHeaders();
                // Convert HeadersInit to plain object for fetch compatibility
                const headers = typeof authHeaders === 'string' ?
                  JSON.parse(authHeaders) :
                  Array.isArray(authHeaders) ?
                    Object.fromEntries(authHeaders) :
                    authHeaders;

                const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/Batch/${batchNo}`, {
                  method: 'GET',
                  headers,
                  credentials: 'include',
                });

                if (response.ok) {
                  const data = await response.json();
                  batchMRP = data.data?.custom_mrp || 0;
                }
              } catch (error) {
                console.error('Error fetching batch MRP:', error);
              }

              if (index === 0) {
                // First batch replaces the original item
                const updatedItem = {
                  ...item,
                  itemCode: itemCode,
                  itemName: selectedAlternative?.item_name || itemCode,
                  batchNo: batchNo,
                  batch: batchNo,
                  expiryDate: expiryDate,
                  batchStockQty: qty,
                  stockQty: qty,
                  rate: newRate !== null ? newRate : item.rate,
                  mrp: batchMRP,
                  saleQty: qty,
                  substituteItem: item.itemCode
                };
                newItems.push(calculateItemTaxAndTotals ? calculateItemTaxAndTotals(updatedItem, true) : updatedItem);
              } else {
                // Subsequent batches are added as new rows
                const newItem = {
                  ...item,
                  id: `${item.id}-${batchNo}-${Date.now()}`,
                  itemCode: itemCode,
                  itemName: selectedAlternative?.item_name || itemCode,
                  batchNo: batchNo,
                  batch: batchNo,
                  expiryDate: expiryDate,
                  batchStockQty: qty,
                  stockQty: qty,
                  rate: newRate !== null ? newRate : item.rate,
                  mrp: batchMRP,
                  saleQty: qty,
                  substituteItem: item.itemCode
                };
                newItems.push(calculateItemTaxAndTotals ? calculateItemTaxAndTotals(newItem, true) : newItem);
              }
            }

            // Update items all at once
            setItems(prev => {
              const updatedItems = prev.map(i => i.id === item.id ? newItems[0] : i);
              // Add remaining items
              for (let i = 1; i < newItems.length; i++) {
                updatedItems.push(newItems[i]);
              }
              if (recalculateTotals) recalculateTotals(updatedItems);

              // Apply pricing rules after substitute items are applied
              if (applyPricingRules && selectedCustomer) {
                console.log('Applying pricing rules after substitute item selection');
                const applyPricingRulesAsync = async () => {
                  try {
                    const updatedItemsWithPricing = await applyPricingRules(updatedItems, selectedCustomer);
                    if (updatedItemsWithPricing && updatedItemsWithPricing.length > 0) {
                      console.log('Setting items with pricing rules applied after substitute selection');
                      setItems(updatedItemsWithPricing);
                    }
                  } catch (error) {
                    console.error('Error applying pricing rules after substitute selection:', error);
                  }
                };
                applyPricingRulesAsync();
              }

              return updatedItems;
            });

            setIsAlternativeOpen(false);
          } catch (error) {
            console.error('Error selecting alternative items:', error);
          }
        };

        return (
          <div className="min-w-[150px]">
            <UIButton
              onClick={loadAlternativeItems}
              disabled={!fetchSubstituteItems || !item.itemCode || loading}
              className="w-full text-xs font-semibold border-2 border-white bg-white text-black px-3 py-2 rounded-md hover:bg-green-100 hover:border-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Substitute'}
            </UIButton>

            <AlternativeItemsPopover
              isOpen={isAlternativeOpen}
              onClose={() => setIsAlternativeOpen(false)}
              onSelectAlternative={(itemCode, batchNo, expiryDate, qty) => {
                // Fallback for single batch selection
                handleSelectAlternativeBulk([{ itemCode, batchNo, expiryDate, qty }]);
              }}
              onSelectAlternativeBulk={handleSelectAlternativeBulk}
              alternativeItems={alternativeItems}
              originalItem={item}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "itemCode",
      header: "Item Code",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell value={getValue()} row={row} column={column} table={table} />
      ),
    },
    {
      accessorKey: "itemName",
      header: "Item Name",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell value={getValue()} row={row} column={column} table={table} />
      ),
    },
    // Conditionally add Sale Bill No column only in return mode
    ...(isReturnMode ? [{
      accessorKey: "saleBillNo",
      header: "Sale Bill No",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center bg-gray-50 text-gray-600">
            {item.saleBillNo || '-'}
          </div>
        );
      },
    }] : []),
    {
      accessorKey: "batchNo",
      header: "Batch No.",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center bg-gray-50 text-gray-600">
            {item.batchNo || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center bg-gray-50 text-gray-600">
            {item.expiryDate || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "stockQty",
      header: "Stock Qty",
      cell: ({ row }) => {
        const item = row.original as Item;
        const displayQty = item.batchStockQty !== undefined && item.batchStockQty !== null ? item.batchStockQty : item.stockQty;
        return <div className="px-2 py-1 min-h-[32px] flex items-center">{displayQty}</div>;
      },
    },
    {
      accessorKey: "orderedQty",
      header: "Ordered Qty",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.orderedQty}
          </div>
        );
      },
    },
    // Conditionally show Sale Qty column based on return type
    ...(isDirectReturn ? [] : [{
      accessorKey: "saleQty",
      header: "Sale Qty",
      cell: ({ getValue, row, column, table }) => (
        isReturnInvoice ? (
          <div className="px-2 py-1 min-h-[32px] flex items-center bg-gray-50 text-gray-600">
            {getValue()}
          </div>
        ) : (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        )
      ),
    }]),
    // Conditionally add Return Qty and Already Given Qty columns only in return mode
    ...(isReturnMode ? [{
      accessorKey: "returnQty",
      header: "Return Qty",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
      ),
    }, {
      accessorKey: "alreadyGivenQty",
      header: "Already Given Qty",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center bg-gray-50 text-gray-600">
            {item.alreadyReturnedQty || 0}
          </div>
        );
      },
    }] : []),
    {
      accessorKey: "rate",
      header: "Unit Sale Rate",
      cell: ({ getValue, row, column, table }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;

        // If user has permission to change rate, make it editable
        if (canChangeRate) {
          return (
            <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
          );
        }

        // Otherwise, show as readonly
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(rate).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "mrp",
      header: "MRP",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
      ),
    },
    {
      accessorKey: "uom",
      header: "UOM",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.uom}
          </div>
        );
      },
    },
    {
      id: "taxableAmount",
      header: "Item Amt",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const totalTaxRate = (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;

        let taxableAmount = totalTaxRate > 0 ? baseAmount / (1 + totalTaxRate) : baseAmount;
        const discountAmount = taxableAmount * (item.discountPercent / 100);
        const discountedTaxableAmount = taxableAmount - discountAmount;

        return (
          <div className="px-2 py-1 text-sm">
            ﷼{truncateToTwoDecimals(discountedTaxableAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "discountPercent",
      header: "Discount (%)",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
      ),
    },
    {
      accessorKey: "discountAmt",
      header: "Discount Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);

        return (
          <EditableCell value={discountAmount} row={row} column={{ id: 'discountAmt' } as any} table={{} as any} type="number" />
        );
      },
    },
    {
      accessorKey: "cgstPercent",
      header: "CGST (%)",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.cgstPercent}%
          </div>
        );
      },
    },
    {
      accessorKey: "cgstAmt",
      header: "CGST Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;

        // Calculate CGST amount based on taxable amount
        const totalTaxRate = (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;
        const taxableAmount = totalTaxRate > 0 ? itemAmountAfterDiscount / (1 + totalTaxRate) : itemAmountAfterDiscount;
        const cgstAmount = taxableAmount * (item.cgstPercent / 100);

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(cgstAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "sgstPercent",
      header: "SGST (%)",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.sgstPercent}%
          </div>
        );
      },
    },
    {
      accessorKey: "sgstAmt",
      header: "SGST Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;

        // Calculate SGST amount based on taxable amount
        const totalTaxRate = (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;
        const taxableAmount = totalTaxRate > 0 ? itemAmountAfterDiscount / (1 + totalTaxRate) : itemAmountAfterDiscount;
        const sgstAmount = taxableAmount * (item.sgstPercent / 100);

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(sgstAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "igstPercent",
      header: "IGST (%)",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.igstPercent}%
          </div>
        );
      },
    },
    {
      accessorKey: "igstAmt",
      header: "IGST Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;

        // Calculate IGST amount based on taxable amount
        const totalTaxRate = (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;
        const taxableAmount = totalTaxRate > 0 ? itemAmountAfterDiscount / (1 + totalTaxRate) : itemAmountAfterDiscount;
        const igstAmount = taxableAmount * (item.igstPercent / 100);

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(igstAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "itemAmount",
      header: "Item Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(item.itemAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmt",
      header: "Total Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        // Use returnQty for return invoices, saleQty for regular invoices
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;

        // Calculate total amount (including tax)
        const totalTaxRate = (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;
        const taxableAmount = totalTaxRate > 0 ? itemAmountAfterDiscount / (1 + totalTaxRate) : itemAmountAfterDiscount;
        const totalTaxAmount = taxableAmount * totalTaxRate;
        const totalAmount = itemAmountAfterDiscount; // This is already tax-inclusive if included_in_print_rate is true

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(totalAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "coPayPercentage",
      header: "Co-Pay %",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="number"
        />
      ),
    },
    {
      accessorKey: "patientAmount",
      header: "Patient Payer",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;
        
        // Co-pay calculations apply if pre-auth fields are not shown, OR if they are shown and covered & approved
        const copayApplies = !showPreAuthFields || (item.covered && item.preAuthStatus === 'Approved');
        let coPayPercent = copayApplies ? (item.coPayPercentage || 0) : 100;
        if (!item.covered) {
          coPayPercent = 0;
        }
        const payerAmount = itemAmountAfterDiscount * (coPayPercent / 100);
        const patientAmount = itemAmountAfterDiscount - payerAmount;

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(patientAmount).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "payerAmount",
      header: "Customer Payer",
      cell: ({ row }) => {
        const item = row.original as Item;
        const rate = item.rate !== null ? item.rate : 0;
        const quantity = item.returnQty && item.returnQty > 0 ? item.returnQty : item.saleQty;
        const baseAmount = quantity * rate;
        const discountAmount = baseAmount * (item.discountPercent / 100);
        const itemAmountAfterDiscount = baseAmount - discountAmount;
        
        // Co-pay calculations apply if pre-auth fields are not shown, OR if they are shown and covered & approved
        const copayApplies = !showPreAuthFields || (item.covered && item.preAuthStatus === 'Approved');
        let coPayPercent = copayApplies ? (item.coPayPercentage || 0) : 100;
        if (!item.covered) {
          coPayPercent = 0;
        }
        const payerAmount = itemAmountAfterDiscount * (coPayPercent / 100);

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(payerAmount).toFixed(2)}
          </div>
        );
      },
    },
    ...(showPreAuthFields ? [{
      accessorKey: "covered",
      header: "Covered",
      cell: ({ getValue, row, column, table }: { getValue: any, row: any, column: any, table: any }) => (
        <div className="px-2 py-1 min-h-[32px] flex items-center justify-center">
          <Checkbox
            checked={getValue() || false}
            onCheckedChange={(checked) => {
              const value = checked === true;
              table.options.meta?.updateCell(row.index, column.id, value);
            }}
          />
        </div>
      ),
    }] : []),
    ...(showPreAuthFields ? [{
      accessorKey: "preAuthRequired",
      header: "Pre-auth Req.",
      cell: ({ row }: { row: any }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.preAuthRequired ? 'Yes' : 'No'}
          </div>
        );
      },
    }] : []),
    ...(showPreAuthFields ? [{
      accessorKey: "preAuthStatus",
      header: "Pre-auth Status",
      cell: ({ getValue, row, column, table }: { getValue: any, row: any, column: any, table: any }) => {
        const value = getValue() || 'Pending';
        const statusColors: { [key: string]: string } = {
          'Approved': 'text-green-600',
          'Pending': 'text-yellow-600',
          'Rejected': 'text-red-600',
          'Initiated': 'text-blue-600'
        };
        const statusColor = statusColors[value] || 'text-gray-600';

        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            <Select
              value={value}
              onValueChange={(selectedValue) => {
                table.options.meta?.updateCell(row.index, column.id, selectedValue);
              }}
              disabled={!row.original.covered}
            >
              <SelectTrigger className={`h-8 w-full ${statusColor}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Initiated">Initiated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    }] : []),
    ...(showPreAuthFields ? [{
      accessorKey: "preAuthNo",
      header: "Pre-auth No.",
      cell: ({ row }: { row: any }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.preAuthNo || '-'}
          </div>
        );
      },
    }] : []),
    ...(showPreAuthFields ? [{
      accessorKey: "preAuthDateTime",
      header: "Pre-auth Date & Time",
      cell: ({ row }: { row: any }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.preAuthDateTime || '-'}
          </div>
        );
      },
    }] : []),
    {
      accessorKey: "kitName",
      header: "KIT Name",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.kitName || ''}
          </div>
        );
      },
    },
    {
      accessorKey: "totalPckgAmt",
      header: "Total Pckg Amt.",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            ﷼{truncateToTwoDecimals(item.totalPckgAmt).toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "packageName",
      header: "Package Name",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.packageName || ''}
          </div>
        );
      },
    },
    {
      accessorKey: "binLocation",
      header: "Bin Location",
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="px-2 py-1 min-h-[32px] flex items-center">
            {item.binLocation || ''}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original as Item;
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleRemoveItemFromDetails(item.id)} size="button-small" type="secondary-button">
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter out tax columns if hideTaxFields is true
  // Filter out insurance columns if showInsuranceFields is false
  const filteredColumns = dynamicColumns.filter(column => {
    const columnKey = column.accessorKey as string;

    // Hide tax fields if hideTaxFields is true
    if (hideTaxFields && ['cgstPercent', 'cgstAmt', 'sgstPercent', 'sgstAmt', 'igstPercent', 'igstAmt'].includes(columnKey)) {
      return false;
    }

    // Show insurance fields only if showInsuranceFields is true
    if (!showInsuranceFields && ['coPayPercentage', 'patientAmount', 'payerAmount'].includes(columnKey)) {
      return false;
    }

    return true;
  });

  const table = useReactTable<Item>({
    data: items,
    columns: filteredColumns,
    state: {
      rowSelection,
      pagination,
      columnVisibility,
      columnOrder,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateCell,
      updateRow: () => { },
      updateData: () => { },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  useEffect(() => {
    setShowRowActions(selectedRows.length > 0);
  }, [selectedRows]);

  const deselectRows = () => {
    setShowRowActions(false);
    table.toggleAllPageRowsSelected(false);
  };

  const handleDelete = () => {
    const selectedIds = selectedRows.map((row) => row.id);
    const updatedItems = items.filter((item: Item) => !selectedIds.includes(item.id));
    setItems(updatedItems);

    if (recalculateTotals) {
      recalculateTotals(updatedItems);
    }
    deselectRows();
  };

  const addNewItem = () => {
    const newItem: Item = {
      id: `new_${Date.now()}`,
      alternateBatches: '',
      substituteItem: '',
      itemCode: '',
      itemName: '',
      uom: '',
      stockQty: 0,
      orderedQty: 0,
      saleQty: 0,
      batch: '',
      batchNo: '',
      expiryDate: '',
      batchStockQty: 0,
      rate: 0,
      taxTemplate: '',
      description: '',
      itemAmount: 0,
      discountPercent: 0,
      discountAmt: 0,
      cgstPercent: 0,
      cgstAmt: 0,
      sgstPercent: 0,
      sgstAmt: 0,
      igstPercent: 0,
      igstAmt: 0,
      totalAmt: 0,
      kitName: '',
      totalPckgAmt: 0.00,
      packageName: '',
      binLocation: '',
      marginType: 'Standard', // Add marginType for new item
      includedInPrintRate: true, // Always consider included_in_print_rate as true for new items
      preAuthStatus: 'Pending',
      covered: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">




      <div className="flex justify-center items-center mb-2">
        <BulkAction
          modalProps={{
            open: showRowActions,
            setOpen: deselectRows,
          }}
          deselectRows={deselectRows}
          rows={selectedRows.map((row) => row.id)}
          onDelete={handleDelete}
        />
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${header.id === 'select' ? 'w-12 text-center' : 'min-w-[120px]'}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => {
              const item = row.original as Item;
              const isNoStock = item.hasStock === false;
              return (
                <tr
                  key={row.id}
                  className={`${isNoStock
                    ? 'bg-red-50 text-red-900'
                    : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-2 py-1 whitespace-nowrap text-sm ${isNoStock
                        ? 'text-red-900 font-semibold'
                        : 'text-gray-900'
                        } ${cell.column.id === 'select'
                          ? 'w-12'
                          : 'min-w-[120px]'
                        }`}

                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button
        onClick={addNewItem}
        type="button" // Changed from primary-button to type="button" assuming Button handles primary styling
        className="primary-button mt-4" // Keep className if it exists
      >
        + Add New Item
      </Button>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          <Button
            onClick={() => table.setPageIndex(0)}
            type="secondary-button"
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            type="secondary-button"
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            type="secondary-button"
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            type="secondary-button"
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
          </div>
          <ColumnVisibilityDropdown table={table} />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditableTable;

