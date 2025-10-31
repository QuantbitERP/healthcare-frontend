import React, { useState, useEffect } from 'react';
import { X, IndianRupee } from 'lucide-react';
import Button from '../buttons/Button';
import PaymentTable from './PaymentTable'; // Import the new PaymentTable

interface Payment {
  id: number;
  paymentMode: string;
  transactionNo: string;
  bankName: string;
  branchName: string;
  paidAmount: string;
  paymentDate: string;
  approvalNo: string;
}

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    paidBy: string;
    payeeName: string;
    pendingAmount: number;
    payments: Payment[]; // Use the Payment interface
  }) => void;
  posProfile?: string;
  apiKey?: string;
  apiSecret?: string;
  outstandingAmount?: number;
  payments: Payment[]; // Payments are now controlled by parent
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>; // Setter is now controlled by parent
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ isOpen, onClose, onSubmit, posProfile, apiKey, apiSecret, outstandingAmount, payments, setPayments }) => {
  const [paidBy, setPaidBy] = useState('Self');
  const [payeeName, setPayeeName] = useState('');
  const [pendingAmount, setPendingAmount] = useState('0');
  // payments and setPayments are now props

  useEffect(() => {
    if (isOpen && outstandingAmount !== undefined) {
      setPendingAmount(outstandingAmount.toString());
      // No longer clearing payments here, as parent controls it.
      // setPayments([]); 
      setPaidBy('Self');
      setPayeeName('');
    }
  }, [isOpen, outstandingAmount]);

  if (!isOpen) return null;

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

          {/* Payment Table Component */}
          <PaymentTable
            payments={payments}
            setPayments={setPayments}
            posProfile={posProfile}
            apiKey={apiKey}
            apiSecret={apiSecret}
            totalBillAmount={parseFloat(pendingAmount) || 0} // Pass the pending amount as totalBillAmount
          />
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