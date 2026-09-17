"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/buttons/Button";
import { useAuth } from '@/context/AuthContext';
import { getAuthHeaders } from '@/utils/sessionAuth';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClosingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOpeningEntry: (openingEntryName: string) => void;
  posProfile: string | null;
  showAlert: (variant: 'success' | 'warning' | 'danger' | 'primary' | 'secondary', heading: string, content: string) => void;
}

type POSOpeningEntry = {
  name: string;
  pos_profile: string;
  period_start_date: string;
  user: string;
  company: string;
};

type POSClosingEntry = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  period_start_date: string;
  period_end_date: string;
  posting_date: string;
  posting_time: string;
  pos_opening_entry: string;
  status: string;
  company: string;
  pos_profile: string;
  user: string;
  grand_total: number;
  net_total: number;
  total_quantity: number;
  error_message: string;
  doctype: string;
  taxes: Array<{
    name: string;
    account_head: string;
    rate: number;
    amount: number;
    idx: number;
  }>;
  pos_transactions: Array<{
    name: string;
    pos_invoice: string;
    posting_date: string;
    posting_time?: string;
    customer: string;
    grand_total: number;
    is_return: number;
    bill_type?: string;
    custom_is_ipd_invoice?: number;
    idx: number;
  }>;
  payment_reconciliation: Array<{
    name: string;
    mode_of_payment: string;
    opening_amount: number;
    expected_amount: number;
    closing_amount: number;
    difference: number;
    idx: number;
  }>;
};

const ClosingEntryModal: React.FC<ClosingEntryModalProps> = ({
  isOpen,
  onClose,
  onSelectOpeningEntry,
  posProfile,
  showAlert,
}) => {
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [openingEntries, setOpeningEntries] = useState<POSOpeningEntry[]>([]);
  const [selectedOpeningEntry, setSelectedOpeningEntry] = useState<string | null>(null);
  const [closingEntryData, setClosingEntryData] = useState<POSClosingEntry | null>(null);
  const [showClosingDetails, setShowClosingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;
  const {  } = useAuth();

  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const API_METHOD_URL = 'https://gmcerp.quantcloud.in/api/method';

  useEffect(() => {
    if (isOpen && posProfile) {
      fetchOpenPOSOpeningEntries(posProfile);
    }
  }, [isOpen, posProfile]);

  useEffect(() => {
    setCurrentPage(1);
  }, [closingEntryData, sortOrder]);

  const sortedTransactions = useMemo(() => {
    if (!closingEntryData?.pos_transactions) return [];
    return [...closingEntryData.pos_transactions].sort((a, b) => {
      const dtA = (a.posting_date || '') + ' ' + (a.posting_time || '');
      const dtB = (b.posting_date || '') + ' ' + (b.posting_time || '');
      const comparison = dtA.localeCompare(dtB);
      if (comparison !== 0) {
        return sortOrder === 'desc' ? -comparison : comparison;
      }
      return sortOrder === 'desc'
        ? (b.pos_invoice || '').localeCompare(a.pos_invoice || '')
        : (a.pos_invoice || '').localeCompare(b.pos_invoice || '');
    });
  }, [closingEntryData?.pos_transactions, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const fetchOpenPOSOpeningEntries = async (profile: string) => {
    setLoadingEntries(true);
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      const filters = encodeURIComponent(JSON.stringify([
        ["pos_profile", "=", profile],
        ["status", "=", "Open"]
      ]));

      const response = await fetch(`${API_BASE_URL}/Opening%20Entry?filters=${filters}&fields=["name", "pos_profile", "period_start_date", "user", "company"]`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOpeningEntries(data.data);
        if (data.data.length > 0) {
          setSelectedOpeningEntry(data.data[0].name); // Auto-select the first one
        } else {
          setSelectedOpeningEntry(null);
        }
      } else {
        console.error('Failed to fetch Opening Entries:', response.status, response.statusText);
        showAlert("danger", "Error", "Failed to fetch open Opening Entries.");
        setOpeningEntries([]);
      }
    } catch (error) {
      console.error('Error fetching Opening Entries:', error);
      showAlert("danger", "Error", "Error fetching open Opening Entries.");
      setOpeningEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleCreateClosingEntryClick = async () => {
    if (!selectedOpeningEntry) {
      showAlert("warning", "Warning", "Please select an Opening Entry.");
      return;
    }

    setPreviewLoading(true);
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      const response = await fetch(
        `${API_METHOD_URL}/quantbit_hims_integration.quantbit_hims_integration.api.get_pos_closing_entry_preview`,
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ opening_entry_name: selectedOpeningEntry }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.statusText}`);
      }

      const payload = await response.json();
      const result = payload.message || payload;

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to prepare closing entry preview.');
      }

      setClosingEntryData(result.data);
      setShowClosingDetails(true);
    } catch (error: any) {
      console.error('Error preparing closing entry preview:', error);
      showAlert("danger", "Error", error?.message || "Error preparing closing entry preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmitClosingEntry = async () => {
    if (!closingEntryData || submitting) return;

    setSubmitting(true);
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ? 
        JSON.parse(authHeaders) : 
        Array.isArray(authHeaders) ? 
          Object.fromEntries(authHeaders) : 
          authHeaders;

      const response = await fetch(
        `${API_METHOD_URL}/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_closing_entry`,
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ opening_entry_name: selectedOpeningEntry }),
        }
      );

      const payload = await response.json();
      const result = payload.message || payload;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to submit closing entry.');
      }

      setClosingEntryData(result.data);
      showAlert("success", "Success", "Closing entry submitted successfully!");
      onSelectOpeningEntry(selectedOpeningEntry!);
      handleCloseAll();
    } catch (error: any) {
      console.error('Error submitting closing entry:', error);
      showAlert("danger", "Error", error?.message || "Error submitting closing entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setShowClosingDetails(false);
    setClosingEntryData(null);
    setSelectedOpeningEntry(null);
    onClose();
  };

  return (
    <>
      {/* Opening Entry Selection Dialog */}
      <Dialog open={isOpen && !showClosingDetails} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Opening Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {loadingEntries ? (
              <div className="text-center">Loading opening entries...</div>
            ) : openingEntries.length === 0 ? (
              <div className="text-center text-gray-500">No open Opening Entries found for this profile.</div>
            ) : (
              <select
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedOpeningEntry || ''}
                onChange={(e) => setSelectedOpeningEntry(e.target.value)}
              >
                {openingEntries.map((entry) => (
                  <option key={entry.name} value={entry.name}>
                    {entry.name} (Started: {new Date(entry.period_start_date).toLocaleString()})
                  </option>
                ))}
              </select>
            )}
          </div>
          <DialogFooter>
            <Button type="secondary-button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary-button"
              onClick={handleCreateClosingEntryClick}
              disabled={!selectedOpeningEntry || loadingEntries || previewLoading}
            >
              {previewLoading ? 'Preparing Preview...' : 'Create Closing Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Closing Entry Details Dialog */}
      <Dialog open={showClosingDetails} onOpenChange={(open) => {
        if (!open) {
          setShowClosingDetails(false);
        }
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>POS Closing Entry Details</DialogTitle>
          </DialogHeader>
          {closingEntryData && (
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Name:</span> {closingEntryData.name}</div>
                  <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded ${closingEntryData.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{closingEntryData.status}</span></div>
                  <div><span className="font-medium">Company:</span> {closingEntryData.company}</div>
                  <div><span className="font-medium">POS Profile:</span> {closingEntryData.pos_profile}</div>
                  <div><span className="font-medium">User:</span> {closingEntryData.user}</div>
                  <div><span className="font-medium">Opening Entry:</span> {closingEntryData.pos_opening_entry}</div>
                  <div><span className="font-medium">Posting Date:</span> {closingEntryData.posting_date}</div>
                  <div><span className="font-medium">Posting Time:</span> {closingEntryData.posting_time}</div>
                  <div><span className="font-medium">Period Start:</span> {new Date(closingEntryData.period_start_date).toLocaleString()}</div>
                  <div><span className="font-medium">Period End:</span> {new Date(closingEntryData.period_end_date).toLocaleString()}</div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><span className="font-medium">Net Total:</span> ﷼{closingEntryData.net_total.toFixed(2)}</div>
                  <div><span className="font-medium">Grand Total:</span> ﷼{closingEntryData.grand_total.toFixed(2)}</div>
                  <div><span className="font-medium">Total Quantity:</span> {closingEntryData.total_quantity}</div>
                </div>
              </div>

              {/* Taxes */}
              {closingEntryData.taxes && closingEntryData.taxes.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Taxes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Account Head</th>
                          <th className="px-4 py-2 text-right">Rate (%)</th>
                          <th className="px-4 py-2 text-right">Amount (﷼)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closingEntryData.taxes.map((tax, index) => (
                          <tr key={tax.name} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{tax.account_head}</td>
                            <td className="px-4 py-2 text-right">{tax.rate.toFixed(3)}</td>
                            <td className="px-4 py-2 text-right">﷼{tax.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* POS Transactions */}
              {closingEntryData.pos_transactions && closingEntryData.pos_transactions.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                      POS Transactions ({sortedTransactions.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Sort Date:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
                        title="Click to toggle Date sort order"
                      >
                        {sortOrder === 'desc' ? (
                          <>
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            <span>Latest First (Desc)</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                            <span>Oldest First (Asc)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Invoice</th>
                          <th className="px-4 py-2 text-left">Customer</th>
                          <th
                            className="px-4 py-2 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors"
                            onClick={() => {
                              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                            }}
                            title="Click to toggle Date sort"
                          >
                            <div className="flex items-center gap-1">
                              <span>Date</span>
                              {sortOrder === 'desc' ? (
                                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </div>
                          </th>
                          <th className="px-4 py-2 text-center">Type</th>
                          <th className="px-4 py-2 text-right">Amount (﷼)</th>
                          <th className="px-4 py-2 text-center">Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((txn, index) => {
                          const itemIndex = (currentPage - 1) * pageSize + index + 1;
                          return (
                            <tr key={txn.pos_invoice || txn.name || index} className="border-t hover:bg-gray-50/50">
                              <td className="px-4 py-2">{itemIndex}</td>
                              <td className="px-4 py-2 font-medium">{txn.pos_invoice}</td>
                              <td className="px-4 py-2">{txn.customer}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div>{txn.posting_date}</div>
                                {txn.posting_time && (
                                  <div className="text-xs text-gray-400">{txn.posting_time}</div>
                                )}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    txn.bill_type === 'IPD' || txn.custom_is_ipd_invoice === 1
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {txn.bill_type || (txn.custom_is_ipd_invoice === 1 ? 'IPD' : 'OPD')}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right">﷼{txn.grand_total.toFixed(2)}</td>
                              <td className="px-4 py-2 text-center">{txn.is_return ? 'Yes' : 'No'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t text-xs text-gray-600">
                    <div>
                      Showing{' '}
                      <span className="font-semibold text-gray-800">
                        {sortedTransactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                      </span>{' '}
                      to{' '}
                      <span className="font-semibold text-gray-800">
                        {Math.min(currentPage * pageSize, sortedTransactions.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-gray-800">{sortedTransactions.length}</span> records
                      (15 per page)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-700 shadow-sm transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      <span className="px-2.5 py-1 bg-gray-100 rounded font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-700 shadow-sm transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Reconciliation */}
              {closingEntryData.payment_reconciliation && closingEntryData.payment_reconciliation.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Payment Reconciliation</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Mode of Payment</th>
                          <th className="px-4 py-2 text-right">Opening (﷼)</th>
                          <th className="px-4 py-2 text-right">Expected (﷼)</th>
                          <th className="px-4 py-2 text-right">Closing (﷼)</th>
                          <th className="px-4 py-2 text-right">Difference (﷼)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closingEntryData.payment_reconciliation.map((payment, index) => (
                          <tr key={payment.name} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{payment.mode_of_payment}</td>
                            <td className="px-4 py-2 text-right">﷼{payment.opening_amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">﷼{payment.expected_amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">﷼{payment.closing_amount.toFixed(2)}</td>
                            <td className={`px-4 py-2 text-right font-medium ${payment.difference < 0 ? 'text-red-600' : payment.difference > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                              ﷼{payment.difference.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="secondary-button" onClick={() => setShowClosingDetails(false)}>
              Close
            </Button>
            <Button
              type="primary-button"
              onClick={handleSubmitClosingEntry}
              disabled={submitting || closingEntryData?.docstatus === 1}
            >
              {submitting ? 'Submitting...' : closingEntryData?.docstatus === 1 ? 'Already Submitted' : 'Submit Closing Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClosingEntryModal;
