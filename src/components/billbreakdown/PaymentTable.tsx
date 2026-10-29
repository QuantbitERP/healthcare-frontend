import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getAuthHeaders } from '@/utils/sessionAuth';

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
  custom_bank_name?: string;
  custom_branch_name?: string;
  custom_transaction_no?: string;
}

interface PaymentTableProps {
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  posProfile?: string;
  apiKey?: string;
  apiSecret?: string;
  totalBillAmount: number;
  transactionType?: 'cash' | 'credit';
  roundedGrandTotal?: number;
  isLoadedInvoice?: boolean; // Flag to indicate if invoice is loaded from draft
  totalPatientAmount?: number;
  coPay?: number;
  showAlert?: (variant: any, heading: string, content: string) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  setPayments,
  posProfile,
  apiKey,
  apiSecret,
  totalBillAmount,
  transactionType,
  roundedGrandTotal,
  isLoadedInvoice,
  totalPatientAmount,
  coPay,
  showAlert,
}) => {
  const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({});
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [manuallyEdited, setManuallyEdited] = useState<boolean>(false);

  const isCredit = transactionType === 'credit';

  // Clamp payments if totalPatientAmount decreases below current total paid on credit bills
  useEffect(() => {
    if (isCredit && totalPatientAmount !== undefined && totalPatientAmount >= 0) {
      const currentTotalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0);
      if (currentTotalPaid > totalPatientAmount + 0.01) {
        let remainingAllowed = totalPatientAmount;
        setPayments(prev =>
          prev.map(p => {
            const currentAmt = parseFloat(p.paidAmount) || 0;
            const newAmt = Math.max(0, Math.min(currentAmt, remainingAllowed));
            remainingAllowed = Math.max(0, remainingAllowed - newAmt);
            return {
              ...p,
              paidAmount: newAmt.toFixed(2),
            };
          })
        );
      }
    }
  }, [totalPatientAmount, isCredit]);

  // Auto-set paid amount based on transaction type (only for new invoices, not loaded ones)
  useEffect(() => {
    // Don't auto-set paid amounts when loading an existing invoice
    if (isLoadedInvoice) {
      return;
    }

    if (transactionType === 'credit') {
      // For credit transactions, set paid amount to 0
      setPayments(prev =>
        prev.map(payment => ({
          ...payment,
          paidAmount: '0'
        }))
      );
    } else if (transactionType === 'cash') {
      // For cash transactions, set paid amount to rounded grand total
      const paidAmount = (roundedGrandTotal ?? totalBillAmount).toString();
      setPayments(prev =>
        prev.map(payment => ({
          ...payment,
          paidAmount: paidAmount
        }))
      );
    }
  }, [transactionType, roundedGrandTotal, totalBillAmount, setPayments, isLoadedInvoice]);

  useEffect(() => {
    const initializePaymentMethods = async () => {
      let methods: PaymentMethod[] = [];

      try {
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ? 
          JSON.parse(authHeaders) : 
          Array.isArray(authHeaders) ? 
            Object.fromEntries(authHeaders) : 
            authHeaders;

        let systemModes: string[] = [];
        try {
          const mopResponse = await fetch(
            `https://gmcerp.quantcloud.in/api/resource/Mode%20of%20Payment?filters=[["enabled","=",1]]&fields=["name"]&limit_page_length=50`,
            {
              method: 'GET',
              headers,
            }
          );
          if (mopResponse.ok) {
            const mopData = await mopResponse.json();
            if (mopData?.data && Array.isArray(mopData.data)) {
              systemModes = mopData.data.map((m: any) => m.name);
            }
          }
        } catch (e) {
          console.error('Failed to fetch Mode of Payment list:', e);
        }

        let posModes: string[] = [];
        let defaultMode = 'Cash';

        if (posProfile) {
          try {
            const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/POS%20Profile/${encodeURIComponent(posProfile)}`, {
              method: 'GET',
              headers,
            });

            if (response.ok) {
              const data = await response.json();
              const posProfileData = data.data;

              if (posProfileData?.payments && Array.isArray(posProfileData.payments)) {
                posModes = posProfileData.payments.map((payment: any) => payment.mode_of_payment);
                const defaultPayment = posProfileData.payments.find((payment: any) => payment.default);
                if (defaultPayment?.mode_of_payment) {
                  defaultMode = defaultPayment.mode_of_payment;
                }
              }
            }
          } catch (e) {
            console.error('Failed to fetch POS Profile for payment methods:', e);
          }
        }

        const modeSet = new Set<string>();
        if (defaultMode) modeSet.add(defaultMode);
        modeSet.add('Cash');
        posModes.forEach(m => m && modeSet.add(m));
        systemModes.forEach(m => m && modeSet.add(m));

        // Fallback if network calls returned nothing
        if (modeSet.size <= 1) {
          ['Credit Card', 'Debit Card', 'POS', 'Cheque', 'Bank Transfer', 'Deposit'].forEach(m => modeSet.add(m));
        }

        methods = Array.from(modeSet).map(mode => ({
          name: mode,
          mode_of_payment: mode,
        }));
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        methods = [
          { name: 'Cash', mode_of_payment: 'Cash' },
          { name: 'Credit Card', mode_of_payment: 'Credit Card' },
          { name: 'Debit Card', mode_of_payment: 'Debit Card' },
          { name: 'POS', mode_of_payment: 'POS' },
          { name: 'Cheque', mode_of_payment: 'Cheque' },
          { name: 'Bank Transfer', mode_of_payment: 'Bank Transfer' },
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
          paidAmount: transactionType === 'credit' ? '0' : Number(totalBillAmount || 0).toFixed(2),
          paymentDate: new Date().toISOString().split('T')[0],
          approvalNo: '',
          custom_bank_name: '',
          custom_branch_name: '',
          custom_transaction_no: ''
        }]);
      }
    };

    initializePaymentMethods();
  }, [posProfile, apiKey, apiSecret]);

  useEffect(() => {
    // Only auto-update payment amount if:
    // 1. Invoice is NOT loaded from draft (isLoadedInvoice is false/undefined)
    // 2. User has NOT manually edited the payment amount
    // 3. Transaction type is cash (do not overwrite credit bills with totalBillAmount!)
    if (isLoadedInvoice || manuallyEdited || transactionType === 'credit') {
      return; // Skip auto-update for loaded invoices, manually edited, or credit bills
    }

    // Update the paidAmount of the last payment entry when totalBillAmount changes
    if (payments.length > 0) {
      setPayments(prevPayments => {
        const lastPaymentIndex = prevPayments.length - 1;
        const updatedPayments = [...prevPayments];
        updatedPayments[lastPaymentIndex] = {
          ...updatedPayments[lastPaymentIndex],
          paidAmount: Number(totalBillAmount || 0).toFixed(0),
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
        paidAmount: Number(totalBillAmount || 0).toFixed(0),
        paymentDate: new Date().toISOString().split('T')[0],
        approvalNo: '',
        custom_bank_name: '',
        custom_branch_name: '',
        custom_transaction_no: ''
      }]);
    }
  }, [totalBillAmount, payments.length, paymentMethods, isLoadedInvoice, manuallyEdited, transactionType]);

  const handleCellClick = (paymentId: number, field: string) => {
    setExpandedCells(prev => ({ ...prev, [`${paymentId}-${field}`]: !prev[`${paymentId}-${field}`] }));
  };

  const handleAddPayment = () => {
    const defaultPaymentMode = paymentMethods.length > 0 ? paymentMethods[0].mode_of_payment : '';
    let initialAmount = '0';
    if (isCredit) {
      const currentPaid = payments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0);
      const remaining = Math.max(0, Number(totalPatientAmount || 0) - currentPaid);
      initialAmount = remaining > 0 ? remaining.toFixed(2) : '0';
    }

    setPayments([...payments, {
      id: Date.now(),
      paymentMode: defaultPaymentMode,
      transactionNo: '',
      bankName: '',
      branchName: '',
      paidAmount: initialAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      approvalNo: '',
      custom_bank_name: '',
      custom_branch_name: '',
      custom_transaction_no: ''
    }]);
  };

  const handleRemovePayment = (paymentId: number) => {
    setPayments(payments.filter(p => p.id !== paymentId));
  };

  const handlePaymentChange = (paymentId: number, field: string, value: string) => {
    if (field === 'paidAmount') {
      setManuallyEdited(true);

      // Validation for Credit transactions
      if (isCredit) {
        // Only allow numbers and at most one decimal point
        if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
          return;
        }

        const maxAllowed = Number(totalPatientAmount || 0);
        const otherPaymentsTotal = payments
          .filter(p => p.id !== paymentId)
          .reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0);

        const newRowAmount = parseFloat(value) || 0;
        const newTotalPaid = otherPaymentsTotal + newRowAmount;

        if (newTotalPaid > maxAllowed + 0.001) {
          if (showAlert) {
            showAlert(
              'warning',
              'Payment Exceeds Patient Amount',
              `Paid amount cannot exceed patient bill amount of ${maxAllowed.toFixed(2)}`
            );
          }
          return; // Do not allow typing more amount!
        }
      }
    }
    
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
                    {!paymentMethods.some(m => m.mode_of_payment === payment.paymentMode) && payment.paymentMode && (
                      <option value={payment.paymentMode}>
                        {payment.paymentMode}
                      </option>
                    )}
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
                    value={payment.custom_transaction_no || payment.transactionNo}
                    onChange={(e) => handlePaymentChange(payment.id, 'custom_transaction_no', e.target.value)}
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
                    value={payment.custom_bank_name || payment.bankName}
                    onChange={(e) => handlePaymentChange(payment.id, 'custom_bank_name', e.target.value)}
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
                    value={payment.custom_branch_name || payment.branchName}
                    onChange={(e) => handlePaymentChange(payment.id, 'custom_branch_name', e.target.value)}
                    onFocus={() => handleCellClick(payment.id, 'branchName')}
                    onBlur={() => handleCellClick(payment.id, 'branchName')}
                  />
                </td>
                <td className="px-3 py-2" style={{ width: getInputWidth(payment.id, 'paidAmount') }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    style={{
                      minWidth: expandedCells[`${payment.id}-paidAmount`] ? '320px' : '120px',
                      width: expandedCells[`${payment.id}-paidAmount`] ? '320px' : '100%'
                    }}
                    placeholder="Amount"
                    title={isCredit ? `Max allowed: ${Number(totalPatientAmount || 0).toFixed(2)}` : undefined}
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