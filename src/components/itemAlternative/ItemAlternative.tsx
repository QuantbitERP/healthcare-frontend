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

interface SelectedBatch {
  [itemCode: string]: string;
}

const AlternativeItemsPopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (itemCode: string, batchNo: string, expiryDate: string, qty: number) => void;
  alternativeItems: any[];
  originalItem: any;
}> = ({ isOpen, onClose, onSelectAlternative, alternativeItems, originalItem }) => {
  const [itemQuantities, setItemQuantities] = useState<ItemQuantity>({});
  const [_selectedBatches, setSelectedBatches] = useState<SelectedBatch>({});
  const [expandedBatches, setExpandedBatches] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize quantities to 1 for each item
      const initialQuantities: ItemQuantity = {};
      const initialBatches: SelectedBatch = {};
      alternativeItems.forEach(alt => {
        initialQuantities[alt.item_code] = 1;
        initialBatches[alt.item_code] = '';
      });
      setItemQuantities(initialQuantities);
      setSelectedBatches(initialBatches);
      setExpandedBatches({});
    }
  }, [isOpen, alternativeItems]);

  if (!isOpen) return null;

  const getTotalAvailableQty = (batches: Batch[]) => {
    return batches.reduce((sum, batch) => sum + batch.qty, 0);
  };

  const handleQuantityChange = (itemCode: string, value: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemCode]: Math.max(1, value)
    }));
  };

  const toggleBatchExpansion = (itemCode: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [itemCode]: !prev[itemCode]
    }));
  };

  const handleAddItem = async (itemCode: string, itemName: string, batches: Batch[]) => {
    const requestedQty = itemQuantities[itemCode] || 1;
    const totalAvailable = getTotalAvailableQty(batches);

    if (requestedQty > totalAvailable) {
      alert(`Requested quantity (${requestedQty}) exceeds available stock (${totalAvailable})`);
      return;
    }

    // Sort batches by expiry date (FEFO - First Expiry First Out)
    const sortedBatches = [...batches].sort((a, b) =>
      new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
    );

    let remainingQty = requestedQty;

    // Split quantity across batches
    for (const batch of sortedBatches) {
      if (remainingQty <= 0) break;

      const qtyFromThisBatch = Math.min(remainingQty, batch.qty);

      // Call the callback for each batch
      await onSelectAlternative(itemCode, batch.batch_no, batch.expiry_date, qtyFromThisBatch);

      remainingQty -= qtyFromThisBatch;
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
                            onChange={(e) => handleQuantityChange(alt.item_code, parseInt(e.target.value) || 1)}
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
                            disabled={!itemQuantities[alt.item_code] || itemQuantities[alt.item_code] <= 0 || itemQuantities[alt.item_code] > totalQty}
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
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {alt.batches.map((batch: Batch, idx: number) => (
                                    <tr key={`${batch.batch_no}-${idx}`} className="hover:bg-gray-50">
                                      <td className="px-3 py-2 text-xs text-gray-700">{batch.batch_no}</td>
                                      <td className="px-3 py-2 text-xs text-gray-600">{batch.expiry_date}</td>
                                      <td className="px-3 py-2 text-xs text-gray-600">{batch.qty}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <p className="text-xs text-gray-500 mt-2 italic">
                                * Quantity will be automatically split across batches using FEFO (First Expiry First Out)
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