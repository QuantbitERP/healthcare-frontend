import React, { useState, useEffect } from 'react';
import { X, FileText, Loader, AlertTriangle } from 'lucide-react';
import Button from '../buttons/Button';
import { useAuth } from '@/context/AuthContext';
import DataTableComponent from '../DataTable';
import { TableCellComponents } from '../DataTable';

interface SelectInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (invoice: any) => void;
}

const SelectInvoiceModal: React.FC<SelectInvoiceModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { apiKey, apiSecret } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customer, _setCustomer] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [saleReturnAllowDays, setSaleReturnAllowDays] = useState<number>(30); // Default 30 days
  const [restrictedInvoice, setRestrictedInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
      fetchSaleReturnAllowDays();
    }
  }, [isOpen]);

  const columnNames = {
    name: 'Invoice No',
    customer: 'Customer',
    posting_date: 'Date',
    posting_time: 'Time',
    grand_total: 'Amount',
    status: 'Status',
    action: 'Action',
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Invoice No',
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: 'posting_date',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleDateString(),
    },
    {
      id: 'posting_time',
      header: 'Time',
      cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleTimeString(),
    },
    {
      accessorKey: 'grand_total',
      header: 'Amount',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const postingDate = new Date(row.original.posting_date);
        const today = new Date();
        const daysDifference = Math.floor((today.getTime() - postingDate.getTime()) / (1000 * 60 * 60 * 24));
        const isAllowed = daysDifference <= saleReturnAllowDays;
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${isAllowed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }: any) => {
        const postingDate = new Date(row.original.posting_date);
        const today = new Date();
        const daysDifference = Math.floor((today.getTime() - postingDate.getTime()) / (1000 * 60 * 60 * 24));
        const isAllowed = daysDifference <= saleReturnAllowDays;
        
        return (
          <Button
            type={isAllowed ? 'primary-button' : 'secondary-button'}
            onClick={async () => {
              if (!isAllowed) {
                setRestrictedInvoice(row.original.name);
                return;
              }
              
              setLoading(true);
              try {
                const res = await fetch(`https://192.168.7.221:4422/api/resource/POS Invoice/${row.original.name}`, {
                  headers: {
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                  }
                });
                const data = await res.json();
                onSelect(data.data);
              } catch (e) {
                console.error('Failed to fetch full invoice', e);
              }
              setLoading(false);
            }}>
            Select
          </Button>
        );
      },
    },
  ];

  const fetchSaleReturnAllowDays = async () => {
    try {
      const response = await fetch(`https://192.168.7.221:4422/api/resource/HIS%20Settings/HIS%20Settings`, {
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
        }
      });
      const data = await response.json();
      if (data.data && data.data.sale_return_allow_days) {
        setSaleReturnAllowDays(Number(data.data.sale_return_allow_days));
      }
    } catch (error) {
      console.error('Failed to fetch sale return allow days:', error);
      // Keep default value of 30 days if fetch fails
    }
  };

  const fetchInvoices = async (invNum = invoiceNumber, cust = customer, dRange = dateRange) => {
    setLoading(true);
    try {
      const apiFilters: any[] = [['docstatus', '=', 1]];
      if (invNum) apiFilters.push(['name', 'like', `%${invNum}%`]);
      if (cust) apiFilters.push(['customer', 'like', `%${cust}%`]);
      if (dRange[0]) apiFilters.push(['posting_date', '>=', dRange[0].toISOString()]);
      if (dRange[1]) apiFilters.push(['posting_date', '<=', dRange[1].toISOString()]);

      const queryParams = new URLSearchParams({
        fields: JSON.stringify(['name', 'customer', 'posting_date', 'grand_total', 'status']),
        filters: JSON.stringify(apiFilters),
        limit_page_length: '100'
      });

      const response = await fetch(`https://192.168.7.221:4422/api/resource/POS Invoice?${queryParams.toString()}`, {
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
        }
      });
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Select Invoice for Return</h2>
              <p className="text-xs text-gray-600 mt-1">Choose a paid invoice to create a return entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-600">Loading invoices...</p>
            </div>
          </div>
        )}

        {/* Table Container */}
        {!loading && (
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <DataTableComponent
                columns={columns}
                data={invoices}
                loading={loading}
                columnNames={columnNames}
                onSearch={(term) => {
                  setInvoiceNumber(term);
                  fetchInvoices(term, customer, dateRange);
                }}
                onDataChange={(dates) => {
                  if (dates) {
                    const newDateRange: [Date | null, Date | null] = [dates.from || null, dates.to || null];
                    setDateRange(newDateRange);
                    fetchInvoices(invoiceNumber, customer, newDateRange);
                  }
                }}
                searchPlaceholder='Search by Invoice No...'
                hideFilters={false}
              />
            </div>

            {/* Empty State */}
            {invoices.length === 0 && !loading && (
              <div className="flex items-center justify-center py-12 px-4">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No invoices found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search filters</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 gap-3 bg-white">
          <Button onClick={onClose} type='secondary-button' className="px-6 py-2.5">Close</Button>
        </div>

        {/* Restriction Alert Modal */}
        {restrictedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Return Period Expired</h3>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-3">
                    Invoice <span className="font-semibold">{restrictedInvoice}</span> is older than {saleReturnAllowDays} days and cannot be returned.
                  </p>
                  <p className="text-sm text-gray-500">
                    Returns are only allowed within {saleReturnAllowDays} days from the invoice date.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setRestrictedInvoice(null)}
                    type='primary-button'
                    className="px-6 py-2.5"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInvoiceModal;
