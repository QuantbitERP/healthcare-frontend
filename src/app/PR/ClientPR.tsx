"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef, use } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Button from "@/components/buttons/Button";
import Alerts from "@/components/alerts/Alerts";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import SelectInput from "@/components/form/Select";
import PageHeader from "@/components/PageHeader";
import RenderFormElement from "@/components/form/RenderFormElement";
import PatientRequisitionCard from "@/components/patientRequisitionCard/PatientRequisitionCard";
import { useFrappeApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/utils/sessionAuth";
import { Search, X, Plus } from 'lucide-react';
import { DataTable as EditableDataTable } from "@/components/EditableCellsTable/TableTry";
import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import SplashScreen from '@/components/SplashScreen/SplashScreen'; // New Import

// Define types (unchanged)
type SelectOption = { label: string; value: string };
type Warehouse = { label: string; value: string; name: string; warehouse_name: string };
type Branch = { label: string; value: string; name: string };
type Kit = { label: string; value: string; name: string; new_item_code: string };
type Classification = { label: string; value: string; name: string; classification_name: string };
type SelectedPatient = {
  registrationDate: string;
  name: string;
  age: string;
  sex: string;
  phone: string;
  ABHAID: string;
  doctor: string;
  mrn?: string;
  displayNo?: string;
  dept?: string;
  visitType?: string;
  company?: string;
  departmentName?: string;
  wardName?: string;
  bedName?: string;
  patientCategory?: string;
  visitId?: string;
  visitDateTime?: string;
  aadhaarNo?: string;
  uhid?: string;
};

interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  unit: string;
  stockQty: string;
  reqQty: string;
  kit: string;
  remark: string;
  expiryDate?: string;
  visitDateTime?: string;
  aadhaarNo?: string;
  custom_classification?: string; // Add custom_classification field for high-alert items
  custom_business_category?: string; // Add custom_business_category field for filtering by company
  // Critical category fields
  custom_is_hazardous?: number;
  custom_reserved_antibiotic?: number;
  custom_stent?: number;
  custom_consignment_items?: number;
  custom_narcotic_drug?: number;
  custom_tb_drug?: number;
  custom_lasa?: number;
  custom_emergency_drug?: number;
  custom_ndps?: number;
  custom_controled_drug?: number;
  custom_high_risk_drug?: number;
  custom_banned_drug?: number;
  custom_edrug?: number;
  custom_is_prescribed?: number;
  _skipHighAlertCheck?: boolean; // Add flag to bypass high-alert check in confirmation flow
}

interface ItemSearchProps {
  onSelectItem: (item: Item) => void;
  placeholder?: string;
  className?: string;
  selectedClassification?: string;
  isGeneric?: boolean;
  selectedCompany?: string; // Add selectedCompany to filter by business category
}

interface AlertState {
  show: boolean;
  variant: "success" | "warning" | "danger" | "primary" | "secondary";
  heading: string;
  content: string;
}

// EnhancedItemSearch component (unchanged)
const EnhancedItemSearch: React.FC<ItemSearchProps> = ({
  onSelectItem,
  placeholder = "Search Items",
  className = "",
  selectedClassification = "",
  isGeneric = false,
  selectedCompany = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const { } = useAuth();

  const API_BASE_URL = 'https://192.168.7.221:4422/api/resource';

  const searchItems = async (query: string = '', classification: string = '', generic: boolean = false, company: string = ''): Promise<Item[]> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const filters: any[] = [];
      if (query) {
        filters.push(["item_name", "like", `%${query}%`]);
      }
      if (classification) {
        filters.push(["custom_classification", "=", classification]);
      }
      if (generic) {
        filters.push(["custom_is_generic", "=", "1"]);
      }

      if (filters.length === 0) {
        return [];
      }

      const response = await fetch(
        `${API_BASE_URL}/Item?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=["name","item_name","stock_uom","custom_classification","custom_is_generic","custom_business_category","custom_is_hazardous","custom_reserved_antibiotic","custom_stent","custom_consignment_items","custom_narcotic_drug","custom_tb_drug","custom_lasa","custom_emergency_drug","custom_ndps","custom_controled_drug","custom_high_risk_drug","custom_banned_drug","custom_edrug","custom_is_prescribed"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Item API Response:', data);
        console.log('Total items returned:', data.data.length);

        let fetchedItems: Item[] = data.data.map((item: any, index: number) => {
          const unit = item.stock_uom || 'Unit';
          console.log(`Mapping item: ${item.item_name}, Unit: ${unit}, Classification: ${item.custom_classification}, Business Category: ${item.custom_business_category}`);
          console.log('Full item data:', item);
          return {
            id: item.name ? String(item.name.hashCode()) : String(index + Date.now()),
            itemCode: item.name || '',
            itemName: item.item_name || '',
            unit: unit,
            stockQty: '0',
            reqQty: '0',
            kit: '',
            remark: '',
            expiryDate: item.end_of_life || '',
            custom_classification: item.custom_classification || '',
            custom_business_category: item.custom_business_category || '',
            // Map critical category fields
            custom_is_hazardous: item.custom_is_hazardous || 0,
            custom_reserved_antibiotic: item.custom_reserved_antibiotic || 0,
            custom_stent: item.custom_stent || 0,
            custom_consignment_items: item.custom_consignment_items || 0,
            custom_narcotic_drug: item.custom_narcotic_drug || 0,
            custom_tb_drug: item.custom_tb_drug || 0,
            custom_lasa: item.custom_lasa || 0,
            custom_emergency_drug: item.custom_emergency_drug || 0,
            custom_ndps: item.custom_ndps || 0,
            custom_controled_drug: item.custom_controled_drug || 0,
            custom_high_risk_drug: item.custom_high_risk_drug || 0,
            custom_banned_drug: item.custom_banned_drug || 0,
            custom_edrug: item.custom_edrug || 0,
            custom_is_prescribed: item.custom_is_prescribed || 0,
          };
        });

        // Filter items by business category if company is selected
        if (company) {
          console.log('Filtering items by company:', company);
          console.log('Items before filtering:', fetchedItems.length);
          fetchedItems = fetchedItems.filter(item => {
            if (!item.custom_business_category) {
              console.log(`Item ${item.itemName}: No business category - HIDDEN`);
              return false; // Hide items with no business category
            }
            // Split business categories by comma and trim whitespace
            const categories = item.custom_business_category.split(',').map(cat => cat.trim());
            // Check if selected company matches any of the business categories
            const matches = categories.includes(company);
            console.log(`Item ${item.itemName}: categories=[${categories.join(', ')}], matches=${matches}`);
            return matches;
          });
          console.log('Items after filtering:', fetchedItems.length);
        }

        console.log('Mapped Items:', fetchedItems);
        return fetchedItems;
      } else {
        console.error('Item search failed:', response.status, response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error during item search:', error);
      return [];
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (selectedClassification || isGeneric || searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await searchItems(searchTerm, selectedClassification, isGeneric, selectedCompany);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setHighlightedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedClassification, isGeneric, selectedCompany]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectItem(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectItem = (item: Item) => {
    console.log('Selected item:', item);
    onSelectItem(item);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-blue-200 text-blue-900 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || selectedClassification || isGeneric) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          autoComplete="off"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}

        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {suggestions.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                Found {suggestions.length} item{suggestions.length !== 1 ? 's' : ''}
              </div>
              <ul ref={suggestionsRef} className="max-h-64 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <li
                    key={item.id}
                    className={`px-3 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${index === highlightedIndex
                      ? 'bg-blue-50 border-blue-100'
                      : 'hover:bg-gray-50'
                      }`}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {highlightMatch(item.itemName, searchTerm)}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {item.unit || 'Unit'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Code: {highlightMatch(item.itemCode, searchTerm)}</span>
                          <span>Stock: {item.stockQty}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              {selectedClassification || isGeneric
                ? 'No items found for selected filters'
                : 'Select a classification or generic to see items'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Add String.prototype.hashCode (unchanged)
declare global {
  interface String {
    hashCode(): number;
  }
}

if (!String.prototype.hashCode) {
  String.prototype.hashCode = function () {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };
}

// ---------------------------------------------------------------------
// Helper: fetch stock qty for a single item/warehouse pair
// ---------------------------------------------------------------------
const useStockQty = () => {
  const { apiKey, apiSecret } = useAuth();

  return useCallback(
    async (itemCode: string, warehouse: string): Promise<string> => {
      if (!itemCode || !warehouse) return "0";

      try {
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;
        const csrf = localStorage.getItem("csrfToken");
        if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;

        const response = await fetch(
          `https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.material_request.get_stock_qty`,
          {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({
              item_code: itemCode,
              warehouse: warehouse,
            }),
          }
        );

        if (!response.ok) throw new Error("Stock call failed");

        const data = await response.json();
        // The custom method returns a plain number (or 0)
        return String(data.message ?? 0);
      } catch (err) {
        console.error("stock qty error:", err);
        return "0";
      }
    },
    [apiKey, apiSecret]
  );
};

export default function ClientPR({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const router = useRouter();
  const params = use(searchParams);
  const { fetchDepartment, fetchBranches, fetchKits, fetchClassifications } = useFrappeApi();
  const { isAuthenticated, apiKey, apiSecret, currentUser } = useAuth();

  // State for form fields
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [requisitionDate, setRequisitionDate] = useState<Date | undefined>(new Date());
  const [requisitionNo, setRequisitionNo] = useState("");
  const [requisitionFrom, setRequisitionFrom] = useState("");
  const [requisitionTo, setRequisitionTo] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedKit, setSelectedKit] = useState("");
  const [selectedSaleType, setSelectedSaleType] = useState("");
  const [_showPatientCard, setShowPatientCard] = useState(false);
  const [patientData, setPatientData] = useState<SelectedPatient | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [isGeneric, setIsGeneric] = useState(false);

  // Critical category dialog state
  const [criticalCategoryDialog, setCriticalCategoryDialog] = useState<{
    show: boolean;
    item: Item | null;
    categories: string[];
  }>({ show: false, item: null, categories: [] });

  // Handle barcode scanning
  const handleBarcodeScan = async (scannedBarcode: string) => {
    try {
      // Fetch batch details using the barcode
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`${API_BASE_URL}/Batch/${scannedBarcode}`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        showAlert('danger', 'Error', `Batch not found for barcode: ${scannedBarcode}`);
        setBarcodeValue(''); // Clear barcode input
        return;
      }

      const batchData = await response.json();
      const batch = batchData.data;

      if (!batch) {
        showAlert('danger', 'Error', `Batch not found for barcode: ${scannedBarcode}`);
        setBarcodeValue('');
        return;
      }

      // Check if batch has stock in selected warehouse
      // Use the same authentication logic as other functions
      // const authHeaders = getAuthHeaders();
      // // Convert HeadersInit to plain object for fetch compatibility
      // const headers = typeof authHeaders === 'string' ? 
      //   JSON.parse(authHeaders) : 
      //   Array.isArray(authHeaders) ? 
      //     Object.fromEntries(authHeaders) : 
      //     authHeaders;

      const batchQtyResponse = await fetch(`https://192.168.7.221:4422/api/method/erpnext.stock.utils.get_stock_balance`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          item_code: batch.item,
          warehouse: warehouses[0]?.name || '', // Use first available warehouse
          batch_no: batch.name,
        }),
      });

      let stockQty = 0;
      if (batchQtyResponse.ok) {
        const stockData = await batchQtyResponse.json();
        stockQty = stockData.message?.[0]?.actual_qty || 0;
      }

      // Fetch item details
      const itemResponse = await fetch(`${API_BASE_URL}/Item/${batch.item}`, {
        headers,
        credentials: 'include',
      });

      if (!itemResponse.ok) {
        showAlert('danger', 'Error', `Item not found: ${batch.item}`);
        setBarcodeValue('');
        return;
      }

      const itemData = await itemResponse.json();
      const item = itemData.data;

      // Check if item already exists in the table
      const existingItemIndex = items.findIndex(
        (item) => item.itemCode === batch.item
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...items];
        const currentQty = parseInt(updatedItems[existingItemIndex].reqQty) || 0;
        updatedItems[existingItemIndex].reqQty = (currentQty + 1).toString();
        updatedItems[existingItemIndex].stockQty = stockQty.toString();

        setItems(updatedItems);
      } else {
        // Create new item
        const newItem: Item = {
          id: Date.now().toString(),
          itemCode: batch.item,
          itemName: batch.item_name || item.item_name,
          unit: item.stock_uom || 'Nos',
          stockQty: stockQty.toString(),
          reqQty: '1',
          kit: '',
          remark: '',
          expiryDate: batch.expiry_date || '',
          custom_classification: item.custom_classification,
          custom_business_category: item.custom_business_category,
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
      }

      showAlert('success', 'Success', `Item ${batch.item_name} added to requisition`);
      setBarcodeValue(''); // Clear barcode input after successful addition

    } catch (error) {
      console.error('Error processing barcode:', error);
      showAlert('danger', 'Error', 'Failed to process barcode');
      setBarcodeValue('');
    }
  };

  useEffect(() => {
    if (barcodeValue && barcodeValue.trim()) {
      handleBarcodeScan(barcodeValue.trim());
    }
  }, [barcodeValue]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 7000); // Show splash screen for at least 7 seconds

    return () => clearTimeout(timer);
  }, []);

  const [patientRemark, setPatientRemark] = useState("");
  const [initialLoading, setInitialLoading] = useState(true); // New state for splash screen
  const [docstatus, setDocstatus] = useState<number>(0); // 0=Draft, 1=Submitted, 2=Cancelled
  const [_isAmendMode, setIsAmendMode] = useState(false); // Track if in amend mode
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: "success",
    heading: "",
    content: ""
  });

  // High-alert confirmation dialog state
  const [showHighAlertDialog, setShowHighAlertDialog] = useState(false);
  const [highAlertItem, setHighAlertItem] = useState<Item | null>(null);
  const [pendingItem, setPendingItem] = useState<Item | null>(null);
  const [pendingQtyIncrement, setPendingQtyIncrement] = useState<number>(0);

  // Priority checkboxes state
  const [priorities, setPriorities] = useState({
    routine: false,
    stat: false,
    discharge: false,
    asap: false,
    expired: false,
  });

  // State for API data
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [_loading, setLoading] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingRequisition, setIsLoadingRequisition] = useState<boolean>(false);

  // Track last added kit
  const lastAddedKit = useRef<string>("");

  // Search type options
  const selectOptions: SelectOption[] = [
    { label: "", value: "CLEAR" }, // Use special value instead of empty string
    { label: "UHID", value: "uhid" },
    { label: "Aadhaar No", value: "aadharCardNo" },
    { label: "Mobile No", value: "mobile" },
    { label: "Full Name", value: "fullName" },
  ];

  // Sale type options
  const saleTypeOptions: SelectOption[] = [
    { label: "", value: "CLEAR" }, // Use special value instead of empty string
    { label: "Cash", value: "cash" },
    { label: "Company", value: "company" },
  ];

  // Show alert function
  const showAlert = (variant: AlertState['variant'], heading: string, content: string) => {
    setAlert({
      show: true,
      variant,
      heading,
      content
    });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fetch default department
  const fetchDefaultDepartment = async (): Promise<string | null> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `https://192.168.7.221:4422/api/method/quantbit_hims_integration.api.pos_api.get_user_default_department`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        const defaultDepartment = data.message;
        if (defaultDepartment) {
          console.log('Default Department fetched:', defaultDepartment);
          return defaultDepartment;
        }
        console.log('No default department found for the user');
        return null;
      } else {
        console.error('Failed to fetch default department:', response.status, response.statusText);
        showAlert('danger', 'Error', `Failed to fetch default department: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching default department:', error);
      showAlert('danger', 'Error', 'Error fetching default department. Please check your connection and try again.');
      return null;
    }
  };

  // Fetch default branch
  const fetchDefaultBranch = async (): Promise<string | null> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `https://192.168.7.221:4422/api/method/quantbit_hims_integration.api.pos_api.get_user_default_branch`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      console.log('fetchDefaultBranch Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('fetchDefaultBranch Data:', data);
        const defaultBranch = data.message;
        if (defaultBranch) {
          console.log('Default Branch fetched:', defaultBranch);
          return defaultBranch;
        }
        console.log('No default branch set; skipping branch assignment');
        return null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching default branch:', error);
      showAlert('danger', 'Error', 'Error fetching default branch. Please check your connection and try again.');
      return null;
    }
  };

  // Updated useEffect to set default department and branch
  useEffect(() => {
    const setDefaultValues = async () => {
      if (isAuthenticated && !requisitionNo && (!requisitionFrom || !requisitionTo || !toLocation)) {
        if (!requisitionFrom || !requisitionTo) {
          const defaultDepartment = await fetchDefaultDepartment();
          if (defaultDepartment) {
            const isValidDepartment = warehouses.some(w => w.value === defaultDepartment);
            if (isValidDepartment) {
              if (!requisitionFrom) setRequisitionFrom(defaultDepartment);
              if (!requisitionTo) setRequisitionTo(defaultDepartment);
            } else {
              console.warn(`Default department ${defaultDepartment} not found in warehouses`);
              showAlert("warning", "Warning", `Default department ${defaultDepartment} is not a valid warehouse. Please select a department manually.`);
            }
          } else {
            console.log('No default department set; skipping department assignment');
          }
        }

        if (!toLocation) {
          const defaultBranch = await fetchDefaultBranch();
          if (defaultBranch) {
            const isValidBranch = branches.some(b => b.value === defaultBranch);
            if (isValidBranch) {
              setToLocation(defaultBranch);
            } else {
              console.warn(`Default branch ${defaultBranch} not found in branches`);
              showAlert("warning", "Warning", `Default branch ${defaultBranch} is not a valid branch. Please select a branch manually.`);
            }
          } else {
            console.log('No default branch set; skipping branch assignment');
          }
        }
      }
    };

    if (warehouses.length > 0 && branches.length > 0) {
      setDefaultValues();
    }
  }, [isAuthenticated, requisitionNo, requisitionFrom, requisitionTo, toLocation, warehouses, branches, apiKey, apiSecret]);

  const fetchStockQty = useStockQty();

  // ---------------------------------------------------------------------
  // Centralised “add-or-update” logic (search, kit, barcode)
  // ---------------------------------------------------------------------
  // Helper function to check for high-alert classifications
  const checkHighAlertClassification = (item: Item): boolean => {
    const highAlertClassifications = ["Control drug", "NDPS", "Reserve Antibiotic", "LASA"];
    const classification = item.custom_classification || "";
    const isHighAlert = highAlertClassifications.includes(classification);
    console.log('Checking high-alert classification:', {
      itemCode: item.itemCode,
      itemName: item.itemName,
      classification,
      isHighAlert
    });
    return isHighAlert;
  };

  // Helper function to check for critical categories
  const checkCriticalCategories = (item: Item): { isCritical: boolean; categories: string[] } => {
    const criticalFields = [
      { field: 'custom_is_hazardous', label: 'Hazardous' },
      { field: 'custom_reserved_antibiotic', label: 'Reserved Antibiotic' },
      { field: 'custom_stent', label: 'Stent' },
      { field: 'custom_consignment_items', label: 'Consignment Items' },
      { field: 'custom_narcotic_drug', label: 'Narcotic Drug' },
      { field: 'custom_tb_drug', label: 'TB Drug' },
      { field: 'custom_lasa', label: 'LASA' },
      { field: 'custom_emergency_drug', label: 'Emergency Drug' },
      { field: 'custom_ndps', label: 'NDPS' },
      { field: 'custom_controled_drug', label: 'Controlled Drug' },
      { field: 'custom_high_risk_drug', label: 'High Risk Drug' },
      { field: 'custom_banned_drug', label: 'Banned Drug' },
      { field: 'custom_edrug', label: 'E-Drug' },
      { field: 'custom_is_prescribed', label: 'Prescribed Drug' }
    ];

    const activeCategories: string[] = [];

    criticalFields.forEach(({ field, label }) => {
      if (item[field as keyof Item] === 1) {
        activeCategories.push(label);
      }
    });

    const isCritical = activeCategories.length > 0;

    console.log('Checking critical categories:', {
      itemCode: item.itemCode,
      itemName: item.itemName,
      isCritical,
      categories: activeCategories
    });

    return { isCritical, categories: activeCategories };
  };

  // Handler functions for critical category dialog
  const handleCriticalCategoryConfirm = async () => {
    if (criticalCategoryDialog.item) {
      // Add the _skipHighAlertCheck flag to bypass the check on retry
      const itemToAdd = { ...criticalCategoryDialog.item, _skipHighAlertCheck: true };
      await upsertItemWithStock(itemToAdd, 1);
    }
    setCriticalCategoryDialog({ show: false, item: null, categories: [] });
  };

  const handleCriticalCategoryCancel = () => {
    setCriticalCategoryDialog({ show: false, item: null, categories: [] });
  };

  const upsertItemWithStock = async (baseItem: Item, qtyIncrement: number = 1) => {
    console.log('upsertItemWithStock called:', { baseItem, qtyIncrement, isLoadingRequisition });

    // Check for high-alert classification
    if (checkHighAlertClassification(baseItem)) {
      // Store the pending item and show custom dialog
      setPendingItem(baseItem);
      setPendingQtyIncrement(qtyIncrement);
      setHighAlertItem(baseItem);
      setShowHighAlertDialog(true);
      return; // Wait for user confirmation
    }

    // Check for critical categories and show confirmation dialog
    const { isCritical, categories } = checkCriticalCategories(baseItem);
    if (isCritical && !baseItem._skipHighAlertCheck) {
      setCriticalCategoryDialog({
        show: true,
        item: baseItem,
        categories: categories
      });
      return; // Wait for user confirmation
    }

    // 1. If we already have the item, just bump the requested qty
    const existingIdx = items.findIndex((i) => i.itemCode === baseItem.itemCode);
    if (existingIdx > -1) {
      const updated = [...items];
      const newReq = Number(updated[existingIdx].reqQty) + qtyIncrement;
      console.log('Updating existing item:', {
        itemCode: baseItem.itemCode,
        currentQty: updated[existingIdx].reqQty,
        increment: qtyIncrement,
        newQty: newReq
      });
      updated[existingIdx].reqQty = String(newReq);

      // 2. Refresh stock (in case the warehouse changed)
      const newStock = await fetchStockQty(updated[existingIdx].itemCode, requisitionFrom);
      updated[existingIdx].stockQty = newStock;

      setItems(updated);
      showAlert("success", "Success", `${baseItem.itemName} quantity updated (stock: ${newStock})`);
      return;
    }

    // 3. New item - get stock
    const stock = await fetchStockQty(baseItem.itemCode, requisitionFrom);

    // 4. Only set kit name if the item is actually from a kit (baseItem.kit is not empty)
    // Don't automatically assign selectedKit to manually added items
    const newItem: Item = {
      ...baseItem,
      id: baseItem.itemCode ? String(baseItem.itemCode.hashCode()) : String(Date.now()),
      reqQty: String(qtyIncrement),
      stockQty: stock,
      kit: baseItem.kit || "", // Only use kit name from baseItem, not selectedKit
      remark: baseItem.remark || "",
    };

    setItems((prev) => [...prev, newItem]);
    showAlert("success", "Success", `${baseItem.itemName} added (stock: ${stock})`);
  };

  // Rest of the component
  const handleRemoveItemFromDetails = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    showAlert("success", "Success", "Item removed successfully");
  };

  const handleUpdateQuantity = (itemId: string, newQty: string) => {
    console.log('handleUpdateQuantity called:', { itemId, newQty });
    if (Number(newQty) <= 0) {
      handleRemoveItemFromDetails(itemId);
      return;
    }
    setItems(prevItems => {
      const updated = prevItems.map(item =>
        item.id === itemId ? { ...item, reqQty: newQty } : item
      );
      console.log('Items updated:', updated);
      return updated;
    });
    showAlert("success", "Success", "Quantity updated successfully");
  };

  // High-alert dialog handlers
  const handleHighAlertConfirm = async () => {
    if (pendingItem && pendingQtyIncrement !== undefined) {
      console.log("User confirmed high-alert item, proceeding with:", pendingItem);

      // Proceed with adding the item (bypass the high-alert check this time)
      const existingIdx = items.findIndex((i) => i.itemCode === pendingItem.itemCode);
      if (existingIdx > -1) {
        const updated = [...items];
        const newReq = Number(updated[existingIdx].reqQty) + pendingQtyIncrement;
        updated[existingIdx].reqQty = String(newReq);

        const newStock = await fetchStockQty(updated[existingIdx].itemCode, requisitionFrom);
        updated[existingIdx].stockQty = newStock;

        setItems(updated);
        showAlert("success", "Success", `${pendingItem.itemName} quantity updated (stock: ${newStock})`);
      } else {
        const stock = await fetchStockQty(pendingItem.itemCode, requisitionFrom);
        const newItem: Item = {
          ...pendingItem,
          id: pendingItem.itemCode ? String(pendingItem.itemCode.hashCode()) : String(Date.now()),
          reqQty: String(pendingQtyIncrement),
          stockQty: stock,
          kit: pendingItem.kit || "",
          remark: pendingItem.remark || "",
        };

        setItems((prev) => [...prev, newItem]);
        showAlert("success", "Success", `${pendingItem.itemName} added (stock: ${stock})`);
      }
    }

    // Reset dialog state
    setShowHighAlertDialog(false);
    setHighAlertItem(null);
    setPendingItem(null);
    setPendingQtyIncrement(0);
  };

  const handleHighAlertCancel = () => {
    console.log("User cancelled adding high-alert item");
    setShowHighAlertDialog(false);
    setHighAlertItem(null);
    setPendingItem(null);
    setPendingQtyIncrement(0);
  };

  const columns: ColumnDef<Item, any>[] = useMemo(
    () => [
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "itemName", header: "Item Name" },
      { accessorKey: "unit", header: "Unit" },
      // {
      //   accessorKey: "stockQty",
      //   header: "Stock Qty",
      //   cell: ({ row }) => (
      //     <span className={row.original.stockQty === "0" ? "text-gray-400" : ""}>
      //       {row.original.stockQty || "–"}
      //     </span>
      //   ),
      // },
      {
        accessorKey: "reqQty",
        header: "Required Qty",
        cell: ({ row }) => (
          <input
            type="number"
            min={0}
            defaultValue={row.original.reqQty ?? ""}
            onBlur={(e) => {
              const v = Math.max(0, Math.floor(Number(e.target.value) || 0));
              handleUpdateQuantity(row.original.id, String(v));
            }}
            placeholder="0"
            className="w-[50px]"
          />
        ),
      },
      { accessorKey: "kit", header: "Kit" },
      { accessorKey: "remark", header: "Remark" },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            onClick={() => handleRemoveItemFromDetails(row.original.id)}
            size="button-small"
            type="secondary-button"
          >
            Remove
          </Button>
        ),
      }
    ],
    [handleRemoveItemFromDetails, handleUpdateQuantity]
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const API_BASE_URL = "http://192.168.7.196:8085/masterdata/search-patient";
  const FRAPPE_API_BASE_URL = "https://192.168.7.221:4422/api/resource";

  const fetchRequisitionData = async (requisitionNo: string) => {
    try {
      setIsLoadingRequisition(true);
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `${FRAPPE_API_BASE_URL}/Patient Requisition/${requisitionNo}?fields=["*"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch requisition: ${response.statusText}`);
      }

      const data = await response.json();
      const requisition = data.data;

      setRequisitionNo(requisition.name || "");
      setRequisitionDate(new Date(requisition.requisition_date_time));
      setRequisitionFrom(requisition.requisition_from || "");
      setRequisitionTo(requisition.requisition_to || "");
      setToLocation(requisition.to_location || "");
      const loadedKit = requisition.kit || "";
      console.log('Loading requisition with kit:', loadedKit);
      setSelectedKit(loadedKit);
      if (loadedKit) {
        console.log('Setting lastAddedKit.current to loaded kit to prevent kit loading:', loadedKit);
        lastAddedKit.current = loadedKit;
      }
      setSelectedSaleType(requisition.sale_type || "");
      setSelectedClassification(requisition.classification || "");
      setIsGeneric(requisition.generic === "1");
      setPatientRemark(requisition.remarks || requisition.remark || "");
      console.log("Loading remark:", requisition.remarks, requisition.remark);
      setDocstatus(requisition.docstatus || 0); // Capture docstatus
      setIsAmendMode(false); // Reset amend mode
      setPriorities({
        routine: requisition.routine === 1,
        stat: requisition.stat === 1,
        discharge: requisition.discharge === 1,
        asap: requisition.asap === 1,
        expired: requisition.expired === 1,
      });

      const patient: SelectedPatient = {
        name: requisition.full_name || "N/A",
        age: requisition.age || "N/A",
        sex: requisition.gender || "N/A",
        phone: requisition.mobile_number || "N/A",
        ABHAID: requisition.aadhar_no || "N/A",
        doctor: requisition.consulting_doctor || requisition.doctor || "N/A",
        mrn: requisition.patient_id || "N/A",
        visitType: requisition.visit_type || "N/A",
        company: requisition.patient_company || "N/A",
        departmentName: requisition.department || "N/A",
        wardName: requisition.ward || "N/A",
        bedName: requisition.bed_name || "N/A",
        patientCategory: requisition.patient_category || "N/A",
        visitId: requisition.visit_id || "N/A",
        visitDateTime: requisition.visit_datetime || "N/A",
        registrationDate: requisition.registration_date || "N/A",
        uhid: requisition.patient_id || "N/A",
        aadhaarNo: requisition.aadhar_no || "N/A",
      };
      setPatientData(patient);
      setShowPatientCard(true);
      setSearchValue(`${patient.name} (${patient.mrn})`);

      const requisitionItems = requisition.patient_requisition_item_details || [];
      console.log('Loading requisition items:', requisitionItems);
      const itemsData: Item[] = requisitionItems.map((item: any, index: number) => {
        // Ensure we're getting the correct quantity field from the API response
        const reqQty = item.req_qty || item.qty || 0;
        console.log('Mapping item:', { itemCode: item.item_code, reqQty, originalReqQty: item.req_qty });
        return {
          id: item.item_code ? String(item.item_code.hashCode()) : String(index + Date.now()),
          itemCode: item.item_code || "",
          itemName: item.item_name || "",
          unit: item.unit || "",
          stockQty: item.stock_qty || "0",
          reqQty: String(Number(reqQty) || 0), // Ensure it's a valid number and convert to string
          kit: item.kit || "",
          remark: item.remark || "",
        };
      });
      console.log('Final items data to set:', itemsData);
      console.log('Setting items with quantities:', itemsData.map(item => ({ itemCode: item.itemCode, reqQty: item.reqQty })));
      setItems(itemsData);

      // Log immediately after setting to verify
      setTimeout(() => {
        console.log('Items immediately after setItems:', items.map(item => ({ itemCode: item.itemCode, reqQty: item.reqQty })));
      }, 100);

      showAlert("success", "Success", "Requisition loaded successfully");
    } catch (error) {
      console.error("Error fetching requisition:", error);
      showAlert("danger", "Error", "Failed to load requisition data");
    } finally {
      setIsLoadingRequisition(false);
    }
  };

  useEffect(() => {
    const requisitionNo = params.requisitionNo;
    if (requisitionNo) {
      fetchRequisitionData(requisitionNo);
    }
  }, [params]);

  const savePatientRequisition = async (isFinalize: boolean = false): Promise<string | false> => {
    if (!patientData) {
      showAlert("danger", "Error", "Please select a patient first.");
      return false;
    }

    if (!requisitionDate || !requisitionFrom || !requisitionTo || !toLocation || !selectedSaleType) {
      showAlert("warning", "Warning", "Please fill all required fields.");
      return false;
    }

    if (items.length === 0) {
      showAlert("warning", "Warning", "Please add at least one item to the requisition.");
      return false;
    }

    // Validate patientRemark for small text field (max 255 characters)
    const trimmedRemark = patientRemark.trim();
    if (trimmedRemark.length > 255) {
      showAlert("warning", "Warning", "Remark cannot exceed 255 characters.");
      return false;
    }

    setIsSaving(true);

    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const formattedDateTime = requisitionDate ?
        `${requisitionDate.toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}` :
        `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}`;

      const formattedDate = requisitionDate ?
        requisitionDate.toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0];

      const requisitionData = {
        doctype: "Patient Requisition",
        full_name: patientData.name,
        mobile_number: patientData.phone,
        patient_company: patientData.company || "",
        department: patientData.departmentName || "",
        patient_id: patientData.mrn || "",
        visit_datetime: patientData.visitDateTime || "",
        visit_type: patientData.visitType || "OPD",
        patient_category: patientData.patientCategory || "Regular",
        consulting_doctor: patientData.doctor,
        doctor: patientData.doctor,
        age: patientData.age,
        visit_id: patientData.visitId || "",
        gender: patientData.sex,
        is_requisition: 1,
        requisition_from: requisitionFrom,
        requisition_to: requisitionTo,
        to_location: toLocation,
        kit: selectedKit || "",
        generic: isGeneric ? "1" : "0",
        requisition_date_time: formattedDateTime,
        classification: selectedClassification || "",
        sale_type: selectedSaleType,
        routine: priorities.routine ? 1 : 0,
        stat: priorities.stat ? 1 : 0,
        discharge: priorities.discharge ? 1 : 0,
        asap: priorities.asap ? 1 : 0,
        expired: priorities.expired ? 1 : 0,
        docstatus: isFinalize ? 1 : 0,
        requisition_date: formattedDate,
        bed_name: patientData.bedName || "",
        ward: patientData.wardName || "",
        aadhar_no: patientData.aadhaarNo || "",
        registration_date: patientData.registrationDate,
        remark: trimmedRemark,
        patient_requisition_item_details: items.map(item => ({
          item_code: item.itemCode,
          item_name: item.itemName,
          unit: item.unit,
          stock_qty: item.stockQty || "0",
          req_qty: parseInt(item.reqQty) || 0,
          kit: item.kit || "", // Only use kit value from item, not selectedKit
          instruction_of_language: "EN",
          remark: item.remark
        })),
      };

      console.log('Saving requisition data:', requisitionData);

      const response = await fetch(
        `${FRAPPE_API_BASE_URL}/Patient Requisition${requisitionNo ? `/${requisitionNo}` : ''}`,
        {
          method: requisitionNo ? 'PUT' : 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(requisitionData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.data) {
        if (!requisitionNo) {
          setRequisitionNo(responseData.data.name);
        }
        console.log('Saved requisition:', responseData.data);
        showAlert("success", "Success", `Patient Requisition ${isFinalize ? 'finalized' : requisitionNo ? 'updated' : 'saved'} successfully! Document: ${responseData.data.name}`);
        return responseData.data.name;
      } else {
        console.error('Save failed:', responseData);
        let errorMessage = `Failed to ${isFinalize ? 'finalize' : requisitionNo ? 'update' : 'save'} Patient Requisition. Please try again.`;
        if (responseData._server_messages) {
          try {
            const serverMessages = JSON.parse(responseData._server_messages);
            if (serverMessages.length > 0) {
              const messageObj = JSON.parse(serverMessages[0]);
              console.error("Server error message for remarks:", messageObj.message);
              errorMessage = messageObj.message || errorMessage;
            }
          } catch (e) {
            console.log('Could not parse server messages:', e);
          }
        }
        showAlert("danger", "Error", errorMessage);
        return false;
      }
    } catch (error) {
      console.error(`Error ${isFinalize ? 'finalizing' : requisitionNo ? 'updating' : 'saving'} Patient Requisition:`, error);
      showAlert("danger", "Error", `Error ${isFinalize ? 'finalizing' : requisitionNo ? 'updating' : 'saving'} Patient Requisition. Please check your connection and try again.`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await savePatientRequisition(false);
  };

  const handleFinalize = async () => {
    const docName = await savePatientRequisition(true);
    if (docName) {
      const printUrl = `https://192.168.7.221:4422/printview?doctype=Patient%20Requisition&name=${encodeURIComponent(docName)}&trigger_print=1&format=Patient%20Requisition&no_letterhead=0&letterhead=City%20Hospital&settings=%7B%7D&_lang=en`;
      window.location.href = printUrl;
    }
  };

  const handleReset = async () => {
    setSelectedValue("");
    setSearchValue("");
    setRequisitionDate(new Date());
    setRequisitionNo("");
    const defaultDepartment = await fetchDefaultDepartment();
    if (defaultDepartment && warehouses.some(w => w.value === defaultDepartment)) {
      setRequisitionFrom(defaultDepartment);
      setRequisitionTo(defaultDepartment);
    } else {
      setRequisitionFrom("");
      setRequisitionTo("");
    }
    const defaultBranch = await fetchDefaultBranch();
    if (defaultBranch && branches.some(b => b.value === defaultBranch)) {
      setToLocation(defaultBranch);
    } else {
      setToLocation("");
    }
    setSelectedKit("");
    setSelectedSaleType("");
    setSelectedClassification("");
    setBarcodeValue("");
    setIsGeneric(false);
    setPatientRemark("");
    setPatientData(null);
    setSearchResults([]);
    setShowDropdown(false);
    setShowPatientCard(false);
    setItems([]);
    setPriorities({
      routine: false,
      stat: false,
      discharge: false,
      asap: false,
      expired: false,
    });
    showAlert("success", "Success", "Form reset successfully");
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setPriorities(prev => {
      if (checked) {
        const newPriorities = Object.keys(prev).reduce((acc, key) => {
          acc[key as keyof typeof prev] = key === priority;
          return acc;
        }, {} as typeof prev);
        return newPriorities;
      } else {
        return {
          ...prev,
          [priority]: false
        };
      }
    });
  };

  const fetchPatientDetails = async (mrn: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await axios.get(`http://192.168.7.196:8085/masterdata/patient-details?mrn=${mrn}`, {
        headers,
        withCredentials: true,
      });
      console.log("Patient Details API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch patient details:", error);
      showAlert("danger", "Error", "Failed to fetch additional patient details.");
      return null;
    }
  };

  const searchPatients = useCallback(
    debounce(async (value: string, searchType: string) => {
      if (value.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        console.log("Search value too short, clearing results");
        return;
      }

      setIsLoading(true);

      try {
        const queryParams = new URLSearchParams({
          [searchType === "uhid" ? "UHID" : searchType === "mobile" ? "MobileNo" : searchType === "fullName" ? "FullName" : "aadharCardNo"]: value,
          PageIndex: "1",
          PageSize: "10",
          IsExpired: "false",
        });

        const response = await axios.get(`${API_BASE_URL}?${queryParams}`);
        const patients = response.data.searchPatientDTO || [];
        console.log("API response:", response.data);
        setSearchResults(patients);
        setShowDropdown(patients.length > 0);
      } catch (error) {
        console.error("Patient search failed:", error);
        showAlert("danger", "Error", "Search failed. Please try again.");
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSelectChange = (value: string) => {
    if (value === "CLEAR") {
      setSelectedValue(""); // Clear selection
      setSearchResults([]);
      setShowDropdown(false);
      console.log("Search field cleared");
      return;
    }

    if (selectOptions.some((option) => option.value === value)) {
      setSelectedValue(value);
      setSearchResults([]);
      setShowDropdown(false);
      console.log("Search field changed:", value);
      if (searchValue) {
        searchPatients(searchValue, value);
      }
    } else {
      setSelectedValue("");
      showAlert("warning", "Warning", "Invalid search field selected.");
    }
  };

  // Handler functions for dropdowns with clear functionality
  const handleKitChange = (value: string) => {
    if (value === "CLEAR") {
      setSelectedKit(""); // Clear selection
      return;
    }
    setSelectedKit(value);
  };

  const handleSaleTypeChange = (value: string) => {
    if (value === "CLEAR") {
      setSelectedSaleType(""); // Clear selection
      return;
    }
    setSelectedSaleType(value);
  };

  const handleClassificationChange = (value: string) => {
    if (value === "CLEAR") {
      setSelectedClassification(""); // Clear selection
      return;
    }
    setSelectedClassification(value);
  };

  const handleRequisitionFromChange = (value: string) => {
    if (value === "CLEAR") {
      setRequisitionFrom(""); // Clear selection
      return;
    }
    setRequisitionFrom(value);
  };

  const handleRequisitionToChange = (value: string) => {
    if (value === "CLEAR") {
      setRequisitionTo(""); // Clear selection
      return;
    }
    setRequisitionTo(value);
  };

  const handleToLocationChange = (value: string) => {
    if (value === "CLEAR") {
      setToLocation(""); // Clear selection
      return;
    }
    setToLocation(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    console.log("Search value:", value, "Selected value:", selectedValue);
    if (selectedValue) {
      searchPatients(value, selectedValue);
    } else {
      showAlert("warning", "Warning", "Please select a search field (e.g., UHID, Full Name).");
    }
  };

  const handleSelectPatient = async (patient: any) => {
    const newPatientData: SelectedPatient = {
      name: patient.patientFullName || "N/A",
      age: patient.ageDisplay || "N/A",
      sex: patient.genderValue || "N/A",
      phone: patient.mobileNo || "N/A",
      ABHAID: patient.aadharCardNo || "N/A",
      doctor: patient.consultingDoctor || "N/A",
      mrn: patient.mrn || "N/A",
      displayNo: patient.displayNo || "N/A",
      dept: patient.departmentName || "N/A",
      visitType: patient.patientVisitType || "N/A",
      company: patient.patientCompany || "N/A",
      departmentName: patient.departmentName || "N/A",
      wardName: patient.wardName || "N/A",
      bedName: patient.bedName || "N/A",
      patientCategory: patient.patientCategory || "N/A",
      visitId: patient.visitID || patient.visitId || "N/A",
      aadhaarNo: patient.aadharCardNo || "N/A",
      visitDateTime: patient.visitDateTime || "N/A",
      registrationDate: patient.registrationDate || "N/A",
      uhid: patient.mrn || "N/A",
    };

    if (
      patient.mrn &&
      (!patient.patientCategory ||
        !patient.departmentName ||
        !patient.wardName ||
        !patient.bedName ||
        !patient.visitID)
    ) {
      const details = await fetchPatientDetails(patient.mrn);
      if (details) {
        newPatientData.patientCategory = details.patientCategory || newPatientData.patientCategory;
        newPatientData.visitId = details.visitID || details.visitId || newPatientData.visitId;
        newPatientData.departmentName = details.departmentName || newPatientData.departmentName;
        newPatientData.wardName = details.wardName || newPatientData.wardName;
        newPatientData.bedName = details.bedName || newPatientData.bedName;
        if (!details.visitID && !details.visitId) {
          showAlert("warning", "Warning", "Visit ID not available from patient details API.");
        }
      }
    }

    setPatientData(newPatientData);
    setSearchValue(`${patient.patientFullName} (${patient.mrn})`);
    setShowDropdown(false);
    setShowPatientCard(true);
    console.log("Selected patient data:", newPatientData);
    showAlert("success", "Success", "Patient selected successfully");
  };

  const handleAddItemToDetails = async (item: Item) => {
    await upsertItemWithStock(item, 1);
  };

  useEffect(() => {
    console.log('Kit useEffect triggered:', { selectedKit, lastAddedKit: lastAddedKit.current, isLoadingRequisition });
    if (selectedKit && selectedKit !== lastAddedKit.current && !isLoadingRequisition) {
      console.log('Kit useEffect proceeding to fetch kit items');
      const fetchKitItems = async () => {
        try {
          // Use the same authentication logic as other functions
          const authHeaders = getAuthHeaders();
          // Convert HeadersInit to plain object for fetch compatibility
          const headers = typeof authHeaders === 'string' ?
            JSON.parse(authHeaders) :
            Array.isArray(authHeaders) ?
              Object.fromEntries(authHeaders) :
              authHeaders;

          const bundleResponse = await fetch(
            `${FRAPPE_API_BASE_URL}/Product%20Bundle/${encodeURIComponent(selectedKit)}`,
            {
              method: 'GET',
              headers,
              mode: 'cors',
              cache: 'no-cache',
            }
          );

          if (!bundleResponse.ok) {
            throw new Error('Failed to fetch kit details');
          }

          const bundleData = await bundleResponse.json();
          const bundleItems = bundleData.data.items || [];

          const kitItemsToAdd: Item[] = [];

          for (const bItem of bundleItems) {
            const itemResponse = await fetch(
              `${FRAPPE_API_BASE_URL}/Item/${encodeURIComponent(bItem.item_code)}?fields=${encodeURIComponent(JSON.stringify(["item_name", "stock_uom"]))}`,
              {
                method: 'GET',
                headers,
                mode: 'cors',
                cache: 'no-cache',
              }
            );

            if (!itemResponse.ok) {
              console.error(`Failed to fetch item ${bItem.item_code}`);
              continue;
            }

            const itemData = (await itemResponse.json()).data;

            const newItem: Item = {
              id: bItem.item_code ? String(bItem.item_code.hashCode()) : String(Date.now()),
              itemCode: bItem.item_code || '',
              itemName: itemData.item_name || bItem.description || '',
              unit: itemData.stock_uom || bItem.uom || 'Unit',
              stockQty: '0',
              reqQty: String(bItem.qty || 1),
              kit: selectedKit,
              remark: '',
            };

            kitItemsToAdd.push(newItem);
          }

          // Add them sequentially to preserve order and fetch stock
          for (const kitItem of kitItemsToAdd) {
            await upsertItemWithStock(kitItem, Number(kitItem.reqQty));
          }

          showAlert('success', 'Success', 'Kit items added to requisition');
          console.log('Setting lastAddedKit.current to:', selectedKit);
          lastAddedKit.current = selectedKit;
        } catch (error) {
          console.error('Error fetching kit items:', error);
          showAlert('danger', 'Error', 'Failed to load kit items');
        }
      };

      fetchKitItems();
    }
  }, [selectedKit, requisitionFrom, apiKey, apiSecret, isLoadingRequisition]);

  // Refresh stock when Requisition From changes
  useEffect(() => {
    console.log('Stock refresh useEffect triggered:', { requisitionFrom, itemsLength: items.length, isLoadingRequisition });
    if (!requisitionFrom || items.length === 0 || isLoadingRequisition) return;

    const refreshAllStocks = async () => {
      const refreshed = await Promise.all(
        items.map(async (it) => {
          const newStock = await fetchStockQty(it.itemCode, requisitionFrom);
          return { ...it, stockQty: newStock };
        })
      );
      setItems(refreshed);
    };

    refreshAllStocks();
  }, [requisitionFrom, fetchStockQty, isLoadingRequisition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".patient-input-group")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("patientData updated:", patientData);
  }, [patientData]);

  useEffect(() => {
    console.log('Items state changed:', items.map(item => ({ itemCode: item.itemCode, reqQty: item.reqQty })));
  }, [items]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("User not authenticated. Using fallback data.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [warehouseData, branchData, kitData, classificationData] = await Promise.all([
          fetchDepartment(),
          fetchBranches(),
          fetchKits(),
          fetchClassifications(),
        ]);
        setWarehouses(warehouseData);
        setBranches(branchData);
        setKits(kitData);
        setClassifications(classificationData);
      } catch (err) {
        setError("Failed to load data from API. Using fallback values.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, fetchDepartment, fetchBranches, fetchKits, fetchClassifications]);

  const handleClick = () => {
    router.push("/PatientRequistionList");
  };

  const clearPatient = () => {
    setPatientData(null);
    setSearchValue("");
    setSearchResults([]);
    setShowDropdown(false);
    setShowPatientCard(false);
    setItems([]);
    showAlert("success", "Success", "Patient and items cleared successfully");
  };

  const handleBarcodeScanner = async () => {
    const barcode = barcodeValue.trim();
    if (!barcode) return;

    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const batchResponse = await fetch(
        `${FRAPPE_API_BASE_URL}/Batch/${encodeURIComponent(barcode)}?fields=["item"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!batchResponse.ok) {
        showAlert("danger", "Error", `Batch ${barcode} not found`);
        setBarcodeValue('');
        setTimeout(() => barcodeInputRef.current?.focus(), 400);
        return;
      }

      const batchData = await batchResponse.json();
      const itemCode = batchData.data?.item;

      if (!itemCode) {
        showAlert("danger", "Error", `No item linked to batch ${barcode}`);
        setBarcodeValue('');
        setTimeout(() => barcodeInputRef.current?.focus(), 400);
        return;
      }

      const itemResponse = await fetch(
        `${FRAPPE_API_BASE_URL}/Item/${encodeURIComponent(itemCode)}?fields=["item_code","item_name","stock_uom"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!itemResponse.ok) {
        showAlert("danger", "Error", `Item ${itemCode} not found`);
        setBarcodeValue('');
        setTimeout(() => barcodeInputRef.current?.focus(), 400);
        return;
      }

      const itemData = await itemResponse.json();
      const item = itemData.data;

      const candidate: Item = {
        itemCode: item.item_code || "",
        itemName: item.item_name || "",
        unit: item.stock_uom || "",
        stockQty: "0",
        reqQty: "1",
        kit: selectedKit || "",
        remark: "",
        id: ""
      };

      await upsertItemWithStock(candidate, 1);
    } catch (error) {
      console.error('Barcode Scan Error:', error);
      showAlert("danger", "Error", "Failed to scan barcode. Please try again.");
    } finally {
      setBarcodeValue('');
      setTimeout(() => barcodeInputRef.current?.focus(), 300);
    }
  };

  useEffect(() => {
    if (barcodeValue) {
      const timer = setTimeout(() => {
        handleBarcodeScanner();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [barcodeValue]);

  // Validation for form submission
  const isFormValid = patientData &&
    requisitionDate &&
    requisitionFrom &&
    requisitionTo &&
    toLocation &&
    selectedSaleType &&
    patientRemark.trim().length <= 255 &&
    items.length > 0;

  // Debug: Log current user
  console.log('Current user:', currentUser);

  // Function to check if sale exists for requisition
  const checkSaleExistsForRequisition = async (reqNo: string): Promise<boolean> => {
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
        `https://192.168.7.221:4422/api/resource/POS%20Invoice?filters=[["custom_req_no","=","${reqNo}"]]&fields=["name"]&limit_page_length=1`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data && data.data.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error checking sale for requisition:", error);
      return false;
    }
  };

  // Function to cancel a submitted requisition
  const handleCancelRequisition = async () => {
    if (!requisitionNo) {
      showAlert("danger", "Error", "No requisition to cancel");
      return;
    }

    // Check if sale exists for this requisition
    const saleExists = await checkSaleExistsForRequisition(requisitionNo);
    if (saleExists) {
      showAlert("danger", "Error", "Cannot cancel requisition: Sale has been generated against this requisition");
      return;
    }

    try {
      setIsSaving(true);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `${FRAPPE_API_BASE_URL}/Patient Requisition/${requisitionNo}`,
        {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            docstatus: 2, // 2 = Cancelled
          }),
        }
      );

      if (response.ok) {
        setDocstatus(2);
        showAlert("success", "Success", "Requisition cancelled successfully");
      } else {
        showAlert("danger", "Error", "Failed to cancel requisition");
      }
    } catch (error) {
      console.error("Error cancelling requisition:", error);
      showAlert("danger", "Error", "Error cancelling requisition. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to amend a cancelled requisition
  const handleAmendRequisition = async () => {
    if (!requisitionNo || docstatus !== 2) {
      showAlert("danger", "Error", "Can only amend cancelled requisitions");
      return;
    }

    try {
      setIsSaving(true);
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      // First, check if an amendment already exists
      const checkAmendResponse = await fetch(
        `https://192.168.7.221:4422/api/resource/Patient%20Requisition?filters=[["amended_from","=","${requisitionNo}"]]&fields=["name"]&limit_page_length=1`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (checkAmendResponse.ok) {
        const existingAmendments = await checkAmendResponse.json();

        // If an amendment already exists, load it
        if (existingAmendments.data && existingAmendments.data.length > 0) {
          const amendedDocName = existingAmendments.data[0].name;
          setIsAmendMode(true);
          setDocstatus(0);
          setRequisitionNo(amendedDocName);
          showAlert("success", "Success", `Loading existing amendment: ${amendedDocName}`);

          setTimeout(() => {
            fetchRequisitionData(amendedDocName);
          }, 500);
        } else {
          // Fetch the cancelled document
          const fetchResponse = await fetch(
            `https://192.168.7.221:4422/api/resource/Patient%20Requisition/${requisitionNo}`,
            {
              method: 'GET',
              headers,
              credentials: 'include',
            }
          );

          if (!fetchResponse.ok) {
            showAlert("danger", "Error", "Failed to fetch requisition for amendment");
            return;
          }

          const cancelledDoc = await fetchResponse.json();
          const docData = cancelledDoc.data;

          // Create a new document with amended_from set
          const newDocData = {
            doctype: 'Patient Requisition',
            amended_from: requisitionNo,
            requisition_date_time: docData.requisition_date_time,
            requisition_from: docData.requisition_from,
            requisition_to: docData.requisition_to,
            to_location: docData.to_location,
            kit: docData.kit,
            sale_type: docData.sale_type,
            classification: docData.classification,
            generic: docData.generic,
            remarks: docData.remarks,
            routine: docData.routine,
            stat: docData.stat,
            discharge: docData.discharge,
            asap: docData.asap,
            expired: docData.expired,
            full_name: docData.full_name,
            age: docData.age,
            gender: docData.gender,
            mobile_number: docData.mobile_number,
            aadhar_no: docData.aadhar_no,
            doctor: docData.doctor || docData.consulting_doctor, // Use doctor field
            patient_id: docData.patient_id,
            visit_type: docData.visit_type,
            patient_company: docData.patient_company,
            department: docData.department,
            ward: docData.ward,
            bed_name: docData.bed_name,
            patient_category: docData.patient_category,
            visit_id: docData.visit_id,
            visit_datetime: docData.visit_datetime,
            registration_date: docData.registration_date,
            patient_requisition_item_details: docData.patient_requisition_item_details || [],
          };

          // Create the new amended document
          const createResponse = await fetch(
            `https://192.168.7.221:4422/api/resource/Patient%20Requisition`,
            {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify(newDocData),
            }
          );

          if (createResponse.ok) {
            const amendedData = await createResponse.json();
            const amendedDocName = amendedData.data?.name;

            setIsAmendMode(true);
            setDocstatus(0);
            setRequisitionNo(amendedDocName);
            showAlert("success", "Success", `Requisition amended successfully. New document: ${amendedDocName}`);

            setTimeout(() => {
              fetchRequisitionData(amendedDocName);
            }, 500);
          } else {
            const errorData = await createResponse.json();
            console.error('Create amendment error:', errorData);
            showAlert("danger", "Error", errorData.exc || "Failed to create amended requisition");
          }
        }
      } else {
        showAlert("danger", "Error", "Failed to check for existing amendments");
      }
    } catch (error) {
      console.error("Error amending requisition:", error);
      showAlert("danger", "Error", "Error amending requisition. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to print requisition
  const handlePrintRequisition = async () => {
    if (!requisitionNo) {
      showAlert("danger", "Error", "No requisition to print");
      return;
    }

    try {
      const printUrl = 'https://192.168.7.221:4422/printview?' +
        'doctype=Patient%20Requisition&' +
        'name=' + encodeURIComponent(requisitionNo) + '&' +
        'trigger_print=1&' +
        'format=Patient%20Requisition&' +
        'no_letterhead=0&' +
        'settings=%7B%7D&' +
        '_lang=en';

      window.open(printUrl, '_blank');
    } catch (error) {
      console.error("Error printing requisition:", error);
      showAlert("danger", "Error", "Failed to print requisition. Please try again.");
    }
  };

  // Function to delete a draft requisition
  const handleDeleteRequisition = async () => {
    if (!requisitionNo || docstatus !== 0) {
      showAlert("danger", "Error", "Can only delete draft requisitions");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this requisition? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      setIsSaving(true);
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `${FRAPPE_API_BASE_URL}/Patient Requisition/${requisitionNo}`,
        {
          method: 'DELETE',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        showAlert("success", "Success", "Requisition deleted successfully");
        // Redirect to requisition list after deletion
        setTimeout(() => {
          router.push("/PatientRequistionList");
        }, 1500);
      } else {
        showAlert("danger", "Error", "Failed to delete requisition");
      }
    } catch (error) {
      console.error("Error deleting requisition:", error);
      showAlert("danger", "Error", "Error deleting requisition. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Splash Screen */}
      <SplashScreen 
        show={initialLoading} 
        message="Initializing Purchase Requisition System..." 
      />
      
      <div className="bg-gray-50 min-h-screen px-3 relative">
      {/* Debug: Show current user info */}


      {/* Profile Circle - Top Right Corner - Always visible for testing */}
      <div className="fixed top-4 right-4 z-[9999] group">
        <div className="relative">

        </div>
      </div>

      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-md">
          <Alerts
            heading={alert.heading}
            content={alert.content}
            variant={alert.variant}
            showCloseIcon={true}
            open={alert.show}
            disappear={true}
            onClick={() => setAlert(prev => ({ ...prev, show: false }))}
          />
        </div>
      )}

      {/* Navbar Header */}
      <PageHeader
        parentTitle="Patient Requisition"
        parentLink="/PatientRequistionList"
        title={requisitionNo ? `Edit Requisition ${requisitionNo}` : "New Requisition"}
        icon="../assets/icons/BriefcaseIcon.svg"
        rightButtons={
          <div className="flex flex-row space-x-2">
          </div>
        }
      />

      <div className="flex gap-3 p-1 mt-17">
        <div className="flex-shrink-0">
          {!patientData ? (
            <Card>
              <CardContent className="p-4 patient-input-group w-[256px] h-[394px] p-4 rounded-lg border border-[#D9D9E0] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full">
                    <SelectInput
                      placeholder="Select Search Type"
                      value={selectedValue}
                      data={selectOptions}
                      onValueChange={(v: string) => handleSelectChange(v)}
                      className="text-[#60646C] text-xs font-normal w-full"
                    />
                  </div>

                  <div className="relative w-full">
                    <Input
                      value={searchValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search Patients"
                      className="w-full"
                    />
                    {isLoading && <div className="loading-text">Searching...</div>}
                    {showDropdown && (
                      <div className="autocomplete-dropdown">
                        {searchResults.length === 0 ? (
                          <div className="dropdown-item no-results">No patients found</div>
                        ) : (
                          searchResults.map((patient) => (
                            <div
                              key={patient.id}
                              className="dropdown-item"
                              onClick={() => handleSelectPatient(patient)}
                            >
                              <div className="patient-dropdown-item">
                                <div className="patient-name">{patient.patientFullName || "N/A"}</div>
                                <div className="patient-details">
                                  <span>MRN: {patient.mrn || "N/A"}</span>
                                  <span>Visit Id: {patient.visitID || "N/A"}</span>
                                  <span>Visit Date Time: {patient.visitDateTime || "N/A"}</span>
                                  <span>Visit Type: {patient.patientVisitType || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <PatientRequisitionCard
                name={patientData.name}
                age={patientData.age}
                sex={patientData.sex}
                phone={patientData.phone}
                ABHAID={patientData.ABHAID}
                company={patientData.company}
                visitType={patientData.visitType}
                doctor={patientData.doctor}
                departmentName={patientData.departmentName}
                wardName={patientData.wardName}
                bedName={patientData.bedName}
                patientCategory={patientData.patientCategory || "N/A"}
                visitId={patientData.visitId || "N/A"}
                visitDateTime={patientData.visitDateTime || "N/A"}
                aadhaarNo={patientData.aadhaarNo || "N/A"}
                registrationDate={patientData.registrationDate || "N/A"}
                uhid={patientData.uhid || "N/A"}
              />
              <div className="mt-2">
                <Button size="link-size" type="link-secondary" onClick={clearPatient}>
                  Change Patient
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <section className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requisition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <RenderFormElement
                      label="Requisition No."
                      inputType="input"
                      InputValueType="text"
                      value={requisitionNo}
                      onChange={setRequisitionNo}
                      placeholder=""
                      readonly={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Requisition Date"
                      inputType="input"
                      InputValueType="date"
                      value={requisitionDate}
                      onChange={setRequisitionDate}
                      placeholder="Pick a date"
                      required={true}
                      readonly={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Requisition From"
                      inputType="select"
                      value={requisitionFrom}
                      onChange={handleRequisitionFromChange}
                      data={[{ label: "", value: "CLEAR" }, ...warehouses]} // Use special value instead of empty string
                      placeholder="Select Department"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Requisition To"
                      inputType="select"
                      value={requisitionTo}
                      onChange={handleRequisitionToChange}
                      data={[{ label: "", value: "CLEAR" }, ...warehouses]} // Use special value instead of empty string
                      placeholder="Select Department"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="To Location"
                      inputType="select"
                      value={toLocation}
                      onChange={handleToLocationChange}
                      data={[{ label: "", value: "CLEAR" }, ...branches]} // Use special value instead of empty string
                      placeholder="Select Branch"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Kit"
                      inputType="select"
                      value={selectedKit}
                      onChange={handleKitChange}
                      data={[{ label: "", value: "CLEAR" }, ...kits]} // Use special value instead of empty string
                      placeholder="Select Kit"
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Sale Type"
                      inputType="select"
                      value={selectedSaleType}
                      onChange={handleSaleTypeChange}
                      data={saleTypeOptions}
                      placeholder="Select Sale Type"
                      required={true}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6 col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="routine"
                        checked={priorities.routine}
                        onCheckedChange={(checked) => handlePriorityChange('routine', checked as boolean)}
                      />
                      <Label htmlFor="routine">Routine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="stat"
                        checked={priorities.stat}
                        onCheckedChange={(checked) => handlePriorityChange('stat', checked as boolean)}
                      />
                      <Label htmlFor="stat">STAT</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="discharge"
                        checked={priorities.discharge}
                        onCheckedChange={(checked) => handlePriorityChange('discharge', checked as boolean)}
                      />
                      <Label htmlFor="discharge">Discharge</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asap"
                        checked={priorities.asap}
                        onCheckedChange={(checked) => handlePriorityChange('asap', checked as boolean)}
                      />
                      <Label htmlFor="asap">ASAP</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="expired"
                        checked={priorities.expired}
                        onCheckedChange={(checked) => handlePriorityChange('expired', checked as boolean)}
                      />
                      <Label htmlFor="expired">Expired</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                  <RenderFormElement
                    inputType="select"
                    value={selectedClassification}
                    onChange={handleClassificationChange}
                    data={[{ label: "", value: "CLEAR" }, ...classifications]} // Use special value instead of empty string
                    placeholder="Select Classification"
                  />
                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox
                      id="terms"
                      checked={isGeneric}
                      onCheckedChange={(checked) => setIsGeneric(checked as boolean)}
                    />
                    <Label htmlFor="terms">Generic</Label>
                    <EnhancedItemSearch
                      onSelectItem={handleAddItemToDetails}
                      placeholder="Search Items"
                      className="pt-2"
                      selectedClassification={selectedClassification}
                      isGeneric={isGeneric}
                      selectedCompany={patientData?.company}
                    />

                    <div className="ml-4 w-full">
                      <RenderFormElement
                        inputType="input"
                        InputValueType="text"
                        value={barcodeValue}
                        onChange={setBarcodeValue}
                        placeholder="Barcode"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <EditableDataTable
                    columns={columns as any}
                    initialData={items}
                    table={table as any}
                    dataProps={{ data: items, setData: setItems }}
                    addButton={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientRemark">Remark</Label>
                  <Textarea
                    id="patientRemark"
                    value={patientRemark}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 255) {
                        setPatientRemark(value);
                      } else {
                        showAlert("warning", "Warning", "Remark cannot exceed 255 characters.");
                      }
                    }}
                    placeholder="Enter remark"
                    className="w-full"
                    maxLength={255}
                  />
                  <div className="text-xs text-gray-500">
                    {patientRemark.length}/255 characters
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] bg-white z-100">
        <div className="w-fit h-fit flex items-center gap-4">
          {/* Status Badge */}
          {requisitionNo && (
            <div className="text-xs font-medium">
              {docstatus === 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Draft</span>}
              {docstatus === 1 && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Submitted</span>}
              {docstatus === 2 && <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Cancelled</span>}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
          {/* Draft State Buttons */}
          {docstatus === 0 && (
            <>
              <Button type="secondary-button" size="button-medium" onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="primary-outlined-button"
                size="button-medium"
                onClick={handleSave}
                disabled={isSaving || !isFormValid}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                type="primary-button"
                size="button-medium"
                onClick={handleFinalize}
                disabled={isSaving || !isFormValid}
              >
                {isSaving ? "Finalizing..." : "Finalize and Print"}
              </Button>
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={handleDeleteRequisition}
                disabled={isSaving}
              >
                {isSaving ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}

          {/* Submitted State Buttons */}
          {docstatus === 1 && (
            <>
              <Button type="primary-button" size="button-medium" onClick={handleClick}>
                Show Requisition
              </Button>
              <Button type="primary-outlined-button" size="button-medium" onClick={handlePrintRequisition}>
                Print
              </Button>
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={handleCancelRequisition}
                disabled={isSaving}
              >
                {isSaving ? "Cancelling..." : "Cancel"}
              </Button>
            </>
          )}

          {/* Cancelled State Buttons */}
          {docstatus === 2 && (
            <>
              <Button type="primary-button" size="button-medium" onClick={handleClick}>
                Show Requisition
              </Button>
              <Button
                type="primary-outlined-button"
                size="button-medium"
                onClick={handleAmendRequisition}
                disabled={isSaving}
              >
                {isSaving ? "Amending..." : "Amend"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* High-Alert Confirmation Dialog */}
      <Dialog open={showHighAlertDialog} onOpenChange={setShowHighAlertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">High Alert Classification Warning</DialogTitle>
            <DialogDescription>
              The following items belong to <span className="font-semibold text-red-600">{highAlertItem?.custom_classification}</span> High Alert Classification. Handle with care.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm font-medium text-yellow-800 mb-1">Item Details:</p>
              <p className="text-sm text-gray-700">
                <strong>{highAlertItem?.itemName}</strong> ({highAlertItem?.itemCode})
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="secondary-button"
              size="button-medium"
              onClick={handleHighAlertCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary-button"
              size="button-medium"
              onClick={handleHighAlertConfirm}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Critical Category Confirmation Dialog */}
      <Dialog open={criticalCategoryDialog.show} onOpenChange={(open) => !open && handleCriticalCategoryCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-600">Critical Category Alert</DialogTitle>
            <DialogDescription>
              The following item belongs to critical categories and requires special handling.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-sm font-medium text-orange-800 mb-2">Critical Categories:</p>
              <p className="text-sm text-gray-700 mb-2">
                {criticalCategoryDialog.categories?.join(', ')}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Item:</strong> {criticalCategoryDialog.item?.itemName} ({criticalCategoryDialog.item?.itemCode})
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              This item requires special handling. Do you want to proceed?
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="secondary-button"
              size="button-medium"
              onClick={handleCriticalCategoryCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary-button"
              size="button-medium"
              onClick={handleCriticalCategoryConfirm}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
        }

        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item.no-results {
          color: #666;
          font-style: italic;
          cursor: default;
        }

        .dropdown-item.no-results:hover {
          background-color: white;
        }

        .patient-dropdown-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .patient-name {
          font-weight: 600;
          color: #333;
        }

        .patient-details {
          font-size: 12px;
          color: #666;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .loading-text {
          font-size: 12px;
          color: #666;
          font-style: italic;
          margin-left: 8px;
        }
      `}</style>
    </div>
    </>
  );
}