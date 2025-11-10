import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface PaymentMethod {
  name: string;
  mode_of_payment: string;
}

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

interface PaymentTableProps {
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  posProfile?: string;
  apiKey?: string;
  apiSecret?: string;
  totalBillAmount: number;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, setPayments, posProfile, apiKey, apiSecret, totalBillAmount }) => {
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const initializePaymentMethods = async () => {
      let methods: PaymentMethod[] = [];

      if (posProfile && apiKey && apiSecret) {
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

            if (posProfileData.payments && Array.isArray(posProfileData.payments)) {
              methods = posProfileData.payments.map((payment: any) => ({
                name: payment.mode_of_payment,
                mode_of_payment: payment.mode_of_payment,
              }));
            } else {
              methods = [
                { name: 'Cash', mode_of_payment: 'Cash' },
                { name: 'Card', mode_of_payment: 'Card' },
                { name: 'UPI', mode_of_payment: 'UPI' },
                { name: 'Cheque', mode_of_payment: 'Cheque' },
              ];
            }
          } else {
            console.error('Failed to fetch POS Profile for payment methods');
            methods = [
              { name: 'Cash', mode_of_payment: 'Cash' },
              { name: 'Card', mode_of_payment: 'Card' },
              { name: 'UPI', mode_of_payment: 'UPI' },
              { name: 'Cheque', mode_of_payment: 'Cheque' },
            ];
          }
        } catch (error) {
          console.error('Error fetching payment methods:', error);
          methods = [
            { name: 'Cash', mode_of_payment: 'Cash' },
            { name: 'Card', mode_of_payment: 'Card' },
            { name: 'UPI', mode_of_payment: 'UPI' },
            { name: 'Cheque', mode_of_payment: 'Cheque' },
          ];
        }
      } else {
        methods = [
          { name: 'Cash', mode_of_payment: 'Cash' },
          { name: 'Card', mode_of_payment: 'Card' },
          { name: 'UPI', mode_of_payment: 'UPI' },
          { name: 'Cheque', mode_of_payment: 'Cheque' },
        ];
      }

      setPaymentMethods(methods);

      // Automatically add first payment row if payments array is empty
      if (payments.length === 0 && methods.length > 0) {
        setPayments([{
          id: Date.now(),
          paymentMode: methods[0].mode_of_payment,
          transactionNo: '',
          bankName: '',
          branchName: '',
          paidAmount: totalBillAmount.toFixed(2),
          paymentDate: new Date().toISOString().split('T')[0],
          approvalNo: ''
        }]);
      }
    };

    initializePaymentMethods();
  }, [posProfile, apiKey, apiSecret]);

  useEffect(() => {
    // Update the paidAmount of the last payment entry when totalBillAmount changes
    if (payments.length > 0) {
      setPayments(prevPayments => {
        const lastPaymentIndex = prevPayments.length - 1;
        const updatedPayments = [...prevPayments];
        updatedPayments[lastPaymentIndex] = {
          ...updatedPayments[lastPaymentIndex],
          paidAmount: totalBillAmount.toFixed(0),
        };
        return updatedPayments;
      });
    } else if (paymentMethods.length > 0) {
      // If no payments exist but totalBillAmount changes, create a new one
      setPayments([{
        id: Date.now(),
        paymentMode: paymentMethods[0].mode_of_payment,
        transactionNo: '',
        bankName: '',
        branchName: '',
        paidAmount: totalBillAmount.toFixed(0),
        paymentDate: new Date().toISOString().split('T')[0],
        approvalNo: ''
      }]);
    }
  }, [totalBillAmount, payments.length, paymentMethods]);

  const handleAddPayment = () => {
    const defaultPaymentMode = paymentMethods.length > 0 ? paymentMethods[0].mode_of_payment : '';
    setPayments([...payments, {
      id: Date.now(),
      paymentMode: defaultPaymentMode,
      transactionNo: '',
      bankName: '',
      branchName: '',
      paidAmount: totalBillAmount.toFixed(2),
      paymentDate: new Date().toISOString().split('T')[0],
      approvalNo: ''
    }]);
  };

  const handleCellClick = (paymentId: number, field: string) => {
    setExpandedCells(prev => ({ ...prev, [`${paymentId}-${field}`]: !prev[`${paymentId}-${field}`] }));
  };

  const handleRemovePayment = (paymentId: number) => {
    setPayments(payments.filter(p => p.id !== paymentId));
  };

  const handlePaymentChange = (paymentId: number, field: string, value: string) => {
    setPayments(prevPayments =>
      prevPayments.map(p =>
        p.id === paymentId ? { ...p, [field]: value } : p
      )
    );
  };

  const getInputWidth = (paymentId: number, field: string) => {
    return expandedCells[`${paymentId}-${field}`] ? '320px' : 'auto';
  };

  return (
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
                    onChange={(e) => handlePaymentChange(payment.id, 'paymentMode', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'transactionNo', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'bankName', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'branchName', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'paidAmount', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'paymentDate', e.target.value)}
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
                    onChange={(e) => handlePaymentChange(payment.id, 'approvalNo', e.target.value)}
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
  );
};

export default PaymentTable;