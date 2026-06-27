import React, { useState, useEffect } from 'react';
import { X, FileText, Loader, AlertTriangle, Eye, CheckSquare, Square } from 'lucide-react';
import Button from '../buttons/Button';
// import { useAuth } from '@/context/AuthContext';
import { getAuthHeaders } from '@/utils/sessionAuth';
import DataTableComponent from '../DataTable';
import { TableCellComponents } from '../DataTable';
import { useAlert } from '@/components/AlertContext/AlertContext';

interface SelectInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (invoices: any[]) => void;
  patientName?: string; // Add patientName prop for default filtering
  isIPDPage?: boolean; // Add prop to determine if this is for IPD page
}

const SelectInvoiceModal: React.FC<SelectInvoiceModalProps> = ({ isOpen, onClose, onSelect, patientName, isIPDPage = false }) => {
  // const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [saleReturnAllowDays, setSaleReturnAllowDays] = useState<number>(30); // Default 30 days
  const [restrictedInvoice, setRestrictedInvoice] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [itemsPopup, setItemsPopup] = useState<{ visible: boolean; items: any[]; invoiceName: string }>({ visible: false, items: [], invoiceName: '' });
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  // Live search with debouncing
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      fetchInvoices(term, dateRange);
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
      fetchSaleReturnAllowDays();
    }
  }, [isOpen, patientName, isIPDPage]); // Add isIPDPage to dependency array

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const columnNames = {
    select: 'Select',
    name: 'Invoice No',
    customer: 'Customer',
    custom_patient_name: 'Patient Name',
    custom_doctor_name: 'Doctor Name',
    posting_date: 'Date',
    posting_time: 'Time',
    grand_total: 'Amount',
    ipd_effect_checkmark: 'IPD Effect',
    ipd_bill_type: 'Bill Type',
    status: 'Status',
    action: 'Action',
  };

  const columns = [
    {
      id: 'select',
      header: 'Select',
      cell: ({ row }: any) => {
        const postingDate = new Date(row.original.posting_date);
        const today = new Date();
        const daysDifference = Math.floor((today.getTime() - postingDate.getTime()) / (1000 * 60 * 60 * 24));
        const isAllowed = daysDifference <= saleReturnAllowDays;
        const isSelected = selectedInvoices.has(row.original.name);

        return (
          <button
            onClick={() => {
              if (!isAllowed) {
                setRestrictedInvoice(row.original.name);
                return;
              }

              const newSelected = new Set(selectedInvoices);
              if (isSelected) {
                newSelected.delete(row.original.name);
              } else {
                newSelected.add(row.original.name);
              }
              setSelectedInvoices(newSelected);
            }}
            disabled={!isAllowed}
            className={`p-2 rounded transition-colors ${isAllowed
              ? isSelected
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-gray-400 hover:bg-gray-50'
              : 'text-gray-200 cursor-not-allowed'
              }`}
          >
            {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
          </button>
        );
      },
    },
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
      accessorKey: 'custom_patient_name',
      header: 'Patient Name',
    },
    {
      accessorKey: 'custom_doctor_name',
      header: 'Doctor Name',
    },
    {
      accessorKey: 'posting_date',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleDateString(),
    },
    {
      id: 'posting_time',
      header: 'Time',
      cell: ({ row }: any) => {
        // First try to use the posting_time field from API
        if (row.original.posting_time) {
          // Extract only HH:mm:ss from time like "18:20:35.704928"
          const timeMatch = row.original.posting_time.match(/(\d{2}:\d{2}:\d{2})/);
          return timeMatch ? timeMatch[1] : row.original.posting_time;
        }

        // Fallback: check if posting_date contains time information
        const dateStr = row.original.posting_date;
        const timeMatch = dateStr.match(/(\d{2}:\d{2}:\d{2})/);
        if (timeMatch) {
          return timeMatch[1];
        }

        // If no time data available, show N/A
        return 'N/A';
      },
    },
    {
      accessorKey: 'grand_total',
      header: 'Amount',
    },
    {
      id: 'ipd_effect_checkmark',
      header: 'IPD Effect',
      cell: ({ row }: any) => {
        const customIpdEffect = row.original.custom_ipd_effect;
        
        return (
          <div className="flex items-center justify-center">
            {customIpdEffect === 1 && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'ipd_bill_type',
      header: 'Bill Type',
      cell: ({ row }: any) => {
        const customIsIpdInvoice = row.original.custom_is_ipd_invoice;
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            customIsIpdInvoice === 1 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {customIsIpdInvoice === 1 ? 'IPD Bill' : 'OPD Bill'}
          </span>
        );
      },
    },
    {
      id: 'items',
      header: 'Items',
      cell: ({ row }: any) => (
        <Button
          type="secondary-button"
          size="button-small"
          onClick={() => fetchInvoiceItems(row.original.name)}
          disabled={loadingItems}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
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
    // {
    //   id: 'action',
    //   header: 'Action',
    //   cell: ({ row }: any) => {
    //     const postingDate = new Date(row.original.posting_date);
    //     const today = new Date();
    //     const daysDifference = Math.floor((today.getTime() - postingDate.getTime()) / (1000 * 60 * 60 * 24));
    //     const isAllowed = daysDifference <= saleReturnAllowDays;

    //     return (
    //       <Button
    //         type={isAllowed ? 'primary-button' : 'secondary-button'}
    //         onClick={async () => {
    //           if (!isAllowed) {
    //             setRestrictedInvoice(row.original.name);
    //             return;
    //           }

    //           setLoading(true);
    //           try {
    //             const res = await fetch(`https://gmcerp.quantcloud.in/api/resource/POS Invoice/${row.original.name}`, {
    //               headers: {
    //                 'Authorization': `token ${apiKey}:${apiSecret}`,
    //               }
    //             });
    //             const data = await res.json();
    //             onSelect(data.data);
    //           } catch (e) {
    //             console.error('Failed to fetch full invoice', e);
    //           }
    //           setLoading(false);
    //         }}>
    //         Select
    //       </Button>
    //     );
    //   },
    // },
  ];

  const fetchInvoiceItems = async (invoiceName: string) => {
    setLoadingItems(true);
    try {
      // Fetch invoice details with items
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/Sale%20Bill/${invoiceName}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.data && data.data.items) {
        const items = data.data.items;

        // Fetch return invoices against this invoice to calculate already returned qty
        // Use the same authentication logic as other functions
        const returnAuthHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const returnHeaders = typeof returnAuthHeaders === 'string' ?
          JSON.parse(returnAuthHeaders) :
          Array.isArray(returnAuthHeaders) ?
            Object.fromEntries(returnAuthHeaders) :
            returnAuthHeaders;

        const returnResponse = await fetch(`https://gmcerp.quantcloud.in/api/resource/Sale%20Bill?filters=[["return_against","=","${invoiceName}"],["docstatus","=",1]]&fields=["name"]&limit_page_length=100`, {
          method: 'GET',
          headers: returnHeaders,
          credentials: 'include',
        });
        const returnData = await returnResponse.json();

        // Calculate already returned quantities for each item
        const itemsWithReturnQty = await Promise.all(items.map(async (item: any) => {
          let alreadyReturnedQty = 0;

          if (returnData.data && returnData.data.length > 0) {
            // Fetch items from all return invoices
            for (const returnInv of returnData.data) {
              // Use the same authentication logic as other functions
              const returnInvAuthHeaders = getAuthHeaders();
              // Convert HeadersInit to plain object for fetch compatibility
              const returnInvHeaders = typeof returnInvAuthHeaders === 'string' ?
                JSON.parse(returnInvAuthHeaders) :
                Array.isArray(returnInvAuthHeaders) ?
                  Object.fromEntries(returnInvAuthHeaders) :
                  returnInvAuthHeaders;

              const returnInvResponse = await fetch(`https://gmcerp.quantcloud.in/api/resource/Sale%20Bill/${returnInv.name}`, {
                method: 'GET',
                headers: returnInvHeaders,
                credentials: 'include',
              });
              const returnInvData = await returnInvResponse.json();

              if (returnInvData.data && returnInvData.data.items) {
                const returnedItem = returnInvData.data.items.find((ri: any) => ri.item_code === item.item_code);
                if (returnedItem) {
                  alreadyReturnedQty += Math.abs(returnedItem.qty || 0);
                }
              }
            }
          }

          return {
            ...item,
            already_returned_qty: alreadyReturnedQty
          };
        }));

        setItemsPopup({ visible: true, items: itemsWithReturnQty, invoiceName });
      }
    } catch (error) {
      console.error('Failed to fetch invoice items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchSaleReturnAllowDays = async () => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/HIS%20Settings/HIS%20Settings`, {
        method: 'GET',
        headers,
        credentials: 'include',
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

  const fetchInvoices = async (search = searchTerm, dRange = dateRange) => {
    setLoading(true);
    try {
      let apiFilters: any[] = [['docstatus', '=', 1], ['is_return', '=', 0]];

      // Add IPD filter only if this is for IPD page
      if (isIPDPage) {
        apiFilters.push(['custom_is_ipd_invoice', '=', 1]);
      }

      // Multi-field search: Invoice No, Patient Name, Doctor Name (only if search term is provided)
      if (search) {
        // const searchFilters = [
        //   ['name', 'like', `%${search}%`],
        //   ['custom_patient_name', 'like', `%${search}%`],
        //   ['custom_doctor_name', 'like', `%${search}%`]
        // ];

        if (patientName) {
          // When patient name is provided, combine patient filter with search using OR logic
          apiFilters = [
            ['docstatus', '=', 1],
            ['custom_patient_name', '=', patientName],
            ['or', ['name', 'like', `%${search}%`], ['custom_patient_name', 'like', `%${search}%`], ['custom_doctor_name', 'like', `%${search}%`]]
          ];
        } else {
          // When no patient name, just use search filters
          apiFilters.push(['or', ['name', 'like', `%${search}%`], ['custom_patient_name', 'like', `%${search}%`], ['custom_doctor_name', 'like', `%${search}%`]]);
        }
      } else if (patientName) {
        // When no search but patient name is provided, just use patient filter
        apiFilters.push(['custom_patient_name', '=', patientName]);
      }

      // Date filters - use local date format to avoid timezone issues
      if (dRange[0]) {
        const startDate = dRange[0].toLocaleDateString('en-CA'); // YYYY-MM-DD format
        apiFilters.push(['posting_date', '>=', startDate]);
      }
      if (dRange[1]) {
        const endDate = dRange[1].toLocaleDateString('en-CA'); // YYYY-MM-DD format
        apiFilters.push(['posting_date', '<=', endDate]);
      }

      const queryParams = new URLSearchParams({
        fields: JSON.stringify(['name', 'customer', 'custom_patient_name', 'custom_doctor_name', 'posting_date', 'posting_time', 'grand_total', 'status', 'custom_ipd_effect', 'custom_is_ipd_invoice']),
        filters: JSON.stringify(apiFilters),
        order_by: 'posting_date desc, posting_time desc',
        limit_page_length: '100'
      });

      const fullUrl = `https://gmcerp.quantcloud.in/api/resource/Sale%20Bill?${queryParams.toString()}`;
      console.log('Fetching invoices from URL:', fullUrl);
      console.log('Filters being used:', apiFilters);

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      const data = await response.json();
      // console.log('API Response:', data);
      // console.log('Invoices data:', data.data);
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
                  handleSearchChange(term);
                }}
                onDataChange={(dates) => {
                  if (dates) {
                    const newDateRange: [Date | null, Date | null] = [dates.from || null, dates.to || null];
                    setDateRange(newDateRange);
                    fetchInvoices(searchTerm, newDateRange);
                  }
                }}
                searchPlaceholder='Search by Invoice No, Patient Name, or Doctor Name...'
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200 gap-3 bg-white">
          <div className="text-sm text-gray-600">
            {selectedInvoices.size > 0 && (
              <span className="font-medium">{selectedInvoices.size} invoice(s) selected</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={onClose} type='secondary-button' className="px-6 py-2.5">Close</Button>
            <Button
              onClick={async () => {
                if (selectedInvoices.size === 0) {
                  showAlert('warning', 'No Selection', 'Please select at least one invoice');
                  return;
                }

                setLoading(true);
                try {
                  const selectedInvoiceData: any[] = [];
                  const customers = new Set<string>();

                  for (const invoiceName of selectedInvoices) {
                    // Use the same authentication logic as other functions
                    const authHeaders = getAuthHeaders();
                    // Convert HeadersInit to plain object for fetch compatibility
                    const headers = typeof authHeaders === 'string' ?
                      JSON.parse(authHeaders) :
                      Array.isArray(authHeaders) ?
                        Object.fromEntries(authHeaders) :
                        authHeaders;

                    const res = await fetch(`https://gmcerp.quantcloud.in/api/resource/Sale Bill/${invoiceName}`, {
                      method: 'GET',
                      headers,
                      credentials: 'include',
                    });
                    const data = await res.json();
                    selectedInvoiceData.push(data.data);

                    // Add customer to set for validation
                    if (data.data.customer) {
                      customers.add(data.data.customer);
                    }
                  }

                  // Check if selected invoices have different customers
                  if (customers.size > 1) {
                    showAlert('danger', 'Validation Error', 'Sale bill transaction type is different so cannot add bill');
                    setLoading(false);
                    return;
                  }

                  onSelect(selectedInvoiceData);
                  setSelectedInvoices(new Set());
                  onClose();
                } catch (e) {
                  console.error('Failed to fetch selected invoices', e);
                }
                setLoading(false);
              }}
              type='primary-button'
              className="px-6 py-2.5"
              disabled={selectedInvoices.size === 0 || loading}
            >
              {loading ? 'Loading...' : `Process ${selectedInvoices.size} Invoice(s)`}
            </Button>
          </div>
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

        {/* Items Popup Modal */}
        {itemsPopup.visible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Invoice Items</h3>
                  <p className="text-sm text-gray-600 mt-1">Invoice: {itemsPopup.invoiceName}</p>
                </div>
                <button
                  onClick={() => setItemsPopup({ visible: false, items: [], invoiceName: '' })}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                {loadingItems ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Code</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Sale Qty</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Already Returned Qty</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Rate</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsPopup.items.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.item_code}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.item_name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.batch_no || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.custom_expiry_date || '-'}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{item.qty}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.already_returned_qty > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {item.already_returned_qty || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">₹{item.rate?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">₹{item.amount?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end p-6 border-t border-gray-200 gap-3 bg-white">
                <Button
                  onClick={() => setItemsPopup({ visible: false, items: [], invoiceName: '' })}
                  type='secondary-button'
                  className="px-6 py-2.5"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInvoiceModal;
