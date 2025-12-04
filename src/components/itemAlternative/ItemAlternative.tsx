import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

interface Batch {
  batch_no: string;
  expiry_date: string;
  qty: number;
}

interface ItemQuantity {
  [itemCode: string]: number;
}

// interface SelectedBatch {
//   [itemCode: string]: string;
// }

interface SelectedBatchQuantities {
  [itemCode: string]: {
    [batchNo: string]: number;
  };
}

interface AlternativeItemsPopover {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (itemCode: string, batchNo: string, expiryDate: string, qty: number) => void;
  onSelectAlternativeBulk?: (batches: Array<{itemCode: string; batchNo: string; expiryDate: string; qty: number}>) => void;
  alternativeItems: any[];
  originalItem: any;
}

const AlternativeItemsPopover: React.FC<AlternativeItemsPopover> = ({ isOpen, onClose, onSelectAlternative, onSelectAlternativeBulk, alternativeItems, originalItem }) => {
  const [selectedBatchQuantities, setSelectedBatchQuantities] = useState<SelectedBatchQuantities>({});
  const [itemQuantities, setItemQuantities] = useState<ItemQuantity>({}); // Reintroduce for overall item quantity
  const [expandedBatches, setExpandedBatches] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize quantities
      const initialBatchQuantities: SelectedBatchQuantities = {};
      const initialItemQuantities: ItemQuantity = {};
      alternativeItems.forEach(alt => {
        initialBatchQuantities[alt.item_code] = {};
        initialItemQuantities[alt.item_code] = 1; // Default to 1 for overall item quantity
        alt.batches.forEach((batch: Batch) => {
          initialBatchQuantities[alt.item_code][batch.batch_no] = 0; // Initialize to 0
        });
      });
      setSelectedBatchQuantities(initialBatchQuantities);
      setItemQuantities(initialItemQuantities);
      setExpandedBatches({});
    }
  }, [isOpen, alternativeItems]);

  if (!isOpen) return null;

  const getTotalAvailableQty = (batches: Batch[]) => {
    return batches.reduce((sum, batch) => sum + batch.qty, 0);
  };

  const handleItemQuantityChange = (itemCode: string, value: number) => {
    setItemQuantities(prev => ({ ...prev, [itemCode]: Math.max(1, value) }));
    // Clear individual batch quantities if overall quantity is being set
    setSelectedBatchQuantities(prev => ({ ...prev, [itemCode]: {} }));
  };

  const handleBatchQuantityChange = (itemCode: string, batchNo: string, value: number) => {
    setSelectedBatchQuantities(prev => ({
      ...prev,
      [itemCode]: {
        ...prev[itemCode],
        [batchNo]: Math.max(0, value)
      }
    }));
    // Clear overall item quantity if individual batch quantities are being set
    setItemQuantities(prev => ({ ...prev, [itemCode]: 0 }));
  };

  const toggleBatchExpansion = (itemCode: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [itemCode]: !prev[itemCode]
    }));
  };

  const handleAddItem = async (itemCode: string, itemName: string, batches: Batch[]) => {
    const individualRequestedQuantities = selectedBatchQuantities[itemCode];
    const totalRequestedQty = itemQuantities[itemCode] || 0;
    const totalAvailable = getTotalAvailableQty(batches);

    console.log('handleAddItem called:', {
      itemCode,
      totalRequestedQty,
      totalAvailable,
      batchesCount: batches.length,
      batches: batches.map(b => ({ batch_no: b.batch_no, qty: b.qty, expiry: b.expiry_date }))
    });

    let batchesToProcess: { batchNo: string; expiryDate: string; qty: number; }[] = [];

    if (individualRequestedQuantities && Object.values(individualRequestedQuantities).some(qty => qty > 0)) {
      // Scenario 1: Individual batch quantities are explicitly set
      batchesToProcess = Object.entries(individualRequestedQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([batchNo, qty]) => {
          const batch = batches.find(b => b.batch_no === batchNo);
          if (batch) {
            return { batchNo, expiryDate: batch.expiry_date, qty };
          }
          return null;
        })
        .filter(Boolean) as { batchNo: string; expiryDate: string; qty: number; }[];

      const sumIndividualQty = batchesToProcess.reduce((sum, b) => sum + b.qty, 0);
      if (sumIndividualQty > totalAvailable) {
        alert(`Total requested quantity for individual batches (${sumIndividualQty}) exceeds available stock (${totalAvailable}).`);
        return;
      }

    } else if (totalRequestedQty > 0) {
      // Scenario 2: Only total quantity is set, distribute using FEFO
      if (totalRequestedQty > totalAvailable) {
        alert(`Requested quantity (${totalRequestedQty}) exceeds available stock (${totalAvailable}).`);
        return;
      }

      const sortedBatches = [...batches].sort((a, b) =>
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      );

      console.log('Sorted batches for FEFO:', sortedBatches.map(b => ({ batch_no: b.batch_no, qty: b.qty, expiry: b.expiry_date })));

      let remainingQty = totalRequestedQty;
      for (const batch of sortedBatches) {
        if (remainingQty <= 0) break;

        const qtyFromThisBatch = Math.min(remainingQty, batch.qty);
        if (qtyFromThisBatch > 0) {
          console.log(`Taking ${qtyFromThisBatch} from batch ${batch.batch_no}`);
          batchesToProcess.push({ batchNo: batch.batch_no, expiryDate: batch.expiry_date, qty: qtyFromThisBatch });
          remainingQty -= qtyFromThisBatch;
        }
      }

      console.log('Batches to process after FEFO:', batchesToProcess);

    } else {
      alert("Please enter a quantity for the item or for individual batches.");
      return;
    }

    if (batchesToProcess.length === 0) {
      alert("No batches could be allocated with the requested quantity.");
      return;
    }

    // Use bulk callback if available (for split batches), otherwise use individual callback
    if (onSelectAlternativeBulk && batchesToProcess.length > 1) {
      console.log('Using bulk callback for', batchesToProcess.length, 'batches');
      onSelectAlternativeBulk(batchesToProcess.map(b => ({
        itemCode,
        batchNo: b.batchNo,
        expiryDate: b.expiryDate,
        qty: b.qty
      })));
    } else {
      // Fallback to individual callbacks
      for (const { batchNo, expiryDate, qty } of batchesToProcess) {
        await onSelectAlternative(itemCode, batchNo, expiryDate, qty);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 overflow-y-auto h-full w-full z-[1001]">
      <div className="relative top-20 mx-auto p-5 border w-[90%] md:w-[80%] lg:w-[70%] shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          No Stock Available For {originalItem?.itemName} - Select Alternative for {originalItem?.itemName} ({originalItem?.itemCode})
        </h3>
        <div className="max-h-[500px] overflow-y-auto mb-4">
          {alternativeItems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Available</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batches</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alternativeItems.map((alt) => {
                  const totalQty = getTotalAvailableQty(alt.batches);
                  const isExpanded = expandedBatches[alt.item_code];

                  return (
                    <React.Fragment key={alt.item_code}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alt.item_code}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{alt.item_name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{alt.uom}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-semibold">{totalQty}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBatchExpansion(alt.item_code)}
                            className="text-xs"
                          >
                            {isExpanded ? '▼' : '▶'} {alt.batches.length} Batch{alt.batches.length !== 1 ? 'es' : ''}
                          </Button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Input
                            type="number"
                            value={itemQuantities[alt.item_code] || 1}
                            onChange={(e) => handleItemQuantityChange(alt.item_code, parseInt(e.target.value) || 1)}
                            min="1"
                            max={totalQty}
                            className="w-24"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddItem(alt.item_code, alt.item_name, alt.batches)}
                            disabled={
                              // Disable if no total quantity AND no individual batch quantities
                              ((!itemQuantities[alt.item_code] || itemQuantities[alt.item_code] <= 0) &&
                                (!selectedBatchQuantities[alt.item_code] || Object.values(selectedBatchQuantities[alt.item_code]).every(qty => qty <= 0))) ||
                              // Disable if total quantity exceeds available stock
                              (itemQuantities[alt.item_code] > totalQty) ||
                              // Disable if any individual batch quantity exceeds its available stock
                              (selectedBatchQuantities[alt.item_code] && Object.entries(selectedBatchQuantities[alt.item_code]).some(([batchNo, qty]) => {
                                const batch = alt.batches.find((b: Batch) => b.batch_no === batchNo);
                                return batch && qty > batch.qty;
                              }))
                            }
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-4 py-2 bg-gray-50">
                            <div className="ml-8">
                              <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Batch No.</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Expiry Date</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Available Qty</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Quantity to Add</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {alt.batches.map((batch: Batch, idx: number) => (
                                    <tr key={`${batch.batch_no}-${idx}`} className="hover:bg-gray-50">
                                      <td className="px-3 py-2 text-xs text-gray-700">{batch.batch_no}</td>
                                      <td className="px-3 py-2 text-xs text-gray-600">{batch.expiry_date}</td>
                                      <td className="px-3 py-2 text-xs text-gray-600">{batch.qty}</td>
                                      <td className="px-3 py-2 text-xs">
                                        <Input
                                          type="number"
                                          value={selectedBatchQuantities[alt.item_code]?.[batch.batch_no] || 0}
                                          onChange={(e) => handleBatchQuantityChange(alt.item_code, batch.batch_no, parseInt(e.target.value) || 0)}
                                          min="0"
                                          max={batch.qty}
                                          className="w-20"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <p className="text-xs text-gray-500 mt-2 italic">
                                * Enter quantities for specific batches to override total quantity. Only batches with quantity &gt; 0 will be added.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-8">No alternative items found.</p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default AlternativeItemsPopover;