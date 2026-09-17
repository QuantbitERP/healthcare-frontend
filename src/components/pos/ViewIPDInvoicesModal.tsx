"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import Button from "@/components/buttons/Button";
import { useAuth } from '@/context/AuthContext';
import { getAuthHeaders } from '@/utils/sessionAuth';
import { securePrintPdf } from '@/utils/printHelper';
import DataTableComponent, { TableCellComponents } from '../DataTable';

interface AlertState {
  show: boolean;
  variant: "success" | "warning" | "danger" | "primary" | "secondary";
  heading: string;
  content: string;
}

interface ViewIPDInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  posProfile: string | null;
  showAlert: (variant: AlertState['variant'], heading: string, content: string) => void;
  onLoadInvoice?: (invoice: Invoice) => void;
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
}

const ViewIPDInvoicesModal: React.FC<ViewIPDInvoicesModalProps> = ({ isOpen, onClose, posProfile, showAlert, onLoadInvoice }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null, to: Date | null }>({ from: null, to: null });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { apiKey, apiSecret } = useAuth();
  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInvoices = async (searchTerm: string, dates: { from: Date | null, to: Date | null }) => {
    if (!posProfile || !apiKey || !apiSecret) {
      showAlert("danger", "Error", "POS Profile or API credentials are missing.");
      return;
    }

    setLoading(true);
    try {
      const filters: any[] = [['pos_profile', '=', posProfile]];

      if (searchTerm) {
        filters.push(['name', 'like', `%${searchTerm}%`]);
      }
      if (dates.from) {
        filters.push(['posting_date', '>=', dates.from.toISOString().split('T')[0]]);
      }
      if (dates.to) {
        filters.push(['posting_date', '<=', dates.to.toISOString().split('T')[0]]);
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
      const url = `${API_BASE_URL}/IPD%20BIll?fields=["name","customer","custom_patient_name","posting_date","posting_time","rounded_total","status","items","pos_profile","modified","modified_by","paid_amount","outstanding_amount","company"]&limit_page_length=100000&order_by=posting_date desc,posting_time desc&filters=${encodeURIComponent(filterStr)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
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
      fetchInvoices(invoiceSearchTerm, initialDateRange);
    }
  }, [isOpen, posProfile]);

  useEffect(() => {
    if (isOpen) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchInvoices(invoiceSearchTerm, dateRange);
      }, 500); // Debounce search
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [invoiceSearchTerm, dateRange, isOpen]);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const invoiceName = invoice.name;
    const company = invoice.company;
    console.log('Printing invoice:', invoiceName);
    const url = 'https://gmcerp.quantcloud.in/printview?' +
      'doctype=IPD BIll&' +
      'name=' + encodeURIComponent(invoiceName) + '&' +
      'format=' + encodeURIComponent(invoice.status === 'Return' ? 'IP SALE RETURN INVOICE' : 'IPD Bill Print Format') + '&' +
      'trigger_print=1&' +
      'no_letterhead=0&' +
      'letterhead=' + encodeURIComponent(company) + '&' +
      'settings=' + encodeURIComponent('{}') + '&' +
      '_lang=en';
    securePrintPdf(url, getAuthHeaders, showAlert);
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
      const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/IPD%20BIll/${invoice.name}`, {
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
      fetchInvoices(invoiceSearchTerm, dateRange);

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
                <h2 className="text-xl font-bold text-black">IPD Bills</h2>
                <p className="text-black text-xs mt-1">Manage and track all your IPD bills</p>
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

        <DataTableComponent
          columns={[
            { accessorKey: 'name', header: 'Invoice No' },
            { accessorKey: 'customer', header: 'Customer' },
            {
              accessorKey: 'custom_patient_name', header: 'Patient', cell: ({ getValue }: any) => (
                <TableCellComponents type="user" value={getValue()} />
              ),
            },
            { accessorKey: 'posting_date', header: 'Date', cell: ({ row }) => new Date(row.original.posting_date).toLocaleDateString() },
            { id: 'posting_time', header: 'Time', cell: ({ row }) => row.original.posting_time ? row.original.posting_time.substring(0, 5) : '' },
            { accessorKey: 'rounded_total', header: 'Amount', cell: ({ row }) => `₹${Number(row.original.rounded_total || 0).toFixed(2)}` },
            { accessorKey: 'status', header: 'Status', cell: ({ row }) => <span className={`status-badge ${row.original.status?.toLowerCase()}`}>{row.original.status}</span> },
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
            name: 'Invoice No',
            customer: 'Customer',
            custom_patient_name: 'Patient',
            posting_date: 'Date',
            posting_time: 'Time',
            rounded_total: 'Amount',
            status: 'Status',
            modified: 'Modified Date',
            modified_by: 'Modified By',
            action: 'Actions',
          }}
          onSearch={setInvoiceSearchTerm}
          onDataChange={(dates) => setDateRange({ from: dates?.from || null, to: dates?.to || null })}
          searchPlaceholder='Search by Invoice No...'
          hideFilters={false}
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
              <p><strong>Total Amount:</strong> ₹{Number(selectedInvoice.rounded_total || 0).toFixed(2)}</p>
              <p><strong>Paid Amount:</strong> ₹{selectedInvoice.paid_amount ? Number(selectedInvoice.paid_amount).toFixed(2) : '0.00'}</p>
              <p><strong>Outstanding Amount:</strong> ₹{selectedInvoice.outstanding_amount ? Number(selectedInvoice.outstanding_amount).toFixed(2) : '0.00'}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${selectedInvoice.status?.toLowerCase()}`}>{selectedInvoice.status}</span></p>
              <p><strong>Modified:</strong> {new Date(selectedInvoice.modified).toLocaleString()}</p>
              <p><strong>Modified By:</strong> {selectedInvoice.modified_by}</p>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {selectedInvoice.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-xs">
                        <span>{item.item_name || item.item_code} (x{item.qty})</span>
                        <span>₹{Number(item.amount || 0).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
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
    </div>
  );
};

export default ViewIPDInvoicesModal;
