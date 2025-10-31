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
import { Search, X, Plus } from 'lucide-react';
import { DataTable as EditableDataTable } from "@/components/EditableCellsTable/TableTry";
import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

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
}

interface ItemSearchProps {
  onSelectItem: (item: Item) => void;
  placeholder?: string;
  className?: string;
  selectedClassification?: string;
  isGeneric?: boolean;
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const { apiKey, apiSecret } = useAuth();

  const API_BASE_URL = 'http://103.219.1.138:4430/api/resource';

  const searchItems = async (query: string = '', classification: string = '', generic: boolean = false): Promise<Item[]> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
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
        `${API_BASE_URL}/Item?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=["name","item_name","stock_uom","custom_classification","custom_is_generic"]&limit_page_length=10`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Item API Response:', data);

        const fetchedItems: Item[] = data.data.map((item: any, index: number) => {
          const unit = item.stock_uom || 'Unit';
          console.log(`Mapping item: ${item.item_name}, Unit: ${unit}`);
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
          };
        });
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
          const results = await searchItems(searchTerm, selectedClassification, isGeneric);
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
  }, [searchTerm, selectedClassification, isGeneric]);

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
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          Authorization: `token ${apiKey}:${apiSecret}`,
        };
        const csrf = localStorage.getItem("csrfToken");
        if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;

        const response = await fetch(
          `http://103.219.1.138:4430/api/method/quantbit_hims_integration.quantbit_hims_integration.material_request.get_stock_qty`,
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
  const { isAuthenticated, apiKey, apiSecret } = useAuth();

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
  const [patientRemark, setPatientRemark] = useState("");
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: "success",
    heading: "",
    content: ""
  });

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

  // Track last added kit
  const lastAddedKit = useRef<string>("");

  // Search type options
  const selectOptions: SelectOption[] = [
    { label: "UHID", value: "uhid" },
    { label: "Aadhaar No", value: "aadharCardNo" },
    { label: "Mobile No", value: "mobile" },
    { label: "Full Name", value: "fullName" },
  ];

  // Sale type options
  const saleTypeOptions: SelectOption[] = [
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
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `http://103.219.1.138:4430/api/method/quantbit_hims_integration.api.pos_api.get_user_default_department`,
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
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      const response = await fetch(
        `http://103.219.1.138:4430/api/method/quantbit_hims_integration.api.pos_api.get_user_default_branch`,
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
  const upsertItemWithStock = async (baseItem: Item, qtyIncrement: number = 1) => {
    // 1. If we already have the item, just bump the requested qty
    const existingIdx = items.findIndex((i) => i.itemCode === baseItem.itemCode);
    if (existingIdx > -1) {
      const updated = [...items];
      const newReq = Number(updated[existingIdx].reqQty) + qtyIncrement;
      updated[existingIdx].reqQty = String(newReq);

      // 2. Refresh stock (in case the warehouse changed)
      if (requisitionFrom) {
        const stock = await fetchStockQty(baseItem.itemCode, requisitionFrom);
        updated[existingIdx].stockQty = stock;
      }
      setItems(updated);
      showAlert(
        "success",
        "Success",
        `${baseItem.itemName} quantity increased to ${newReq}`
      );
      return;
    }

    // 3. New item – fetch stock first, then push
    let stock = "0";
    if (requisitionFrom) {
      stock = await fetchStockQty(baseItem.itemCode, requisitionFrom);
    }

    const newItem: Item = {
      ...baseItem,
      id: baseItem.itemCode ? String(baseItem.itemCode.hashCode()) : String(Date.now()),
      reqQty: String(qtyIncrement),
      stockQty: stock,
      kit: selectedKit || baseItem.kit || "",
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
    if (Number(newQty) <= 0) {
      handleRemoveItemFromDetails(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, reqQty: newQty } : item
      )
    );
    showAlert("success", "Success", "Quantity updated successfully");
  };

  const columns: ColumnDef<Item, any>[] = useMemo(
    () => [
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "itemName", header: "Item Name" },
      { accessorKey: "unit", header: "Unit" },
      {
        accessorKey: "stockQty",
        header: "Stock Qty",
        cell: ({ row }) => (
          <span className={row.original.stockQty === "0" ? "text-gray-400" : ""}>
            {row.original.stockQty || "–"}
          </span>
        ),
      },
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
              e.target.value = String(v);
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
  const FRAPPE_API_BASE_URL = "http://103.219.1.138:4430/api/resource";

  const fetchRequisitionData = async (requisitionNo: string) => {
    try {
      setLoading(true);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
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
      setSelectedKit(requisition.kit || "");
      setSelectedSaleType(requisition.sale_type || "");
      setSelectedClassification(requisition.classification || "");
      setIsGeneric(requisition.generic === "1");
      setPatientRemark(requisition.remarks || "");
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
      const itemsData: Item[] = requisitionItems.map((item: any, index: number) => ({
        id: item.item_code ? String(item.item_code.hashCode()) : String(index + Date.now()),
        itemCode: item.item_code || "",
        itemName: item.item_name || "",
        unit: item.unit || "",
        stockQty: item.stock_qty || "0",
        reqQty: item.req_qty ? String(item.req_qty) : "0",
        kit: item.kit || "",
        remark: item.remark || "",
      }));
      setItems(itemsData);

      showAlert("success", "Success", "Requisition loaded successfully");
    } catch (error) {
      console.error("Error fetching requisition:", error);
      showAlert("danger", "Error", "Failed to load requisition data");
    } finally {
      setLoading(false);
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
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };

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
          kit: item.kit || selectedKit || "",
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
      const printUrl = `http://103.219.1.138:4430/printview?doctype=Patient%20Requisition&name=${encodeURIComponent(docName)}&trigger_print=1&format=Patient%20Requisition&no_letterhead=0&letterhead=City%20Hospital&settings=%7B%7D&_lang=en`;
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
    if (selectedKit && selectedKit !== lastAddedKit.current) {
      const fetchKitItems = async () => {
        try {
          const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `token ${apiKey}:${apiSecret}`,
          };

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
          lastAddedKit.current = selectedKit;
        } catch (error) {
          console.error('Error fetching kit items:', error);
          showAlert('danger', 'Error', 'Failed to load kit items');
        }
      };

      fetchKitItems();
    }
  }, [selectedKit, requisitionFrom, apiKey, apiSecret]);

  // Refresh stock when Requisition From changes
  useEffect(() => {
    if (!requisitionFrom || items.length === 0) return;

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
  }, [requisitionFrom, fetchStockQty]);

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
    console.log("Selected value updated:", selectedValue);
  }, [selectedValue]);

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
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };
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

  return (
    <div className="bg-gray-50 min-h-screen px-3">
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

      <div className="my-16">
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
      </div>

      <div className="flex gap-3 p-1">
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
                      onChange={setRequisitionFrom}
                      data={warehouses}
                      placeholder="Select Department"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Requisition To"
                      inputType="select"
                      value={requisitionTo}
                      onChange={setRequisitionTo}
                      data={warehouses}
                      placeholder="Select Department"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="To Location"
                      inputType="select"
                      value={toLocation}
                      onChange={setToLocation}
                      data={branches}
                      placeholder="Select Branch"
                      required={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Kit"
                      inputType="select"
                      value={selectedKit}
                      onChange={setSelectedKit}
                      data={kits}
                      placeholder="Select Kit"
                    />
                  </div>

                  <div className="space-y-2">
                    <RenderFormElement
                      label="Sale Type"
                      inputType="select"
                      value={selectedSaleType}
                      onChange={setSelectedSaleType}
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
                    onChange={setSelectedClassification}
                    data={classifications}
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
        </div>
        <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal">
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
          <Button type="primary-button" size="button-medium" onClick={handleClick}>
            Show Requisition
          </Button>
        </div>
      </div>

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
  );
}