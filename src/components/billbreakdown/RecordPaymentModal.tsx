import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Plus, Trash2 } from 'lucide-react';
import Button from '../buttons/Button';

interface PaymentMethod {
  name: string;
  mode_of_payment: string;
}

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    paidBy: string;
    payeeName: string;
    pendingAmount: number;
    payments: Array<{
      id: number;
      paymentMode: string;
      transactionNo: string;
      bankName: string;
      branchName: string;
      paidAmount: string;
      paymentDate: string;
      approvalNo: string;
    }>
  }) => void;
  posProfile?: string;
  apiKey?: string;
  apiSecret?: string;
  outstandingAmount?: number;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, onSubmit, posProfile, apiKey, apiSecret, outstandingAmount }) => {
  const [paidBy, setPaidBy] = useState('Self');
  const [payeeName, setPayeeName] = useState('');
  const [pendingAmount, setPendingAmount] = useState('0');
  const [payments, setPayments] = useState<any[]>([]);
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  // Set pending amount when modal opens or outstanding amount changes
  useEffect(() => {
    if (isOpen && outstandingAmount !== undefined) {
      setPendingAmount(outstandingAmount.toString());
    }
  }, [isOpen, outstandingAmount]);

  // Fetch payment methods from POS Profile
  useEffect(() => {
    if (isOpen && posProfile && apiKey && apiSecret) {
      const fetchPaymentMethods = async () => {
        try {
          const response = await fetch(`https://192.168.7.221:4422/api/resource/POS%20Profile/${posProfile}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `token ${apiKey}:${apiSecret}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const posProfileData = data.data;

            // Extract payment methods from POS Profile
            if (posProfileData.payments && Array.isArray(posProfileData.payments)) {
              const methods = posProfileData.payments.map((payment: any) => ({
                name: payment.mode_of_payment,
                mode_of_payment: payment.mode_of_payment,
              }));
              setPaymentMethods(methods);
            } else {
              // Fallback to default payment methods if none found in POS Profile
              setPaymentMethods([
                { name: 'Cash', mode_of_payment: 'Cash' },
                { name: 'Card', mode_of_payment: 'Card' },
                { name: 'UPI', mode_of_payment: 'UPI' },
                { name: 'Cheque', mode_of_payment: 'Cheque' },
              ]);
            }
          } else {
            console.error('Failed to fetch POS Profile for payment methods');
            // Fallback to default payment methods
            setPaymentMethods([
              { name: 'Cash', mode_of_payment: 'Cash' },
              { name: 'Card', mode_of_payment: 'Card' },
              { name: 'UPI', mode_of_payment: 'UPI' },
              { name: 'Cheque', mode_of_payment: 'Cheque' },
            ]);
          }
        } catch (error) {
          console.error('Error fetching payment methods:', error);
          // Fallback to default payment methods
          setPaymentMethods([
            { name: 'Cash', mode_of_payment: 'Cash' },
            { name: 'Card', mode_of_payment: 'Card' },
            { name: 'UPI', mode_of_payment: 'UPI' },
            { name: 'Cheque', mode_of_payment: 'Cheque' },
          ]);
        }
      };

      fetchPaymentMethods();
    } else if (isOpen && (!posProfile || !apiKey || !apiSecret)) {
      // Fallback to default payment methods if no POS profile or credentials provided
      setPaymentMethods([
        { name: 'Cash', mode_of_payment: 'Cash' },
        { name: 'Card', mode_of_payment: 'Card' },
        { name: 'UPI', mode_of_payment: 'UPI' },
        { name: 'Cheque', mode_of_payment: 'Cheque' },
      ]);
    }
  }, [isOpen, posProfile, apiKey, apiSecret]);

  if (!isOpen) return null;

  const handleAddPayment = () => {
    setPayments([...payments, {
      id: Date.now(),
      paymentMode: '',
      transactionNo: '',
      bankName: '',
      branchName: '',
      paidAmount: '',
      paymentDate: '',
      approvalNo: ''
    }]);
  };

  const handleCellClick = (paymentId: number, field: string) => {
    setExpandedCells(prev => ({ ...prev, [`${paymentId}-${field}`]: !prev[`${paymentId}-${field}`] }));
  };

  const handleRemovePayment = (paymentId: number) => {
    setPayments(payments.filter(p => p.id !== paymentId));
  };

  const getInputWidth = (paymentId: number, field: string) => {
    return expandedCells[`${paymentId}-${field}`] ? '320px' : 'auto';
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Record Payments</h2>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Paid by
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Self">Self</option>
                <option value="Family Member">Family Member</option>
                <option value="Insurance">Insurance</option>
                <option value="Company">Company</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Sponsored By (Payee)
              </label>
              <input
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Enter payee name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pending Payable Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="text"
                value={pendingAmount}
                onChange={(e) => setPendingAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Payment Table */}
          <div className="border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 p-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[120px]">Payment Mode</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[180px]">Card/Cheque/Trans. No.</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[140px]">Bank Name</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[140px]">Branch Name</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[120px]">Paid Amount</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[140px]">Payment Date</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 min-w-[120px]">Approval No</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-gray-200">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'paymentMode') }}>
                        <select
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-paymentMode`] ? '320px' : '120px',
                            width: expandedCells[`${payment.id}-paymentMode`] ? '320px' : '100%'
                          }}
                          value={payment.paymentMode}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, paymentMode: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'paymentMode')}
                          onBlur={() => handleCellClick(payment.id, 'paymentMode')}
                        >
                          <option value="">Select</option>
                          {paymentMethods.map((method) => (
                            <option key={method.mode_of_payment} value={method.mode_of_payment}>
                              {method.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'transactionNo') }}>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-transactionNo`] ? '320px' : '180px',
                            width: expandedCells[`${payment.id}-transactionNo`] ? '320px' : '100%'
                          }}
                          placeholder="Transaction No"
                          value={payment.transactionNo}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, transactionNo: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'transactionNo')}
                          onBlur={() => handleCellClick(payment.id, 'transactionNo')}
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'bankName') }}>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-bankName`] ? '320px' : '140px',
                            width: expandedCells[`${payment.id}-bankName`] ? '320px' : '100%'
                          }}
                          placeholder="Bank Name"
                          value={payment.bankName}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, bankName: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'bankName')}
                          onBlur={() => handleCellClick(payment.id, 'bankName')}
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'branchName') }}>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-branchName`] ? '320px' : '140px',
                            width: expandedCells[`${payment.id}-branchName`] ? '320px' : '100%'
                          }}
                          placeholder="Branch Name"
                          value={payment.branchName}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, branchName: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'branchName')}
                          onBlur={() => handleCellClick(payment.id, 'branchName')}
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'paidAmount') }}>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-paidAmount`] ? '320px' : '120px',
                            width: expandedCells[`${payment.id}-paidAmount`] ? '320px' : '100%'
                          }}
                          placeholder="Amount"
                          value={payment.paidAmount}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, paidAmount: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'paidAmount')}
                          onBlur={() => handleCellClick(payment.id, 'paidAmount')}
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'paymentDate') }}>
                        <input
                          type="date"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-paymentDate`] ? '320px' : '140px',
                            width: expandedCells[`${payment.id}-paymentDate`] ? '320px' : '100%'
                          }}
                          value={payment.paymentDate}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, paymentDate: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'paymentDate')}
                          onBlur={() => handleCellClick(payment.id, 'paymentDate')}
                        />
                      </td>
                      <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'approvalNo') }}>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                          style={{
                            minWidth: expandedCells[`${payment.id}-approvalNo`] ? '320px' : '120px',
                            width: expandedCells[`${payment.id}-approvalNo`] ? '320px' : '100%'
                          }}
                          placeholder="Approval No"
                          value={payment.approvalNo}
                          onChange={(e) => {
                            const updatedPayments = payments.map(p =>
                              p.id === payment.id ? { ...p, approvalNo: e.target.value } : p
                            );
                            setPayments(updatedPayments);
                          }}
                          onFocus={() => handleCellClick(payment.id, 'approvalNo')}
                          onBlur={() => handleCellClick(payment.id, 'approvalNo')}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleRemovePayment(payment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleAddPayment}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <Button
            type='primary-button'
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => {
              onSubmit?.({
                paidBy,
                payeeName,
                pendingAmount: parseFloat(pendingAmount) || 0,
                payments,
              });
              onClose();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordPaymentModal;