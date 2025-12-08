import React, { useState, useEffect } from 'react';
import { X, FileText, User, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import Button from '../buttons/Button';
import { useAuth } from '@/context/AuthContext';

interface CreateReturnEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (returnData: any) => void;
  invoice: any;
}

const CreateReturnEntryModal: React.FC<CreateReturnEntryModalProps> = ({ isOpen, onClose, onSubmit, invoice }) => {
  const { apiKey, apiSecret } = useAuth();
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [refundMode, setRefundMode] = useState('Cash');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [alreadyReturnedQty, setAlreadyReturnedQty] = useState<{ [key: string]: number }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [_isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (invoice?.items && apiKey && apiSecret) {
      setReturnItems(invoice.items.map((item: any) => ({ ...item, return_qty: 0 })));
      fetchAlreadyReturnedQty();
    }
  }, [invoice, apiKey, apiSecret]);

  const fetchAlreadyReturnedQty = async () => {
    try {
      setIsLoadingData(true);
      if (!invoice?.name) return;
      
      // Fetch all return invoices for this original invoice
      const response = await fetch(
        `https://192.168.7.221:4422/api/resource/POS Invoice?filters=[["return_against","=","${invoice.name}"]]&fields=["name"]`,
        {
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
          }
        }
      );
      
      const data = await response.json();
      const returnedQtyMap: { [key: string]: number } = {};
      
      if (data.data && Array.isArray(data.data)) {
        // For each return invoice, fetch its full details to get items
        for (const returnInvoice of data.data) {
          try {
            const detailResponse = await fetch(
              `https://192.168.7.221:4422/api/resource/POS Invoice/${returnInvoice.name}`,
              {
                headers: {
                  'Authorization': `token ${apiKey}:${apiSecret}`,
                }
              }
            );
            
            const detailData = await detailResponse.json();
            if (detailData.data && detailData.data.items) {
              detailData.data.items.forEach((item: any) => {
                const itemCode = item.item_code;
                const returnedQty = Math.abs(item.qty || 0);
                returnedQtyMap[itemCode] = (returnedQtyMap[itemCode] || 0) + returnedQty;
              });
            }
          } catch (error) {
            console.error(`Failed to fetch details for return invoice ${returnInvoice.name}:`, error);
          }
        }
      }
      
      setAlreadyReturnedQty(returnedQtyMap);
      console.log('Already Returned Quantities:', returnedQtyMap);
    } catch (error) {
      console.error('Failed to fetch already returned quantities:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleQtyChange = (itemCode: string, qty: number) => {
    const originalItem = invoice.items.find((i: any) => i.item_code === itemCode);
    const alreadyReturned = alreadyReturnedQty[itemCode] || 0;
    const availableQty = originalItem.qty - alreadyReturned;
    
    const newErrors = { ...validationErrors };
    
    if (qty > availableQty) {
      newErrors[itemCode] = `Cannot return more than ${availableQty} units (${originalItem.qty} original - ${alreadyReturned} already returned)`;
    } else {
      delete newErrors[itemCode];
    }
    
    setValidationErrors(newErrors);

    setReturnItems(currentItems =>
      currentItems.map(item =>
        item.item_code === itemCode ? { ...item, return_qty: qty } : item
      )
    );
  };

  const totalReturnQty = returnItems.reduce((acc, item) => acc + Number(item.return_qty || 0), 0);
  const totalReturnAmount = returnItems.reduce((acc, item) => acc + (Number(item.return_qty || 0) * item.rate), 0);

  const handleSubmit = () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the validation errors before submitting');
      return;
    }

    const itemsToReturn = returnItems
      .filter(item => Number(item.return_qty) > 0)
      .map(item => ({
        item_code: item.item_code,
        return_qty: item.return_qty
      }));

    if(itemsToReturn.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    // Prepare taxes with included_in_print_rate flag
    const taxesWithFlag = invoice.taxes?.map((tax: any) => ({
      ...tax,
      included_in_print_rate: true
    })) || [];

    onSubmit({
      original_invoice: invoice.name,
      return_items: itemsToReturn,
      refund_mode: refundMode,
      return_remarks: returnRemarks,
      taxes: taxesWithFlag
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Return Entry</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Invoice No</p>
                <p className="text-sm font-bold text-gray-900">{invoice.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Customer</p>
                <p className="text-sm font-bold text-gray-900">{invoice.customer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Date & Time</p>
                <p className="text-sm font-bold text-gray-900">{new Date(invoice.posting_date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-600">{new Date(invoice.posting_date).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Total Amount</p>
                <p className="text-sm font-bold text-gray-900">₹{Number(invoice.grand_total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-y-auto">
          
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item Code</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Original Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Already Returned</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Available Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Return Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">UOM</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {returnItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                      <p className="text-sm">No items available</p>
                    </td>
                  </tr>
                ) : (
                  returnItems.map((item, idx) => {
                    const alreadyReturned = alreadyReturnedQty[item.item_code] || 0;
                    const availableQty = item.qty - alreadyReturned;
                    const hasError = validationErrors[item.item_code];
                    
                    return (
                      <React.Fragment key={item.name}>
                        <tr className={`hover:bg-blue-50 transition-colors ${hasError ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-600 bg-gray-50">{idx + 1}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.item_code}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">{item.item_name}</td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">{item.qty}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className="inline-block bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-medium">{alreadyReturned}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className={`inline-block px-3 py-1 rounded-full font-medium ${availableQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {availableQty}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input 
                              type="number" 
                              value={item.return_qty} 
                              onChange={e => handleQtyChange(item.item_code, Number(e.target.value))} 
                              max={availableQty} 
                              min={0} 
                              className={`w-20 border-2 rounded-lg px-3 py-2 text-sm text-center font-semibold focus:outline-none focus:ring-2 transition-all ${
                                hasError 
                                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                  : 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-gray-600 font-medium">{item.uom}</td>
                          <td className="px-4 py-4 text-sm text-right text-gray-600 font-medium">₹{Number(item.rate).toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">₹{Number(item.amount).toFixed(2)}</td>
                        </tr>
                        {hasError && (
                          <tr className="bg-red-50">
                            <td colSpan={10} className="px-4 py-2">
                              <div className="flex items-center gap-2 text-red-700 text-xs">
                                <AlertCircle className="w-4 h-4" />
                                <span>{validationErrors[item.item_code]}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Form */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Total Return Qty</label>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <input 
                  type="text" 
                  readOnly 
                  value={totalReturnQty} 
                  className="flex-1 bg-transparent text-2xl font-bold text-gray-900 border-none outline-none"
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Total Return Amount</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <input 
                  type="text" 
                  readOnly 
                  value={`₹${totalReturnAmount.toFixed(2)}`} 
                  className="flex-1 bg-transparent text-2xl font-bold text-gray-900 border-none outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Mode</label>
              <select 
                value={refundMode} 
                onChange={e => setRefundMode(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Return Remarks</label>
              <input 
                type="text" 
                value={returnRemarks} 
                onChange={e => setReturnRemarks(e.target.value)} 
                placeholder="Enter return remarks..." 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 gap-3 bg-white">
          <Button onClick={onClose} type='secondary-button' className="px-6 py-2.5">Cancel</Button>
          <Button onClick={handleSubmit} type='primary-button' className="px-6 py-2.5">Submit Return</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReturnEntryModal;
