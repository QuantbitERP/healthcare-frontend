"use client";
import React, { useState, useEffect } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import BulkAction from "../bulkAction/BulkAction";

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
  marginType?: string; // Add marginType as optional property
  includedInPrintRate?: boolean; // Add includedInPrintRate as optional property
}

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
        value={value}
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
        ? (column.id.includes('Amt') || column.id.includes('rate') || column.id === 'itemAmount' || column.id === 'totalAmt' || column.id === 'totalPckgAmt')
          ? `₹${value.toFixed(2)}`
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

const ColumnVisibilityDropdown = ({ table }: { table: any }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    rate: "Unit Sale Rate",
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
    totalAmt: "Total Amt.",
    kitName: "Kit Name",
    totalPckgAmt: "Total Pckg Amt.",
    packageName: "Package Name",
    binLocation: "Bin Location",
    actions: "Actions"
  };

  const toggleAllColumns = (visible: boolean) => {
    table.getAllLeafColumns().forEach((column: any) => {
      if (column.id !== 'actions' && column.id !== 'select') {
        column.toggleVisibility(visible);
      }
    });
  };

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
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Show/Hide Columns</div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllColumns(true)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Show All
              </button>
              <button
                onClick={() => toggleAllColumns(false)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Hide All
              </button>
            </div>
          </div>

          <div className="p-2">
            {table.getAllLeafColumns().map((column: any) => {
              if (column.id === 'actions' || column.id === 'select') return null;

              return (
                <label
                  key={column.id}
                  className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {columnLabels[column.id] || column.id}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="p-2 border-t border-gray-200">
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
  selectedWarehouse?: string;
  calculateItemTaxAndTotals?: (item: Item, includedInPrintRate: boolean) => Item;
  recalculateTotals?: (itemsList: Item[]) => void;
}

const EditableTable = ({
  items,
  setItems,
  fetchItemBatches,
  fetchSubstituteItems,
  fetchItemPrice,
  getBatchQty,
  selectedWarehouse,
  calculateItemTaxAndTotals,
  recalculateTotals
}: EditableTableProps) => {

  const [rowSelection, setRowSelection] = useState({});
  const [showRowActions, setShowRowActions] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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

          if (['stockQty', 'orderedQty', 'saleQty', 'rate', 'itemAmount', 'discountPercent', 'discountAmt',
            'cgstPercent', 'cgstAmt', 'sgstPercent', 'sgstAmt', 'igstPercent', 'igstAmt', 'totalAmt', 'totalPckgAmt'].includes(columnId)) {
            parsedValue = parseFloat(value) || 0;
          }

          let updatedRow = {
            ...row,
            [columnId]: parsedValue,
          };

          if (columnId === 'discountAmt') {
            const rate = updatedRow.rate !== null ? updatedRow.rate : 0;
            const baseAmount = updatedRow.orderedQty * rate;
            if (baseAmount > 0) {
              const discountPercent = (parsedValue / baseAmount) * 100;
              updatedRow = {
                ...updatedRow,
                discountPercent: discountPercent,
              };
            }
          }

          const rate = updatedRow.rate !== null ? updatedRow.rate : 0;
          const baseAmount = updatedRow.orderedQty * rate;
          const discountAmount = baseAmount * (updatedRow.discountPercent / 100);
          const itemAmountAfterDiscount = baseAmount - discountAmount;

          if (columnId === 'cgstAmt' && itemAmountAfterDiscount > 0) {
            updatedRow.cgstPercent = (parsedValue / itemAmountAfterDiscount) * 100;
          } else if (columnId === 'sgstAmt' && itemAmountAfterDiscount > 0) {
            updatedRow.sgstPercent = (parsedValue / itemAmountAfterDiscount) * 100;
          } else if (columnId === 'igstAmt' && itemAmountAfterDiscount > 0) {
            updatedRow.igstPercent = (parsedValue / itemAmountAfterDiscount) * 100;
          }

          if (['rate', 'orderedQty', 'saleQty', 'discountPercent', 'discountAmt',
              'cgstPercent', 'sgstPercent', 'igstPercent', 'cgstAmt', 'sgstAmt', 'igstAmt'].includes(columnId)) {
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

      return updated;
    });
  };

  const table = useReactTable<Item>({
    data: items,
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
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

          const loadBatches = async () => {
            if (!fetchItemBatches || !item.itemCode) return;
            setLoading(true);
            try {
              const fetchedBatches = await fetchItemBatches(item.itemCode);
              setBatches(fetchedBatches);
            } catch (error) {
              console.error('Error fetching batches:', error);
            } finally {
              setLoading(false);
            }
          };

          const handleBatchChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedBatchNo = e.target.value;
            if (!selectedBatchNo || !fetchItemPrice) return;

            const selectedBatch = batches.find(b => b.name === selectedBatchNo);
            if (!selectedBatch) return;

            try {
              const newRate = await fetchItemPrice(item.itemCode, selectedBatchNo, 'Standard Selling');
              const newBatchQty = selectedBatch.batch_qty || 0;

              setItems(prev => {
                const updatedItems = prev.map(i => {
                  if (i.id === item.id) {
                    const updatedItem = {
                      ...i,
                      batchNo: selectedBatchNo,
                      batch: selectedBatchNo,
                      expiryDate: selectedBatch.expiry_date,
                      batchStockQty: newBatchQty,
                      stockQty: newBatchQty,
                      rate: newRate !== null ? newRate : i.rate
                    };
                    return calculateItemTaxAndTotals ? calculateItemTaxAndTotals(updatedItem, true) : updatedItem;
                  }
                  return i;
                });
                if (recalculateTotals) recalculateTotals(updatedItems);
                return updatedItems;
              });

            } catch (error) {
              console.error('Error updating batch:', error);
            }
          };

          return (
            <div className="min-w-[180px]">
              <select
                value={item.batchNo || ''}
                onChange={handleBatchChange}
                onFocus={loadBatches}
                disabled={!fetchItemBatches || !item.itemCode}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Current: {item.batchNo || 'No Batch'}</option>
                {loading && <option disabled>Loading...</option>}
                {batches.map((batch: any) => (
                  <option key={batch.name} value={batch.name}>
                    {batch.name} (Exp: {batch.expiry_date}, Qty: {batch.batch_qty})
                  </option>
                ))}
              </select>
            </div>
          );
        },
      },
      {
        accessorKey: "substituteItem",
        header: "Substitute Item",
        cell: ({ row }) => {
          const item = row.original as Item;
          const [substitutes, setSubstitutes] = useState<any[]>([]);
          const [loading, setLoading] = useState(false);

          const loadSubstitutes = async () => {
            if (!fetchSubstituteItems || !item.itemCode) return;
            setLoading(true);
            try {
              const fetchedSubstitutes = await fetchSubstituteItems(item.itemCode);
              setSubstitutes(fetchedSubstitutes);
            } catch (error) {
              console.error('Error fetching substitutes:', error);
            } finally {
              setLoading(false);
            }
          };

          const handleSubstituteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedItemCode = e.target.value;
            if (!selectedItemCode || !fetchItemBatches || !fetchItemPrice) return;

            const selectedSubstitute = substitutes.find(s => s.alternative_item_code === selectedItemCode);
            if (!selectedSubstitute) return;

            try {
              const batches = await fetchItemBatches(selectedItemCode);
              const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

              let firstBatch = sortedBatches.length > 0 ? sortedBatches[0] : null;
              let newRate: number | null = null;
              let newBatchQty = 0;

              if (firstBatch) {
                newRate = await fetchItemPrice(selectedItemCode, firstBatch.name, 'Standard Selling');
                newBatchQty = firstBatch.batch_qty || 0;
              } else {
                newRate = await fetchItemPrice(selectedItemCode, null, 'Standard Selling');
                console.warn(`Substitute item ${selectedItemCode} has no available batches.`);
              }

              setItems(prev => {
                const updatedItems = prev.map(i => {
                  if (i.id === item.id) {
                    const updatedItem = {
                      ...i,
                      itemCode: selectedItemCode,
                      itemName: selectedSubstitute.alternative_item_name || selectedItemCode,
                      batchNo: firstBatch ? firstBatch.name : '',
                      batch: firstBatch ? firstBatch.name : '',
                      expiryDate: firstBatch ? firstBatch.expiry_date : '',
                      batchStockQty: newBatchQty,
                      stockQty: newBatchQty,
                      rate: newRate !== null ? newRate : i.rate,
                      substituteItem: item.itemCode
                    };
                    return calculateItemTaxAndTotals ? calculateItemTaxAndTotals(updatedItem, true) : updatedItem;
                  }
                  return i;
                });
                if (recalculateTotals) recalculateTotals(updatedItems);
                return updatedItems;
              });

            } catch (error) {
              console.error('Error updating substitute item:', error);
            }
          };

          return (
            <div className="min-w-[200px]">
              <select
                value={''}
                onChange={handleSubstituteChange}
                onFocus={loadSubstitutes}
                disabled={!fetchSubstituteItems || !item.itemCode}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Current: {item.itemName}</option>
                {loading && <option disabled>Loading...</option>}
                {substitutes.map((sub) => (
                  <option key={sub.alternative_item_code} value={sub.alternative_item_code}>
                    {sub.alternative_item_name || sub.alternative_item_code}
                  </option>
                ))}
              </select>
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
      {
        accessorKey: "batchNo",
        header: "Batch No.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} />
        ),
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="date" />
        ),
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
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "saleQty",
        header: "Sale Qty",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "rate",
        header: "Unit Sale Rate",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "uom",
        header: "UOM",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} />
        ),
      },
      {
        accessorKey: "itemAmount",
        header: "Item Amount",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
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
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "cgstPercent",
        header: "CGST (%)",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "cgstAmt",
        header: "CGST Amt.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "sgstPercent",
        header: "SGST (%)",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "sgstAmt",
        header: "SGST Amt.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "igstPercent",
        header: "IGST (%)",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "igstAmt",
        header: "IGST Amt.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "totalAmt",
        header: "Total Amt.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "kitName",
        header: "KIT Name",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue() || ''} row={row} column={column} table={table} />
        ),
      },
      {
        accessorKey: "totalPckgAmt",
        header: "Total Pckg Amt.",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue()} row={row} column={column} table={table} type="number" />
        ),
      },
      {
        accessorKey: "packageName",
        header: "Package Name",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue() || ''} row={row} column={column} table={table} />
        ),
      },
      {
        accessorKey: "binLocation",
        header: "Bin Location",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell value={getValue() || ''} row={row} column={column} table={table} />
        ),
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
    ],
    state: {
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
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
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800"></h2>
        <ColumnVisibilityDropdown table={table} />
      </div>

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
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${row.getIsSelected() ? 'bg-blue-50' : ''}`} >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-2 py-1 whitespace-nowrap text-sm text-gray-900 ${cell.column.id === 'select'
                      ? 'w-12'
                      : 'min-w-[120px]'
                      }`}

                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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

