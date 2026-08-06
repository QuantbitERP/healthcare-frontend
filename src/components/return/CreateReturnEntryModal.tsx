import React, { useState, useEffect } from 'react';
import { X, FileText, User, Calendar, DollarSign, Package, AlertCircle, Search, ArrowLeft } from 'lucide-react';
import Button from '../buttons/Button';
import { useAuth } from '@/context/AuthContext';
import { getAuthHeaders } from '@/utils/sessionAuth';

interface CreateReturnEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (returnData: any) => void;
  invoice: any;
  onBack?: () => void;
}

const CreateReturnEntryModal: React.FC<CreateReturnEntryModalProps> = ({ isOpen, onClose, onSubmit, invoice, onBack }) => {
  const { isAuthenticated } = useAuth();
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [refundMode, setRefundMode] = useState('Cash');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [alreadyReturnedQty, setAlreadyReturnedQty] = useState<{ [key: string]: number }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [_isLoadingData, setIsLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (invoice?.items && isAuthenticated) {
      setReturnItems(invoice.items.map((item: any) => ({ ...item, return_qty: 0, discount_percent: 0, discount_amount: 0 })));
      console.log('Invoice items:', invoice.items);
      // Log GST rates for debugging
      invoice.items.forEach((item: any, index: number) => {
        console.log(`Item ${index}:`, {
          item_code: item.item_code,
          rate: item.rate,
          cgst_rate: item.cgst_rate,
          sgst_rate: item.sgst_rate,
          igst_rate: item.igst_rate
        });
      });
      fetchAlreadyReturnedQty();
    }
  }, [invoice, isAuthenticated]);

  const fetchAlreadyReturnedQty = async () => {
    try {
      setIsLoadingData(true);
      if (!invoice?.name) return;

      // Fetch all return invoices for this original invoice
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      const response = await fetch(
        `https://gmcerp.quantcloud.in/api/resource/Sale Bill?filters=[["return_against","=","${invoice.name}"]]&fields=["name"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      const data = await response.json();
      const returnedQtyMap: { [key: string]: number } = {};

      if (data.data && Array.isArray(data.data)) {
        // For each return invoice, fetch its full details to get items
        for (const returnInvoice of data.data) {
          try {
            // Use the same authentication logic as other functions
            const authHeaders = getAuthHeaders();
            // Convert HeadersInit to plain object for fetch compatibility
            const headers = typeof authHeaders === 'string' ? 
              JSON.parse(authHeaders) : 
              Array.isArray(authHeaders) ? 
                Object.fromEntries(authHeaders) : 
                authHeaders;

            const detailResponse = await fetch(
              `https://gmcerp.quantcloud.in/api/resource/Sale Bill/${returnInvoice.name}`,
              {
                method: 'GET',
                headers,
                credentials: 'include',
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

  const handleDiscountChange = (itemCode: string, discountPercent: number) => {
    setReturnItems(currentItems =>
      currentItems.map(item => {
        if (item.item_code === itemCode) {
          // Get the rate after margin calculation
          let rateAfterMargin = item.price_list_rate || item.rate;
          
          // Apply margin if present
          if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
            rateAfterMargin += item.margin_rate_or_amount;
          } else if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
            rateAfterMargin += (rateAfterMargin * item.margin_rate_or_amount) / 100;
          }
          
          // Calculate discount on rate after margin
          const discountAmount = (rateAfterMargin * discountPercent) / 100;
          
          return { ...item, discount_percent: discountPercent, discount_amount: discountAmount };
        }
        return item;
      })
    );
  };

  // Filter items based on search term
  const filteredItems = returnItems.filter(item =>
    item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReturnQty = returnItems.reduce((acc, item) => acc + Number(item.return_qty || 0), 0);
  const totalReturnAmount = returnItems.reduce((acc, item) => {
    const returnQty = Number(item.return_qty || 0);
    if (returnQty <= 0) return acc;
    
    const gstRate = (item.cgst_rate || 0) + (item.sgst_rate || 0) + (item.igst_rate || 0);
    
    // Get the rate after margin calculation
    let rateAfterMargin = item.price_list_rate || item.rate;
    
    // Apply margin if present
    if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
      rateAfterMargin += item.margin_rate_or_amount;
    } else if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
      rateAfterMargin += (rateAfterMargin * item.margin_rate_or_amount) / 100;
    }
    
    // For MRP inclusive GST calculation
    if (gstRate > 0) {
      // Remove GST from rate after margin to get base price (taxable value)
      // const basePrice = rateAfterMargin / (1 + gstRate / 100);
      
      // Calculate GST amount
      // const gstAmount = rateAfterMargin - basePrice;
      
      // Apply discount on rate after margin for final amount calculation
      const discountAmount = Number(item.discount_amount || 0);
      const finalAmount = (rateAfterMargin - discountAmount) * returnQty;
      
      return acc + finalAmount;
    } else {
      // No GST case
      const itemTotal = returnQty * rateAfterMargin;
      const discountAmount = Number(item.discount_amount || 0);
      return acc + (itemTotal - discountAmount);
    }
  }, 0);
  const totalDiscount = returnItems.reduce((acc, item) => {
    const returnQty = Number(item.return_qty || 0);
    if (returnQty <= 0) return acc;
    
    const gstRate = (item.cgst_rate || 0) + (item.sgst_rate || 0) + (item.igst_rate || 0);
    
    // Get the rate after margin calculation
    let itemRateAfterMargin = item.price_list_rate || item.rate;
    
    // Apply margin if present
    if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
      itemRateAfterMargin += item.margin_rate_or_amount;
    } else if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
      itemRateAfterMargin += (itemRateAfterMargin * item.margin_rate_or_amount) / 100;
    }
    
    // For MRP inclusive GST, discount is calculated on rate after margin
    if (gstRate > 0) {
      // Discount is calculated on rate after margin
      const discountAmount = Number(item.discount_amount || 0) * returnQty;
      const finalAmount = (itemRateAfterMargin - discountAmount) * returnQty;
      
      return acc + finalAmount;
    } else {
      // No GST case
      const discountAmount = Number(item.discount_amount || 0);
      const itemTotal = returnQty * itemRateAfterMargin;
      return acc + (itemTotal - discountAmount);
    }
  }, 0);

  const handleSubmit = () => {
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the validation errors before submitting');
      return;
    }

    const itemsToReturn = returnItems
      .filter(item => Number(item.return_qty) > 0)
      .map(item => {
        const returnQty = Number(item.return_qty || 0);
        const gstRate = (item.cgst_rate || 0) + (item.sgst_rate || 0) + (item.igst_rate || 0);
        
        // Get the rate after margin calculation
        let rateAfterMargin = item.price_list_rate || item.rate;
        
        // Apply margin if present
        if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
          rateAfterMargin += item.margin_rate_or_amount;
        } else if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
          rateAfterMargin += (rateAfterMargin * item.margin_rate_or_amount) / 100;
        }
        
        // For MRP inclusive GST calculation
        let amount, base_amount, discount_amount;
        
        if (gstRate > 0) {
          // Remove GST from rate after margin to get base price (taxable value)
          const basePrice = rateAfterMargin / (1 + gstRate / 100);
          
          // Calculate GST amount
          // const gstAmount = rateAfterMargin - basePrice;
          
          // Apply discount on rate after margin for final amount calculation
          const itemDiscountAmount = Number(item.discount_amount || 0);
          const finalAmount = (rateAfterMargin - itemDiscountAmount) * returnQty;
          
          // But for accounting, we need to separate the discount from taxable value
          // Taxable value remains the same regardless of discount
          base_amount = -(basePrice * returnQty);
          
          // Amount is the final amount after discount
          amount = -finalAmount;
          
          // Discount amount for accounting
          discount_amount = -(itemDiscountAmount * returnQty);
        } else {
          // No GST case
          const itemTotal = returnQty * rateAfterMargin;
          const itemDiscountAmount = Number(item.discount_amount || 0) * returnQty;
          amount = -(itemTotal - itemDiscountAmount);
          base_amount = -(returnQty * rateAfterMargin);
          discount_amount = -(itemDiscountAmount);
        }
        
        return {
          item_code: item.item_code,
          item_name: item.item_name,
          return_qty: item.return_qty,
          margin_type: item.margin_type || "Percentage",
          margin_rate_or_amount: item.margin_rate_or_amount || 0,
          discount_percentage: item.discount_percent || 0,
          discount_amount: discount_amount,
          rate: item.price_list_rate || item.rate,
          amount: amount,
          base_rate: item.price_list_rate || item.rate,
          base_amount: base_amount,
          // Add GST rates for proper calculation on backend
          cgst_rate: item.cgst_rate || 0,
          sgst_rate: item.sgst_rate || 0,
          igst_rate: item.igst_rate || 0
        };
      });

    // Debug logging
    console.log('Items to Return:', itemsToReturn);
    console.log('Sample item data:', itemsToReturn[0]);

    if (itemsToReturn.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    // Prepare taxes with included_in_print_rate flag
    const taxesWithFlag = invoice.taxes?.map((tax: any) => ({
      ...tax,
      included_in_print_rate: true
    })) || [];

    const submissionData = {
      original_invoice: invoice.name,
      return_items: itemsToReturn,
      refund_mode: refundMode,
      return_remarks: returnRemarks,
      taxes: taxesWithFlag
    };

    // Debug logging for final submission
    console.log('Final submission data:', JSON.stringify(submissionData, null, 2));

    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        {/* <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Return Entry</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div> */}

        {/* Invoice Details */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Back to Invoice List"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-800">Create Return Entry</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
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
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item code or name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-xs text-gray-600">
                Showing {filteredItems.length} of {returnItems.length} items
              </p>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item Code</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Batch No</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Original Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Already Returned</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Available Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Return Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">UOM</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Discount %</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                      <p className="text-sm">
                        {searchTerm ? 'No items found matching your search' : 'No items available'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const alreadyReturned = alreadyReturnedQty[item.item_code] || 0;
                    const availableQty = item.qty - alreadyReturned;
                    const hasError = validationErrors[item.item_code];

                    return (
                      <React.Fragment key={item.name}>
                        <tr className={`hover:bg-blue-50 transition-colors ${hasError ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-600 bg-gray-50">{idx + 1}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.item_code}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">{item.item_name}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{item.batch_no || '-'}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.custom_expiry_date ? new Date(item.custom_expiry_date).toLocaleDateString() : '-'}
                          </td>
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
                              className={`w-20 border-2 rounded-lg px-3 py-2 text-sm text-center font-semibold focus:outline-none focus:ring-2 transition-all ${hasError
                                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                  : 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-gray-600 font-medium">{item.uom}</td>
                          <td className="px-4 py-4 text-sm text-right text-gray-600 font-medium">₹{Number(item.price_list_rate || item.rate).toFixed(2)}</td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              value={item.discount_percent || 0}
                              onChange={e => handleDiscountChange(item.item_code, Number(e.target.value))}
                              min={0}
                              max={100}
                              step={0.01}
                              placeholder="0"
                              className="w-20 border-2 border-green-300 rounded-lg px-3 py-2 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">₹{(() => {
                            const returnQty = Number(item.return_qty || 0);
                            if (returnQty <= 0) return '0.00';
                            
                            const gstRate = (item.cgst_rate || 0) + (item.sgst_rate || 0) + (item.igst_rate || 0);
                            
                            // Get the rate after margin calculation
                            let rateAfterMargin = item.price_list_rate || item.rate;
                            
                            // Apply margin if present
                            if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
                              rateAfterMargin += item.margin_rate_or_amount;
                            } else if (item.margin_type === "Percentage" && item.margin_rate_or_amount) {
                              rateAfterMargin += (rateAfterMargin * item.margin_rate_or_amount) / 100;
                            }
                            
                            // For MRP inclusive GST calculation
                            if (gstRate > 0) {
                              // Remove GST from rate after margin to get base price (taxable value)
                              // const basePrice = rateAfterMargin / (1 + gstRate / 100);
                              
                              // Calculate GST amount
                              // const gstAmount = rateAfterMargin - basePrice;
                              
                              // Apply discount on rate after margin for final amount calculation
                              const discountAmount = Number(item.discount_amount || 0);
                              const finalAmount = (rateAfterMargin - discountAmount) * returnQty;
                              
                              return finalAmount.toFixed(2);
                            } else {
                              // No GST case
                              const itemTotal = returnQty * rateAfterMargin;
                              const discountAmount = Number(item.discount_amount || 0);
                              
                              return (itemTotal - discountAmount).toFixed(2);
                            }
                          })()}</td>
                        </tr>
                        {hasError && (
                          <tr className="bg-red-50">
                            <td colSpan={13} className="px-4 py-2">
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
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Total Discount</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <input
                  type="text"
                  readOnly
                  value={`₹${totalDiscount.toFixed(2)}`}
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            {onBack && (
              <Button 
                onClick={onBack} 
                type='secondary-button' 
                className="px-4 py-2.5 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} type='secondary-button' className="px-6 py-2.5">Cancel</Button>
            <Button onClick={handleSubmit} type='primary-button' className="px-6 py-2.5">Submit Return</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReturnEntryModal;
