import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import Dropdown from '../dropdownForPatientCard/Dropdown';
import RecordPaymentModal from './RecordPaymentModal';
import TotalBreakdownModal from './TotalBreakdownModal';
import { useAuth } from '@/context/AuthContext';

interface BillBreakdownProps {
  totalBillAmount: number;
  totalDiscountAmount: number;
  totalCgstAmount: number;
  totalSgstAmount: number;
  totalIgstAmount: number;
  posProfile?: string;
  employeeId?: string; // Added
  employeeBalance?: number; // Added
  onRecordPayments?: (data: {
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
    }>;
  }) => void;
  onRoundOffChange?: (data: {
    isRoundedOff: boolean;
    rounded_total: number;
    rounding_adjustment: number;
    grand_total: number;
  }) => void;
}

interface RecordedPayment {
  id: number;
  paymentMode: string;
  transactionNo: string;
  bankName: string;
  branchName: string;
  paidAmount: string;
  paymentDate: string;
  approvalNo: string;
}

const BillBreakdown: React.FC<BillBreakdownProps> = ({
  totalBillAmount,
  totalDiscountAmount,
  totalCgstAmount,
  totalSgstAmount,
  totalIgstAmount,
  posProfile,
  employeeId = '', // Default to empty string
  employeeBalance = 0, // Default to 0
  onRecordPayments,
  onRoundOffChange,
}) => {
  const { apiKey, apiSecret } = useAuth();
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showTotalBreakdown, setShowTotalBreakdown] = useState(false);
  const [selectedConcession, setSelectedConcession] = useState<string>('');
  const [selectedConcessionauth, setSelectedConcessionauth] = useState<string>('');
  const [concessionOptions, setConcessionOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [concessionauthOptions, setConcessionauthOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [concessionAmount, setConcessionAmount] = useState<number>(0);
  const [isRoundedOff, setIsRoundedOff] = useState<boolean>(true);
  const [recordedPayments, setRecordedPayments] = useState<RecordedPayment[]>([]);

  // Editable fields state
  const [editableFields, setEditableFields] = useState({
    total: { value: totalBillAmount, isEditing: false },
    balanceUtilized: { value: 0, isEditing: false },
    transactions: { value: 0, isEditing: false },
  });

  // Temporary values for editing
  const [tempValues, setTempValues] = useState({
    total: totalBillAmount.toString(),
    balanceUtilized: '0',
    transactions: '0',
  });

  const FRAPPE_BASE_URL = 'http://103.219.1.138:4430';

  // Fetch concession types and users (unchanged)
  useEffect(() => {
    const fetchConcessionTypes = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `token ${apiKey}:${apiSecret}`,
        };
        const response = await fetch(`${FRAPPE_BASE_URL}/api/resource/Concession Type?fields=["name"]&limit_page_length=1000`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const options = data.data.map((item: any) => ({
            value: item.name,
            label: item.name,
          }));
          setConcessionOptions(options);
        }
      } catch (error) {
        console.error('Error fetching concession types:', error);
      }
    };

    if (apiKey && apiSecret) {
      fetchConcessionTypes();
    }
  }, [apiKey, apiSecret]);

  useEffect(() => {
    const fetchConcessionUsers = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `token ${apiKey}:${apiSecret}`,
        };
        const roleResponse = await fetch(`${FRAPPE_BASE_URL}/api/resource/User?fields=["name","full_name"]&filters=[["Has Role","role","=","concession"]]&limit_page_length=1000`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          const userNames = [...new Set(roleData.data.map((item: any) => item.name))] as string[];
          if (userNames.length > 0) {
            const userPromises = userNames.map((userName: string) =>
              fetch(`${FRAPPE_BASE_URL}/api/resource/User/${encodeURIComponent(userName)}?fields=["name","full_name"]`, {
                method: 'GET',
                headers,
                credentials: 'include',
              }).then(res => res.json())
            );
            const userResults = await Promise.all(userPromises);
            const options = userResults
              .filter(result => result.data)
              .map(result => ({
                value: result.data.name,
                label: result.data.full_name || result.data.name,
              }));
            setConcessionauthOptions(options);
          }
        }
      } catch (error) {
        console.error('Error fetching concession users:', error);
      }
    };

    if (apiKey && apiSecret) {
      fetchConcessionUsers();
    }
  }, [apiKey, apiSecret]);

  const handleEditToggle = (field: keyof typeof editableFields) => {
    if (editableFields[field].isEditing) {
      setTempValues(prev => ({
        ...prev,
        [field]: editableFields[field].value.toString(),
      }));
    } else {
      setTempValues(prev => ({
        ...prev,
        [field]: editableFields[field].value.toString(),
      }));
    }
    setEditableFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        isEditing: !prev[field].isEditing,
      },
    }));
  };

  const handleSave = (field: keyof typeof editableFields) => {
    const newValue = parseFloat(tempValues[field]) || 0;
    setEditableFields(prev => ({
      ...prev,
      [field]: {
        value: newValue,
        isEditing: false,
      },
    }));
  };

  const handleInputChange = (field: keyof typeof tempValues, value: string) => {
    setTempValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotalPaidAmount = () => {
    return recordedPayments.reduce((sum, payment) => sum + (parseFloat(payment.paidAmount) || 0), 0);
  };

  const calculateOutstandingAmount = () => {
    const totalPaidAmount = calculateTotalPaidAmount();
    const outstanding = totalBillAmount - concessionAmount - editableFields.balanceUtilized.value - totalPaidAmount;
    return Math.max(0, outstanding);
  };

  const calculateNetTotal = () => {
    const totalGST = totalCgstAmount + totalSgstAmount + totalIgstAmount;
    return totalBillAmount - totalGST;
  };

  const calculateRoundOffValues = () => {
    const outstandingAmount = calculateOutstandingAmount();
    const rounded_total = Math.round(totalBillAmount - concessionAmount - editableFields.balanceUtilized.value);
    const rounding_adjustment = rounded_total - totalBillAmount;
    const grand_total = isRoundedOff ? rounded_total : outstandingAmount;
    return {
      rounded_total,
      rounding_adjustment,
      grand_total,
    };
  };

  useEffect(() => {
    const { rounded_total, rounding_adjustment, grand_total } = calculateRoundOffValues();
    onRoundOffChange?.({
      isRoundedOff,
      rounded_total,
      rounding_adjustment,
      grand_total,
    });
  }, [isRoundedOff, totalBillAmount, concessionAmount, editableFields.balanceUtilized.value, recordedPayments, onRoundOffChange]);

  const renderEditableField = (
    label: string,
    field: keyof typeof editableFields,
    textColor: string = 'text-[#1C2024]',
    isCurrency: boolean = false,
  ) => {
    const fieldData = editableFields[field];
    return (
      <div className="flex justify-between items-center">
        <span className={`${textColor} text-xs font-normal`}>{label}</span>
        <div className="flex items-center space-x-2">
          {fieldData.isEditing ? (
            <>
              <input
                type="number"
                value={tempValues[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                step="10"
                min="0"
              />
              <button
                onClick={() => handleSave(field)}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleEditToggle(field)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <span className="text-[#1C2024] text-xs font-semibold">
                {isCurrency ? '₹' : ''}{fieldData.value.toLocaleString()}
              </span>
              <button
                onClick={() => handleEditToggle(field)}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className=""
      style={{
        background: 'linear-gradient(135deg, rgb(229, 220, 255) 0%, rgba(255, 255, 255, 0.5) 37.73%), rgb(255, 255, 255)',
      }}
    >
      <div className="p-0 space-y-3" style={{ background: 'linear-gradient(135deg, rgb(229, 220, 255) 0%, rgba(255, 255, 255, 0.5) 37.73%), rgb(255, 255, 255)' }}>
        <div className="w-[280px] h-fit flex flex-col rounded-lg p-4 gap-3 border border-[#D9D9E0] shadow-sm bg-[linear-gradient(135deg,#E5DCFF_0%,rgba(255,255,255,0.50)_37.73%),#FFF]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#1C2024] text-xs font-semibold">Total Breakdown</h3>
            <button
              onClick={() => setShowTotalBreakdown(true)}
              className="p-1 hover:bg-[#F5F5F5] rounded"
            >
              <MoreHorizontal className="w-4 h-4 text-[#60646C]" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#1C2024] text-xs font-normal">Total (Net Total)</span>
            <span className="text-[#1C2024] text-xs font-semibold">
              ₹{calculateNetTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#1C2024] text-xs font-normal">Grand Total</span>
            <span className="text-[#1C2024] text-xs font-semibold">
              ₹{totalBillAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[rgb(13_116_206_/var(--tw-text-opacity,_1))] text-xs font-normal">Concession Type</span>
                <div className="flex items-center space-x-1">
                  <Dropdown
                    reasons={concessionOptions.map(consession => ({
                      key: consession.value,
                      value: consession.label,
                    }))}
                    value={selectedConcession}
                    onChange={(value) => setSelectedConcession(value)}
                    placeholder="Select"
                    className="w-32 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgb(13_116_206_/var(--tw-text-opacity,_1))] text-xs font-normal">Concession Given Authority</span>
                <div className="flex items-center space-x-1">
                  <Dropdown
                    reasons={concessionauthOptions.map(consessionauth => ({
                      key: consessionauth.value,
                      value: consessionauth.label,
                    }))}
                    value={selectedConcessionauth}
                    onChange={(value) => setSelectedConcessionauth(value)}
                    placeholder="Select"
                    className="w-32 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgb(13_116_206_/var(--tw-text-opacity,_1))] text-xs font-normal">Concession Amount</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={concessionAmount}
                    onChange={(e) => setConcessionAmount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    step="100"
                    min="0"
                  />
                </div>
              </div>
            </div>
            {/* Display Total Employee Balance Utilized */}
            {renderEditableField(
              'Total Employee Balance Utilized',
              'balanceUtilized',
              'text-[rgb(13_116_206_/var(--tw-text-opacity,_1))]',
              true
            )}
          </div>
          <div className="flex justify-start">
            <button
              onClick={() => setShowTotalBreakdown(true)}
              className="text-[#1C2024] text-xs font-semibold mt-2 hover:underline"
            >
              Show More
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[#1C2024] text-xs font-semibold">Outstanding Amount</h3>
              <span className="text-[#1C2024] text-xs font-bold">
                ₹{calculateOutstandingAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRoundedOff}
                  onChange={(e) => setIsRoundedOff(e.target.checked)}
                  className="w-4 h-4 text-[#0D74CE] border-gray-300 rounded focus:ring-[#0D74CE] focus:ring-2 cursor-pointer"
                />
                <span className="text-[#1C2024] text-xs font-normal">Round Off</span>
              </label>
              {isRoundedOff && (
                <span className="text-[#60646C] text-xs font-normal">
                  {calculateRoundOffValues().rounding_adjustment >= 0 ? '' : ''}
                </span>
              )}
            </div>
            {isRoundedOff && (
              <div className="flex justify-between items-center pt-2 border-t border-[#D9D9E0]">
                <h3 className="text-[#1C2024] text-xs font-semibold">Grand Total</h3>
                <span className="text-[#1C2024] text-xs font-bold">
                  ₹{calculateRoundOffValues().grand_total.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[rgb(13_116_206_/var(--tw-text-opacity,_1))] text-xs font-normal">Transactions</span>
              <div className="flex items-center space-x-2">
                {editableFields.transactions.isEditing ? (
                  <>
                    <input
                      type="number"
                      value={tempValues.transactions}
                      onChange={(e) => handleInputChange('transactions', e.target.value)}
                      className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      min="0"
                    />
                    <button
                      onClick={() => handleSave('transactions')}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleEditToggle('transactions')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="px-2 py-1 bg-purple-100 text-[#60646C] text-xs font-normal rounded-full">
                      {editableFields.transactions.value}
                    </span>
                    <button
                      onClick={() => handleEditToggle('transactions')}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowRecordPayment(true)}
              className="w-full py-2 bg-[#0D74CE] text-white text-xs font-normal rounded-lg hover:bg-[#0D74CE]/90 transition-colors"
            >
              Record Payment
            </button>
            <button className="w-full py-2 bg-white border border-[#D9D9E0] text-[#60646C] text-xs font-normal rounded-lg hover:bg-[#F5F5F5] transition-colors">
              View Payment Receipt
            </button>
          </div>
        </div>
      </div>

      <RecordPaymentModal
        isOpen={showRecordPayment}
        onClose={() => setShowRecordPayment(false)}
        onSubmit={(data) => {
          setRecordedPayments(data.payments || []);
          onRecordPayments?.(data);
          setShowRecordPayment(false);
        }}
        posProfile={posProfile}
        apiKey={apiKey || undefined}
        apiSecret={apiSecret || undefined}
        outstandingAmount={calculateRoundOffValues().grand_total}
      />

      <TotalBreakdownModal
        isOpen={showTotalBreakdown}
        onClose={() => setShowTotalBreakdown(false)}
        totalBillAmount={totalBillAmount}
        totalDiscountAmount={totalDiscountAmount}
        totalCgstAmount={totalCgstAmount}
        totalSgstAmount={totalSgstAmount}
        totalIgstAmount={totalIgstAmount}
        concessionAmount={concessionAmount}
        balanceUtilized={editableFields.balanceUtilized.value}
        employeeId={employeeId} // Pass to modal
        employeeBalance={employeeBalance} // Pass to modal
      />
    </div>
  );
};

export default BillBreakdown;