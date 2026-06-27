"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuthHeaders } from '../../utils/sessionAuth';
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from '../DataTable';
import { Eye, Search, X } from 'lucide-react';

interface AlertState {
  show: boolean;
  variant: "success" | "warning" | "danger" | "primary" | "secondary";
  heading: string;
  content: string;
}

interface ViewPosInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  posProfile: string | null;
  showAlert: (variant: AlertState['variant'], heading: string, content: string) => void;
  onLoadInvoice?: (invoice: Invoice) => void;
  isIPDPage?: boolean; // Add prop to determine if this is for IPD page
  excludeIPDInvoices?: boolean; // Add prop to exclude IPD invoices
  showOnlyReturns?: boolean; // Add prop to show only return invoices
}

interface Invoice {
  name: string;
  customer: string;
  custom_patient_name: string;
  posting_date: string;
  posting_time: string;
  rounded_total: number;
  status: string;
  items: any[];
  pos_profile: string;
  modified: string;
  modified_by: string;
  paid_amount: number;
  outstanding_amount: number;
  company: string;
  custom_ipd_effect?: number; // Add IPD effect field
}

const ViewPosInvoicesModal: React.FC<ViewPosInvoicesModalProps> = ({ isOpen, onClose, posProfile, showAlert, onLoadInvoice, isIPDPage = false, excludeIPDInvoices = false, showOnlyReturns = false }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceNumberSearchTerm, setInvoiceNumberSearchTerm] = useState('');
  const [patientNameSearchTerm, setPatientNameSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [itemsForModal, setItemsForModal] = useState<any[]>([]);
  
  const { } = useAuth();
  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInvoices = async (invoiceNumber: string, patientName: string, dates: { from: Date | undefined, to: Date | undefined }) => {
    // Skip POS profile validation when showing only returns
    if (!posProfile && !showOnlyReturns) {
      showAlert("danger", "Error", "POS Profile is missing.");
      return;
    }

    setLoading(true);
    try {
      const filters: any[] = [];

      // Add POS profile filter only if not showing returns
      if (!showOnlyReturns) {
        filters.push(['pos_profile', '=', posProfile]);
      }

      // Add IPD filter only if this is for IPD page
      if (isIPDPage) {
        filters.push(['custom_is_ipd_invoice', '=', 1]);
      }
      
      // Exclude IPD invoices if excludeIPDInvoices is true
      if (excludeIPDInvoices) {
        filters.push(['custom_is_ipd_invoice', '!=', 1]);
      }

      // Show only return invoices if showOnlyReturns is true
      if (showOnlyReturns) {
        filters.push(['is_return', '=', 1]);
      }

      if (invoiceNumber) {
        filters.push(['name', 'like', `%${invoiceNumber}%`]);
      }
      if (patientName) {
        filters.push(['custom_patient_name', 'like', `%${patientName}%`]);
      }
      if (dates.from) {
        // Add one day to the 'to' date to include the full end date
        const fromDate = new Date(dates.from);
        fromDate.setHours(0, 0, 0, 0);
        filters.push(['posting_date', '>=', fromDate.toISOString().split('T')[0]]);
      }
      if (dates.to) {
        // Set time to end of day to include the full end date
        const toDate = new Date(dates.to);
        toDate.setHours(23, 59, 59, 999);
        filters.push(['posting_date', '<=', toDate.toISOString().split('T')[0]]);
      }

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      const filterStr = JSON.stringify(filters);
      const url = `${API_BASE_URL}/Sale%20Bill?fields=["name","customer","custom_patient_name","posting_date","posting_time","rounded_total","status","pos_profile","modified","modified_by","paid_amount","outstanding_amount","company","is_return","custom_ipd_effect"]&limit_page_length=100000&order_by=posting_date desc,posting_time desc&filters=${encodeURIComponent(filterStr)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched invoices:', data.data); // Debug log
        setInvoices(data.data || []);
      } else {
        console.error('Failed to fetch invoices:', response.status, response.statusText);
        showAlert("danger", "Error", "Failed to fetch invoices.");
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showAlert("danger", "Error", "Error fetching invoices. Please try again.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const initialDateRange = { from: yesterday, to: today };
      setDateRange(initialDateRange);
      fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, { from: yesterday, to: today });
    }
  }, [isOpen, posProfile, isIPDPage, excludeIPDInvoices, showOnlyReturns]);

  useEffect(() => {
    if (isOpen) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, dateRange);
      }, 500); // Debounce search
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [invoiceNumberSearchTerm, patientNameSearchTerm, dateRange, isOpen]);

  const handleViewDetails = async (invoice: Invoice) => {
    console.log('Selected invoice details:', invoice); // Debug log
    
    // Fetch the full invoice document to get items
    try {
      const invoiceUrl = `${API_BASE_URL}/Sale%20Bill/${encodeURIComponent(invoice.name)}`;
      
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;
      
      console.log('Fetching invoice with headers:', headers);
      
      const invoiceResponse = await fetch(invoiceUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      
      if (invoiceResponse.ok) {
        const invoiceData = await invoiceResponse.json();
        console.log('Fetched full invoice:', invoiceData.data); // Debug log
        const fullInvoice = { ...invoice, ...invoiceData.data };
        setSelectedInvoice(fullInvoice);
      } else {
        console.error('Failed to fetch full invoice:', invoiceResponse.status);
        setSelectedInvoice(invoice);
      }
    } catch (error) {
      console.error('Error fetching full invoice:', error);
      setSelectedInvoice(invoice);
    }
    
    setShowDetailsModal(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const invoiceName = invoice.name;
    const company = invoice.company;
    console.log('Printing invoice:', invoiceName);
    const url = 'https://gmcerp.quantcloud.in/printview?' +
      'doctype=Sale Bill&' +
      'name=' + encodeURIComponent(invoiceName) + '&' +
      'format=' + encodeURIComponent(invoice.status === 'Return' ? 'IP SALE RETURN INVOICE' : 'Pos Invoice print Format') + '&' +
      'trigger_print=1&' +
      'no_letterhead=0&' +
      'letterhead=' + encodeURIComponent(company) + '&' +
      'settings=' + encodeURIComponent('{}') + '&' +
      '_lang=en';
    window.open(url, '_blank');
  };

  const handleSubmitInvoice = async (invoice: Invoice) => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      // Submit the draft invoice
      const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/Sale%20Bill/${invoice.name}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ docstatus: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showAlert("danger", "Error", `Failed to submit invoice: ${errorData.message || 'Unknown error'}`);
        return;
      }

      showAlert("success", "Success", `Invoice ${invoice.name} submitted successfully!`);

      // Refresh the invoice list
      fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, dateRange);

      // Close the details modal
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      showAlert("danger", "Error", "Failed to submit invoice. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-start justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl my-4 overflow-hidden modal-enter max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r px-6 py-4 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Sale Bills</h2>
                <p className="text-black text-xs mt-1">Manage and track all your invoices</p>
              </div>
            </div>
            <button
              className="w-8 h-8 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Inputs */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Invoice No</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter invoice number..."
                value={invoiceNumberSearchTerm}
                onChange={(e) => setInvoiceNumberSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Patient Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name..."
                value={patientNameSearchTerm}
                onChange={(e) => setPatientNameSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Invoice Count */}
        {/* <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{invoices.length}</span> invoices
          </div>
        </div> */}

        <DataTableComponent
          columns={[
            { accessorKey: 'idx', header: 'IDX', cell: ({ row }) => row.index + 1 },
            { accessorKey: 'name', header: 'Invoice No' },
            { accessorKey: 'customer', header: 'Customer' },
            {
              accessorKey: 'custom_patient_name', header: 'Patient', cell: ({ getValue }: any) => (
                <TableCellComponents type="user" value={getValue()} />
              ),
            },
            { accessorKey: 'posting_date', header: 'Date', cell: ({ row }) => new Date(row.original.posting_date).toLocaleDateString() },
            { id: 'posting_time', header: 'Time', cell: ({ row }) => row.original.posting_time ? row.original.posting_time.substring(0, 5) : '' },
            { accessorKey: 'rounded_total', header: 'Amount', cell: ({ row }) => `₹${row.original.rounded_total.toFixed(2)}` },
            { accessorKey: 'status', header: 'Status', cell: ({ row }) => <span className={`status-badge ${row.original.status?.toLowerCase()}`}>{row.original.status}</span> },
            {
  id: 'ipd_effect',
  header: 'IPD Effect',
  cell: ({ row }) => {
    const hasIPDEffect = row.original.custom_ipd_effect === 1;

    return (
      <div className="flex items-center justify-center">
        {hasIPDEffect ? (
          // ✔ Green filled circle with check icon
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          // — Gray empty circle
          <div className="">
            <span className="text-gray-400 text-xs"></span>
          </div>
        )}
      </div>
    );
  }
},
            { accessorKey: 'modified', header: 'Modified Date', cell: ({ row }) => new Date(row.original.modified).toLocaleDateString() },
            {
              accessorKey: 'modified_by', header: 'Modified By', cell: ({ getValue }: any) => (
                <TableCellComponents type="user" value={getValue()} />
              ),
            },
            { id: 'action', header: 'Actions', cell: ({ row }) => <Button type="secondary-button" size="button-small" onClick={() => handleViewDetails(row.original)}>View</Button> },
          ]}
          data={invoices}
          loading={loading}
          columnNames={{
            idx: 'IDX',
            name: 'Invoice No',
            customer: 'Customer',
            custom_patient_name: 'Patient',
            posting_date: 'Date',
            posting_time: 'Time',
            rounded_total: 'Amount',
            status: 'Status',
            ipd_effect: 'IPD Effect',
            modified: 'Modified Date',
            modified_by: 'Modified By',
            action: 'Actions',
          }}
          hideFilters={true}
          hideMeFilter={true}
          onFilterClick={() => {}}
          hideDatePicker={false}
          onDataChange={(dates) => setDateRange({ from: dates?.from || undefined, to: dates?.to || undefined })}
          hideShowColumns={true}
        />

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end sticky bottom-0 z-10">
          <Button type="secondary-button" size="button-medium" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Invoice Details Mini-Popup */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowDetailsModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Invoice Details: {selectedInvoice.name}</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
              <p><strong>Patient Name:</strong> {selectedInvoice.custom_patient_name}</p>
              <p><strong>Date:</strong> {new Date(selectedInvoice.posting_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedInvoice.posting_time ? selectedInvoice.posting_time.substring(0, 5) : 'N/A'}</p>
              <p><strong>Total Amount:</strong> ₹{selectedInvoice.rounded_total.toFixed(2)}</p>
              <p><strong>Paid Amount:</strong> ₹{selectedInvoice.paid_amount ? selectedInvoice.paid_amount.toFixed(2) : '0.00'}</p>
              <p><strong>Outstanding Amount:</strong> ₹{selectedInvoice.outstanding_amount ? selectedInvoice.outstanding_amount.toFixed(2) : '0.00'}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${selectedInvoice.status?.toLowerCase()}`}>{selectedInvoice.status}</span></p>
              <p><strong>Modified:</strong> {new Date(selectedInvoice.modified).toLocaleString()}</p>
              <p><strong>Modified By:</strong> {selectedInvoice.modified_by}</p>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Items ({selectedInvoice.items.length}):</h4>
                    <button
                      onClick={() => {
                        setItemsForModal(selectedInvoice.items);
                        setShowItemsModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                      title="View items"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium">View Items</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              {selectedInvoice.status === 'Draft' && (
                <Button
                  type="primary-button"
                  size="button-medium"
                  onClick={() => handleSubmitInvoice(selectedInvoice)}
                >
                  Submit Invoice
                </Button>
              )}
              {onLoadInvoice && (
                <Button
                  type="primary-button"
                  size="button-medium"
                  onClick={() => {
                    onLoadInvoice(selectedInvoice);
                    setShowDetailsModal(false);
                    onClose();
                  }}
                >
                  Load Invoice
                </Button>
              )}
              <Button type="primary-button" size="button-medium" onClick={() => handlePrintInvoice(selectedInvoice)}>
                Print Invoice
              </Button>
              <Button type="secondary-button" size="button-medium" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items List Mini-Popup */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1002] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-white-600 to-white-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-black">Invoice Items</h3>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white transition-all"
                onClick={() => setShowItemsModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Name</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {itemsForModal.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.item_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.item_name || item.item_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{(item.rate || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">₹{(item.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 sticky bottom-0">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      ₹{itemsForModal.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end">
              <Button type="secondary-button" size="button-medium" onClick={() => setShowItemsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPosInvoicesModal;
