"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from "@/components/DataTable";
import SearchInput from "@/components/form/SearchInput";
import SelectInput from "@/components/form/Select";
import PageHeader from "@/components/billbreakdown/PageHeader";
import { useAuth } from "@/context/AuthContext";
import POSProfileSelector from "@/components/pos/POSProfileSelector";
import { redirectToFrappeLogin, getAuthHeaders } from "@/utils/sessionAuth";
import { FRAPPE_BASE_URL } from "@/config/frappe";
import { securePrintPdf } from "@/utils/printHelper";
import { Eye, Search, X } from "lucide-react";
import { DateRange } from "react-day-picker";

interface Invoice {
  name: string;
  customer: string;
  custom_patient_name?: string;
  custom_uhid?: string;
  custom_doctor_name?: string;
  custom_age?: string;
  custom_phone?: string;
  custom_bed_no?: string;
  custom_department?: string;
  posting_date: string;
  posting_time?: string;
  rounded_total?: number;
  grand_total?: number;
  paid_amount?: number;
  outstanding_amount?: number;
  status?: string;
  visit_type?: string;
  custom_ipd_effect?: number;
  custom_opd_effect?: number;
  company?: string;
  items?: any[];
  [key: string]: any;
}

export default function POS() {
  const selectOptions = [
    { label: "Bill No", value: "name" },
    { label: "Patient Name", value: "custom_patient_name" },
    { label: "Customer Name", value: "customer" },
    { label: "Status", value: "status" },
  ];

  const [searchValue, setSearchValue] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("name");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isMeMode, setIsMeMode] = useState<boolean>(false);
  const [showFilterBar, setShowFilterBar] = useState<boolean>(false);

  const [showPosProfileSelector, setShowPosProfileSelector] = useState(false);
  const [_forceShowProfileSelector, setForceShowProfileSelector] = useState(false);

  const [salesInvoices, setSalesInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invoice Details Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [itemsForModal, setItemsForModal] = useState<any[]>([]);

  const hasInitializedRef = useRef(false);

  const {
    logout,
    isAuthenticated,
    posProfile,
    currentUser,
    setPosProfile,
    apiKey,
    apiSecret,
    csrfToken,
    checkAnyOpenPOS,
    isInitialized,
  } = useAuth();
  const router = useRouter();

  // Clear redirect flag on mount to prevent stale flags from previous sessions
  useEffect(() => {
    localStorage.removeItem("pos_redirected_to_login");
  }, []);

  const fetchSalesInvoices = useCallback(async (profileOverride?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const authHeaders = getAuthHeaders();
      const headers =
        typeof authHeaders === "string"
          ? JSON.parse(authHeaders)
          : Array.isArray(authHeaders)
          ? Object.fromEntries(authHeaders)
          : authHeaders;

      const requestedFields = JSON.stringify([
        "name",
        "customer",
        "custom_patient_name",
        "custom_uhid",
        "custom_doctor_name",
        "custom_age",
        "custom_phone",
        "custom_visit_code",
        "custom_bed_no",
        "custom_req_no",
        "custom_department",
        "custom_hospital",
        "custom_payer_category",
        "custom_payer_name",
        "custom_sub_insurance",
        "custom_network",
        "custom_insurance_no",
        "custom_other_no",
        "custom_validity_from",
        "custom_validity_to",
        "co_pay",
        "payer_amount",
        "patient_amount",
        "posting_date",
        "posting_time",
        "rounded_total",
        "grand_total",
        "status",
        "pos_profile",
        "modified",
        "modified_by",
        "paid_amount",
        "outstanding_amount",
        "company",
        "is_return",
        "custom_ipd_effect",
        "custom_opd_effect",
        "visit_type",
      ]);

      const filters: any[] = [["docstatus", "in", [0, 1]]];

      // Fetch primary Sale Bill documents
      const url = `${FRAPPE_BASE_URL}/api/resource/Sale Bill?fields=${encodeURIComponent(
        requestedFields
      )}&limit_page_length=500&order_by=posting_date desc,posting_time desc&filters=${encodeURIComponent(
        JSON.stringify(filters)
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });

      let fetchedList: Invoice[] = [];

      if (response.ok) {
        const data = await response.json();
        fetchedList = data.data || [];
      } else {
        console.warn("Sale Bill fetch failed, falling back to Sales Invoice:", response.status);
      }

      // If Sale Bill returns empty list or failed, fallback to Sales Invoice with fields
      if (fetchedList.length === 0) {
        const fallbackFilters: any[] = [["docstatus", "in", [0, 1]]];
        const fallbackUrl = `${FRAPPE_BASE_URL}/api/resource/Sales Invoice?fields=${encodeURIComponent(
          requestedFields
        )}&limit_page_length=500&order_by=posting_date desc,posting_time desc&filters=${encodeURIComponent(
          JSON.stringify(fallbackFilters)
        )}`;

        const fallbackResponse = await fetch(fallbackUrl, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          fetchedList = fallbackData.data || [];
        }
      }

      setSalesInvoices(fetchedList);
      setFilteredInvoices(fetchedList);
    } catch (e: any) {
      console.error("Error fetching sales invoices:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [posProfile]);

  useEffect(() => {
    const checkOpeningEntryAndShowSelector = async () => {
      if (hasInitializedRef.current) return;
      if (!isInitialized) return;

      hasInitializedRef.current = true;
      const hasAlreadyRedirected = localStorage.getItem("pos_redirected_to_login");

      if (!isAuthenticated && !currentUser && !hasAlreadyRedirected) {
        localStorage.setItem("pos_redirected_to_login", "true");
        redirectToFrappeLogin();
        return;
      }

      if (isAuthenticated && hasAlreadyRedirected) {
        localStorage.removeItem("pos_redirected_to_login");
      }

      if (posProfile) {
        try {
          const openEntry = await checkAnyOpenPOS(posProfile);
          if (openEntry && openEntry.isOpen) {
            setShowPosProfileSelector(false);
            setForceShowProfileSelector(false);
            fetchSalesInvoices(posProfile);
          } else {
            setForceShowProfileSelector(true);
            setShowPosProfileSelector(true);
          }
        } catch (error) {
          console.error("Error checking opening entry:", error);
          setForceShowProfileSelector(true);
          setShowPosProfileSelector(true);
        }
      } else {
        setForceShowProfileSelector(true);
        setShowPosProfileSelector(true);
      }
    };

    checkOpeningEntryAndShowSelector();
  }, [isInitialized, isAuthenticated, currentUser, posProfile, checkAnyOpenPOS, fetchSalesInvoices]);

  // Real-time Filtering Pipeline (Search Term + Date Range + Selected Filter Field)
  const applyFilters = useCallback(() => {
    let result = [...salesInvoices];

    // 1. Text Search Filter
    if (searchValue.trim()) {
      const term = searchValue.trim().toLowerCase();
      result = result.filter((inv) => {
        if (filterType === "name") {
          return (inv.name || "").toLowerCase().includes(term);
        } else if (filterType === "customer") {
          return (inv.customer || "").toLowerCase().includes(term);
        } else if (filterType === "custom_patient_name") {
          return (inv.custom_patient_name || "").toLowerCase().includes(term);
        } else if (filterType === "status") {
          return (inv.status || "").toLowerCase().includes(term);
        } else {
          // All Fields Search
          return (
            (inv.name || "").toLowerCase().includes(term) ||
            (inv.customer || "").toLowerCase().includes(term) ||
            (inv.custom_patient_name || "").toLowerCase().includes(term) ||
            (inv.status || "").toLowerCase().includes(term)
          );
        }
      });
    }

    // 2. Date Range Filter
    if (dateRange?.from) {
      const fromStr = dateRange.from.toISOString().split("T")[0];
      result = result.filter((inv) => inv.posting_date >= fromStr);
    }
    if (dateRange?.to) {
      const toStr = dateRange.to.toISOString().split("T")[0];
      result = result.filter((inv) => inv.posting_date <= toStr);
    }

    // 3. Me Mode Filter (Filter by current user's created/modified invoices)
    if (isMeMode && currentUser) {
      const userIdentifier = (
        typeof currentUser === "string"
          ? currentUser
          : (currentUser as any)?.email || (currentUser as any)?.name || ""
      ).toLowerCase();

      result = result.filter((inv) => {
        const ownerVal = (inv.owner || "").toLowerCase();
        const modifiedByVal = (inv.modified_by || "").toLowerCase();
        return (
          ownerVal === userIdentifier ||
          modifiedByVal === userIdentifier ||
          (userIdentifier !== "" && ownerVal.includes(userIdentifier)) ||
          (userIdentifier !== "" && modifiedByVal.includes(userIdentifier))
        );
      });
    }

    setFilteredInvoices(result);
  }, [salesInvoices, searchValue, filterType, dateRange, isMeMode, currentUser]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePOSProfileSelect = async (profile: string) => {
    setPosProfile(profile);
    try {
      const openEntry = await checkAnyOpenPOS(profile);
      if (openEntry && openEntry.isOpen) {
        setShowPosProfileSelector(false);
        setForceShowProfileSelector(false);
        fetchSalesInvoices(profile);
      } else {
        router.push("/pos/opening");
      }
    } catch (error) {
      console.error("Error checking opening entry:", error);
      router.push("/pos/opening");
    }
  };

  const handleViewDetails = async (invoice: Invoice) => {
    try {
      const authHeaders = getAuthHeaders();
      const headers =
        typeof authHeaders === "string"
          ? JSON.parse(authHeaders)
          : Array.isArray(authHeaders)
          ? Object.fromEntries(authHeaders)
          : authHeaders;

      const invoiceUrl = `${FRAPPE_BASE_URL}/api/resource/Sale Bill/${encodeURIComponent(
        invoice.name
      )}`;

      const response = await fetch(invoiceUrl, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (response.ok) {
        const invoiceData = await response.json();
        setSelectedInvoice({ ...invoice, ...invoiceData.data });
      } else {
        setSelectedInvoice(invoice);
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setSelectedInvoice(invoice);
    }
    setShowDetailsModal(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const invoiceName = invoice.name;
    const company = invoice.company || "GMC";
    const url =
      "https://gmcerp.quantcloud.in/printview?" +
      "doctype=Sale Bill&" +
      "name=" +
      encodeURIComponent(invoiceName) +
      "&" +
      "format=" +
      encodeURIComponent(
        invoice.status === "Return" ? "IP SALE RETURN INVOICE" : "Pos Invoice print Format"
      ) +
      "&" +
      "trigger_print=1&" +
      "no_letterhead=0&" +
      "letterhead=" +
      encodeURIComponent(company) +
      "&" +
      "settings=" +
      encodeURIComponent("{}") +
      "&" +
      "_lang=en";
    securePrintPdf(url, getAuthHeaders, (variant, heading, content) =>
      console.log(variant, heading, content)
    );
  };

  const handleLoadInvoiceFromPos = (invoice: Invoice) => {
    const isIPD =
      invoice.custom_is_ipd_invoice === 1 ||
      invoice.custom_ipd_effect === 1 ||
      (invoice.visit_type || "").toUpperCase() === "IPD";

    sessionStorage.setItem("load_pos_invoice_name", invoice.name);

    if (isIPD) {
      router.push(`/sale_bill?invoice=${encodeURIComponent(invoice.name)}`);
    } else {
      router.push(`/opd-sale-bill?invoice=${encodeURIComponent(invoice.name)}`);
    }
  };

  const handleClick = (path: string) => {
    router.push(path);
  };

  const tableColumns = [
    {
      accessorKey: "name",
      header: "Bill No",
      cell: ({ row }: any) => (
        <button
          className="text-blue-600 font-medium hover:underline text-left"
          onClick={() => handleViewDetails(row.original)}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }: any) => row.original.customer || "-",
    },
    {
      accessorKey: "custom_patient_name",
      header: "Patient Name",
      cell: ({ row }: any) => row.original.custom_patient_name || "-",
    },
    {
      accessorKey: "posting_date",
      header: "Date",
      cell: ({ row }: any) => row.original.posting_date || "-",
    },
    {
      accessorKey: "grand_total",
      header: "Total (₹)",
      cell: ({ row }: any) => {
        const val = row.original.grand_total ?? row.original.rounded_total ?? 0;
        return Number(val);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => row.original.status || "Draft",
    },
    {
      accessorKey: "pos_profile",
      header: "POS Profile",
      cell: ({ row }: any) => row.original.pos_profile || "-",
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }: any) => row.original.owner || "-",
    },
    {
      accessorKey: "modified_by",
      header: "Modified By",
      cell: ({ row }: any) => row.original.modified_by || "-",
    },
  ];

  const columnNames = {
    name: "Bill No",
    customer: "Customer",
    custom_patient_name: "Patient Name",
    posting_date: "Date",
    grand_total: "Total (₹)",
    status: "Status",
    pos_profile: "POS Profile",
    owner: "Owner",
    modified_by: "Modified By",
  };

  return (
    <div className="bg-white min-h-screen p-2">
      <div className="my-20">
        <PageHeader
          title="POS"
          icon="../pos/assets/icons/BriefcaseIcon.svg"
          posProfile={posProfile || undefined}
          rightButtons={
            <div className="flex flex-row space-x-2">
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handleClick("/opd-sale-bill")}
              >
                + New OPD Sale Bill
              </Button>
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handleClick("/sale_bill")}
              >
                + New IPD Bill
              </Button>
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={() => setShowPosProfileSelector(true)}
              >
                Change POS Profile
              </Button>
              <Button type="secondary-button" size="button-medium" onClick={logout}>
                Logout
              </Button>
            </div>
          }
        />
      </div>

      <div className="w-full">
        {/* Collapsible Top Filter Bar */}
        {showFilterBar && (
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 mb-3 bg-gray-50 border border-gray-200 rounded-xl transition-all">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              FILTER BY:
            </span>
            <div className="w-full sm:w-56">
              <SelectInput
                data={selectOptions}
                value={filterType}
                onValueChange={(value) => setFilterType(value as string)}
                placeholder="Select Filter Field"
              />
            </div>
            <div className="flex-1 w-full">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder={`Filter by ${
                  selectOptions.find((opt) => opt.value === filterType)?.label || "Field"
                }`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTableComponent
          pageName="Sales Invoices"
          isRowSelectable={true}
          searchPlaceholder="Search Bill No, Patient, Customer, Status..."
          data={filteredInvoices}
          columns={tableColumns}
          columnNames={columnNames}
          loading={loading}
          filterCount={showFilterBar ? 1 : 0}
          onSearch={(term) => setSearchValue(term)}
          onDataChange={(dates) => setDateRange(dates)}
          onToggleMe={(meMode) => setIsMeMode(meMode)}
          meKeyAccesser="owner"
          onFilterClick={() => setShowFilterBar((prev) => !prev)}
          hideFilters={false}
          hideMeFilter={false}
          hideDatePicker={false}
          hideShowColumns={false}
        />
      </div>

      {/* Invoice Details Popup */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowDetailsModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Invoice Details: {selectedInvoice.name}
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Customer:</strong> {selectedInvoice.customer || "-"}
              </p>
              <p>
                <strong>Patient Name:</strong> {selectedInvoice.custom_patient_name || "-"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedInvoice.posting_date
                  ? new Date(selectedInvoice.posting_date).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>Grand Total:</strong> ₹
                {(
                  selectedInvoice.grand_total ?? selectedInvoice.rounded_total ?? 0
                ).toFixed(2)}
              </p>
              <p>
                <strong>Paid Amount:</strong> ₹
                {(selectedInvoice.paid_amount || 0).toFixed(2)}
              </p>
              <p>
                <strong>Outstanding Amount:</strong> ₹
                {(selectedInvoice.outstanding_amount || 0).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${(selectedInvoice.status || "").toLowerCase()}`}>
                  {selectedInvoice.status || "Draft"}
                </span>
              </p>
              <p>
                <strong>Visit Type:</strong> {selectedInvoice.visit_type || "-"}
              </p>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Items ({selectedInvoice.items.length}):
                    </h4>
                    <button
                      onClick={() => {
                        setItemsForModal(selectedInvoice.items || []);
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
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handleLoadInvoiceFromPos(selectedInvoice)}
              >
                Load Invoice
              </Button>
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => handlePrintInvoice(selectedInvoice)}
              >
                Print Invoice
              </Button>
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items List Popup */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1002] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white">Invoice Items</h3>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                onClick={() => setShowItemsModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Item Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {itemsForModal.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {item.item_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.item_name || item.item_code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.qty}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        ₹{(item.rate || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                        ₹{(item.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 sticky bottom-0">
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-sm font-semibold text-gray-900 text-right"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      ₹
                      {itemsForModal
                        .reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end">
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={() => setShowItemsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPosProfileSelector && (
        <POSProfileSelector
          isOpen={showPosProfileSelector}
          onSelect={handlePOSProfileSelect}
        />
      )}
    </div>
  );
}