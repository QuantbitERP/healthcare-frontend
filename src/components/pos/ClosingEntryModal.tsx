"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/buttons/Button";
import { useAuth } from '@/context/AuthContext';

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
    customer: string;
    grand_total: number;
    is_return: number;
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
  const { apiKey, apiSecret } = useAuth();

  const API_BASE_URL = 'http://103.219.1.138:4430/api/resource';
  const API_METHOD_URL = 'http://103.219.1.138:4430/api/method';

  useEffect(() => {
    if (isOpen && posProfile) {
      fetchOpenPOSOpeningEntries(posProfile);
    }
  }, [isOpen, posProfile]);

  const fetchOpenPOSOpeningEntries = async (profile: string) => {
    setLoadingEntries(true);
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };

      const filters = encodeURIComponent(JSON.stringify([
        ["pos_profile", "=", profile],
        ["status", "=", "Open"]
      ]));

      const response = await fetch(`${API_BASE_URL}/POS%20Opening%20Entry?filters=${filters}&fields=["name", "pos_profile", "period_start_date", "user", "company"]`, {
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
        console.error('Failed to fetch POS Opening Entries:', response.status, response.statusText);
        showAlert("danger", "Error", "Failed to fetch open POS Opening Entries.");
        setOpeningEntries([]);
      }
    } catch (error) {
      console.error('Error fetching POS Opening Entries:', error);
      showAlert("danger", "Error", "Error fetching open POS Opening Entries.");
      setOpeningEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleCreateClosingEntryClick = async () => {
    if (!selectedOpeningEntry) {
      showAlert("warning", "Warning", "Please select a POS Opening Entry.");
      return;
    }

    setPreviewLoading(true);
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };

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
    if (!closingEntryData) return;

    setSubmitting(true);
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };

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
            <DialogTitle>Select POS Opening Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {loadingEntries ? (
              <div className="text-center">Loading opening entries...</div>
            ) : openingEntries.length === 0 ? (
              <div className="text-center text-gray-500">No open POS Opening Entries found for this profile.</div>
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
                  <div><span className="font-medium">Net Total:</span> ₹{closingEntryData.net_total.toFixed(2)}</div>
                  <div><span className="font-medium">Grand Total:</span> ₹{closingEntryData.grand_total.toFixed(2)}</div>
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
                          <th className="px-4 py-2 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closingEntryData.taxes.map((tax, index) => (
                          <tr key={tax.name} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{tax.account_head}</td>
                            <td className="px-4 py-2 text-right">{tax.rate.toFixed(3)}</td>
                            <td className="px-4 py-2 text-right">₹{tax.amount.toFixed(2)}</td>
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
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">POS Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">#</th>
                          <th className="px-4 py-2 text-left">Invoice</th>
                          <th className="px-4 py-2 text-left">Customer</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-right">Amount (₹)</th>
                          <th className="px-4 py-2 text-center">Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closingEntryData.pos_transactions.map((txn, index) => (
                          <tr key={txn.name} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{txn.pos_invoice}</td>
                            <td className="px-4 py-2">{txn.customer}</td>
                            <td className="px-4 py-2">{txn.posting_date}</td>
                            <td className="px-4 py-2 text-right">₹{txn.grand_total.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">{txn.is_return ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                          <th className="px-4 py-2 text-right">Opening (₹)</th>
                          <th className="px-4 py-2 text-right">Expected (₹)</th>
                          <th className="px-4 py-2 text-right">Closing (₹)</th>
                          <th className="px-4 py-2 text-right">Difference (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closingEntryData.payment_reconciliation.map((payment, index) => (
                          <tr key={payment.name} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{payment.mode_of_payment}</td>
                            <td className="px-4 py-2 text-right">₹{payment.opening_amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">₹{payment.expected_amount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">₹{payment.closing_amount.toFixed(2)}</td>
                            <td className={`px-4 py-2 text-right ${payment.difference !== 0 ? 'text-red-600 font-semibold' : ''}`}>
                              ₹{payment.difference.toFixed(2)}
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
