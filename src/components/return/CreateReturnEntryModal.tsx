import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../buttons/Button';

interface CreateReturnEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (returnData: any) => void;
  invoice: any;
}

const CreateReturnEntryModal: React.FC<CreateReturnEntryModalProps> = ({ isOpen, onClose, onSubmit, invoice }) => {
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [refundMode, setRefundMode] = useState('Cash');
  const [returnRemarks, setReturnRemarks] = useState('');

  useEffect(() => {
    if (invoice?.items) {
      setReturnItems(invoice.items.map((item: any) => ({ ...item, return_qty: 0 })));
    }
  }, [invoice]);

  const handleQtyChange = (itemCode: string, qty: number) => {
    const originalItem = invoice.items.find((i: any) => i.item_code === itemCode);
    if (qty > originalItem.qty) return; // Prevent returning more than purchased

    setReturnItems(currentItems =>
      currentItems.map(item =>
        item.item_code === itemCode ? { ...item, return_qty: qty } : item
      )
    );
  };

  const totalReturnQty = returnItems.reduce((acc, item) => acc + Number(item.return_qty || 0), 0);
  const totalReturnAmount = returnItems.reduce((acc, item) => acc + (Number(item.return_qty || 0) * item.rate), 0);

  const handleSubmit = () => {
    const itemsToReturn = returnItems
      .filter(item => Number(item.return_qty) > 0)
      .map(item => ({ item_code: item.item_code, return_qty: item.return_qty }));

    if(itemsToReturn.length === 0) return; // Don't submit if no items are being returned

    onSubmit({
      original_invoice: invoice.name,
      return_items: itemsToReturn,
      refund_mode: refundMode,
      return_remarks: returnRemarks,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create Return Entry</h2>
          <Button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-4 space-y-4">
          <div>Invoice No: <strong>{invoice.name}</strong></div>
          <div>Customer: <strong>{invoice.customer}</strong></div>
          <div>Date: <strong>{new Date(invoice.posting_date).toLocaleString()}</strong></div>
          <div>Total Amount: <strong>{invoice.grand_total}</strong></div>
        </div>
        <div className="overflow-y-auto flex-grow p-4">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['#', 'Item Code', 'Item Name', 'Original Qty', 'Return Qty', 'UOM', 'Rate', 'Amount'].map(h => <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {returnItems.map((item, idx) => (
                <tr key={item.name} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{item.item_code}</td>
                  <td className="px-4 py-2">{item.item_name}</td>
                  <td className="px-4 py-2">{item.qty}</td>
                  <td className="px-4 py-2"><input type="number" value={item.return_qty} onChange={e => handleQtyChange(item.item_code, Number(e.target.value))} max={item.qty} min={0} className="w-20 border rounded px-2 py-1" /></td>
                  <td className="px-4 py-2">{item.uom}</td>
                  <td className="px-4 py-2">{item.rate}</td>
                  <td className="px-4 py-2">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Total Return Qty</label>
                    <input type="text" readOnly value={totalReturnQty} className="w-full bg-gray-100 border rounded px-3 py-2" />
                </div>
                <div>
                    <label>Total Return Amount</label>
                    <input type="text" readOnly value={totalReturnAmount.toFixed(2)} className="w-full bg-gray-100 border rounded px-3 py-2" />
                </div>
                <div>
                    <label>Refund Mode</label>
                    <select value={refundMode} onChange={e => setRefundMode(e.target.value)} className="w-full border rounded px-3 py-2">
                        <option>Cash</option>
                        <option>Card</option>
                        <option>UPI</option>
                    </select>
                </div>
                <div>
                    <label>Return Remarks</label>
                    <input type="text" value={returnRemarks} onChange={e => setReturnRemarks(e.target.value)} placeholder="Return remarks" className="w-full border rounded px-3 py-2" />
                </div>
            </div>
        </div>
        <div className="flex items-center justify-end p-4 border-t gap-4">
            <Button onClick={onClose} type='secondary-button'>Cancel</Button>
            <Button onClick={handleSubmit} type='primary-button'>Submit Return</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReturnEntryModal;
