"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuthHeaders } from '../../utils/sessionAuth';
import { securePrintPdf } from '@/utils/printHelper';
import Button from "@/components/buttons/Button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button as UIButton } from "@/components/ui/button";
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
  custom_uhid?: string;
  custom_mrn?: string;
  custom_doctor_name?: string;
  custom_age?: string;
  custom_gender?: string;
  custom_phone?: string;
  custom_visit_code?: string;
  custom_bed_no?: string;
  custom_ward?: string;
  custom_patient_category?: string;
  custom_patient_company?: string;
  custom_department?: string;
  custom_payer_category?: string;
  custom_payer_name?: string;
  custom_sub_insurance?: string;
  custom_network?: string;
  custom_insurance_no?: string;
  custom_other_no?: string;
  custom_validity_from?: string;
  custom_validity_to?: string;
  co_pay?: number;
  payer_amount?: number;
  patient_amount?: number;
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
  custom_opd_effect?: number; // Add OPD effect field
  visit_type?: string;
}

const formatDateToYMD = (d: Date | undefined): string => {
  if (!d || isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseYMDToDate = (str: string): Date | undefined => {
  if (!str) return undefined;
  const parts = str.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return undefined;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const ViewPosInvoicesModal: React.FC<ViewPosInvoicesModalProps> = ({ isOpen, onClose, posProfile, showAlert, onLoadInvoice, isIPDPage = false, excludeIPDInvoices = false, showOnlyReturns = false }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumberSearchTerm, setInvoiceNumberSearchTerm] = useState('');
  const [patientNameSearchTerm, setPatientNameSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string>(posProfile || '');
  const [posProfilesList, setPosProfilesList] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>(() => ({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  }));
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [itemsForModal, setItemsForModal] = useState<any[]>([]);
  
  const { } = useAuth();
  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedParamsRef = useRef<string>('');

  useEffect(() => {
    if (posProfile) {
      setSelectedProfile(posProfile);
    }
  }, [posProfile]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const headers = typeof authHeaders === 'string' ? 
          JSON.parse(authHeaders) : 
          Array.isArray(authHeaders) ? 
            Object.fromEntries(authHeaders) : 
            authHeaders;
        const res = await fetch(`${API_BASE_URL}/POS%20Profile?fields=["name"]&limit_page_length=100`, { 
          headers, 
          credentials: 'include' 
        });
        if (res.ok) {
          const pData = await res.json();
          if (pData.data) {
            setPosProfilesList(pData.data.map((p: any) => p.name));
          }
        }
      } catch (e) {
        console.error('Error fetching POS Profiles:', e);
      }
    };
    if (isOpen && !showOnlyReturns) {
      fetchProfiles();
    }
  }, [isOpen, showOnlyReturns]);

  const fetchInvoices = async (
    invoiceNumber: string, 
    patientName: string, 
    dates: { from: Date | undefined, to: Date | undefined },
    profileToFilter?: string
  ) => {
    setLoading(true);
    try {
      const filters: any[] = [];

      // Add POS profile filter only if not showing returns and a profile is chosen
      const activeProfile = profileToFilter !== undefined ? profileToFilter : selectedProfile;
      if (!showOnlyReturns && activeProfile && activeProfile !== 'ALL') {
        filters.push(['pos_profile', '=', activeProfile]);
      }

      // Add IPD filter only if this is for IPD page
      if (isIPDPage) {
        filters.push(['custom_is_ipd_invoice', '=', 1]);
      }
      
      // Exclude IPD invoices if excludeIPDInvoices is true
      if (excludeIPDInvoices) {
        filters.push(['custom_is_ipd_invoice', '!=', 1]);
      }

      // Exclude cancelled invoices
      filters.push(['docstatus', '!=', 2]);

      // Show only return invoices if showOnlyReturns is true, otherwise exclude returned bills
      if (showOnlyReturns) {
        filters.push(['is_return', '=', 1]);
      } else {
        filters.push(['is_return', '!=', 1]);
      }

      if (invoiceNumber) {
        filters.push(['name', 'like', `%${invoiceNumber}%`]);
      }
      if (patientName) {
        filters.push(['custom_patient_name', 'like', `%${patientName}%`]);
      }
      if (dates.from) {
        filters.push(['posting_date', '>=', formatDateToYMD(dates.from)]);
      }
      if (dates.to) {
        filters.push(['posting_date', '<=', formatDateToYMD(dates.to)]);
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
      const requestedFields = JSON.stringify([
        "name", "customer", "custom_patient_name", "custom_uhid",
        "custom_doctor_name", "custom_age", "custom_phone",
        "custom_visit_code", "custom_bed_no", "custom_req_no",
        "custom_department", "custom_hospital", "custom_payer_category",
        "custom_payer_name", "custom_sub_insurance", "custom_network",
        "custom_insurance_no", "custom_other_no", "custom_validity_from",
        "custom_validity_to", "co_pay", "payer_amount", "patient_amount",
        "posting_date", "posting_time", "rounded_total", "status", "pos_profile",
        "modified", "modified_by", "paid_amount", "outstanding_amount", "company",
        "is_return", "custom_ipd_effect", "custom_opd_effect", "visit_type"
      ]);
      const url = `${API_BASE_URL}/Sale%20Bill?fields=${encodeURIComponent(requestedFields)}&limit_page_length=100000&order_by=posting_date desc,posting_time desc&filters=${encodeURIComponent(filterStr)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched invoices:', data.data); // Debug log
        const rawList = data.data || [];
        const filteredList = showOnlyReturns
          ? rawList.filter((inv: any) => inv.is_return === 1 || inv.status === 'Return')
          : rawList.filter((inv: any) => inv.is_return !== 1 && inv.status !== 'Return');
        setInvoices(filteredList);
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
      setDateRange({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      });
      if (posProfile) {
        setSelectedProfile(posProfile);
      }
    }
  }, [isOpen, posProfile]);

  useEffect(() => {
    if (!isOpen) {
      lastFetchedParamsRef.current = '';
      setLoading(true);
      return;
    }

    const fromStr = dateRange.from ? formatDateToYMD(dateRange.from) : '';
    const toStr = dateRange.to ? formatDateToYMD(dateRange.to) : '';

    const paramsKey = JSON.stringify({
      isOpen, selectedProfile, isIPDPage, excludeIPDInvoices, showOnlyReturns,
      invoiceNumberSearchTerm, patientNameSearchTerm,
      from: fromStr,
      to: toStr
    });

    if (lastFetchedParamsRef.current === paramsKey) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const isInitialLoad = lastFetchedParamsRef.current === '';
    lastFetchedParamsRef.current = paramsKey;

    if (isInitialLoad) {
      // Execute immediate fetch on initial modal open for stable loading skeletons
      fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, dateRange, selectedProfile);
    } else {
      // Debounce user typing search changes
      searchTimeoutRef.current = setTimeout(() => {
        fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, dateRange, selectedProfile);
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [isOpen, selectedProfile, isIPDPage, excludeIPDInvoices, showOnlyReturns, invoiceNumberSearchTerm, patientNameSearchTerm, dateRange]);

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
      fetchInvoices(invoiceNumberSearchTerm, patientNameSearchTerm, dateRange, selectedProfile);

      // Close the details modal
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      showAlert("danger", "Error", "Failed to submit invoice. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[56px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[calc(100vh-5rem)] flex flex-col my-auto overflow-hidden modal-enter">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {showOnlyReturns ? "Return Sale Bills" : "Sale Bills"}
          </CardTitle>
          <UIButton onClick={onClose} variant="ghost" size="icon" className="p-0">
            <X className="h-5 w-5" />
          </UIButton>
        </CardHeader>

        {/* Search Inputs */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showOnlyReturns ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-4 items-end`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Invoice No</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter invoice number..."
                value={invoiceNumberSearchTerm}
                onChange={(e) => setInvoiceNumberSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Patient Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name..."
                value={patientNameSearchTerm}
                onChange={(e) => setPatientNameSearchTerm(e.target.value)}
              />
            </div>
            {!showOnlyReturns && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">POS Profile</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                >
                  <option value="">All POS Profiles</option>
                  {posProfilesList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateRange.from ? formatDateToYMD(dateRange.from) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setDateRange(prev => ({
                    ...prev,
                    from: val ? parseYMDToDate(val) : undefined
                  }));
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                {(dateRange.from || dateRange.to) && (
                  <button
                    type="button"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Clear Dates
                  </button>
                )}
              </div>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateRange.to ? formatDateToYMD(dateRange.to) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setDateRange(prev => ({
                    ...prev,
                    to: val ? parseYMDToDate(val) : undefined
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable DataTable Section */}
        <div className="flex-1 overflow-hidden p-4 min-h-0 flex flex-col">
          <DataTableComponent
            columns={[
              { accessorKey: 'idx', header: 'IDX', cell: ({ row }: any) => row.index + 1 },
              { accessorKey: 'name', header: 'Invoice No' },
              { accessorKey: 'customer', header: 'Customer' },
              {
                accessorKey: 'custom_patient_name', header: 'Patient', cell: ({ getValue }: any) => (
                  <TableCellComponents type="user" value={getValue()} />
                ),
              },
              { accessorKey: 'posting_date', header: 'Date', cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleDateString() },
              { id: 'posting_time', header: 'Time', cell: ({ row }: any) => row.original.posting_time ? row.original.posting_time.substring(0, 5) : '' },
              { accessorKey: 'rounded_total', header: 'Amount', cell: ({ row }: any) => `₹${Number(row.original.rounded_total || 0).toFixed(2)}` },
              { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <span className={`status-badge ${row.original.status?.toLowerCase()}`}>{row.original.status}</span> },
              { accessorKey: 'visit_type', header: 'Visit Type', cell: ({ row }: any) => row.original.visit_type || '-' },
              {
                id: isIPDPage ? 'ipd_effect' : 'opd_effect',
                header: isIPDPage ? 'IPD Effect' : 'OPD Effect',
                cell: ({ row }: any) => {
                  const hasEffect = isIPDPage
                    ? row.original.custom_ipd_effect === 1
                    : row.original.custom_opd_effect === 1;

                  return (
                    <div className="flex items-center justify-center">
                      {hasEffect ? (
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
                        <div className="">
                          <span className="text-gray-400 text-xs"></span>
                        </div>
                      )}
                    </div>
                  );
                }
              },
              { accessorKey: 'modified', header: 'Modified Date', cell: ({ row }: any) => new Date(row.original.modified).toLocaleDateString() },
              {
                accessorKey: 'modified_by', header: 'Modified By', cell: ({ getValue }: any) => (
                  <TableCellComponents type="user" value={getValue()} />
                ),
              },
              { id: 'action', header: 'Actions', cell: ({ row }: any) => <Button type="secondary-button" size="button-medium" onClick={() => handleViewDetails(row.original)}>View</Button> },
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
              visit_type: 'Visit Type',
              ...(isIPDPage ? { ipd_effect: 'IPD Effect' } : { opd_effect: 'OPD Effect' }),
              modified: 'Modified Date',
              modified_by: 'Modified By',
              action: 'Actions',
            }}
            hideFilters={true}
            hideMeFilter={true}
            onFilterClick={() => {}}
            hideDatePicker={true}
            onDataChange={(dates) => setDateRange({ from: dates?.from || undefined, to: dates?.to || undefined })}
            hideShowColumns={true}
            autoSize={true}
            className="h-full"
          />
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end sticky bottom-0 z-10">
          <Button type="secondary-button" size="button-medium" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Invoice Details Mini-Popup */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed top-[56px] inset-x-0 bottom-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              <p><strong>Visit Type:</strong> {selectedInvoice.visit_type || 'N/A'}</p>
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
        <div className="fixed top-[56px] inset-x-0 bottom-0 bg-black/70 flex items-center justify-center z-[51] p-4">
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
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{Number(item.rate || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">₹{Number(item.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 sticky bottom-0">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      ₹{itemsForModal.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2)}
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
