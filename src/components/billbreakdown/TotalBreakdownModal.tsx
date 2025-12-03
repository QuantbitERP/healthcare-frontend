import React, { useState, useEffect } from 'react';
import { X, IndianRupee, MoreHorizontal, Edit2, Check, X as XIcon } from 'lucide-react';
import Button from '../buttons/Button';

interface GetBillDetailsDTO {
  id?: number;
  amount?: number;
}

interface TotalBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  setOpen?: (open: boolean) => void;
  showInsuranceDetails?: boolean;
  InsuranceDeposit?: string;
  selectedPatientBill?: GetBillDetailsDTO | null;
  totalBillAmount: number;
  totalDiscountAmount: number;
  totalCgstAmount: number;
  totalSgstAmount: number;
  totalIgstAmount: number;
  concessionAmount: number;
  balanceUtilized: number;
  employeeId?: string; // Added
  employeeBalance?: number; // Added
}

interface BreakdownItem {
  id: string;
  description: string;
  amount: number;
  isIndented?: boolean;
  isMain?: boolean;
  isBlue?: boolean;
  isRed?: boolean;
  isTotal?: boolean;
  isEditable?: boolean;
  isPercentage?: boolean;
  parentId?: string;
}

const TotalBreakdownModal: React.FC<TotalBreakdownModalProps> = ({
  isOpen,
  onClose,
  InsuranceDeposit = '0',
  totalBillAmount = 0,
  totalDiscountAmount = 0,
  totalCgstAmount = 0,
  totalSgstAmount = 0,
  totalIgstAmount = 0,
  concessionAmount = 0,
  balanceUtilized = 0,
  employeeId = '', // Default to empty string
  employeeBalance = 0, // Default to 0
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [breakdownData, setBreakdownData] = useState<BreakdownItem[]>([]);

  const calculateAllBreakdownValues = (
    currentData: BreakdownItem[],
    billAmount: number,
    discountAmount: number,
    cgstAmt: number,
    sgstAmt: number,
    igstAmt: number,
    concessionAmt: number,
    balUtilized: number,
    insuranceDep: string
  ): BreakdownItem[] => {
    const newData = [...currentData];
    const itemMap = new Map<string, number>();
    newData.forEach((item, index) => itemMap.set(item.id, index));

    const getAmount = (id: string) => newData[itemMap.get(id) || -1]?.amount || 0;
    const setAmount = (id: string, value: number) => {
      const index = itemMap.get(id);
      if (index !== undefined && index !== -1) {
        newData[index] = { ...newData[index], amount: value };
      }
    };

    const parsedInsuranceDeposit = parseFloat(insuranceDep) || 0;

    // setAmount('inline', billAmount - (cgstAmt + sgstAmt + igstAmt) + discountAmount);
    setAmount('totalServiceGST', cgstAmt + sgstAmt + igstAmt);
    setAmount('cgstService', cgstAmt);
    setAmount('sgstService', sgstAmt);
    setAmount('igstService', igstAmt);
    setAmount('netServiceAmount', billAmount - (cgstAmt + sgstAmt + igstAmt));
    setAmount('billConcession', concessionAmt);
    setAmount('totalDiscount', discountAmount);
    setAmount('totalEmployeeBalanceUtilized', balUtilized); // Set total employee balance utilized
    setAmount('employeeBalance', employeeBalance); // Set employee balance
    setAmount('totalDepositBefore', parsedInsuranceDeposit);
    setAmount('utilizedDeposit', balUtilized);
    setAmount('totalDepositAfter', parsedInsuranceDeposit - balUtilized);
    setAmount('pendingPayableAmount', billAmount - concessionAmt - balUtilized - getAmount('totalReceivedAmount'));
    setAmount('grandTotal', billAmount - concessionAmt);

    const baseAmountForPercentage = getAmount('netServiceAmount');
    const updatePercentage = (id: string, amount: number) => {
      const index = itemMap.get(id);
      if (index !== undefined && index !== -1) {
        const percentage = baseAmountForPercentage > 0 ? (amount / baseAmountForPercentage * 100) : 0;
        newData[index].description = `${newData[index].description.split('(')[0].trim()} (${percentage.toFixed(2)}%)`;
      }
    };

    updatePercentage('cgstService', getAmount('cgstService'));
    updatePercentage('sgstService', getAmount('sgstService'));
    updatePercentage('igstService', getAmount('igstService'));

    return newData;
  };

  useEffect(() => {
    const initialDataTemplate: BreakdownItem[] = [
      { id: 'employeeId', description: 'Employee ID', amount: 0, isMain: true, isEditable: false, isIndented: false }, // Non-editable
      { id: 'employeeBalance', description: 'Employee Balance', amount: employeeBalance, isMain: true, isBlue: true, isEditable: false }, // Non-editable
      { id: 'totalEmployeeBalanceUtilized', description: 'Total Employee Balance Utilized', amount: balanceUtilized, isMain: true, isRed: true, isEditable: true }, // Editable
      // { id: 'inline', description: 'Inline', amount: 0, isIndented: true, isEditable: true },
      { id: 'totalServiceGST', description: 'Total Service GST Amount', amount: 0, isMain: true, isEditable: false },
      { id: 'cgstService', description: 'CGST (0.00%)', amount: 0, isIndented: true, isEditable: true, isPercentage: true, parentId: 'totalServiceGST' },
      { id: 'sgstService', description: 'SGST (0.00%)', amount: 0, isIndented: true, isEditable: true, isPercentage: true, parentId: 'totalServiceGST' },
      { id: 'igstService', description: 'IGST (0.00%)', amount: 0, isIndented: true, isEditable: true, isPercentage: true, parentId: 'totalServiceGST' },
      { id: 'netServiceAmount', description: 'Net Service Amount', amount: 0, isMain: true, isEditable: false },
      { id: 'billConcession', description: 'Bill Concession', amount: 0, isMain: true, isBlue: true, isEditable: true },
      { id: 'totalDiscount', description: 'Total Discount', amount: 0, isMain: true, isBlue: true, isEditable: false },
      { id: 'patientPayable', description: 'Patient Payable', amount: 0, isMain: true, isEditable: true },
      { id: 'companyPayable', description: 'Company Payable', amount: 0, isMain: true, isEditable: true },
      { id: 'totalDepositBefore', description: 'Total Deposit Before Bill', amount: 0, isMain: true, isBlue: true, isEditable: true },
      { id: 'utilizedDeposit', description: 'Utilized Deposit', amount: 0, isMain: true, isRed: true, isEditable: true },
      { id: 'totalDepositAfter', description: 'Total Deposit After Bill', amount: 0, isMain: true, isBlue: true, isEditable: false },
      { id: 'totalReceivedAmount', description: 'Total Received Amount', amount: 0, isMain: true, isBlue: true, isEditable: true },
      { id: 'pendingPayableAmount', description: 'Pending Payable Amount', amount: 0, isMain: true, isEditable: false },
      { id: 'grandTotal', description: 'Grand Total', amount: 0, isTotal: true, isEditable: false },
    ];

    const calculatedData = calculateAllBreakdownValues(
      initialDataTemplate,
      totalBillAmount,
      totalDiscountAmount,
      totalCgstAmount,
      totalSgstAmount,
      totalIgstAmount,
      concessionAmount,
      balanceUtilized,
      InsuranceDeposit
    );
    // Update employeeId description separately since it's not a numeric amount
    const updatedData = calculatedData.map(item =>
      item.id === 'employeeId' ? { ...item, description: `Employee ID: ${employeeId}` } : item
    );
    setBreakdownData(updatedData);
  }, [
    totalBillAmount,
    totalDiscountAmount,
    totalCgstAmount,
    totalSgstAmount,
    totalIgstAmount,
    concessionAmount,
    balanceUtilized,
    InsuranceDeposit,
    employeeId,
    employeeBalance,
  ]);

  if (!isOpen) return null;

  const handleEditStart = (itemId: string, currentValue: number) => {
    setEditingField(itemId);
    setTempValue(currentValue.toString());
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleEditSave = (itemId: string) => {
    const numericValue = parseFloat(tempValue) || 0;
    setBreakdownData(prevData => {
      const updatedData = prevData.map(item =>
        item.id === itemId ? { ...item, amount: numericValue } : item
      );
      return calculateAllBreakdownValues(
        updatedData,
        totalBillAmount,
        totalDiscountAmount,
        totalCgstAmount,
        totalSgstAmount,
        totalIgstAmount,
        getAmountFromData(updatedData, 'billConcession') || concessionAmount,
        getAmountFromData(updatedData, 'totalEmployeeBalanceUtilized') || balanceUtilized, // Use updated balanceUtilized
        InsuranceDeposit
      );
    });
    setEditingField(null);
    setTempValue('');
  };

  const getAmountFromData = (data: BreakdownItem[], id: string) => {
    const item = data.find(i => i.id === id);
    return item ? item.amount : 0;
  };

  const handleInputChange = (value: string) => {
    setTempValue(value);
  };

  // Helper function to truncate to 2 decimal places (not round)
  const truncateToTwoDecimals = (value: number): number => {
    return Math.floor(value * 100) / 100;
  };

  const formatAmount = (amount: number): string => {
    return `₹${truncateToTwoDecimals(amount).toFixed(2)}`;
  };

  const renderEditableCell = (item: BreakdownItem) => {
    if (item.id === 'employeeId') {
      return (
        <div className="flex items-center justify-end">
          <span>{item.description.split(': ')[1]}</span> {/* Display only the ID value */}
        </div>
      );
    }

    if (!item.isEditable) {
      return (
        <div className="flex items-center justify-end">
          {item.isTotal && <IndianRupee className="w-4 h-4 mr-1" />}
          <span>{formatAmount(item.amount)}</span>
        </div>
      );
    }

    if (editingField === item.id) {
      return (
        <div className="flex items-center justify-end space-x-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-right"
            step="0.01"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave(item.id);
              if (e.key === 'Escape') handleEditCancel();
            }}
          />
          <button
            onClick={() => handleEditSave(item.id)}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleEditCancel}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end space-x-2 group">
        {item.isTotal && <IndianRupee className="w-4 h-4 mr-1" />}
        <span>{formatAmount(item.amount)}</span>
        <button
          onClick={() => handleEditStart(item.id, item.amount)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full h-full mx-4 max-h-[100vh] overflow-y-auto relative flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Total Breakdown</h2>
            <span className="text-sm text-gray-500 ml-2">(Click amounts to edit)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg border-2 border-blue-500">
              <MoreHorizontal className="w-5 h-5 text-blue-600" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 flex-grow">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {breakdownData.map((item) => (
                  <tr
                    key={item.id}
                    className={`${item.isTotal ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'} ${editingField === item.id ? 'bg-blue-50' : ''}`}
                  >
                    <td
                      className={`px-6 py-3 text-sm ${
                        item.isIndented ? 'pl-12 text-gray-600' :
                        item.isBlue ? 'text-blue-600 font-medium' :
                        item.isRed ? 'text-red-600 font-medium' :
                        item.isTotal ? 'text-gray-900 font-semibold' :
                        'text-gray-900'
                      }`}
                    >
                      {item.description}
                      {!item.isEditable && item.id !== 'grandTotal' && item.id !== 'employeeId' && (
                        <span className="ml-2 text-xs text-gray-400">(Auto-calculated)</span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-3 text-sm text-right ${item.isTotal ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}
                    >
                      {renderEditableCell(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sticky bottom-0 left-0 w-full flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-white z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <Button type="primary-button" className="px-4 py-2 text-white rounded-lg hover:bg-blue-700">
            Preview & Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TotalBreakdownModal;