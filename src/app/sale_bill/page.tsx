"use client";
import { securePrintPdf } from "@/utils/printHelper";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { redirectToFrappeLogin, getAuthHeaders } from "@/utils/sessionAuth";
// Removed unused OpenAPI imports
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
import Document from "@/components/documentUpload/Document"; // <-- Make sure this import is here
import PageHeader from "@/components/billbreakdown/PageHeader";
import RenderFormElement from "@/components/form/RenderFormElement";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import BillBreakdown from "@/components/billbreakdown/billbreakdown";
import { networkPrinter } from "@/utils/networkPrinter";
import POSProfileSelector from '@/components/pos/POSProfileSelector';
import { Search, X, Plus, UploadCloud, AlertTriangle } from 'lucide-react';
import OpdCard, { OpdCardRef } from "@/components/OpdInfo/Opdinfo";
import HorizontallyScrollableTable from "@/components/editableTablePos/editable";
import PatientRequisitionList from "@/components/patientRequisitionList/PatientRequisitionList";
import PrescriptionList from "@/components/prescriptionList/PrescriptionList";
import Alerts from "@/components/alerts/Alerts";
import AlternativeItemsPopover from "@/components/itemAlternative/ItemAlternative";
import { useFrappeApi } from "@/api/api";
import ClosingEntryModal from '@/components/pos/ClosingEntryModal';
import ViewPosInvoicesModal from '@/components/pos/ViewPosInvoicesModal'; // New Import
import SelectInvoiceModal from '@/components/return/SelectInvoiceModal';
import { useAlert } from "@/components/AlertContext/AlertContext";
import PaymentTable from '@/components/billbreakdown/PaymentTable'; // New Import
import SplashScreen from '@/components/SplashScreen/SplashScreen'; // New Import
interface AlertState {
  show: boolean;
  variant: "success" | "warning" | "danger" | "primary" | "secondary";
  heading: string;
  content: string;
}

// Define types
export interface Item {
  id: string;
  custom_his_item_id?: string; // Returned by item_details API, used for preauth matching
  alternateBatches: string;
  substituteItem: string;
  itemCode: string;
  itemName: string;
  uom: string;      // Changed from unit to uom, moved up
  stockQty: number;
  orderedQty: number;
  saleQty: number;
  returnQty?: number; // Add returnQty field for return invoices
  batch: string;
  batchNo: string; // Add batchNo to Item interface
  expiryDate: string; // Add expiryDate to Item interface
  batchStockQty: number; // Add batchStockQty to Item interface
  rate: number | null;
  taxTemplate: string; // New field for tax template
  description: string;
  itemAmount: number;
  discountPercent: number;
  discountAmt: number;
  cgstPercent: number;
  cgstAmt: number;
  sgstPercent: number;
  sgstAmt: number;
  igstPercent: number;
  igstAmt: number;
  totalAmt: number;
  kitName: string;
  totalPckgAmt: number;
  packageName: string;
  binLocation: string;
  warehouse?: string; // Add warehouse field for stock tracking
  marginType?: string; // Add marginType as optional property
  includedInPrintRate?: boolean; // Add includedInPrintRate as optional property
  genericName?: string; // Add genericName as optional property
  mrp?: number; // Add MRP field for batch custom_mrp
  use_serial_batch_fields?: number;
  custom_allow_sale_days?: number; // Add custom_allow_sale_days field
  hasStock?: boolean; // Add hasStock field to track if item has stock
  req_qty?: number; // Add req_qty field for requisition/prescription requested quantity
  custom_classification?: string; // Add custom_classification field for high-alert items
  _skipHighAlertCheck?: boolean; // Add flag to bypass high-alert check in confirmation flow
  custom_business_category?: string; // Add custom_business_category field for filtering by company
  max_discount?: number; // Add max_discount field for discount validation
  appliedPricingRule?: string; // Add field to track which pricing rule was applied
  coPayPercentage?: number; // Add co-pay percentage field
  patientAmount?: number; // Add patient amount field
  payerAmount?: number; // Add payer amount field
  covered?: boolean; // Add covered checkbox field
  preAuthRequired?: boolean; // Add pre-auth required field
  preAuthStatus?: string; // Add pre-auth status field (Rejected, Pending, Initiated, Approved)
  preAuthNo?: string; // Add pre-auth number field
  preAuthDateTime?: string; // Add pre-auth date and time field
  isFromPrescription?: boolean; // Add flag to track if item is loaded from prescription
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
}

interface ItemSearchProps {
  onSelectItem: (item: Item) => void;
  placeholder?: string;
  className?: string;
  fetchItemBatches: (itemCode: string) => Promise<any[]>;
  fetchItemPrice: (itemCode: string, batchNo: string | null, priceList: string) => Promise<number | null>;
  getBatchQty: (itemCode: string, batchNo: string, warehouse: string) => Promise<number>;
  onNoBatchesFound?: (item: Item) => void;
  selectedWarehouse?: string;
  selectedCompany?: string; // Add selectedCompany to the interface
  selectedCustomer?: string; // Add selectedCustomer to pass pricing rule context
  applyPricingRules?: (items: Item[], customer: string) => Promise<Item[]>; // Pricing rule handler
  // showAlert: (variant: AlertState['variant'], heading: string, content: string) => void;
  selectedClassification?: string;
  isGeneric?: boolean;
  isDisabled?: boolean; // Add disabled prop
  criticalCategoryDialog?: {
    show: boolean;
    item: Item | null;
    categories: string[];
  };
  setCriticalCategoryDialog?: (dialog: { show: boolean; item: Item | null; categories: string[] }) => void;
}

type SelectedPatient = {
  name: string;
  age: string;
  sex: string;
  phone: string;
  ABHAID: string;
  category: string;
  doctor: string;
  mrn?: string;
  displayNo?: string;
  dept?: string;
  visitType?: string;
  company?: string;
  visitID?: string;
  visitNo?: string;
  bed?: string;
  bedName?: string;
  wardName?: string;
  payerType?: string;
  payerName?: string;
  network?: string;
  insuranceNo?: string;
  subInsurance?: string;
  otherNo?: string;
  validityFrom?: string;
  expiryValidityTo?: string;
  isDischarged?: boolean;
  hospitalId?: string;
  coPay?: number;
};

// Enhanced Item Search Component
const EnhancedItemSearch: React.FC<ItemSearchProps> = ({
  onSelectItem,
  placeholder = "Search Items",
  className = "",
  fetchItemBatches,
  fetchItemPrice,
  getBatchQty,
  onNoBatchesFound,
  selectedWarehouse,
  selectedCompany,
  selectedCustomer,
  applyPricingRules: applyPricingRulesFn,
  // showAlert, // Destructure selectedWarehouse
  selectedClassification,
  isGeneric,
  isDisabled = false, // Add disabled prop with default value
  // criticalCategoryDialog,
  // setCriticalCategoryDialog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [allSuggestions, setAllSuggestions] = useState<Item[]>([]);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [_selectedBatch, setSelectedBatch] = useState<string | null>(null); // New state for selected batch
  const [itemBatches, setItemBatches] = useState<any[]>([]); // To store batches for the highlighted item
  const [quantity, setQuantity] = useState<number>(1); // New state for quantity
  const [currentRate, setCurrentRate] = useState<number | null>(null); // New state for current rate
  const [selectedManualBatches, setSelectedManualBatches] = useState<{ [batchNo: string]: number }>({}); // New state for manually selected batches
  const { showAlert } = useAlert();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';

  const searchItems = async (query: string, selectedClassification?: string, isGeneric?: boolean, selectedCompany?: string, selectedCustomer?: string): Promise<Item[]> => {
    try {
      // const headers: HeadersInit = {
      //   'Content-Type': 'application/json',
      //   'Authorization': `token ${apiKey}:${apiSecret}`,
      // };

      const filters: any[] = [];
      if (isGeneric) {
        filters.push(["custom_generic_name", "like", `%${query}%`]);
        filters.push(["custom_is_generic", "=", 1]);
      } else {
        filters.push(["item_name", "like", `%${query}%`]);
      }
      if (selectedClassification) {
        filters.push(["custom_classification", "=", selectedClassification]);
      }
      const fields = ["name", "item_name", "item_code", "custom_generic_name", "custom_allow_sale_days", "custom_classification", "custom_business_category", "max_discount",
        "custom_is_hazardous", "custom_reserved_antibiotic", "custom_stent", "custom_consignment_items", "custom_narcotic_drug", "custom_tb_drug", "custom_lasa",
        "custom_emergency_drug", "custom_ndps", "custom_controled_drug", "custom_high_risk_drug", "custom_banned_drug", "custom_edrug", "custom_is_prescribed"]; // Add any fields you need


      const response = await fetch(
        `${API_BASE_URL}/Item?filters=${encodeURIComponent(JSON.stringify(filters))}` +
        `&fields=${encodeURIComponent(JSON.stringify(fields))}` +
        `${isGeneric ? '&limit_page_length=1000' : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        let fetchedItems: Item[] = data.data.map((item: any) => ({
          id: item.name || '', // Use item.name (which is itemCode) as the initial ID
          itemCode: item.name || '',
          itemName: item.item_name || '',
          uom: item.uom || 'Unit', // Use uom instead of unit, provide default
          stockQty: item.actual_qty || 0,
          orderedQty: 0,
          saleQty: 0,
          batch: '',
          batchNo: '', // Initialize batchNo
          expiryDate: '', // Initialize expiryDate
          batchStockQty: 0, // Initialize batchStockQty
          rate: item.rate || 0,
          mrp: 0, // Initialize MRP, will be set when batch is selected
          taxTemplate: '',
          description: '',
          itemAmount: 0,
          discountPercent: 0,
          discountAmt: 0,
          cgstPercent: 0,
          cgstAmt: 0,
          sgstPercent: 0,
          sgstAmt: 0,
          igstPercent: 0,
          igstAmt: 0,
          totalAmt: 0,
          totalPckgAmt: 0,
          kitName: '',
          packageName: '',
          binLocation: '',
          genericName: item.custom_generic_name, // Map generic name from API
          custom_allow_sale_days: item.custom_allow_sale_days || 0, // Map custom_allow_sale_days from API
          custom_classification: item.custom_classification || '', // Map custom_classification from API
          custom_business_category: item.custom_business_category || '', // Map custom_business_category from API
          max_discount: item.max_discount || 0, // Map max_discount from API
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
        }));

        if (selectedCustomer && applyPricingRulesFn) {
          fetchedItems = await applyPricingRulesFn(fetchedItems, selectedCustomer);
        }

        if (selectedCompany) {
          const itemsWithMatchingCategories = fetchedItems.filter(item => {
            if (!item.custom_business_category) return false;
            const categories = item.custom_business_category.split(',').map(cat => cat.trim());
            return categories.includes(selectedCompany);
          });

          if (itemsWithMatchingCategories.length > 0) {
            fetchedItems = itemsWithMatchingCategories;
          }
        }

        return isGeneric ? fetchedItems : fetchedItems.slice(0, 10);
      } else {
        console.error('Item search failed:', response.status, response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error during item search:', error);
      return [];
    }
  };
  const { posProfile } = useAuth();

  // Create network printer instance with credentials
  // const networkPrinter: (NetworkPrinter | null) = apiKey && apiSecret ? createNetworkPrinter(apiKey, apiSecret) : null;

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await searchItems(searchTerm, selectedClassification, isGeneric, selectedCompany, selectedCustomer);
          setAllSuggestions(results);
          if (isGeneric) {
            const filtered = results.filter(item =>
              subSearchTerm === '' || item.itemName.toLowerCase().includes(subSearchTerm.toLowerCase())
            );
            setSuggestions(filtered);
          } else {
            setSuggestions(results);
          }
          setShowSuggestions(true);
          setHighlightedIndex(-1);
          setItemBatches([]); // Clear batches on new search term
          setSelectedBatch(null); // Clear selected batch
          setSubSearchTerm(''); // Reset sub search on new generic search
          setSelectedManualBatches({}); // Clear manually selected batches
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedClassification, isGeneric, selectedCompany, selectedCustomer, applyPricingRulesFn]);

  // useEffect for sub-search filtering
  useEffect(() => {
    if (isGeneric) {
      const filtered = allSuggestions.filter(item =>
        subSearchTerm === '' || item.itemName.toLowerCase().includes(subSearchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 || subSearchTerm.length > 0);
      setHighlightedIndex(-1);
    }
  }, [allSuggestions, subSearchTerm, isGeneric]);

  // New useEffect to fetch batches when an item is highlighted
  useEffect(() => {
    const fetchBatchesForHighlightedItem = async () => {
      if (highlightedIndex >= 0 && suggestions.length > 0) {
        const itemCode = suggestions[highlightedIndex].itemCode;
        if (!selectedWarehouse) {
          showAlert("danger", "Error", "Please select a warehouse first.");
          return;
        }
        if (!selectedCompany) {
          showAlert("danger", "Error", "Please select a company first.");
          return;
        }
        try {
          const batches = await fetchItemBatches(itemCode);
          setItemBatches(batches);
          setSelectedBatch(batches.length > 0 ? batches[0].name : null); // Auto-select the first batch
          const rate = await fetchItemPrice(itemCode, batches.length > 0 ? batches[0].name : null, 'Standard Selling');
          setCurrentRate(rate);
        } catch (error) {
          console.error('Error fetching batches for highlighted item:', error);
          setItemBatches([]);
          setSelectedBatch(null);
        }
      } else {
        setItemBatches([]);
        setSelectedBatch(null);
        setSelectedManualBatches({}); // Clear manually selected batches when clicking outside
      }
    };

    fetchBatchesForHighlightedItem();
  }, [highlightedIndex, suggestions, posProfile, fetchItemBatches, selectedWarehouse, selectedCompany]); // Depend on highlightedIndex and suggestions

  // Function to calculate total quantity across all batches
  const getTotalBatchQuantity = (batches: any[]) => {
    return batches.reduce((total, batch) => total + (batch.batch_qty || 0), 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setSelectedManualBatches({}); // Clear manually selected batches when clicking outside
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
        setHighlightedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const item = suggestions[highlightedIndex];
          // Distribute quantity across batches
          handleDistributedQuantitySelection(item, quantity, Object.keys(selectedManualBatches));
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        setSelectedManualBatches({}); // Clear manually selected batches
        break;
    }
  };

  // Function to fetch batch MRP
  const fetchBatchMRP = async (batchName: string): Promise<number> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`https://gmcerp.quantcloud.in/api/resource/Batch/${batchName}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.data?.custom_mrp || 0;
      }
    } catch (error) {
      console.error('Error fetching batch MRP:', error);
    }
    return 0;
  };

  const handleConfirmedSelectItem = async (item: Item, batchNo: string, expiryDate: string, qtyToTake: number, batchQtyFromList?: number) => {
    if (!selectedWarehouse) {
      showAlert("danger", "Error", "Please select a warehouse first.");
      return;
    }
    if (!selectedCompany) {
      showAlert("danger", "Error", "Please select a company first.");
      return;
    }
    const warehouse = selectedWarehouse; // Use selectedWarehouse prop
    const itemRate = currentRate !== null ? currentRate : item.rate; // Use currentRate if available, otherwise fall back to item.rate
    let batchStockQty = 0; // Initialize batchStockQty
    let batchMRP = 0; // Initialize batchMRP

    if (batchNo) {
      // Use the batch quantity from the list if provided, otherwise fetch from API
      if (batchQtyFromList !== undefined && batchQtyFromList !== null) {
        batchStockQty = batchQtyFromList;
      } else {
        batchStockQty = await getBatchQty(item.itemCode, batchNo, warehouse); // Fetch batch quantity
      }

      // Fetch batch MRP
      batchMRP = await fetchBatchMRP(batchNo);
    }

    const itemWithBatchAndRate: Item = {
      ...item,
      id: `${item.itemCode}-${batchNo}-${Date.now()}`,
      batchNo: batchNo,
      expiryDate: expiryDate,
      batchStockQty: batchStockQty,
      stockQty: batchStockQty,
      rate: itemRate,
      mrp: batchMRP,
      orderedQty: item.orderedQty,
      saleQty: qtyToTake,
      use_serial_batch_fields: 1,
      custom_classification: item.custom_classification,
    };

    onSelectItem(itemWithBatchAndRate);
    // setSearchTerm(''); // Don't clear search term immediately, allow further selections
    // setSuggestions([]);
    // setShowSuggestions(false);
    // setHighlightedIndex(-1);
    // setSelectedBatch(null); // Clear selected batch after selection
    // setItemBatches([]); // Clear batches
    // inputRef.current?.focus();
    setCurrentRate(null); // Reset currentRate after selection
  };

  const handleDistributedQuantitySelection = async (item: Item, totalRequestedQty: number, selectedBatchesManual: string[] = []) => {
    if (!selectedWarehouse) {
      showAlert("danger", "Error", "Please select a warehouse first.");
      return;
    }
    if (!selectedCompany) {
      showAlert("danger", "Error", "Please select a company first.");
      return;
    }

    if (totalRequestedQty < 0) {
      // For negative quantities (returns), add directly without batch allocation
      await handleConfirmedSelectItem(item, '', '', totalRequestedQty);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      setSelectedBatch(null);
      setItemBatches([]);
      setQuantity(1);
      inputRef.current?.focus();
      return;
    }

    let remainingQty = totalRequestedQty;
    const batches = await fetchItemBatches(item.itemCode); // Ensure batches are fresh
    const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

    let batchesToAllocateFrom = sortedBatches;

    if (selectedBatchesManual.length > 0) {
      // If specific batches are selected, filter to only those and prioritize quantity from selectedManualBatches
      batchesToAllocateFrom = sortedBatches.filter(batch => selectedBatchesManual.includes(batch.name));

      for (const batch of batchesToAllocateFrom) {
        if (remainingQty <= 0) break;

        const manuallySetQty = selectedManualBatches[batch.name];
        if (manuallySetQty !== undefined && manuallySetQty > 0) {
          const qtyToTake = Math.min(remainingQty, manuallySetQty, batch.batch_qty);
          if (qtyToTake > 0) {
            await handleConfirmedSelectItem(item, batch.name, batch.expiry_date, qtyToTake, batch.batch_qty);
            remainingQty -= qtyToTake;
          }
        }
      }
      // If there's still remainingQty and we've only allocated from manually selected with specific quantities
      // and not all of totalRequestedQty has been fulfilled, then try to allocate remaining to selected batches
      // that were only chosen for allocation, but not given a specific quantity.
      if (remainingQty > 0) {
        for (const batch of batchesToAllocateFrom) {
          if (remainingQty <= 0) break;
          const qtyToTake = Math.min(remainingQty, batch.batch_qty);
          if (qtyToTake > 0) {
            await handleConfirmedSelectItem(item, batch.name, batch.expiry_date, qtyToTake, batch.batch_qty);
            remainingQty -= qtyToTake;
          }
        }
      }

    } else {
      // Original FEFO logic if no manual batches selected
      const allocationDetails: string[] = [];

      for (const batch of sortedBatches) {
        if (remainingQty <= 0) break;

        const batchAvailableQty = batch.batch_qty;
        const qtyToTake = Math.min(remainingQty, batchAvailableQty);

        if (qtyToTake > 0) {
          allocationDetails.push(`${batch.name} (${qtyToTake} units)`);
          await handleConfirmedSelectItem(item, batch.name, batch.expiry_date, qtyToTake, batch.batch_qty);
          remainingQty -= qtyToTake;
        }
      }
    }

    if (remainingQty > 0) {
      if (selectedBatchesManual.length > 0) {
        showAlert("warning", "Warning", `Only ${totalRequestedQty - remainingQty} of ${totalRequestedQty} quantity could be fulfilled from selected batches.`);
      } else {
        showAlert("warning", "Warning", `Only ${totalRequestedQty - remainingQty} of ${totalRequestedQty} quantity could be fulfilled using FEFO (First Expiry First Out) allocation.`);
      }
      if (onNoBatchesFound) {
        onNoBatchesFound(item);
      }
    } else {
      if (sortedBatches.length === 1) {
        showAlert("success", "Success", `Successfully added ${totalRequestedQty} quantity from batch ${sortedBatches[0].name}.`);
      } else {
        showAlert("success", "Success", `Successfully added ${totalRequestedQty} quantity using FEFO allocation across ${sortedBatches.length} batches.`);
      }
    }
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setSelectedBatch(null); // Clear selected batch after selection
    setItemBatches([]); // Clear batches
    setQuantity(1); // Reset quantity after selection
    setSelectedManualBatches({}); // Clear manually selected batches
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSubSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
    setSelectedManualBatches({}); // Clear manually selected batches
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
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={isDisabled ? "Items loaded from requisition/prescription" : (isGeneric ? "Search Generic Name" : placeholder)}
          disabled={isDisabled}
          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${isDisabled
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-gray-300 focus:border-blue-500"
            }`}
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
      {isGeneric && (
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={subSearchTerm}
            onChange={(e) => setSubSearchTerm(e.target.value)}
            placeholder="Search within items"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            autoComplete="off"
          />
        </div>
      )}
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
                    className={`px-3 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${index === highlightedIndex ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50'
                      }`}
                    // Add onClick to the li element for direct item selection
                    onClick={() => { // Modified onClick to handle quantity distribution
                      handleDistributedQuantitySelection(item, quantity, Object.keys(selectedManualBatches));
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {highlightMatch(item.itemName, isGeneric ? subSearchTerm : searchTerm)}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {item.uom}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Code: {highlightMatch(item.itemCode, isGeneric ? subSearchTerm : searchTerm)}</span>
                          <span>Stock: {itemBatches.length > 0 && highlightedIndex === index ? getTotalBatchQuantity(itemBatches) : item.stockQty}</span>
                          {item.batch && <span>Batch: {item.batch}</span>}
                          {currentRate !== null ? ( // Show currentRate if available
                            <span>Rate: {currentRate.toFixed(2)}</span>
                          ) : (
                            item.rate !== null && <span>Rate: {item.rate.toFixed(2)}</span> // Fallback to item.rate
                          )}
                          {isGeneric && item.genericName && (
                            <span className="text-blue-600 font-medium">Generic Name: {item.genericName}</span>
                          )}
                        </div>

                        {highlightedIndex === index && selectedWarehouse && selectedCompany && ( // Show quantity input when item is highlighted, only if warehouse and company are selected
                          <div className="mt-2" onClick={(e) => e.stopPropagation()}> {/* Prevent li onClick when clicking inside quantity input */}
                            <label htmlFor="quantity-input" className="sr-only">Quantity</label>
                            <Input
                              id="quantity-input"
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                              placeholder="Enter Quantity" // Changed placeholder to indicate total quantity
                              // min="1"
                              className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            />
                            {/* <p className="text-xs text-gray-500 mt-1">
                              * If specific batches are selected above, the quantity will be split among them.
                              Otherwise, it will be split using FEFO across all available batches.
                            </p> */}
                          </div>
                        )}
                        {itemBatches.length > 0 && highlightedIndex === index && selectedWarehouse && selectedCompany && (
                          <div className="mt-2 p-2 border rounded-md bg-gray-50" onClick={(e) => e.stopPropagation()}> {/* Prevent li onClick when clicking inside batch dropdown */}
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Avl Batches:</h4>
                            <ul className="space-y-1 max-h-40 overflow-y-auto">
                              {itemBatches.map((batch) => (
                                <li key={batch.name} className="flex items-center justify-between text-xs text-gray-600">
                                  <label htmlFor={`batch-${batch.name}`} className="flex items-center space-x-2 cursor-pointer">
                                    {/* <input
                                      type="checkbox"
                                      id={`batch-${batch.name}`}
                                      checked={!!selectedManualBatches[batch.name]}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelectedManualBatches(prev => {
                                          const newState = { ...prev };
                                          if (isChecked) {
                                            newState[batch.name] = batch.batch_qty > 0 ? 1 : 0; // Default to 1 or 0 if batch qty is 0
                                          } else {
                                            delete newState[batch.name];
                                          }
                                          return newState;
                                        });
                                      }}
                                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                    /> */}
                                    <span>{batch.name} (Exp: {batch.expiry_date} | Qty: {batch.batch_qty})</span>
                                  </label>
                                  {/* {!!selectedManualBatches[batch.name] && (
                                    <Input
                                      type="number"
                                      value={selectedManualBatches[batch.name] || 0}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setSelectedManualBatches(prev => ({
                                          ...prev,
                                          [batch.name]: Math.min(Math.max(0, val), batch.batch_qty) // Clamp between 0 and available batch qty
                                        }));
                                      }}
                                      min="0"
                                      max={batch.batch_qty}
                                      className="w-20 text-xs py-1 px-2"
                                      onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle
                                    />
                                  )} */}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <Plus
                          className="h-4 w-4 text-gray-400 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent li onClick from firing
                            handleDistributedQuantitySelection(item, quantity, Object.keys(selectedManualBatches)); // Use the new handler
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              {searchTerm.length < 2 ? 'Type at least 2 characters to search' : 'No items found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Add String.prototype.hashCode
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

interface CalculatedItem extends Item {
  itemAmount: number;
  discountAmt: number;
  cgstAmt: number;
  sgstAmt: number;
  igstAmt: number;
  totalAmt: number;
  payerAmount?: number;
  patientAmount?: number;
}

// Helper function to truncate to 2 decimal places (not round)
const truncateToTwoDecimals = (value: number): number => {
  return Math.ceil(value * 100) / 100;
};

const calculateItemTaxAndTotals = (item: Item, includedInPrintRate: boolean = false): CalculatedItem => {
  const mrp = item.rate !== null ? item.rate : 0; // MRP (already includes GST)
  const saleQty = item.saleQty || 0;
  const discountPercent = item.discountPercent || 0;
  const cgstPercent = item.cgstPercent || 0;
  const sgstPercent = item.sgstPercent || 0;
  const igstPercent = item.igstPercent || 0;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let taxableAmount = 0;
  let totalAmount = 0;
  let discountAmount = 0;
  let itemAmountAfterDiscount = 0;

  if (includedInPrintRate) {
    // MRP Inclusive GST Formula with Discount
    const totalGstRate = (cgstPercent + sgstPercent + igstPercent) / 100;

    if (totalGstRate > 0) {
      // Step 1: Calculate discount amount directly on MRP
      // Discount Amount = MRP × (Discount% / 100)
      const discountAmountPerUnit = mrp * (discountPercent / 100);
      discountAmount = discountAmountPerUnit * saleQty;

      // Step 2: Price after discount (includes GST)
      const priceAfterDiscountPerUnit = mrp - discountAmountPerUnit;
      // const totalPriceAfterDiscount = priceAfterDiscountPerUnit * saleQty;

      // Step 3: Remove GST from discounted price to get taxable amount
      // Taxable Amount = Price After Discount / (1 + GST% / 100)
      const taxableAmountPerUnit = priceAfterDiscountPerUnit / (1 + totalGstRate);
      taxableAmount = taxableAmountPerUnit * saleQty;

      // Step 4: Calculate GST amounts on taxable amount
      cgstAmount = taxableAmount * (cgstPercent / 100);
      sgstAmount = taxableAmount * (sgstPercent / 100);
      igstAmount = taxableAmount * (igstPercent / 100);

      // Step 5: Final amount = Taxable Amount + GST Amounts
      totalAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

      // Set item amount after discount (taxable amount)
      itemAmountAfterDiscount = taxableAmount;
    } else {
      // If no tax rates, handle as normal amount
      const baseAmount = mrp * saleQty;
      discountAmount = baseAmount * (discountPercent / 100);
      itemAmountAfterDiscount = baseAmount - discountAmount;
      taxableAmount = itemAmountAfterDiscount;
      totalAmount = itemAmountAfterDiscount;
    }
  } else {
    // For tax-exclusive rates, apply discount first, then calculate tax
    const baseAmount = mrp * saleQty;
    discountAmount = baseAmount * (discountPercent / 100);
    itemAmountAfterDiscount = baseAmount - discountAmount;
    taxableAmount = itemAmountAfterDiscount;

    // Calculate tax on the discounted taxable amount
    cgstAmount = taxableAmount * (cgstPercent / 100);
    sgstAmount = taxableAmount * (sgstPercent / 100);
    igstAmount = taxableAmount * (igstPercent / 100);

    // Total amount includes the calculated tax
    totalAmount = itemAmountAfterDiscount + cgstAmount + sgstAmount + igstAmount;
  }

  // Calculate payer and patient amounts based on co-pay percentage and pre-auth status
  const copayApplies = item.covered && item.preAuthStatus === 'Approved';
  let coPayPercent = copayApplies ? (item.coPayPercentage || 0) : 100;
  if (!item.covered) {
    coPayPercent = 0;
  }
  
  const patientAmount = totalAmount * (coPayPercent / 100);
  const payerAmount = totalAmount - patientAmount;

  return {
    ...item,
    coPayPercentage: !item.covered ? 0 : item.coPayPercentage,
    itemAmount: truncateToTwoDecimals(itemAmountAfterDiscount), // Amount after discount (taxable amount)
    discountAmt: truncateToTwoDecimals(discountAmount), // Discount amount calculated on MRP
    cgstAmt: truncateToTwoDecimals(cgstAmount),
    sgstAmt: truncateToTwoDecimals(sgstAmount),
    igstAmt: truncateToTwoDecimals(igstAmount),
    totalAmt: truncateToTwoDecimals(totalAmount), // Final amount after discount and tax
    cgstPercent: cgstPercent,
    sgstPercent: sgstPercent,
    igstPercent: igstPercent,
    payerAmount: truncateToTwoDecimals(payerAmount),
    patientAmount: truncateToTwoDecimals(patientAmount),
  };
};

export default function IPDBill() {
  const [remarks, setRemarks] = useState('');

  // --- START: Added state for file upload ---
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadedAttachments, setLoadedAttachments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  // --- END: Added state for file upload ---

  // Critical category dialog state
  const [criticalCategoryDialog, setCriticalCategoryDialog] = useState<{
    show: boolean;
    item: Item | null;
    categories: string[];
  }>({ show: false, item: null, categories: [] });

  // Handler functions for critical category dialog
  const handleCriticalCategoryConfirm = async () => {
    if (criticalCategoryDialog.item) {
      // Add the _skipHighAlertCheck flag to bypass the check on retry
      const itemToAdd = { ...criticalCategoryDialog.item, _skipHighAlertCheck: true };
      await handleAddItemToDetails(itemToAdd);
    }
    setCriticalCategoryDialog({ show: false, item: null, categories: [] });
  };

  const handleCriticalCategoryCancel = () => {
    setCriticalCategoryDialog({ show: false, item: null, categories: [] });
  };

  const router = useRouter();
  const { isAuthenticated, posProfile, setPosProfile, isInitialized, apiKey, apiSecret, checkUserRole, currentUser } = useAuth();
  const { classifications, fetchUserDefaultCompany, customers } = useFrappeApi();

  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  // const PATIENT_API_BASE_URL = "https://192.168.6.254:8085/masterdata/search-patient";
  const ITEM_DETAILS_API_URL = 'https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.item_details';

  // Function to fetch pricing rules for a specific customer
  const fetchPricingRules = async (customer: string): Promise<any[]> => {
    try {
      if (!customer || !apiKey || !apiSecret) {
        return [];
      }
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;



      const visitType = patientData?.visitType || "IP";

      const encodedCustomer = encodeURIComponent(customer);
      const baseFilters = [
        `["customer","=","${encodedCustomer}"]`,
        '["selling","=",1]',
        `["custom_visit_type","=","${visitType}"]`,
        `["disable","=",0]`
      ];

      let allPricingRules: any[] = [];

      if (transactionType === 'cash') {
        // Fetch cash-specific rules
        const cashFilters = [...baseFilters, '["custom_cash","=",1]'];
        const cashResponse = await fetch(`${API_BASE_URL}/Pricing%20Rule?filters=[${cashFilters.join(',')}]&fields=["name","title","discount_percentage","rate_or_discount","apply_on","for_price_list","valid_from","valid_upto","items","custom_is_landing_cost_applicable","margin_rate_or_amount"]&order_by=modified desc`,
          {
            method: 'GET',
            headers,
            credentials: 'include',
          }
        );

        if (cashResponse.ok) {
          const cashData = await cashResponse.json();
          if (cashData.data && Array.isArray(cashData.data)) {
            allPricingRules = allPricingRules.concat(cashData.data);
          }
        }

        // Fetch rules that apply to all transaction types
        const allFilters = [...baseFilters, '["custom_all","=",1]'];
        const allResponse = await fetch(`${API_BASE_URL}/Pricing%20Rule?filters=[${allFilters.join(',')}]&fields=["name","title","discount_percentage","rate_or_discount","apply_on","for_price_list","valid_from","valid_upto","items","custom_is_landing_cost_applicable","margin_rate_or_amount"]&order_by=modified desc`,
          {
            method: 'GET',
            headers,
            credentials: 'include',
          }
        );

        if (allResponse.ok) {
          const allData = await allResponse.json();
          if (allData.data && Array.isArray(allData.data)) {
            allPricingRules = allPricingRules.concat(allData.data);
          }
        }
      } else if (transactionType === 'credit') {
        // Fetch credit-specific rules
        const creditFilters = [...baseFilters, '["custom_credit","=",1]'];
        const creditResponse = await fetch(`${API_BASE_URL}/Pricing%20Rule?filters=[${creditFilters.join(',')}]&fields=["name","title","discount_percentage","rate_or_discount","apply_on","for_price_list","valid_from","valid_upto","items","custom_is_landing_cost_applicable","margin_rate_or_amount"]&order_by=modified desc`,
          {
            method: 'GET',
            headers,
            credentials: 'include',
          }
        );

        if (creditResponse.ok) {
          const creditData = await creditResponse.json();
          if (creditData.data && Array.isArray(creditData.data)) {
            allPricingRules = allPricingRules.concat(creditData.data);
          }
        }

        // Fetch rules that apply to all transaction types
        const allFilters = [...baseFilters, '["custom_all","=",1]'];
        const allResponse = await fetch(`${API_BASE_URL}/Pricing%20Rule?filters=[${allFilters.join(',')}]&fields=["name","title","discount_percentage","rate_or_discount","apply_on","for_price_list","valid_from","valid_upto","items","custom_is_landing_cost_applicable","margin_rate_or_amount"]&order_by=modified desc`,
          {
            method: 'GET',
            headers,
            credentials: 'include',
          }
        );

        if (allResponse.ok) {
          const allData = await allResponse.json();
          if (allData.data && Array.isArray(allData.data)) {
            allPricingRules = allPricingRules.concat(allData.data);
          }
        }
      }

      // Remove duplicates based on rule name
      const uniqueRules = allPricingRules.filter((rule, index, self) =>
        index === self.findIndex((r) => r.name === rule.name)
      );

      if (uniqueRules && Array.isArray(uniqueRules)) {
        // Fetch complete pricing rule documents with their items
        const pricingRulesWithItems = await Promise.all(
          uniqueRules.map(async (rule: any) => {
            try {
              // Fetch the complete pricing rule document to get items
              const ruleResponse = await fetch(`${API_BASE_URL}/Pricing%20Rule/${rule.name}`, {
                method: 'GET',
                headers,
                credentials: 'include',
              });

              if (ruleResponse.ok) {
                const ruleData = await ruleResponse.json();
                const fullRule = ruleData.data;
                rule.items = fullRule.items || [];
              } else {
                rule.items = [];
              }
            } catch (error) {
              console.error(`Error fetching pricing rule ${rule.name}:`, error);
              rule.items = [];
            }
            return rule;
          })
        );

        // Filter only valid pricing rules (within valid date range)
        const currentDate = new Date();
        return pricingRulesWithItems.filter((rule: any) => {
          if (!rule.disable) {
            // Check if rule is within valid date range
            const validFrom = rule.valid_from ? new Date(rule.valid_from) : null;
            const validTo = rule.valid_upto ? new Date(rule.valid_upto) : null;

            const isValidDate = (!validFrom || currentDate >= validFrom) &&
              (!validTo || currentDate <= validTo);

            return isValidDate;
          }
          return false;
        });
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }
  };

  // Function to apply pricing rules to item rates
  const applyPricingRules = async (items: Item[], customer: string): Promise<Item[]> => {
    try {
      if (!customer || !items.length) {
        return items;
      }

      const pricingRules = await fetchPricingRules(customer);

      if (!pricingRules.length) {
        return items;
      }

      return await Promise.all(items.map(async (item) => {
        const updatedItem = { ...item };

        for (const rule of pricingRules) {
          // Skip disabled pricing rules
          if (rule.disable) {
            continue;
          }

          // Check if this rule applies to the item
          let ruleApplies = false;

          if (rule.apply_on === 'Item Code') {
            // Check if item is in the rule's items list
            if (rule.items && rule.items.length > 0) {
              ruleApplies = rule.items.some((ruleItem: any) => ruleItem.item_code === item.itemCode);
            } else {
              ruleApplies = false;
            }
          } else if (rule.apply_on === 'Item Group' && rule.item_groups && rule.item_groups.length > 0) {
            ruleApplies = false;
          } else if (!rule.apply_on || rule.apply_on === 'Grand Total') {
            ruleApplies = true;
          }

          if (ruleApplies) {
            const originalRate = updatedItem.rate || 0;

            if (rule.custom_is_landing_cost_applicable) {
              if (rule.margin_rate_or_amount && rule.margin_rate_or_amount > 0) {
                const landingCost = await fetchLandingCost(item.itemCode, item.batchNo, 'Standard Selling');

                if (landingCost !== null && landingCost > 0) {
                  const marginAmount = (landingCost * rule.margin_rate_or_amount) / 100;
                  updatedItem.rate = landingCost + marginAmount;
                  updatedItem.appliedPricingRule = rule.name;
                  break;
                } else {
                  updatedItem.appliedPricingRule = rule.name;
                  break;
                }
              }
            } else if (rule.discount_percentage && rule.discount_percentage > 0) {
              const discountAmount = (originalRate * rule.discount_percentage) / 100;
              updatedItem.rate = originalRate - discountAmount;
              updatedItem.appliedPricingRule = rule.name;
              break;
            }
          }
        }

        return updatedItem;
      }));

    } catch (error) {
      console.error('Error applying pricing rules:', error);
      return items;
    }
  };


  const fetchLandingCost = async (itemCode: string, batchNo: string | null, priceList: string): Promise<number | null> => {
    try {
      const authHeaders = getAuthHeaders();
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const filters = [
        ["item_code", "=", itemCode],
        ["price_list", "=", priceList]
      ];
      if (batchNo) {
        filters.push(["batch_no", "=", batchNo]);
      }

      const response = await fetch(`${API_BASE_URL}/Item%20Price?filters=${JSON.stringify(filters)}&fields=["custom_landing_cost", "valid_from", "valid_upto"]&order_by=valid_from desc&limit=1`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const itemPrice = data.data[0];
        const currentDate = new Date();
        const validFrom = itemPrice.valid_from ? new Date(itemPrice.valid_from) : null;
        const validUpto = itemPrice.valid_upto ? new Date(itemPrice.valid_upto) : null;

        const isValidPrice = (!validFrom || currentDate >= validFrom) &&
          (!validUpto || currentDate <= validUpto);

        if (isValidPrice && itemPrice.custom_landing_cost) {
          return itemPrice.custom_landing_cost;
        }
      }
    } catch (error) {
      console.error('Error fetching landing cost from Item Price:', error);
    }
    return null;
  };


  // Function to fetch item batches filtered by warehouse and company
  const fetchItemBatches = async (itemCode: string) => {
    try {
      if (!selectedWarehouse) {
        console.warn('No warehouse selected, cannot fetch batches');
        return [];
      }

      if (!selectedCompany) {
        console.warn('No company selected, cannot fetch batches');
        return [];
      }

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Call the new API method that filters by warehouse and company
      const response = await fetch('https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_item_batches_by_warehouse_and_company', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          item_code: itemCode,
          warehouse: selectedWarehouse,
          company: selectedCompany
        })
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (data.message) {
        return data.message;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching batches:', error);
      return [];
    }
  };

  // Function to fetch item batches with explicit warehouse and company parameters
  const fetchItemBatchesWithParams = async (itemCode: string, warehouse: string, company: string) => {
    try {
      if (!warehouse) {
        console.warn('No warehouse provided, cannot fetch batches');
        return [];
      }

      if (!company) {
        console.warn('No company provided, cannot fetch batches');
        return [];
      }

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Call the new API method that filters by warehouse and company
      const response = await fetch('https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_item_batches_by_warehouse_and_company', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          item_code: itemCode,
          warehouse: warehouse,
          company: company
        })
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (data.message) {
        return data.message;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching batches:', error);
      return [];
    }
  };

  // Function to get batch quantity
  const getBatchQty = async (itemCode: string, batchNo: string, warehouse: string) => {
    if (!batchNo || !warehouse) return 0;
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const resp = await fetch('https://gmcerp.quantcloud.in/api/method/erpnext.stock.doctype.batch.batch.get_batch_qty', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ item_code: itemCode, batch_no: batchNo, warehouse })
      });
      if (!resp.ok) return 0;
      const data = await resp.json();
      // ERPNext method typically returns a number in message or data
      return (data.message !== undefined ? data.message : data.data) || 0;
    } catch (e) {
      console.error('Error getting batch qty:', e);
      return 0;
    }
  };

  // Function to fetch item price based on item, batch and price list
  const fetchItemPrice = async (itemCode: string, batchNo: string | null, priceList: string) => {
    let rate: number | null = null;
    // Try to fetch from Item Price doctype first
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const filters = [
        ["item_code", "=", itemCode],
        ["price_list", "=", priceList]
      ];
      if (batchNo) {
        filters.push(["batch_no", "=", batchNo]);
      }

      const response = await fetch(`${API_BASE_URL}/Item%20Price?filters=${JSON.stringify(filters)}&fields=["price_list_rate", "valid_from", "valid_upto", "custom_landing_cost"]&order_by=valid_from desc&limit=1`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const itemPrice = data.data[0];
        const currentDate = new Date();
        const validFrom = itemPrice.valid_from ? new Date(itemPrice.valid_from) : null;
        const validUpto = itemPrice.valid_upto ? new Date(itemPrice.valid_upto) : null;

        const isValidPrice = (!validFrom || currentDate >= validFrom) &&
          (!validUpto || currentDate <= validUpto);

        if (isValidPrice && itemPrice.price_list_rate) {
          rate = itemPrice.price_list_rate;
          return rate;
        }
      }
    } catch (error) {
      console.error('Error fetching item price from Price List:', error);
    }

    // If not found in Price List or not valid, try to fetch custom_mrp from Batch
    if (batchNo) {
      try {
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;
        const response = await fetch(`${API_BASE_URL}/Batch?filters=[["item", "=", "${itemCode}"], ["name", "=", "${batchNo}"]]&fields=["custom_mrp"]&limit=1`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        const data = await response.json();
        if (data.data && data.data.length > 0 && data.data[0].custom_mrp) {
          rate = data.data[0].custom_mrp;
        }
      } catch (error) {
        console.error('Error fetching custom_mrp from Batch:', error);
      }
    }
    return rate;
  };

  // Function to fetch bin_location from Item doctype's custom_item_consumption_details
  const fetchBinLocationFromItem = async (itemCode: string) => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Fetch the entire Item document
      const response = await fetch(`${API_BASE_URL}/Item/${itemCode}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        return "";
      }

      const data = await response.json();

      // Try different possible field names for the child table
      const childTableNames = ['custom_item_consumption_details', 'item_consumption_details', 'consumption_details'];

      for (const fieldName of childTableNames) {
        if (data.data?.[fieldName]) {
          if (Array.isArray(data.data[fieldName]) && data.data[fieldName].length > 0) {
            const binLocation = data.data[fieldName][0].bin_location;
            if (binLocation) {
              return binLocation;
            }
          }
        }
      }

      // If no child table found, try direct bin_location field
      if (data.data?.bin_location) {
        return data.data.bin_location;
      }

      return "";
    } catch (error) {
      console.error('[BinLocation] Error fetching bin location:', error);
      return "";
    }
  };

  const classificationTypeOptions = classifications;

  // const [searchValue, setSearchValue] = useState<string>("");
  const [requisitionDate, setRequisitionDate] = useState<Date | undefined>(undefined);
  const [requisitionNo, setRequisitionNo] = useState('');
  const [requisitionFrom, setRequisitionFrom] = useState('');
  const [requisitionTo] = useState('');
  const [initialLoading, setInitialLoading] = useState(true); // New state for splash screen

  const [_toLocation, setToLocation] = useState('');
  const [barcode, setBarcode] = useState('');
  const [reqId, setReqId] = useState('');
  const [isReqIdReadonly, setIsReqIdReadonly] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle barcode scanning
  const handleBarcodeScan = async (scannedBarcode: string) => {
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Fetch batch details using the barcode
      const response = await fetch(`${API_BASE_URL}/Batch/${scannedBarcode}`, {

        headers,
      });

      if (!response.ok) {
        showAlert('danger', 'Error', `Batch not found for barcode: ${scannedBarcode}`);
        setBarcode(''); // Clear barcode input
        return;
      }

      const batchData = await response.json();
      const batch = batchData.data;

      if (!batch) {
        showAlert('danger', 'Error', `Batch not found for barcode: ${scannedBarcode}`);
        setBarcode('');
        return;
      }

      // Check if batch has stock in selected warehouse
      let stockQty = 0;
      if (selectedWarehouse) {
        try {
          const batchQtyResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/erpnext.stock.utils.get_stock_balance`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              item_code: batch.item,
              warehouse: selectedWarehouse,
              batch_no: batch.name,
            }),
          });

          if (batchQtyResponse.ok) {
            const stockData = await batchQtyResponse.json();
            stockQty = stockData.message || 0;
          }
        } catch (error) {
          console.error('Error checking stock balance:', error);
        }
      } else {
        stockQty = batch.batch_qty || 0;
      }

      // Only show stock warning if we have a warehouse selected and stock is 0
      if (selectedWarehouse && stockQty <= 0) {
        showAlert('warning', 'Warning', `Item ${batch.item_name} has no stock in warehouse ${selectedWarehouse}. Adding anyway.`);
        // Don't return, continue to add the item
      }

      // Fetch item details
      const itemResponse = await fetch(`${API_BASE_URL}/Item/${batch.item}`, {
        headers,
      });

      if (!itemResponse.ok) {
        showAlert('danger', 'Error', `Item not found: ${batch.item}`);
        setBarcode('');
        return;
      }

      const itemData = await itemResponse.json();
      const item = itemData.data;

      // Check if item already exists in the table with the same batch
      const existingItemIndex = items.findIndex(
        (item) => item.itemCode === batch.item && item.batchNo === batch.name
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...items];
        updatedItems[existingItemIndex].saleQty += 1;
        updatedItems[existingItemIndex].stockQty = stockQty;

        // Recalculate totals for updated item
        const recalculatedItem = calculateItemTaxAndTotals(updatedItems[existingItemIndex], item.included_in_print_rate || false);
        updatedItems[existingItemIndex] = recalculatedItem;

        setItems(updatedItems);
        recalculateTotals?.(updatedItems);
      } else {
        // Create new item
        const newItem: Item = {
          id: Date.now().toString(),
          alternateBatches: '',
          substituteItem: '',
          itemCode: batch.item,
          itemName: batch.item_name || item.item_name,
          uom: item.stock_uom || 'Nos',
          stockQty: stockQty,
          orderedQty: 0,
          saleQty: 1,
          batch: batch.name,
          batchNo: batch.name,
          expiryDate: batch.expiry_date || '',
          batchStockQty: stockQty,
          rate: batch.custom_mrp || 0, // Use custom_mrp from batch as Unit Sale Rate
          taxTemplate: item.taxes_and_charges || '',
          description: item.description || '',
          itemAmount: 0,
          discountPercent: 0,
          discountAmt: 0,
          cgstPercent: 0,
          cgstAmt: 0,
          sgstPercent: 0,
          sgstAmt: 0,
          igstPercent: 0,
          igstAmt: 0,
          totalAmt: 0,
          kitName: '',
          totalPckgAmt: 0,
          packageName: '',
          binLocation: '',
          mrp: batch.custom_mrp,
          hasStock: stockQty > 0,
        };

        // Calculate tax and totals for the new item
        const calculatedItem = calculateItemTaxAndTotals(newItem, item.included_in_print_rate || false);

        const updatedItems = [...items, calculatedItem];
        setItems(updatedItems);
        recalculateTotals?.(updatedItems);
      }

      showAlert('success', 'Success', `Item ${batch.item_name} added to bill`);
      setBarcode(''); // Clear barcode input after successful addition

    } catch (error) {
      console.error('Error processing barcode:', error);
      showAlert('danger', 'Error', 'Failed to process barcode');
      setBarcode('');
    }
  };

  useEffect(() => {
    if (barcode && barcode.trim()) {
      handleBarcodeScan(barcode.trim());
    }
  }, [barcode]);
  const [selectedKit, setSelectedKit] = useState('');
  const [selectedSaleType, setSelectedSaleType] = useState('');
  const [isRoutine, setIsRoutine] = useState(false);
  const [isStat, setIsStat] = useState(false);
  const [isDischarge, setIsDischarge] = useState(false);
  const [isAsap, setIsAsap] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isGeneric, setIsGeneric] = useState(false);
  const [globalCoPayPercent, setGlobalCoPayPercent] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [patientData, setPatientData] = useState<SelectedPatient | null>(null);
  const [rawPatientData, setRawPatientData] = useState<any | null>(null);

  // Holds the preauth-eligible item IDs for the currently selected patient.
  // Pure lookup data read during item search — never rendered, so a ref
  // avoids triggering a re-render every time a patient is selected.
  const preauthItemIdsRef = useRef<Map<string, { isIncluded: boolean, isPreAuthRequired: boolean }>>(new Map());
  const opdCardRef = useRef<OpdCardRef>(null);
  const prescriptionVisitIdRef = useRef<string>("");
  const [payerDetailsFromSearch, setPayerDetailsFromSearch] = useState(false);
  const [selectedPayerCompanyId, setSelectedPayerCompanyId] = useState<string>('');
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  const [_showDropdown, setShowDropdown] = useState(false);
  const [showPosProfileSelector, setShowPosProfileSelector] = useState(false);
  const [showPatientRequisitionList, setShowPatientRequisitionList] = useState(false);
  const [showPrescriptionList, setShowPrescriptionList] = useState(false);
  // const [showDocumentUpload, setShowDocumentUpload] = useState(false); // This state is now managed above
  const [kitOptions, setKitOptions] = useState<{ label: string; value: string }[]>([]);
  const [showAlternativeItemsPopover, setShowAlternativeItemsPopover] = useState(false);
  const [itemSeekingAlternatives, setItemSeekingAlternatives] = useState<Item | null>(null);
  const [alternativeItems, setAlternativeItems] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<string>('');
  const selectedHospital = '';
  const [showViewPosInvoicesModal, setShowViewPosInvoicesModal] = useState(false); // New state for View POS Invoices modal
  const [_isItemsLoadedFromRequisitionOrPrescription, setIsItemsLoadedFromRequisitionOrPrescription] = useState(false); // Track if items are loaded from requisition or prescription
  const [sourceDocumentName, setSourceDocumentName] = useState<string>(''); // Track the source document name (requisition or prescription)
  const [sourceDocumentType, setSourceDocumentType] = useState<'requisition' | 'prescription' | ''>(''); // Track the source document type

  const [showSelectInvoiceModal, setShowSelectInvoiceModal] = useState(false);
  const [_showCreateReturnModal, setShowCreateReturnModal] = useState(false);
  const [_selectedInvoiceForReturn, setSelectedInvoiceForReturn] = useState<any>(null);
  const [loadedInvoiceName, setLoadedInvoiceName] = useState<string | null>(null);
  const [loadedInvoiceDocstatus, setLoadedInvoiceDocstatus] = useState<number>(0);
  const [isLoadingFromPosInvoice, setIsLoadingFromPosInvoice] = useState<boolean>(false);

  // Global discount state
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);

  const [transactionType, setTransactionType] = useState<'cash' | 'credit'>('credit');

  const [isIpdEffect, setIsIpdEffect] = useState(true);

  const isDischargedFlag = Boolean(
    patientData?.isDischarged ||
    rawPatientData?.isDischarged === true ||
    rawPatientData?.isDischarged === "true" ||
    rawPatientData?.isDischarged === 1 ||
    rawPatientData?.is_discharged === true ||
    rawPatientData?.is_discharged === "true" ||
    rawPatientData?.is_discharged === 1 ||
    rawPatientData?.discharged === true ||
    rawPatientData?.discharged === "true" ||
    rawPatientData?.discharged === 1
  );

  const isFinalBillDoneFlag = Boolean(
    rawPatientData?.isFinalBillDone === true ||
    rawPatientData?.isFinalBillDone === "true" ||
    rawPatientData?.isFinalBillDone === 1 ||
    rawPatientData?.is_final_bill_done === true ||
    rawPatientData?.is_final_bill_done === "true" ||
    rawPatientData?.is_final_bill_done === 1 ||
    rawPatientData?.final_bill_done === true ||
    rawPatientData?.final_bill_done === "true" ||
    rawPatientData?.final_bill_done === 1
  );

  const isDischargedPatient = isDischargedFlag || isFinalBillDoneFlag;

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalMessage, setStatusModalMessage] = useState("");

  useEffect(() => {
    if (isDischargedFlag && isFinalBillDoneFlag) {
      setIsIpdEffect(false);
      setStatusModalMessage('This patient is already discharged and final bill is done.');
      setStatusModalOpen(true);
    } else if (isDischargedFlag) {
      setIsIpdEffect(false);
      setStatusModalMessage('This patient is already discharged.');
      setStatusModalOpen(true);
    } else if (isFinalBillDoneFlag) {
      setIsIpdEffect(false);
      setStatusModalMessage('Final bill is done for this patient.');
      setStatusModalOpen(true);
    }
  }, [isDischargedFlag, isFinalBillDoneFlag]);

  // New state variables for tax details
  const [taxTemplate, setTaxTemplate] = useState<string>('');
  const [cgstAccounts, setCgstAccounts] = useState<any[]>([]);
  const [sgstAccounts, setSgstAccounts] = useState<any[]>([]);
  const [igstAccounts, setIgstAccounts] = useState<any[]>([]);
  const [gstCategory, setGstCategory] = useState<string>('');
  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState<number>(0);
  const [totalCgstAmount, setTotalCgstAmount] = useState<number>(0);
  const [totalSgstAmount, setTotalSgstAmount] = useState<number>(0);
  const [totalIgstAmount, setTotalIgstAmount] = useState<number>(0);
  const [totalPayerAmount, setTotalPayerAmount] = useState<number>(0);
  const [totalPatientAmount, setTotalPatientAmount] = useState<number>(0);
  const [showClosingEntryModal, setShowClosingEntryModal] = useState(false); // New state
  const [CompanyAddress, setCompanyAddress] = useState<string | null>(null);
  const [isReturn, setIsReturn] = useState(false);
  const [isReturnInvoice, setIsReturnInvoice] = useState(false);
  const [isDirectReturn, setIsDirectReturn] = useState(false);
  const [returnAgainstInvoice, setReturnAgainstInvoice] = useState<string>('');
  const [roundedGrandTotal, setRoundedGrandTotal] = useState<number>(0);
  // Payments captured from RecordPaymentModal
  const [recordedPayments, setRecordedPayments] = useState<Array<{
    id: number;
    name?: string; // Frappe child table row identifier
    paymentMode: string;
    transactionNo: string;
    bankName: string;
    branchName: string;
    paidAmount: string;
    paymentDate: string;
    approvalNo: string;
    custom_bank_name?: string;
    custom_branch_name?: string;
    custom_transaction_no?: string;
  }>>([]);

  // Permission state for rate changes
  const [canChangeRate, setCanChangeRate] = useState(false);

  // Loading state for save/submit operations
  const [isSaving, setIsSaving] = useState(false);

  // Payer details state
  const [payerCategory, setPayerCategory] = useState<string>('');
  const [payerName, setPayerName] = useState<string>('');
  const [subInsurance, setSubInsurance] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [insuranceNo, setInsuranceNo] = useState<string>('');
  const [validityFrom, setValidityFrom] = useState<Date | undefined>();
  const [expiryValidityTo, setExpiryValidityTo] = useState<Date | undefined>();
  const [otherNo, setOtherNo] = useState<string>('');

  // Dropdown options for payer fields
  const [payerCategoryOptions, setPayerCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [payerNameOptions, setPayerNameOptions] = useState<{ label: string; value: string }[]>([]);
  const [subInsuranceOptions, setSubInsuranceOptions] = useState<{ label: string; value: string }[]>([]);
  const [networkOptions, setNetworkOptions] = useState<{ label: string; value: string }[]>([]);

  // Auto-select default self-paid customer once data is available
  useEffect(() => {
    if (selectedCustomer) return;
    if (!customers || customers.length === 0) return;

    const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
    if (defaultSelfPaidCustomer) {
      setSelectedCustomer(defaultSelfPaidCustomer.value);
    }
  }, [customers, selectedCustomer]);

  // Check if user has permission to change sale rate
  useEffect(() => {
    const checkRolePermission = async () => {
      try {
        const hasPermission = await checkUserRole("Allow Sale Rate Change");
        setCanChangeRate(hasPermission);
      } catch (error) {
        console.error("Error checking user role:", error);
        setCanChangeRate(false);
      }
    };

    if (isAuthenticated && isInitialized) {
      checkRolePermission();
    }
  }, [isAuthenticated, isInitialized, checkUserRole]);

  // Auto-load POS invoice if passed via URL or sessionStorage
  useEffect(() => {
    if (!isInitialized || !apiKey || !apiSecret) return;

    const urlParams = new URLSearchParams(window.location.search);
    const invFromUrl = urlParams.get('invoice');
    const invFromSession = sessionStorage.getItem('load_pos_invoice_name');
    const targetInvoiceName = invFromUrl || invFromSession;

    if (targetInvoiceName) {
      sessionStorage.removeItem('load_pos_invoice_name');
      handleLoadInvoice({ name: targetInvoiceName });
    }
  }, [isInitialized, apiKey, apiSecret]);

  // Handle direct return checkbox changes
  useEffect(() => {
    if (isReturn && !isReturnInvoice) {
      setIsReturnInvoice(true);
      setIsDirectReturn(true);
    } else if (!isReturn && isReturnInvoice) {
      setIsReturnInvoice(false);
      setIsDirectReturn(false);
    }
  }, [isReturn]);

  useEffect(() => {
    if (items.length > 0 && selectedCustomer) {
      applyPricingRulesToExistingItems();
    }
  }, [transactionType]);

  useEffect(() => {
    if (items.length > 0) {
      applyPricingRulesToExistingItems();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (items.length > 0 && selectedCustomer && patientData?.visitType) {
      applyPricingRulesToExistingItems();
    }
  }, [patientData?.visitType]);

  const applyPricingRulesToExistingItems = async () => {
    if (!selectedCustomer || items.length === 0) {
      return;
    }

    try {
      const updatedItems = await applyPricingRules(items, selectedCustomer);

      if (updatedItems && updatedItems.length > 0) {
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error reapplying pricing rules:', error);
      showAlert('danger', 'Error', 'Failed to reapply pricing rules. Please try again.');
    }
  };

  // Function to check if sale exists for requisition
  // const checkSaleExistsForRequisition = async (reqNo: string): Promise<boolean> => {
  //   try {
  //     const headers: HeadersInit = {
  //       'Content-Type': 'application/json',
  //       'Authorization': `token ${apiKey}:${apiSecret}`,
  //     };

  //     const response = await fetch(
  //       `${API_BASE_URL}/POS%20Invoice?filters=[["custom_req_no","=","${reqNo}"]]&fields=["name"]&limit_page_length=1`,
  //       {
  //         method: 'GET',
  //         headers,
  //         credentials: 'include',
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       return data.data && data.data.length > 0;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error("Error checking sale for requisition:", error);
  //     return false;
  //   }
  // };

  // Function to get total and invoiced quantities for a requisition
  const getRequisitionQuantities = async (reqNo: string): Promise<{ total_qty: number; invoiced_qty: number }> => {
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;


      // Get total quantity from requisition items
      const reqResponse = await fetch(
        `${API_BASE_URL}/Patient%20Requisition/${reqNo}?fields=["name","patient_requisition_item_details"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!reqResponse.ok) {
        console.error("Failed to fetch requisition details");
        return { total_qty: 0, invoiced_qty: 0 };
      }

      const reqData = await reqResponse.json();
      const requisitionItems = reqData.data?.patient_requisition_item_details || [];

      // Try different field names for quantity
      const totalQty = requisitionItems.reduce((sum: number, item: any) => {
        const qty = item.req_qty || item.quantity || item.qty || item.ordered_qty || item.requested_qty || 0;
        return sum + qty;
      }, 0);

      // Get invoiced quantity from Sale bills
      const invoiceResponse = await fetch(
        `${API_BASE_URL}/Sale%20Bill?filters=[["custom_req_no","=","${reqNo}"],["docstatus","=",1]]&fields=["name","custom_req_no"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!invoiceResponse.ok) {
        console.error("Failed to fetch invoice details");
        return { total_qty: totalQty, invoiced_qty: 0 };
      }

      const invoiceData = await invoiceResponse.json();
      const invoices = invoiceData.data || [];
      console.log("Invoices for requisition", reqNo, ":", invoices);
      let invoicedQty = 0;

      // Fetch full invoice details for each invoice to get items
      for (const invoice of invoices) {
        console.log("Processing invoice:", invoice.name, "custom_req_no:", invoice.custom_req_no);

        try {
          const fullInvoiceResponse = await fetch(
            `${API_BASE_URL}/Sale%20Bill/${invoice.name}?fields=["name","items"]`,
            {
              method: 'GET',
              headers,
              credentials: 'include',
            }
          );

          if (fullInvoiceResponse.ok) {
            const fullInvoiceData = await fullInvoiceResponse.json();
            const fullInvoice = fullInvoiceData.data;

            if (fullInvoice?.items) {
              console.log("Invoice items:", fullInvoice.items);
              const invoiceQty = fullInvoice.items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);
              invoicedQty += invoiceQty;
              console.log("Invoice qty:", invoiceQty, "Total invoiced so far:", invoicedQty);
            }
          }
        } catch (error) {
          console.error("Failed to fetch full invoice details for", invoice.name, ":", error);
        }
      }

      console.log("Final quantities - Total:", totalQty, "Invoiced:", invoicedQty);
      return { total_qty: totalQty, invoiced_qty: invoicedQty };
    } catch (error) {
      console.error("Error getting requisition quantities:", error);
      return { total_qty: 0, invoiced_qty: 0 };
    }
  };

  // Function to get invoiced quantity for a specific item from a requisition
  const getItemInvoicedQuantity = async (reqNo: string, itemCode: string): Promise<number> => {
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;


      console.log(`Getting invoiced quantity for item ${itemCode} in requisition ${reqNo}`);

      // Get all invoices for this requisition
      const invoiceResponse = await fetch(
        `${API_BASE_URL}/Sale%20Bill?filters=[["custom_req_no","=","${reqNo}"],["docstatus","=",1]]&fields=["name","custom_req_no"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!invoiceResponse.ok) {
        console.error("Failed to fetch invoice details for item quantity calculation");
        return 0;
      }

      const invoiceData = await invoiceResponse.json();
      const invoices = invoiceData.data || [];
      console.log(`Found ${invoices.length} invoices for requisition ${reqNo}:`, invoices.map(inv => inv.name));

      let totalInvoicedQty = 0;

      // Fetch full invoice details for each invoice to get items
      for (const invoice of invoices) {
        try {
          const fullInvoiceResponse = await fetch(
            `${API_BASE_URL}/Sale%20Bill/${invoice.name}?fields=["name","items"]`,
            {
              method: 'GET',
              headers,
              credentials: 'include',
            }
          );

          if (fullInvoiceResponse.ok) {
            const fullInvoiceData = await fullInvoiceResponse.json();
            const fullInvoice = fullInvoiceData.data;

            console.log(`Processing invoice ${invoice.name} for item ${itemCode}`);

            if (fullInvoice?.items) {
              console.log(`Invoice ${invoice.name} has ${fullInvoice.items.length} items:`, fullInvoice.items.map((item: any) => ({ item_code: item.item_code, qty: item.qty })));

              // Sum quantities for the specific item code
              const itemInvoiceQty = fullInvoice.items
                .filter((item: any) => item.item_code === itemCode)
                .reduce((sum: number, item: any) => sum + (item.qty || 0), 0);

              console.log(`Item ${itemCode} quantity in invoice ${invoice.name}: ${itemInvoiceQty}`);
              totalInvoicedQty += itemInvoiceQty;
            }
          } else {
            console.error(`Failed to fetch full invoice details for ${invoice.name}:`, fullInvoiceResponse.status);
          }
        } catch (error) {
          console.error("Failed to fetch full invoice details for", invoice.name, ":", error);
        }
      }

      console.log(`Item ${itemCode} in requisition ${reqNo}: Invoiced quantity = ${totalInvoicedQty}`);
      return totalInvoicedQty;
    } catch (error) {
      console.error("Error getting item invoiced quantity:", error);
      return 0;
    }
  };

  // Function to get invoiced quantity for a specific item from a prescription
  const getItemInvoicedQuantityFromPrescription = async (prescriptionNo: string, itemCode: string): Promise<number> => {
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Get all invoices for this prescription
      const invoiceResponse = await fetch(
        `${API_BASE_URL}/Sale%20Bill?filters=[["custom_req_no","=","${prescriptionNo}"],["docstatus","=",1]]&fields=["name","custom_req_no"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!invoiceResponse.ok) {
        console.error("Failed to fetch invoice details for prescription item quantity calculation");
        return 0;
      }

      const invoiceData = await invoiceResponse.json();
      const invoices = invoiceData.data || [];
      let totalInvoicedQty = 0;

      // Fetch full invoice details for each invoice to get items
      for (const invoice of invoices) {
        try {
          const fullInvoiceResponse = await fetch(
            `${API_BASE_URL}/Sale%20Bill/${invoice.name}?fields=["name","items"]`,
            {
              method: 'GET',
              headers,
              credentials: 'include',
            }
          );

          if (fullInvoiceResponse.ok) {
            const fullInvoiceData = await fullInvoiceResponse.json();
            const fullInvoice = fullInvoiceData.data;

            if (fullInvoice?.items) {
              // Sum quantities for the specific item code
              const itemInvoiceQty = fullInvoice.items
                .filter((item: any) => item.item_code === itemCode)
                .reduce((sum: number, item: any) => sum + (item.qty || 0), 0);
              totalInvoicedQty += itemInvoiceQty;
            }
          }
        } catch (error) {
          console.error("Failed to fetch full invoice details for", invoice.name, ":", error);
        }
      }

      console.log(`Item ${itemCode} in prescription ${prescriptionNo}: Invoiced quantity = ${totalInvoicedQty}`);
      return totalInvoicedQty;
    } catch (error) {
      console.error("Error getting prescription item invoiced quantity:", error);
      return 0;
    }
  };

  // Function to check if requisition is fully completed
  const isRequisitionFullyCompleted = async (reqNo: string): Promise<boolean> => {
    const { total_qty, invoiced_qty } = await getRequisitionQuantities(reqNo);
    return total_qty > 0 && invoiced_qty >= total_qty;
  };

  // Function to update requisition status
  const updateRequisitionStatus = async (reqNo: string, forceComplete: boolean = false): Promise<void> => {
    try {
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      let status = "Pending";

      if (forceComplete) {
        status = "Completed";
        console.log("Force completing requisition:", reqNo);
      } else {
        // Check current status based on quantities
        const { total_qty, invoiced_qty } = await getRequisitionQuantities(reqNo);
        console.log("Checking requisition status - Total:", total_qty, "Invoiced:", invoiced_qty);

        if (total_qty > 0 && invoiced_qty >= total_qty) {
          status = "Completed";
          console.log("Requisition marked as Completed");
        } else {
          status = "Pending";
          console.log("Requisition marked as Pending");
        }
      }

      console.log("Updating requisition", reqNo, "status to:", status);

      // Update the requisition status
      const response = await fetch(
        `${API_BASE_URL}/Patient%20Requisition/${reqNo}`,
        {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            custom_requisition_status: status
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update requisition status:", errorData);
      } else {
        const result = await response.json();
        console.log(`Requisition ${reqNo} status updated to: ${status}`, result);

        // Verify the update by fetching the requisition again
        try {
          const verifyResponse = await fetch(
            `${API_BASE_URL}/Patient%20Requisition/${reqNo}?fields=["name","custom_requisition_status"]`,
            {
              method: 'GET',
              headers,
              credentials: 'include',
            }
          );

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log("Verification - Current status in database:", verifyData.data?.custom_requisition_status);
          }
        } catch (verifyError) {
          console.error("Failed to verify status update:", verifyError);
        }
      }
    } catch (error) {
      console.error("Error updating requisition status:", error);
    }
  };

  // --- START: Added function to clear file ---
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the modal from opening
    setSelectedDocument(null);
  };
  // --- END: Added function to clear file ---

  // --- START: File upload function ---
  const uploadFile = async (file: File, invoiceName?: string): Promise<string | null> => {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('is_private', '0'); // Make file public
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Remove Content-Type header for FormData uploads to let browser set it with boundary
      delete headers['Content-Type'];

      const response = await fetch('https://gmcerp.quantcloud.in/api/method/upload_file', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("File upload failed:", response.status, errorData);
        showAlert("danger", "Upload Error", `Failed to upload file: ${errorData.message || 'Unknown error'}`);
        return null;
      }

      const result = await response.json();
      console.log("File upload result:", result);

      if (result.message && result.message.file_url) {
        const fileUrl = result.message.file_url;
        const fileName = result.message.file_name || file.name;

        // If invoice name is provided, create a File document linked to the invoice
        if (invoiceName) {
          try {
            const authHeaders = getAuthHeaders();
            // Convert HeadersInit to plain object for fetch compatibility
            const headers = typeof authHeaders === 'string' ?
              JSON.parse(authHeaders) :
              Array.isArray(authHeaders) ?
                Object.fromEntries(authHeaders) :
                authHeaders;
            const fileDocResponse = await fetch('https://gmcerp.quantcloud.in/api/resource/File', {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify({
                doctype: 'File',
                file_name: fileName,
                file_url: fileUrl,
                attached_to_doctype: 'POS Invoice',
                attached_to_name: invoiceName,
                is_private: 0,
                folder: 'Home/Attachments'
              }),
            });

            if (fileDocResponse.ok) {
              console.log("File document created and linked to invoice:", invoiceName);
            } else {
              console.error("Failed to create File document:", await fileDocResponse.json());
              // Still return the URL even if linking failed
            }
          } catch (error) {
            console.error("Error creating File document:", error);
            // Still return the URL even if linking failed
          }
        }

        return fileUrl;
      } else {
        console.error("Invalid file upload response:", result);
        showAlert("danger", "Upload Error", "Invalid response from server");
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showAlert("danger", "Upload Error", "Error uploading file. Please try again.");
      return null;
    }
  };
  // --- END: File upload function ---

  const handleCheckPreAuthStatus = async () => {
    const visitIdToCheck = prescriptionVisitIdRef.current || patientData?.visitID;
    if (!visitIdToCheck) {
      showAlert("danger", "Error", "No visit ID found");
      return;
    }

    try {
      const authHeaders = getAuthHeaders();
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      console.log('Selected visit_id:', visitIdToCheck);
      const url = `https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.preauth_api.get_service_status_by_visit_id?visit_id=${encodeURIComponent(visitIdToCheck)}`;
      console.log('Backend API endpoint being called:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      console.log('HTTP response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Complete backend response:', responseData);

      const statuses = responseData?.message?.data || responseData?.data || [];
      console.log('Number of status records received:', statuses.length);

      if (statuses.length > 0) {
        setItems((prevItems: any) => {
          const newItems = prevItems.map((item: any) => {
            console.log(`Checking match for item: itemId=${item.custom_his_item_id}, qbItemId=${item.itemCode}`);
            const matchedStatus = statuses.find((s: any) => {
              const hasValidItemId = s.itemId && s.itemId !== "00000000-0000-0000-0000-000000000000";
              const matchesItemId = hasValidItemId && s.itemId === item.custom_his_item_id;
              const matchesQbItemId = s.qbItemId && (s.qbItemId === item.itemCode || s.qbItemId === item.itemName);
              return matchesItemId || matchesQbItemId;
            });

            if (matchedStatus && matchedStatus.statusName) {
              console.log(`Match found for item ${item.itemCode}. Updating PreAuth Status to: ${matchedStatus.statusName}`);
              return {
                ...item,
                preAuthStatus: matchedStatus.statusName.charAt(0).toUpperCase() + matchedStatus.statusName.slice(1).toLowerCase(),
                preAuthNo: matchedStatus.preAuthNumber || item.preAuthNo,
                preAuthDateTime: matchedStatus.preAuthDate || item.preAuthDateTime
              };
            }
            return item;
          });
          console.log('Final table state after update:', newItems);
          return newItems;
        });
        showAlert("success", "Success", "Pre-auth statuses updated successfully.");
      } else {
        showAlert("warning", "Notice", "No pre-auth statuses found for this visit.");
      }
    } catch (error: any) {
      console.error('GetServiceStatusByVisitId API error response:', error);
      showAlert("danger", "Error", "Failed to fetch pre-auth status.");
    }
  };

  const handleReset = () => {
    prescriptionVisitIdRef.current = "";
    setRemarks('');
    setShowDocumentUpload(false);
    setSelectedDocument(null);
    setLoadedAttachments([]); // Clear loaded attachments
    setHoveredAttachment(null); // Clear hovered attachment
    setRequisitionDate(undefined);
    setRequisitionNo('');
    setRequisitionFrom('');
    setToLocation('');
    setBarcode('');
    setReqId('');
    setIsReqIdReadonly(false);
    setSelectedKit('');
    setSelectedSaleType('');
    setIsRoutine(false);
    setIsStat(false);
    setIsDischarge(false);
    setIsAsap(false);
    setIsExpired(false);
    setIsGeneric(false);
    setIsItemsLoadedFromRequisitionOrPrescription(false);
    setSourceDocumentName('');
    setSourceDocumentType('');
    setItems([]);
    setPatientData(null);
    preauthItemIdsRef.current = new Map();
    setShowDropdown(false);
    setShowPosProfileSelector(false);
    setShowPatientRequisitionList(false);
    setShowPrescriptionList(false);
    setKitOptions([]);
    setShowAlternativeItemsPopover(false);
    setItemSeekingAlternatives(null);
    setAlternativeItems([]);
    setSelectedCustomer('');
    setSelectedBranch('');
    setSelectedDepartment('');
    setSelectedSubDepartment('');
    setShowViewPosInvoicesModal(false);
    setShowSelectInvoiceModal(false);
    setShowCreateReturnModal(false);
    setSelectedInvoiceForReturn(null);
    setLoadedInvoiceName(null);
    setLoadedInvoiceDocstatus(0);
    setIsLoadingFromPosInvoice(false);
    setGlobalDiscountPercent(0);
    setGlobalCoPayPercent(0);
    setTransactionType('credit');
    setIsIpdEffect(true);
    setTaxTemplate('');
    // Reset Insurance Information fields
    setPayerCategory('');
    setPayerName('');
    setSubInsurance('');
    setNetwork('');
    setInsuranceNo('');
    setOtherNo('');
    setValidityFrom(undefined);
    setExpiryValidityTo(undefined);
    setPayerDetailsFromSearch(false);
    setCgstAccounts([]);
    setSgstAccounts([]);
    setIgstAccounts([]);
    setGstCategory('');
    setTotalBillAmount(0);
    setTotalDiscountAmount(0);
    setTotalCgstAmount(0);
    setTotalSgstAmount(0);
    setTotalIgstAmount(0);
    setTotalPayerAmount(0);
    setTotalPatientAmount(0);
    setShowClosingEntryModal(false);
    setCompanyAddress(null);
    setIsReturn(false);
    setIsReturnInvoice(false);
    setIsDirectReturn(false);
    setRecordedPayments([]);
    setAlert({
      show: false,
      variant: "success",
      heading: "",
      content: ""
    });
  };

  // Function to recalculate totals
  const recalculateTotals = (itemsList: Item[]) => {
    // Skip recalculation if loading from POS invoice
    if (isLoadingFromPosInvoice) {
      return;
    }

    const calculatedItems = itemsList.map(item => calculateItemTaxAndTotals(item, true));

    // Update items in state with recalculated values
    setItems(calculatedItems);

    // For return mode, calculate totals based on returnQty
    if (isReturn) {
      const newTotalBillAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + (item.totalAmt * returnQty / saleQty);
      }, 0);
      const newTotalDiscountAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + (item.discountAmt * returnQty / saleQty);
      }, 0);
      const newTotalCgstAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + (item.cgstAmt * returnQty / saleQty);
      }, 0);
      const newTotalSgstAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + (item.sgstAmt * returnQty / saleQty);
      }, 0);
      const newTotalIgstAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + (item.igstAmt * returnQty / saleQty);
      }, 0);

      setTotalBillAmount(newTotalBillAmount);
      setTotalDiscountAmount(newTotalDiscountAmount);
      setTotalCgstAmount(newTotalCgstAmount);
      setTotalSgstAmount(newTotalSgstAmount);
      setTotalIgstAmount(newTotalIgstAmount);
      const newTotalPayerAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + ((item.payerAmount || 0) * returnQty / saleQty);
      }, 0);
      const newTotalPatientAmount = calculatedItems.reduce((sum, item) => {
        const returnQty = item.returnQty || 0;
        const saleQty = item.saleQty || 1;
        return sum + ((item.patientAmount || 0) * returnQty / saleQty);
      }, 0);
      setTotalPayerAmount(newTotalPayerAmount);
      setTotalPatientAmount(newTotalPatientAmount);
    } else {
      // Normal mode calculations
      const newTotalBillAmount = calculatedItems.reduce((sum, item) => sum + item.totalAmt, 0);
      const newTotalDiscountAmount = calculatedItems.reduce((sum, item) => sum + item.discountAmt, 0);
      const newTotalCgstAmount = calculatedItems.reduce((sum, item) => sum + item.cgstAmt, 0);
      const newTotalSgstAmount = calculatedItems.reduce((sum, item) => sum + item.sgstAmt, 0);
      const newTotalIgstAmount = calculatedItems.reduce((sum, item) => sum + item.igstAmt, 0);

      setTotalBillAmount(newTotalBillAmount);
      setTotalDiscountAmount(newTotalDiscountAmount);
      setTotalCgstAmount(newTotalCgstAmount);
      setTotalSgstAmount(newTotalSgstAmount);
      setTotalIgstAmount(newTotalIgstAmount);
      const newTotalPayerAmount = calculatedItems.reduce((sum, item) => sum + (item.payerAmount || 0), 0);
      const newTotalPatientAmount = calculatedItems.reduce((sum, item) => sum + (item.patientAmount || 0), 0);
      setTotalPayerAmount(newTotalPayerAmount);
      setTotalPatientAmount(newTotalPatientAmount);
    }
  };

  const clearPatient = () => {
    setPatientData(null);
    preauthItemIdsRef.current = new Map();
    // setSearchValue("");
    // setSearchResults([]);
    setShowDropdown(false);
    setItems([]);
    setIsItemsLoadedFromRequisitionOrPrescription(false);
    setSourceDocumentName('');
    setSourceDocumentType('');
    <Alerts
      heading="Sucess"


    />;
  };

  // useEffect to fetch kit options - DISABLED to prevent infinite loop
  // useEffect(() => {
  //   const fetchKitOptions = async () => {
  //     try {
  //       const authHeaders = getAuthHeaders();
  //       // Convert HeadersInit to plain object for fetch compatibility
  //       const headers = typeof authHeaders === 'string' ?
  //         JSON.parse(authHeaders) :
  //         Array.isArray(authHeaders) ?
  //           Object.fromEntries(authHeaders) :
  //           authHeaders;

  //       const response = await fetch(`${API_BASE_URL}/Product Bundle?fields=["name"]&limit_page_length=1000000`, {
  //         method: 'GET',
  //         headers,
  //         credentials: 'include'
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  //       }

  //       const data = await response.json();
  //       if (data.data) {
  //         const fetchedKitOptions = data.data.map((kit: { name: string }) => ({
  //           label: kit.name,
  //           value: kit.name,
  //         }));
  //         // Add empty option at the beginning
  //         setKitOptions([{ label: "", value: "CLEAR" }, ...fetchedKitOptions]);
  //       }
  //     } catch (error: any) {
  //       console.error('Error fetching kit options:', error);
  //       showAlert("danger", "Error", "Failed to fetch kit options.");
  //     }
  //   };

  //   if (apiKey && apiSecret) {
  //     fetchKitOptions();
  //   }
  // }, [apiKey, apiSecret]);

  useEffect(() => {
    const setDefaultCompany = async () => {
      if (isAuthenticated && fetchUserDefaultCompany) {
        const defaultCompany = await fetchUserDefaultCompany();
        if (defaultCompany) {
          setSelectedCompany(defaultCompany);
          console.log("Default company set:", defaultCompany);
        }
      }
    };

    setDefaultCompany();
  }, [isAuthenticated, fetchUserDefaultCompany, setSelectedCompany]);

  // useEffect to fetch tax template and tax accounts
  useEffect(() => {
    const fetchTaxData = async () => {
      if (!selectedCompany) return;

      try {
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;
        // Fetch Tax Template
        // const taxTemplateHeaders: HeadersInit = {
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'Authorization': `token ${apiKey}:${apiSecret}`,
        // };
        const taxTemplateResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_tax_template`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ company: selectedCompany, customer: selectedCustomer || '' }),
        });

        if (taxTemplateResponse.ok) {
          const taxTemplateData = await taxTemplateResponse.json();
          if (taxTemplateData.message && taxTemplateData.message.taxes_template) {
            setTaxTemplate(taxTemplateData.message.taxes_template);
          }
        } else {
          console.error('Failed to fetch tax template:', taxTemplateResponse.status, taxTemplateResponse.statusText);
        }

        // Fetch Tax Accounts
        const taxAccountsResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_tax_accounts`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ company: selectedCompany }),
        });

        if (taxAccountsResponse.ok) {
          const taxAccountsData = await taxAccountsResponse.json();
          console.log('Tax accounts response:', taxAccountsData);
          if (taxAccountsData.message) {
            setCgstAccounts(taxAccountsData.message.cgst_accounts || []);
            setSgstAccounts(taxAccountsData.message.sgst_accounts || []);
            setIgstAccounts(taxAccountsData.message.igst_accounts || []);
            console.log('CGST Accounts:', taxAccountsData.message.cgst_accounts);
            console.log('SGST Accounts:', taxAccountsData.message.sgst_accounts);
            console.log('IGST Accounts:', taxAccountsData.message.igst_accounts);
          }
        } else {
          console.error('Failed to fetch tax accounts:', taxAccountsResponse.status, taxAccountsResponse.statusText);
        }

      } catch (error) {
        console.error('Error fetching tax data:', error);
      }
    };

    fetchTaxData();
  }, [selectedCompany, selectedCustomer]);

  // useEffect to fetch GST Category for the selected company
  useEffect(() => {
    const fetchGstCategory = async () => {
      if (!selectedCompany) return;

      try {
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        const response = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_company_gst_category`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ company: selectedCustomer }),
        });
        console.log("Fetching GST Category for company:", selectedCompany);

        if (response.ok) {
          const data = await response.json();
          if (data.gst_category) {
            setGstCategory(data.gst_category);
            console.log("Fetched GST Category:", data.gst_category);
          }
        } else {
          console.error('Failed to fetch GST category:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching GST category:', error);
      }
    };

    fetchGstCategory();
  }, [selectedCompany]); // Only depend on selectedCompany to prevent infinite loops

  // useEffect to fetch dropdown options for payer fields
  useEffect(() => {
    const fetchPayerDropdownOptions = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        // Fetch Payer Category options using Python method
        const payerCategoryResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_qatar_customization.insurance.get_payer_categories`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (payerCategoryResponse.ok) {
          const data = await payerCategoryResponse.json();
          if (data.message) {
            setPayerCategoryOptions(data.message.map((item: any) => ({
              label: item.name || item,
              value: item.name || item,
              id: item.id || item
            })));
          }
        }

        // Use existing customers from useFrappeApi hook instead of fetching again
        if (customers && customers.length > 0) {
          setPayerNameOptions(customers.map((item: any) => ({
            label: item.customer_name || item.label || item.name,
            value: item.value || item.name,
            id: item.value || item.name
          })));
        }

        // Fetch Network options using Python method
        const networkResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_qatar_customization.insurance.get_network_types`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (networkResponse.ok) {
          const data = await networkResponse.json();
          if (data.message) {
            setNetworkOptions(data.message.map((item: any) => ({
              label: item.name || item,
              value: item.name || item
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching payer dropdown options:', error);
      }
    };

    // Always fetch — triggered by selectedCompany so auth credentials are ready
    fetchPayerDropdownOptions();
  }, [selectedCompany]); // Re-run when company changes (ensures auth headers are available)

  // Sync payerNameOptions with customers when customers change
  useEffect(() => {
    if (customers && customers.length > 0) {
      setPayerNameOptions(customers.map((item: any) => ({
        label: item.customer_name || item.label || item.name,
        value: item.value || item.name
      })));
    }
  }, [customers]);

  // Populate payer fields from patient search response
  useEffect(() => {
    if (patientData) {
      console.log('Patient data changed:', patientData);
      console.log('Payer details in patient data:', {
        payerType: patientData.payerType,
        payerName: patientData.payerName,
        network: patientData.network,
        insuranceNo: patientData.insuranceNo,
        subInsurance: patientData.subInsurance,
        otherNo: patientData.otherNo,
        validityFrom: patientData.validityFrom,
        expiryValidityTo: patientData.expiryValidityTo
      });

      // Auto-set IPD Effect to OFF when patient is selected
      // User can manually turn it ON for credit transactions if needed
      setIsIpdEffect(false);
      console.log('Auto-set IPD Effect to OFF when patient selected');

      // Auto-set global Co-Pay % from patient data
      if (patientData.coPay !== undefined && patientData.coPay !== null) {
        setGlobalCoPayPercent(patientData.coPay);
        console.log('Auto-set global Co-Pay % to:', patientData.coPay);
      }

      // Only populate if payer details exist in patient data (from search response)
      if (patientData.payerType || patientData.payerName || patientData.network || patientData.insuranceNo) {
        console.log('Populating payer fields from patient data');
        console.log('Setting payerCategory to:', patientData.payerType);
        console.log('Setting payerName to:', patientData.payerName);
        console.log('Setting subInsurance to:', patientData.subInsurance);
        console.log('Setting network to:', patientData.network);
        console.log('Setting insuranceNo to:', patientData.insuranceNo);
        console.log('Setting otherNo to:', patientData.otherNo);
        console.log('Setting validityFrom to:', patientData.validityFrom);
        console.log('Setting expiryValidityTo to:', patientData.expiryValidityTo);

        setPayerCategory(patientData.payerType || '');
        setPayerName(patientData.payerName || '');
        setSubInsurance(patientData.subInsurance || '');
        setNetwork(patientData.network || '');
        setInsuranceNo(patientData.insuranceNo || '');
        setOtherNo(patientData.otherNo || '');
        if (patientData.validityFrom) {
          setValidityFrom(new Date(patientData.validityFrom));
        }
        if (patientData.expiryValidityTo) {
          setExpiryValidityTo(new Date(patientData.expiryValidityTo));
        }

        // Seed dropdown options from patient data as fallback when HIS API is unavailable
        // This ensures the selected value is always visible in the dropdown
        if (patientData.payerType) {
          setPayerCategoryOptions(prev => {
            const exists = prev.some(o => o.value === patientData.payerType);
            if (!exists) return [...prev, { label: patientData.payerType || '', value: patientData.payerType || '' }];
            return prev;
          });
        }
        if (patientData.network) {
          setNetworkOptions(prev => {
            const exists = prev.some(o => o.value === patientData.network);
            if (!exists) return [...prev, { label: patientData.network || '', value: patientData.network || '' }];
            return prev;
          });
        }
        if (patientData.payerName) {
          setPayerNameOptions(prev => {
            const exists = prev.some(o => o.value === patientData.payerName);
            if (!exists) return [...prev, { label: patientData.payerName || '', value: patientData.payerName || '' }];
            return prev;
          });
        }
        if (patientData.subInsurance) {
          setSubInsuranceOptions(prev => {
            const exists = prev.some(o => o.value === patientData.subInsurance);
            if (!exists) return [...prev, { label: patientData.subInsurance || '', value: patientData.subInsurance || '' }];
            return prev;
          });
        }

        // Set a flag to indicate payer details came from patient search
        // This prevents visit details from overwriting them
        setPayerDetailsFromSearch(true);

        // If hospitalId is present in patient data, it will be used for sub insurance fetch
        if (patientData.hospitalId) {
          console.log('Hospital ID from patient data:', patientData.hospitalId);
        }
      } else {
        console.log('No payer details found in patient data');
        setPayerDetailsFromSearch(false);
      }
    }
  }, [patientData]);

  // Case correction for payer fields to match dropdown options exactly (case-sensitive Select input)
  useEffect(() => {
    if (payerCategory && payerCategoryOptions.length > 0) {
      const match = payerCategoryOptions.find(o => (o.value || '').toLowerCase().trim() === payerCategory.toLowerCase().trim());
      if (match && match.value !== payerCategory) {
        console.log(`Case correcting payerCategory from ${payerCategory} to ${match.value}`);
        setPayerCategory(match.value);
      }
    }
  }, [payerCategory, payerCategoryOptions]);

  useEffect(() => {
    if (network && networkOptions.length > 0) {
      const match = networkOptions.find(o => (o.value || '').toLowerCase().trim() === network.toLowerCase().trim());
      if (match && match.value !== network) {
        console.log(`Case correcting network from ${network} to ${match.value}`);
        setNetwork(match.value);
      }
    }
  }, [network, networkOptions]);

  useEffect(() => {
    if (payerName && payerNameOptions.length > 0) {
      const match = payerNameOptions.find(o => (o.value || '').toLowerCase().trim() === payerName.toLowerCase().trim());
      if (match && match.value !== payerName) {
        console.log(`Case correcting payerName from ${payerName} to ${match.value}`);
        setPayerName(match.value);
      }
    }
  }, [payerName, payerNameOptions]);

  useEffect(() => {
    if (subInsurance && subInsuranceOptions.length > 0) {
      const match = subInsuranceOptions.find(o => (o.value || '').toLowerCase().trim() === subInsurance.toLowerCase().trim());
      if (match && match.value !== subInsurance) {
        console.log(`Case correcting subInsurance from ${subInsurance} to ${match.value}`);
        setSubInsurance(match.value);
      }
    }
  }, [subInsurance, subInsuranceOptions]);

  // Log state changes to detect if values are being cleared
  useEffect(() => {
    console.log('Payer state changed:', {
      payerCategory,
      payerName,
      subInsurance,
      network,
      insuranceNo,
      otherNo,
      validityFrom,
      expiryValidityTo
    });
    console.log('Dropdown options:', {
      payerCategoryOptions,
      payerNameOptions,
      subInsuranceOptions,
      networkOptions
    });
  }, [payerCategory, payerName, subInsurance, network, insuranceNo, otherNo, validityFrom, expiryValidityTo, payerCategoryOptions, payerNameOptions, subInsuranceOptions, networkOptions]);

  // Fetch payer names based on selected payer category
  useEffect(() => {
    const fetchPayerNames = async () => {
      if (!payerCategory) return;

      try {
        const authHeaders = getAuthHeaders();
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        // Fetch Payer Name options using Python method with payer_type parameter
        const payerNameResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_qatar_customization.insurance.get_payer_name?payer_type=${encodeURIComponent(payerCategory)}`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (payerNameResponse.ok) {
          const data = await payerNameResponse.json();
          if (data.message) {
            const newOptions = data.message.map((item: any) => ({
              label: item.name || item,
              value: item.name || item,
              id: item.id || item
            }));

            // Preserve existing payerName value if it's not in the new options
            const existingValue = payerName;
            const valueExists = newOptions.some((opt: any) => opt.value === existingValue || opt.label === existingValue);

            if (existingValue && !valueExists) {
              newOptions.unshift({
                label: existingValue,
                value: existingValue,
                id: existingValue
              });
            }

            setPayerNameOptions(newOptions);

            // If the current payerName matches one of the options, set the selectedPayerCompanyId
            const matchedOption = newOptions.find((opt: any) => opt.value === existingValue || opt.label === existingValue);
            if (matchedOption && matchedOption.id) {
              setSelectedPayerCompanyId(matchedOption.id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching payer names:', error);
      }
    };

    fetchPayerNames();
  }, [payerCategory, payerName]);

  // Fetch sub insurance based on selected payer name
  useEffect(() => {
    const fetchSubInsurance = async () => {
      if (!selectedPayerCompanyId || !payerName) return;

      try {
        const authHeaders = getAuthHeaders();
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        // Get hospital_id from patient data or settings
        const hospitalId = patientData?.hospitalId || 'f1b0f4c7-9f66-48db-b94d-0f4ca190d477'; // Default hospital ID

        console.log('Fetching sub insurance with schema_id:', selectedPayerCompanyId, 'and hospital_id:', hospitalId);

        // Fetch Sub Insurance options using Python method with schema_id and hospital_id
        const subInsuranceResponse = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_qatar_customization.insurance.get_sub_insurance_list?schema_id=${encodeURIComponent(selectedPayerCompanyId)}&hospital_id=${encodeURIComponent(hospitalId)}`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        if (subInsuranceResponse.ok) {
          const data = await subInsuranceResponse.json();
          if (data.message) {
            const newOptions = data.message.map((item: any) => ({
              label: item.name || item,
              value: item.name || item
            }));

            // Preserve existing subInsurance value if it's not in the new options
            const existingValue = subInsurance;
            const valueExists = newOptions.some((opt: any) => opt.value === existingValue || opt.label === existingValue);

            if (existingValue && !valueExists) {
              newOptions.unshift({
                label: existingValue,
                value: existingValue
              });
            }

            setSubInsuranceOptions(newOptions);
          }
        }
      } catch (error) {
        console.error('Error fetching sub insurance:', error);
      }
    };

    fetchSubInsurance();
  }, [selectedPayerCompanyId, payerName, subInsurance]);

  // useEffect to populate payer fields when patient data changes (from visit details)
  useEffect(() => {
    if (patientData && patientData.visitID && patientData.visitID !== "N/A" && patientData.visitID !== "undefined") {
      console.log('Visit details useEffect triggered with visitID:', patientData.visitID);
      console.log('payerDetailsFromSearch flag:', payerDetailsFromSearch);
      console.log('Current payer state in visit useEffect:', {
        payerCategory,
        payerName,
        subInsurance,
        network,
        insuranceNo,
        otherNo,
        validityFrom,
        expiryValidityTo
      });

      // Skip fetching visit details if payer fields are already populated (from patient search or loaded invoice)
      if (payerDetailsFromSearch || (payerCategory && payerName)) {
        console.log('Skipping visit details fetch for payer fields - they are already populated');
        return;
      }

      const fetchVisitDetails = async () => {
        try {
          const authHeaders = getAuthHeaders();
          const headers = typeof authHeaders === 'string' ?
            JSON.parse(authHeaders) :
            Array.isArray(authHeaders) ?
              Object.fromEntries(authHeaders) :
              authHeaders;

          const response = await fetch(`${API_BASE_URL}/Patient%20Visit/${patientData.visitID}`, {
            method: 'GET',
            headers,
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const visitData = data.data;

            console.log('Visit details fetched:', visitData);
            console.log('Current payer state before visit details:', {
              payerCategory,
              payerName,
              subInsurance,
              network,
              insuranceNo,
              otherNo,
              validityFrom,
              expiryValidityTo
            });

            // Only populate payer fields from visit details if they don't already have values
            // This prevents overwriting values from patient search
            if (visitData) {
              console.log('Visit data has payer fields:', {
                payer_category: visitData.payer_category,
                custom_payer_category: visitData.custom_payer_category,
                payer_name: visitData.payer_name,
                custom_payer_name: visitData.custom_payer_name,
              });

              if (!payerCategory) {
                console.log('Setting payerCategory from visit details');
                setPayerCategory(visitData.payer_category || visitData.custom_payer_category || '');
              } else {
                console.log('Skipping payerCategory - already has value:', payerCategory);
              }
              if (!payerName) {
                console.log('Setting payerName from visit details');
                setPayerName(visitData.payer_name || visitData.custom_payer_name || '');
              } else {
                console.log('Skipping payerName - already has value:', payerName);
              }
              if (!subInsurance) {
                console.log('Setting subInsurance from visit details');
                setSubInsurance(visitData.sub_insurance || visitData.custom_sub_insurance || '');
              } else {
                console.log('Skipping subInsurance - already has value:', subInsurance);
              }
              if (!network) {
                console.log('Setting network from visit details');
                setNetwork(visitData.network || visitData.custom_network || '');
              } else {
                console.log('Skipping network - already has value:', network);
              }
              if (!insuranceNo) {
                console.log('Setting insuranceNo from visit details');
                setInsuranceNo(visitData.insurance_no || visitData.custom_insurance_no || '');
              } else {
                console.log('Skipping insuranceNo - already has value:', insuranceNo);
              }
              if (!otherNo) {
                console.log('Setting otherNo from visit details');
                setOtherNo(visitData.other_no || visitData.custom_other_no || '');
              } else {
                console.log('Skipping otherNo - already has value:', otherNo);
              }
              if (!validityFrom && (visitData.validity_from || visitData.custom_validity_from)) {
                console.log('Setting validityFrom from visit details');
                setValidityFrom(new Date(visitData.validity_from || visitData.custom_validity_from));
              } else {
                console.log('Skipping validityFrom - already has value:', validityFrom);
              }
              if (!expiryValidityTo && (visitData.validity_to || visitData.custom_validity_to)) {
                console.log('Setting expiryValidityTo from visit details');
                setExpiryValidityTo(new Date(visitData.validity_to || visitData.custom_validity_to));
              } else {
                console.log('Skipping expiryValidityTo - already has value:', expiryValidityTo);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching visit details:', error);
        }
      };

      fetchVisitDetails();
    }
  }, [patientData?.visitID, payerDetailsFromSearch, payerCategory, payerName, subInsurance, network, insuranceNo, otherNo, validityFrom, expiryValidityTo]); // Include payerDetailsFromSearch flag


  useEffect(() => {
    const fetchCompanyAddress = async () => {
      if (!selectedCustomer) {
        console.log('Missing required parameters:', { selectedCustomer });
        setCompanyAddress(null);
        return;
      }

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
          'https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_company_billing_address',
          {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({ company: selectedCustomer }),
          }
        );

        console.log('Fetching Company Billing Address for company:', selectedCustomer);
        console.log('Response:', response);

        const data = await response.json();
        console.log('Response JSON for Company Address:', data);

        if (response.ok && data.message) {
          if (data.message.company_address) {
            setCompanyAddress(data.message.company_address);
            console.log('Fetched Company Address:', data.message.company_address);
          } else {
            console.log('No company address found for:', selectedCustomer);
            setCompanyAddress(null);
          }
        } else {
          console.error('Failed to fetch company address:', response.status, response.statusText, data);
          setCompanyAddress(null);
        }
      } catch (error) {
        console.error('Error fetching company address:', error);
        setCompanyAddress(null);
      }
    };

    fetchCompanyAddress();
  }, [selectedCustomer]);

  const handleClassificationChange = (value: string) => {
    if (value === "CLEAR") {
      setSelectedSaleType("");
      return;
    }
    setSelectedSaleType(value);
  };

  const handleSelectKit = async (kitName: string) => {
    if (kitName === "CLEAR") {
      setSelectedKit("");
      return;
    }
    setSelectedKit(kitName);
    if (!kitName) {
      showAlert("primary", "Information", "No kit selected.");
      return;
    }

    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_product_bundle_items`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ bundle_name: kitName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const kitItems = data.message || [];

      if (kitItems.length === 0) {
        showAlert("primary", "Information", "No items found in the selected kit.");
        return;
      }

      for (const kitItem of kitItems) {
        if (!selectedWarehouse) {
          showAlert("danger", "Error", "Please select a warehouse first.");
          return;
        }
        const warehouse = selectedWarehouse; // Use selectedWarehouse
        const batches = await fetchItemBatches(kitItem.item_code);
        const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

        let remainingQtyToAllocate = kitItem.qty;

        for (const batch of sortedBatches) {
          if (remainingQtyToAllocate <= 0) break;

          const batchAvailableQty = batch.batch_qty;
          const qtyToTake = Math.min(remainingQtyToAllocate, batchAvailableQty);

          if (qtyToTake > 0) {
            const itemRate = await fetchItemPrice(kitItem.item_code, batch.name, 'Standard Selling');
            const batchStockQty = await getBatchQty(kitItem.item_code, batch.name, warehouse);

            const itemToAdd: Item = {
              id: `${kitItem.item_code}-${batch.name}-${Date.now()}`,
              alternateBatches: "",
              substituteItem: "",
              itemCode: kitItem.item_code,
              itemName: kitItem.item_name,
              uom: kitItem.uom,
              stockQty: batchStockQty,
              orderedQty: qtyToTake,
              saleQty: qtyToTake,
              batch: batch.name,
              batchNo: batch.name,
              expiryDate: batch.expiry_date,
              batchStockQty: batchStockQty,
              rate: itemRate,
              taxTemplate: "",
              description: kitItem.description,
              itemAmount: 0,
              discountPercent: 0,
              discountAmt: 0,
              cgstPercent: 0,
              cgstAmt: 0,
              sgstPercent: 0,
              sgstAmt: 0,
              igstPercent: 0,
              igstAmt: 0,
              totalAmt: 0,
              totalPckgAmt: 0,
              kitName: kitItem.custom_kit_name,
              packageName: "",// Set packageName to kitName
              binLocation: "",
            };
            await handleAddItemToDetails(itemToAdd); // Add to the table
            remainingQtyToAllocate -= qtyToTake;
          }
        }

        if (remainingQtyToAllocate > 0) {
          showAlert("warning", "Warning", `Only ${kitItem.qty - remainingQtyToAllocate} of ${kitItem.qty} quantity for item ${kitItem.item_name} could be fulfilled from batches.`);
        }
      }
      showAlert("success", "Success", `Kit "${kitName}" items added successfully.`);
    } catch (error: any) {
      console.error("Error handling kit selection:", error);
      showAlert("danger", "Error", `Failed to add kit items: ${error.message || 'Unknown error'}`);
    }
  };

  // Item handling
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

  const handleAddItemToDetails = async (item: Item) => {
    console.log("handleAddItemToDetails - received item: ", item); // Log here
    try {
      // Check for duplicate item with same batch
      console.log("Checking for duplicate:", {
        newItem: { itemCode: item.itemCode, batchNo: item.batchNo, itemName: item.itemName },
        existingItems: items.map(i => ({ itemCode: i.itemCode, batchNo: i.batchNo, itemName: i.itemName, id: i.id }))
      });

      const existingItemIndex = items.findIndex(existingItem =>
        existingItem.itemCode === item.itemCode &&
        existingItem.batchNo === item.batchNo &&
        existingItem.batchNo !== '' // Only check if batchNo is not empty
      );

      console.log("Duplicate check result:", { existingItemIndex, itemCode: item.itemCode, batchNo: item.batchNo });

      if (existingItemIndex !== -1) {
        const rowNum = existingItemIndex + 1; // Convert 0-based index to 1-based row number
        showAlert("danger", "Duplicate Item", `Item ${item.itemName} with batch ${item.batchNo} already exists in grid at row number ${rowNum}.`);
        return; // Don't add the duplicate item
      }

      // Check for critical categories and show confirmation dialog
      const { isCritical, categories } = checkCriticalCategories(item);
      if (isCritical && !item._skipHighAlertCheck) {
        setCriticalCategoryDialog({
          show: true,
          item: item,
          categories: categories
        });
        return; // Wait for user confirmation
      }

      const taxDetails = await fetchTaxDetails(item.itemCode, item.rate || 0, 1, item.uom);
      // The item passed from EnhancedItemSearch should already have batchNo, expiryDate, and rate set.
      // We will use these directly.
      const finalBatchNo = item.batchNo;
      const finalExpiryDate = item.expiryDate;
      let finalRate = item.rate !== null ? item.rate : 0; // Use item's rate, ensure it's not null
      const finalBatchStockQty = item.batchStockQty; // Use item's batchStockQty

      // Apply  the rate if customer is selected
      if (selectedCustomer) {
        const itemsWithPricingRule = await applyPricingRules([{ ...item, rate: finalRate }], selectedCustomer);
        if (itemsWithPricingRule.length > 0 && itemsWithPricingRule[0].rate !== finalRate && itemsWithPricingRule[0].rate !== null) {
          finalRate = itemsWithPricingRule[0].rate;
          console.log(`Applied pricing rule in handleAddItemToDetails. New rate: ${finalRate}`);
        }
      }

      // Fetch bin_location from Item doctype
      console.log(`[BinLocation] Fetching bin_location for item: ${item.itemCode}`);
      const binLocation = await fetchBinLocationFromItem(item.itemCode);
      console.log(`[BinLocation] Fetched bin_location: ${binLocation}`);

      // Batch expiry warning check
      console.log("Batch Expiry Warning Check - finalExpiryDate:", finalExpiryDate);
      console.log("Batch Expiry Warning Check - Date.now():", Date.now());
      const daysUntilExpiry = Math.round((new Date(finalExpiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
      console.log("Batch Expiry Warning Check - daysUntilExpiry:", daysUntilExpiry);
      const customAllowSaleDays = item.custom_allow_sale_days || 0; // Default to 0 if undefined
      console.log("Batch Expiry Warning Check - customAllowSaleDays:", customAllowSaleDays);
      if (customAllowSaleDays > 0) {
        if (daysUntilExpiry > 0 && daysUntilExpiry <= customAllowSaleDays) {
          console.log(`Batch ${finalBatchNo} of item ${item.itemName} expires in ${daysUntilExpiry} days. Please verify before proceeding.`);
          console.log("Showing batch expiry warning alert...");
          showAlert("warning", "Batch Expiry Warning", `Batch ${finalBatchNo} of ${item.itemName} will expire in ${daysUntilExpiry} days (Expiry Date: ${finalExpiryDate}). This is within the allowed sale period of ${customAllowSaleDays} days.`);
        } else if (daysUntilExpiry <= 0) {
          console.log(`Batch ${finalBatchNo} of item ${item.itemName} has already expired. Please verify before proceeding.`);
          console.log("Showing batch expiry error alert...");
          showAlert("danger", "Batch Expired", `Batch ${finalBatchNo} of ${item.itemName} has already expired (Expiry Date: ${finalExpiryDate}). Cannot add to bill.`);
          return; // Don't add expired batch
        }
      }

      // Check if this item is in the patient's preauth pharmacy list
      const hisItemId = item.custom_his_item_id || taxDetails.custom_his_item_id;
      const preAuthDetails = !!hisItemId ? preauthItemIdsRef.current.get(hisItemId) : null;

      setItems(prevItems => {
        // Always add as a new item, as each batch-specific item has a unique ID now
        const newItemWithCalculations = calculateItemTaxAndTotals({
          ...item,
          orderedQty: item.orderedQty, // Preserve the original ordered quantity from requisition
          stockQty: finalBatchStockQty, // Set stockQty with batch-specific quantity for new item
          rate: finalRate, // Use the final rate from the item
          batchNo: finalBatchNo, // Use the final batch number
          expiryDate: finalExpiryDate, // Use the final expiry date
          binLocation: binLocation, // Set the fetched bin_location
          cgstPercent: taxDetails.cgstRate,
          sgstPercent: taxDetails.sgstRate,
          igstPercent: taxDetails.igstRate,
          taxTemplate: taxDetails.taxTemplate,
          custom_his_item_id: hisItemId,

          // Add alternateBatches only if it's an alternative item
          alternateBatches: item.substituteItem ? "1" : "",
          includedInPrintRate: true, // Always consider included_in_print_rate as true
          covered: preAuthDetails ? !!preAuthDetails.isIncluded : item.covered,
          preAuthRequired: preAuthDetails ? !!preAuthDetails.isPreAuthRequired : item.preAuthRequired,
        });
        console.log("handleAddItemToDetails - newItemWithCalculations: ", newItemWithCalculations); // Log here
        if (newItemWithCalculations) {
          const updatedItems = [...prevItems, newItemWithCalculations];
          // Recalculate totals for all items
          const allCalculatedItems = updatedItems.map(itm => calculateItemTaxAndTotals(itm, true));

          // Update bill totals
          const newTotalBillAmount = allCalculatedItems.reduce((sum, itm) => sum + itm.totalAmt, 0);
          const newTotalDiscountAmount = allCalculatedItems.reduce((sum, itm) => sum + itm.discountAmt, 0);
          const newTotalCgstAmount = allCalculatedItems.reduce((sum, itm) => sum + itm.cgstAmt, 0);
          const newTotalSgstAmount = allCalculatedItems.reduce((sum, itm) => sum + itm.sgstAmt, 0);
          const newTotalIgstAmount = allCalculatedItems.reduce((sum, itm) => sum + itm.igstAmt, 0);

          setTotalBillAmount(newTotalBillAmount);
          setTotalDiscountAmount(newTotalDiscountAmount);
          setTotalCgstAmount(newTotalCgstAmount);
          setTotalSgstAmount(newTotalSgstAmount);
          setTotalIgstAmount(newTotalIgstAmount);

          return allCalculatedItems;
        } else {
          console.error("Error adding item to details: newItemWithCalculations is null or undefined");
          return prevItems;
        }
      });
      // showAlert("success", "Success", "Item added successfully");
    } catch (error) {
      console.error("Error adding item with tax details:", error);
      showAlert("danger", "Error", "Failed to add item. Please try again.");
    }
  };

  // const handleRemoveItemFromDetails = (itemId: string) => {
  //    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  //    showAlert("success", "Success", "Item removed successfully");
  // };

  // const handleUpdateQuantity = (itemId: string, newQty: number) => {
  //    if (newQty <= 0) {
  //       handleRemoveItemFromDetails(itemId);
  //       return;
  //    }
  //    setItems(prevItems =>
  //       prevItems.map(item =>
  //          item.id === itemId
  //             ? calculateItemTaxAndTotals({ ...item, orderedQty: newQty })
  //             : item
  //       )
  //    );
  //    showAlert("success", "Success", "Quantity updated successfully");
  // };

  // Save as Draft functionality
  // Inside NewBill component
  const handleSaveAsDraft = async (skipHighAlertCheck: boolean = false) => {
    // Prevent multiple submissions
    if (isSaving) {
      console.log('Save operation already in progress');
      return;
    }

    // Restrict saving if any covered item has pre-auth status as Pending or Initiated (or not set, defaulting to Pending)
    const pendingOrInitiatedItems = items.filter(item => item.covered && (item.preAuthStatus === 'Pending' || item.preAuthStatus === 'Initiated' || !item.preAuthStatus));
    if (pendingOrInitiatedItems.length > 0) {
      const itemNames = pendingOrInitiatedItems.map(item => item.itemName).join(', ');
      showAlert("danger", "Validation Error", `Cannot save draft. Pre-auth Status is Pending or Initiated for covered items: ${itemNames}`);
      return;
    }

    if (!patientData) {
      showAlert("danger", "Error", "Please select a patient before saving.");
      setIsSaving(false);
      return;
    }

    if (items.length === 0) {
      showAlert("danger", "Error", "Please add at least one item to the invoice.");
      setIsSaving(false);
      return;
    }

    // Set loading state to true and freeze screen
    setIsSaving(true);

    // Check for high-alert items and show confirmation if any exist (unless skipped)
    if (!skipHighAlertCheck) {
      console.log("Checking for high-alert items in save draft, items count:", items.length);
      const highAlertItems = items.filter(item => checkHighAlertClassification(item));
      console.log("High-alert items found:", highAlertItems.length);
      if (highAlertItems.length > 0) {
        console.log("Showing high-alert save dialog");
        // const highAlertItemNames = highAlertItems.map(item => `${item.itemName} (${item.custom_classification})`).join(', ');
        setHighAlertItems(highAlertItems);
        setPendingSaveAction('draft');
        setShowHighAlertSaveDialog(true);
        setIsSaving(false); // Reset loading state since we're waiting for user confirmation
        return; // Wait for user confirmation
      }
    }

    // Continue with save logic...
    // Check for items with zero or negative stock
    const itemsWithZeroOrNegativeStock = items.filter(item => (item.stockQty || 0) <= 0);
    if (itemsWithZeroOrNegativeStock.length > 0) {
      const itemNames = itemsWithZeroOrNegativeStock.map(item => `${item.itemName} (Stock: ${item.stockQty})`).join(', ');
      showAlert("danger", "Error", `Cannot save invoice. The following items have zero or negative stock: ${itemNames}`);
      setIsSaving(false);
      return;
    }

    if (!posProfile) {
      showAlert("danger", "Error", "Please select a POS profile.");
      setShowPosProfileSelector(true);
      setIsSaving(false);
      return;
    }

    // Check if requisition is fully completed
    if (sourceDocumentName && sourceDocumentType === 'requisition') {
      console.log("Checking requisition completion for:", sourceDocumentName);
      const isFullyCompleted = await isRequisitionFullyCompleted(sourceDocumentName);
      console.log("Is requisition fully completed?", isFullyCompleted);

      if (isFullyCompleted) {
        showAlert("danger", "Error", "Cannot create sale for this requisition: All quantities have already been completed");
        setIsSaving(false);
        return;
      }
    }

    // // Check if POS session is open
    // try {
    //    const isPosOpen = await checkOpenPOS(posProfile);
    //    if (!isPosOpen) {
    //       showAlert("danger", "Error", "No open POS session found for the selected profile.");
    //       return;
    //    }
    // } catch (error) {
    //    console.error("Error checking POS session:", error);
    //    showAlert("danger", "Error", "Failed to verify POS session. Please try again.");
    //    return;
    // }

    // Calculate total discount amount for invoice level
    const totalDiscountAmount = items.reduce((sum, item) => sum + (Number(item.discountAmt) || 0), 0);
    // const hasAnyDiscount = items.some(item => (Number(item.discountPercent) || 0) > 0);

    // console.log('Save Draft - Discount calculation debug:', {
    //   items: items.map(item => ({
    //     itemCode: item.itemCode,
    //     discountPercent: item.discountPercent,
    //     discountAmt: item.discountAmt,
    //     rate: item.rate
    //   })),
    //   totalDiscountAmount,
    //   hasAnyDiscount
    // });

    console.log('DEBUG: isIpdEffect value when saving draft:', isIpdEffect);
    console.log('DEBUG: isIpdEffect type:', typeof isIpdEffect);

    const payload = {
      doctype: "Sale Bill",
      currency: "QAR",
      customer: selectedCustomer || patientData.mrn || "PQR Ltd",
      pos_profile: posProfile,
      is_pos: 1,
      update_stock: 1,
      company: selectedCompany || patientData.company || "Default Company",
      docstatus: 0, // Save as draft
      gst_category: gstCategory || "Unregistered",
      customer_address: CompanyAddress,
      remarks: remarks,
      included_in_print_rate: 1, // Always consider included_in_print_rate as true
      custom_is_ipd_invoice: 1, // Mark as IPD invoice
      custom_ipd_effect: isIpdEffect ? 1 : 0, // IPD Effect checkbox value

      // Add invoice-level discount fields
      // apply_discount_on: hasAnyDiscount ? "Grand Total" : "",
      // base_discount_amount: totalDiscountAmount,
      // discount_amount: totalDiscountAmount,
      // additional_discount_percentage: hasAnyDiscount ? (totalDiscountAmount / (items.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.saleQty) || 0), 0))) * 100 : 0,

      posting_date: requisitionDate ? requisitionDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      items: items.map(item => {
        // Recalculate all items before saving to ensure correct values
        const calculatedItem = calculateItemTaxAndTotals(item, true);

        // Get MRP (original rate includes GST)
        const mrp = Number(item.rate) || 0;
        const saleQty = Number(calculatedItem.saleQty) || 0;
        const discountPercent = Number(calculatedItem.discountPercent) || 0;
        const totalGstRate = (Number(calculatedItem.cgstPercent) + Number(calculatedItem.sgstPercent) + Number(calculatedItem.igstPercent)) / 100;

        // When included_in_print_rate = 1, Frappe expects:
        // rate = MRP - discount_amount (already discounted price, includes GST)
        // Then Frappe removes GST: taxable_amount = rate / (1 + GST%)
        // Then Frappe adds GST back: GST = taxable_amount * GST%
        // Final amount = taxable_amount + GST

        // Calculate discount amount on MRP
        const discountAmountOnMrp = mrp * (discountPercent / 100);
        // Rate after discount (includes GST)
        const rateAfterDiscount = mrp - discountAmountOnMrp;
        // Remove GST to get taxable amount
        const taxableAmountPerUnit = totalGstRate > 0 ? rateAfterDiscount / (1 + totalGstRate) : rateAfterDiscount;

        // Calculate GST amounts (per unit)
        const cgstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.cgstPercent) / 100);
        const sgstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.sgstPercent) / 100);
        const igstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.igstPercent) / 100);

        // Final amount per unit
        const finalAmountPerUnit = taxableAmountPerUnit + cgstAmountPerUnit + sgstAmountPerUnit + igstAmountPerUnit;

        // Multiply by quantity for totals
        const totalDiscountAmount = discountAmountOnMrp * saleQty;
        const totalCgstAmount = cgstAmountPerUnit * saleQty;
        const totalSgstAmount = sgstAmountPerUnit * saleQty;
        const totalIgstAmount = igstAmountPerUnit * saleQty;
        const totalAmount = finalAmountPerUnit * saleQty;
        const netAmount = taxableAmountPerUnit * saleQty;

        console.log('Saving item with MRP Inclusive GST (Frappe format):', {
          itemCode: calculatedItem.itemCode,
          mrp,
          saleQty,
          discountPercent,
          discountAmountOnMrp,
          rateAfterDiscount,
          taxableAmountPerUnit,
          cgstAmountPerUnit,
          sgstAmountPerUnit,
          igstAmountPerUnit,
          finalAmountPerUnit,
          totalAmount,
          netAmount
        });

        return {
          item_code: calculatedItem.itemCode,
          qty: isReturn ? saleQty : saleQty,
          uom: calculatedItem.uom,
          // Send rate as MRP minus discount (Frappe will remove GST from this when included_in_print_rate = 1)
          rate: rateAfterDiscount,
          // MRP (includes GST) - original price before discount
          price_list_rate: mrp,
          batch_no: calculatedItem.batchNo || calculatedItem.batch || "",
          custom_expiry_date: calculatedItem.expiryDate || "",
          custom_bin_location: calculatedItem.binLocation || "",
          warehouse: selectedWarehouse || calculatedItem.warehouse || "",
          margin_type: "",
          discount_percentage: discountPercent,
          discount_amount: totalDiscountAmount,
          cgst_rate: Number(calculatedItem.cgstPercent) || 0,
          cgst_amount: totalCgstAmount,
          sgst_rate: Number(calculatedItem.sgstPercent) || 0,
          sgst_amount: totalSgstAmount,
          igst_rate: Number(calculatedItem.igstPercent) || 0,
          igst_amount: totalIgstAmount,
          amount: totalAmount,
          item_tax_template: calculatedItem.taxTemplate || "",
          included_in_print_rate: 1,
          use_serial_batch_fields: 1,
          co_pay: Number(calculatedItem.coPayPercentage) || 0,
          patient_amount: Number(calculatedItem.patientAmount) || 0,
          payer_amount: Number(calculatedItem.payerAmount) || 0,
          covered: calculatedItem.covered ? 1 : 0,
          pre_auth_req: calculatedItem.preAuthRequired ? "Yes" : "No",
          pre_auth_status: calculatedItem.preAuthStatus || "",
          pre_auth_no: calculatedItem.preAuthNo || "",
          pre_auth_date_time: calculatedItem.preAuthDateTime || "",
          custom_his_item_id: calculatedItem.custom_his_item_id || item.custom_his_item_id || "",
        };
      }),
      payments: recordedPayments.map(p => ({
        ...(p.name ? { name: p.name } : {}), // Include name if exists (for updating existing rows)
        mode_of_payment: p.paymentMode || "Cash",
        amount: parseFloat(p.paidAmount || "0") || 0,
        reference_no: p.custom_transaction_no || p.transactionNo || "",
        custom_bank_name: p.custom_bank_name || p.bankName || "",
        custom_branch_name: p.custom_branch_name || p.branchName || "",
        custom_transaction_no: p.custom_transaction_no || p.transactionNo || "",
      })),
      // Add Pricing Rule Detail child table if any pricing rules were applied
      pricing_rule_details: items
        .filter(item => item.appliedPricingRule)
        .map(item => ({
          pricing_rule: item.appliedPricingRule,
          item_code: item.itemCode,
          rate_or_discount: "Discount",
          rule_applied: 1
        })),
      patient_data: {
        mrn: patientData.mrn || "",
        age: patientData.age || "",
        sex: patientData.sex || "",
        phone: patientData.phone || "",
        abha_id: patientData.ABHAID || "",
        category: patientData.category || "",
        doctor: patientData.doctor || "",
        department: patientData.dept || "",
        visit_type: patientData.visitType || "",
        visit_id: patientData.visitID || "",
        visit_no: patientData.visitNo || patientData.visitID || "",
        bed_no: patientData.bed || "",
        company: selectedCompany || patientData.company || "",
      },
      sale_type: selectedSaleType || "retail",
      is_routine: isRoutine ? 1 : 0,
      is_stat: isStat ? 1 : 0,
      is_discharge: isDischarge ? 1 : 0,
      is_asap: isAsap ? 1 : 0,
      is_expired: isExpired ? 1 : 0,
      is_return: isReturn ? 1 : 0,
      // to_location: toLocation || "",
      kit: selectedKit || "",
      requisition_no: requisitionNo || "",
      requisition_from: requisitionFrom || "",
      requisition_to: requisitionTo || "",
      // Custom patient and requisition details
      custom_patient_name: patientData?.name || "",
      custom_uhid: patientData?.mrn || "",
      custom_abha_id: patientData?.ABHAID || "",
      custom_age: patientData?.age || "",
      custom_gender: patientData?.sex || "",
      custom_visit_type: patientData?.visitType || "",
      custom_ward: patientData?.wardName || "",
      custom_patient_category: patientData?.category || "",
      custom_patient_company: patientData?.company || "",
      custom_req_no: reqId || sourceDocumentName || requisitionNo || "",
      custom_prescription_no: reqId || sourceDocumentName || requisitionNo || "",
      prescription_no: reqId || sourceDocumentName || requisitionNo || "",
      custom_visit_code: patientData?.visitID || "",
      custom_phone: patientData?.phone || "",
      custom_doctor_name: patientData?.doctor || "",
      custom_bed_no: patientData?.bedName || patientData?.bed || "",
      custom_department: selectedDepartment || patientData?.dept || "",
      custom_hospital: selectedHospital || "",
      // Payer details
      custom_payer_category: payerCategory,
      custom_payer_name: payerName,
      custom_sub_insurance: subInsurance,
      custom_network: network,
      custom_insurance_no: insuranceNo,
      custom_other_no: otherNo,
      custom_validity_from: validityFrom ? validityFrom.toISOString().split('T')[0] : '',
      custom_validity_to: expiryValidityTo ? expiryValidityTo.toISOString().split('T')[0] : '',
      payer_amount: Number(totalPayerAmount) || 0,
      patient_amount: Number(totalPatientAmount) || 0,
      co_pay: Number(globalCoPayPercent) || 0,
      visit_type: patientData?.visitType || "IPD",
      visit_no: patientData?.visitNo || patientData?.visitID || "",
      is_cash_bill: transactionType === 'cash' ? 1 : 0,
      is_credit_bill: transactionType === 'credit' ? 1 : 0,
    };

    console.log('DEBUG: Payload being sent:', JSON.stringify(payload, null, 2));

    // Construct the taxes array dynamically
    const taxesPayload: any[] = [];
    const taxBaseAmount = totalBillAmount - totalDiscountAmount;

    if (totalCgstAmount !== 0) {
      taxesPayload.push({
        charge_type: "On Net Total",
        account_head: cgstAccounts.length > 0 ? cgstAccounts[0]?.name : "", // Always include account_head
        description: "CGST",
        rate: taxBaseAmount !== 0 ? (totalCgstAmount / taxBaseAmount) * 100 : 0,
        gst_tax_type: "cgst",
        tax_amount: totalCgstAmount,
        total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        tax_amount_after_discount_amount: totalCgstAmount,
        base_tax_amount: totalCgstAmount,
        base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        base_tax_amount_after_discount_amount: totalCgstAmount,
        included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
        item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
          if (item.cgstAmt !== 0) {
            acc[item.itemCode] = [item.cgstAmt, item.cgstPercent];
          }
          return acc;
        }, {} as Record<string, [number, number]>)),
      });
    }

    if (totalSgstAmount !== 0) {
      taxesPayload.push({
        charge_type: "On Net Total",
        account_head: sgstAccounts.length > 0 ? sgstAccounts[0]?.name : "", // Always include account_head
        description: "SGST",
        rate: taxBaseAmount !== 0 ? (totalSgstAmount / taxBaseAmount) * 100 : 0,
        gst_tax_type: "sgst",
        tax_amount: totalSgstAmount,
        total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        tax_amount_after_discount_amount: totalSgstAmount,
        base_tax_amount: totalSgstAmount,
        base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        base_tax_amount_after_discount_amount: totalSgstAmount,
        included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
        item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
          if (item.sgstAmt !== 0) {
            acc[item.itemCode] = [item.sgstAmt, item.sgstPercent];
          }
          return acc;
        }, {} as Record<string, [number, number]>)),
      });
    }

    if (totalIgstAmount !== 0) {
      taxesPayload.push({
        charge_type: "On Net Total",
        account_head: igstAccounts.length > 0 ? igstAccounts[0]?.name : "", // Always include account_head
        description: "IGST",
        rate: taxBaseAmount !== 0 ? (totalIgstAmount / taxBaseAmount) * 100 : 0,
        gst_tax_type: "igst",
        tax_amount: totalIgstAmount,
        total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        tax_amount_after_discount_amount: totalIgstAmount,
        base_tax_amount: totalIgstAmount,
        base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
        base_tax_amount_after_discount_amount: totalIgstAmount,
        included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
        item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
          if (item.igstAmt !== 0) {
            acc[item.itemCode] = [item.igstAmt, item.igstPercent];
          }
          return acc;
        }, {} as Record<string, [number, number]>)),
      });
    }

    const finalPayload: any = {
      ...payload,
      taxes_and_charges: taxTemplate, // Add taxes_and_charges field
      taxes: taxesPayload,
      total_taxes_and_charges: totalCgstAmount + totalSgstAmount + totalIgstAmount,
      // Calculate outstanding amount as grand_total - paid_amount
      paid_amount: recordedPayments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0),
      outstanding_amount: (totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount) -
        (recordedPayments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0)),
    }

    // --- START: Handle file upload ---
    let attachmentUrl: string | null = null;
    let selectedFile: File | null = null;
    if (selectedDocument) {
      console.log("Preparing to upload document:", selectedDocument.name);
      selectedFile = selectedDocument;
      // Upload the file first to get the URL
      attachmentUrl = await uploadFile(selectedFile);
      if (attachmentUrl) {
        console.log("Document uploaded successfully:", attachmentUrl);
      } else {
        console.warn("File upload failed, saving invoice without attachment");
        showAlert("warning", "Upload Warning", "File upload failed. Invoice saved without attachment.");
        selectedFile = null; // Clear the file if upload failed
      }
    }
    // --- END: Handle file upload ---

    try {
      console.log("Final payload for saving draft:", finalPayload); // Log the final payload
      console.log("Items being sent:", JSON.stringify(finalPayload.items, null, 2)); // Log items with formatting
      console.log("Sample item custom_bin_location:", finalPayload.items[0]?.custom_bin_location); // Log first item's bin_location

      // Check if a draft invoice is already loaded
      if (loadedInvoiceName && loadedInvoiceDocstatus === 0) {
        // Update existing draft invoice using PUT request
        console.log("Updating existing draft invoice:", loadedInvoiceName);
        // Add docstatus: 0 to ensure Frappe recalculates totals

        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        const response = await fetch(`${API_BASE_URL}/Sale%20Bill/${loadedInvoiceName}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify(finalPayload),
        });

        if (response.ok) {
          const result = await response.json();
          showAlert("success", "Success", `Sale Bill ${loadedInvoiceName} updated successfully!`);
          console.log("Draft updated:", result);
          // Keep the invoice loaded but don't reset
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to update draft:", response.status, errorData);
          showAlert("danger", "Error", `Failed to update draft: ${errorData.message || 'Unknown error occurred.'}`);
        }
      } else {
        // Create new draft invoice using POST request
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        const response = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_draft`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(finalPayload),
        });
        console.log(response);

        if (response.ok) {
          const result = await response.json();

          if (result.message?.status === "error") {
            // When backend returns error status
            showAlert("danger", "Error", result.message?.message || "Something went wrong while saving draft.");
            console.error("Draft save error:", result);
          }
          else if (result.message?.status === "success") {
            // When draft saved successfully
            showAlert("success", "Success", result.message?.message || "Sale Bill saved as draft successfully!");
            console.log("Draft saved:", result);

            // --- START: Link file to invoice if file was uploaded ---
            if (selectedFile && attachmentUrl && result.message?.data?.name) {
              const invoiceName = result.message.data.name;
              console.log("Linking file to invoice:", invoiceName);

              try {
                const authHeaders = getAuthHeaders();
                // Convert HeadersInit to plain object for fetch compatibility
                const headers = typeof authHeaders === 'string' ?
                  JSON.parse(authHeaders) :
                  Array.isArray(authHeaders) ?
                    Object.fromEntries(authHeaders) :
                    authHeaders;
                const fileDocResponse = await fetch('https://gmcerp.quantcloud.in/api/resource/File', {
                  method: 'POST',
                  headers,
                  credentials: 'include',
                  body: JSON.stringify({
                    doctype: 'File',
                    file_name: selectedFile.name,
                    file_url: attachmentUrl,
                    attached_to_doctype: 'POS Invoice',
                    attached_to_name: invoiceName,
                    is_private: 0,
                    folder: 'Home/Attachments'
                  }),
                });

                if (fileDocResponse.ok) {
                  console.log("File document created and linked to invoice:", invoiceName);
                  showAlert("success", "File Attached", "Document successfully attached to the invoice.");
                } else {
                  console.error("Failed to create File document:", await fileDocResponse.json());
                  showAlert("warning", "Attachment Warning", "Invoice saved but file attachment failed.");
                }
              } catch (error) {
                console.error("Error creating File document:", error);
                showAlert("warning", "Attachment Warning", "Invoice saved but file attachment failed.");
              }
            }
            // --- END: Link file to invoice ---

            // Reset the form after successful save
            handleReset();
            // clearPatient();
            // router.push("/pos");
          }
          else {
            // Unknown or unexpected response structure
            showAlert("warning", "Unexpected Response", "Received an unexpected response from the server.");
            console.warn("Unexpected result:", result);
          }

        } else {
          // HTTP-level error (non-2xx)
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to save draft:", response.status, errorData);
          showAlert("danger", "Error", `Failed to save draft: ${errorData.message || 'Unknown error occurred.'}`);
        }
      }

    } catch (error) {
      console.error("Error saving draft:", error);
      showAlert("danger", "Error", "Error saving draft. Please try again.");
    } finally {
      // Reset loading state and unfreeze screen
      setIsSaving(false);
    }
  };

  // Authentication and POS profile handling
  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      // Redirect to Frappe login with current URL as return address
      redirectToFrappeLogin();
    } else if (!posProfile) {
      setShowPosProfileSelector(true);
    }
  }, [isAuthenticated, router, posProfile, isInitialized]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 7000); // Show splash screen for at least 2 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, posProfile]);

  // Automatically set warehouse based on selected POS Profile
  useEffect(() => {
    const fetchPosProfileWarehouse = async () => {
      if (!posProfile) return;

      try {
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        const response = await fetch(`${API_BASE_URL}/POS%20Profile/${posProfile}`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const posProfileData = data.data;

          // Set warehouse from POS Profile if available
          if (posProfileData.warehouse) {
            setSelectedWarehouse(posProfileData.warehouse);
            console.log('Warehouse set automatically from POS Profile:', posProfileData.warehouse);
          }
        } else if (response.status === 403) {
          console.log('Access forbidden (403) - User lacks permission for POS Profile data');
        } else {
          console.error('Failed to fetch POS Profile:', response.status, response.statusText);
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          console.log('Access forbidden (403) - User lacks permission for POS Profile data');
        } else {
          console.error('Error fetching POS Profile warehouse:', error);
        }
      }
    };

    fetchPosProfileWarehouse();
  }, [posProfile]);

  const checkForOpeningEntries = async () => {
    if (!posProfile || !currentUser) {
      return false;
    }

    try {
      console.log("Checking for opening entries for POS profile:", posProfile, "and user:", currentUser);

      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(
        `https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.check_pos_opening_entry_conflict`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            pos_profile: posProfile,
            current_user: currentUser
          }),
        }
      );

      const result = await response.json();
      console.log("Opening entries check result:", result);

      if (response.ok && result.message) {
        const conflictData = result.message;

        if (conflictData.has_conflict) {
          if (conflictData.conflict_type === "own_entry") {
            showAlert("warning", "Opening Entry Found", `Opening entry ${conflictData.entry_name} is present against this profile and against you. Please close this entry first.`);
            return true;
          } else if (conflictData.conflict_type === "other_user_entry") {
            showAlert("warning", "Opening Entry Found", `Opening entry ${conflictData.entry_name} is present against this profile and created by ${conflictData.user_name}. Please ask them to close this entry first.`);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking for opening entries:", error);
      return false;
    }
  };

  const handlePOSProfileSelect = (profile: string) => {
    setPosProfile(profile);
    localStorage.setItem('posProfile', profile);
    setShowPosProfileSelector(false);
    // Reset form when POS Profile changes
    handleReset();
  };

  const handleChangePOSProfile = async () => {
    const hasOpeningEntries = await checkForOpeningEntries();
    if (!hasOpeningEntries) {
      setShowPosProfileSelector(true);
    }
  };

  // Hide patient search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".patient-input-group")) {
        setShowDropdown(false)

      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debug: Log patientData and selectedValue changes
  useEffect(() => {
    console.log("patientData updated:", patientData);
  }, [patientData]);

  useEffect(() => {
    if (transactionType === 'credit') {
      setIsIpdEffect(true);
    } else {
      setIsIpdEffect(false);
    }
  }, [transactionType]);

  const handleSelectRequisition = async (requisition: any) => {
    console.log("Selected requisition:", requisition);
    // Set source document information
    setSourceDocumentName(requisition.name);
    setSourceDocumentType('requisition');
    setIsItemsLoadedFromRequisitionOrPrescription(true);

    // Set Req ID field with requisition name and make it readonly
    setReqId(requisition.name);
    setIsReqIdReadonly(true);

    // Fetch the full requisition document to ensure child tables are available
    let fullRequisitionData = requisition;
    try {
      // Use the same authentication logic as PatientRequisitionList
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`${API_BASE_URL}/Patient%20Requisition/${requisition.name}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        fullRequisitionData = data.data;
      } else if (response.status === 403) {
        console.log('Access forbidden (403) - User lacks permission for Patient Requisition details');
        showAlert("warning", "Access Restricted", "You don't have permission to view requisition details. The basic information will be used.");
        // Continue with the basic requisition data we already have
      } else {
        console.error('Failed to fetch full requisition details:', response.status, response.statusText);
        showAlert("danger", "Error", "Failed to load full requisition details. Please try again.");
        setShowPatientRequisitionList(false);
        return;
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.log('Access forbidden (403) - User lacks permission for Patient Requisition details');
        showAlert("warning", "Access Restricted", "You don't have permission to view requisition details. The basic information will be used.");
        // Continue with the basic requisition data we already have
      } else {
        console.error('Error fetching full requisition details:', error);
        showAlert("danger", "Error", "Error fetching full requisition details. Please try again.");
        setShowPatientRequisitionList(false);
        return;
      }
    }

    try {
      const PATIENT_API_BASE_URL = "https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.patient_api.search_patient";
      const fetchHeaders: any = { 'Content-Type': 'application/json' };
      if (apiKey && apiSecret) {
        fetchHeaders['Authorization'] = `token ${apiKey}:${apiSecret}`;
      }

      console.log("Patient Search API request for requisition patient_id:", fullRequisitionData.patient_id);
      const searchRes = await fetch(`${PATIENT_API_BASE_URL}?search_type=UHID&search_value=${fullRequisitionData.patient_id}&PageIndex=1&PageSize=10&IsExpired=false`, {
        method: 'GET',
        headers: fetchHeaders,
        credentials: 'include',
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const patients = searchData.message || [];
        if (patients.length > 0) {
          const fetchedPatient = patients[0];
          if (opdCardRef.current) {
            opdCardRef.current.handleSelectPatient(fetchedPatient);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch patient details:", e);
    }

    // Auto-set customer based on requisition's patient company or default to self-paid
    console.log('Customer population - requisition data:', fullRequisitionData);
    console.log('Customer population - patient_company:', fullRequisitionData.patient_company);
    console.log('Customer population - available customers:', customers);

    if (customers && customers.length > 0) {
      // If requisition has a patient company, try to find matching customer
      if (fullRequisitionData.patient_company) {
        console.log('Looking for customer matching:', fullRequisitionData.patient_company);
        const matchingCustomer = customers.find((customer: any) =>
          customer.label === fullRequisitionData.patient_company || customer.value === fullRequisitionData.patient_company
        );
        console.log('Found matching customer:', matchingCustomer);
        if (matchingCustomer) {
          setSelectedCustomer(matchingCustomer.value);
          console.log('Set customer to requisition patient company:', matchingCustomer.value);
        } else {
          // If no matching customer found, default to self-paid
          console.log('No matching customer found, looking for self-paid customer');
          const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
          if (defaultSelfPaidCustomer) {
            setSelectedCustomer(defaultSelfPaidCustomer.value);
            console.log('No matching customer found for requisition, defaulted to self-paid:', defaultSelfPaidCustomer.value);
          }
        }
      } else {
        // If requisition has no patient company, default to self-paid
        console.log('Requisition has no patient company, looking for self-paid customer');
        const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
        if (defaultSelfPaidCustomer) {
          setSelectedCustomer(defaultSelfPaidCustomer.value);
          console.log('Requisition has no patient company, defaulted to self-paid:', defaultSelfPaidCustomer.value);
        }
      }
    } else {
      console.log('No customers available for population');
    }

    // Set requisition details
    setRequisitionNo(fullRequisitionData.name);
    setRequisitionFrom(fullRequisitionData.requisition_from);
    setRequisitionDate(new Date(fullRequisitionData.requisition_date_time));
    setToLocation(fullRequisitionData.to_location);
    setSelectedSaleType(fullRequisitionData.sale_type);
    // setSelectedKit(fullRequisitionData.kit);

    // Set boolean flags
    setIsRoutine(fullRequisitionData.routine === 1);
    setIsStat(fullRequisitionData.stat === 1);
    setIsDischarge(fullRequisitionData.discharge === 1);
    setIsAsap(fullRequisitionData.asap === 1);
    setIsExpired(fullRequisitionData.expired === 1);
    setIsReturn(fullRequisitionData.is_return === 1);

    // Add requisition items to the table
    const warehouse = selectedWarehouse; // Ensure selectedWarehouse is set before this point
    if (!warehouse) {
      showAlert("danger", "Error", "Please select a warehouse first to load requisition items.");
      setShowPatientRequisitionList(false);
      return;
    }

    const company = selectedCompany; // Ensure selectedCompany is set before this point
    if (!company) {
      showAlert("danger", "Error", "Please select a company first to load requisition items.");
      setShowPatientRequisitionList(false);
      return;
    }

    if (!fullRequisitionData.patient_requisition_item_details || !Array.isArray(fullRequisitionData.patient_requisition_item_details)) {
      showAlert("danger", "Error", "Requisition item details are missing or not in a valid format.");
      setShowPatientRequisitionList(false);
      return;
    }

    for (const reqItem of fullRequisitionData.patient_requisition_item_details) {
      const itemCode = reqItem.item_code;
      const requestedQty = reqItem.req_qty;

      console.log(`Processing requisition item: ${itemCode}, requestedQty: ${requestedQty}`);

      try {
        // Get the invoiced quantity for this specific item
        const invoicedQty = await getItemInvoicedQuantity(requisition.name, itemCode);
        let remainingQtyToAllocate = requestedQty - invoicedQty;

        console.log(`Item ${itemCode}: Requested=${requestedQty}, Invoiced=${invoicedQty}, Remaining=${remainingQtyToAllocate}`);

        // Skip items that are already fully invoiced
        if (remainingQtyToAllocate <= 0) {
          console.log(`Skipping item ${itemCode} - already fully invoiced`);
          continue;
        }

        // Skip items with zero remaining quantity
        if (remainingQtyToAllocate === 0) {
          console.log(`Skipping item ${itemCode} - no remaining quantity to allocate`);
          continue;
        }

        const batches = await fetchItemBatchesWithParams(itemCode, warehouse, company);
        const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

        if (sortedBatches.length === 0) {
          // Add item without stock to grid with red color indicator
          const itemWithoutStock: Item = {
            id: `${itemCode}-nostock-${Date.now()}`,
            alternateBatches: "1", // Indicate it's an alternative item
            substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
            itemCode: itemCode,
            itemName: reqItem.item_name,
            uom: reqItem.unit,
            stockQty: 0,
            orderedQty: requestedQty, // Show original requested quantity
            saleQty: remainingQtyToAllocate, // Show remaining quantity to be invoiced
            batch: "",
            batchNo: "",
            expiryDate: "",
            batchStockQty: 0,
            rate: null,
            taxTemplate: "",
            description: "",
            itemAmount: 0,
            discountPercent: 0,
            discountAmt: 0,
            cgstPercent: 0,
            cgstAmt: 0,
            sgstPercent: 0,
            sgstAmt: 0,
            igstPercent: 0,
            igstAmt: 0,
            totalAmt: 0,
            totalPckgAmt: 0,
            kitName: "",
            packageName: "",
            binLocation: "",
            hasStock: false, // Mark as no stock
          };
          await handleAddItemToDetails(itemWithoutStock);
          showAlert("warning", "Warning", `No stock available for item ${itemCode} from requisition. Item added to grid with no stock indicator.`);
          remainingQtyToAllocate = 0; // Stop further processing for this item
          continue;
        }

        for (const batch of sortedBatches) {
          if (remainingQtyToAllocate <= 0) break;

          const batchAvailableQty = batch.batch_qty;
          const qtyToTake = Math.min(remainingQtyToAllocate, batchAvailableQty);

          if (qtyToTake > 0) {
            console.log(`Adding item: ${itemCode}, batch: ${batch.name}, qty: ${qtyToTake}`);
            const itemRate = await fetchItemPrice(itemCode, batch.name, 'Standard Selling');
            const batchStockQty = await getBatchQty(itemCode, batch.name, warehouse);

            const itemToAdd: Item = {
              id: `${itemCode}-${batch.name}-${Date.now()}`,
              alternateBatches: "1", // Indicate it's an alternative item
              substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
              itemCode: itemCode,
              itemName: reqItem.item_name,
              uom: reqItem.unit,
              stockQty: batchStockQty,
              orderedQty: requestedQty, // Use full requisition quantity instead of batch quantity
              saleQty: qtyToTake, // Keep saleQty as the actual batch quantity being allocated
              batch: batch.name,
              batchNo: batch.name,
              expiryDate: batch.expiry_date,
              batchStockQty: batchStockQty,
              rate: itemRate,
              taxTemplate: "",
              description: "",
              itemAmount: 0,
              discountPercent: 0,
              discountAmt: 0,
              cgstPercent: 0,
              cgstAmt: 0,
              sgstPercent: 0,
              sgstAmt: 0,
              igstPercent: 0,
              igstAmt: 0,
              totalAmt: 0,
              totalPckgAmt: 0,
              kitName: "", // Add kitName
              packageName: "",
              binLocation: "",
            };
            await handleAddItemToDetails(itemToAdd);
            remainingQtyToAllocate -= qtyToTake;
          }
        }

        if (remainingQtyToAllocate > 0) {
          showAlert("warning", "Warning", `Only ${requestedQty - remainingQtyToAllocate} of ${requestedQty} quantity for item ${itemCode} could be fulfilled from batches. Showing alternatives for remaining ${remainingQtyToAllocate}.`);
          const originalItemForAltPartial: Item = {
            id: `${itemCode}-alt-${Date.now()}`,
            alternateBatches: "1", // Indicate it's an alternative item
            substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
            itemCode: itemCode,
            itemName: reqItem.item_name,
            uom: reqItem.unit,
            stockQty: 0,
            orderedQty: requestedQty, // Show original requested quantity
            saleQty: remainingQtyToAllocate, // Show remaining quantity to be invoiced
            batch: "",
            batchNo: "",
            expiryDate: "",
            batchStockQty: 0,
            rate: null,
            taxTemplate: "",
            description: "",
            itemAmount: 0,
            discountPercent: 0,
            discountAmt: 0,
            cgstPercent: 0,
            cgstAmt: 0,
            sgstPercent: 0,
            sgstAmt: 0,
            igstPercent: 0,
            igstAmt: 0,
            totalAmt: 0,
            totalPckgAmt: 0,
            kitName: "",
            packageName: "",
            binLocation: "",
          };
          await handleNoBatchesFound(originalItemForAltPartial);
        }
      } catch (error) {
        console.error(`Error processing item ${itemCode} from requisition:`, error);
        showAlert("danger", "Error", `Failed to add item ${itemCode} from requisition.`);
      }
    }

    setShowPatientRequisitionList(false);
    showAlert("success", "Success", `Requisition ${requisition.name} selected and loaded.`);
  };

  const handleSelectPrescription = async (prescription: any) => {
    console.log("Selected prescription:", prescription);
    const docId = prescription.name || prescription.prescription_id || prescription.prescription_number;
    const displayNo = prescription.prescription_number || prescription.custom_prescription_no || prescription.prescriptionNo || prescription.name;

    // Set source document information (docId is hidden prescription ID, displayNo is user-facing)
    setSourceDocumentName(docId);
    setSourceDocumentType('prescription');
    setIsItemsLoadedFromRequisitionOrPrescription(true);

    // Set Req ID field with display number and make it readonly
    setReqId(displayNo);
    setIsReqIdReadonly(true);

    // Fetch the full prescription document using primary key docId
    let fullPrescriptionData = prescription;
    try {
      const authHeaders = getAuthHeaders();
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;
      const response = await fetch(`${API_BASE_URL}/Patient%20Requisition/${encodeURIComponent(docId)}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        fullPrescriptionData = data.data;
      } else {
        console.error('Failed to fetch full prescription details:', response.status, response.statusText);
        showAlert("danger", "Error", "Failed to load full prescription details. Please try again.");
        setShowPrescriptionList(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching full prescription details:', error);
      showAlert("danger", "Error", "Error fetching full prescription details. Please try again.");
      setShowPrescriptionList(false);
      return;
    }

    // Store prescription visit_id for Check Status API
    if (fullPrescriptionData.visit_id) {
      prescriptionVisitIdRef.current = fullPrescriptionData.visit_id;
    } else if (prescription.visit_id) {
      prescriptionVisitIdRef.current = prescription.visit_id;
    } else {
      prescriptionVisitIdRef.current = "";
    }

    try {
      const PATIENT_API_BASE_URL = "https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.patient_api.search_patient";
      const fetchHeaders: any = { 'Content-Type': 'application/json' };
      if (apiKey && apiSecret) {
        fetchHeaders['Authorization'] = `token ${apiKey}:${apiSecret}`;
      }

      console.log("Patient Search API request for prescription patient_id:", fullPrescriptionData.patient_id);
      const searchRes = await fetch(`${PATIENT_API_BASE_URL}?search_type=UHID&search_value=${fullPrescriptionData.patient_id}&PageIndex=1&PageSize=10&IsExpired=false`, {
        method: 'GET',
        headers: fetchHeaders,
        credentials: 'include',
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        console.log("Patient Search API response:", searchData);
        const patients = searchData.message || [];
        if (patients.length > 0) {
          const fetchedPatient = patients[0];
          console.log("The function that populates the patient state: opdCardRef.current.handleSelectPatient");
          if (opdCardRef.current) {
            opdCardRef.current.handleSelectPatient(fetchedPatient);
          } else {
            console.error("opdCardRef is null! Cannot populate patient data.");
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch patient details:", e);
    }

    // Auto-set customer based on prescription's patient company or default to self-paid
    if (customers && customers.length > 0) {
      // If prescription has a patient company, try to find matching customer
      if (fullPrescriptionData.patient_company) {
        const matchingCustomer = customers.find((customer: any) =>
          customer.label === fullPrescriptionData.patient_company || customer.value === fullPrescriptionData.patient_company
        );
        if (matchingCustomer) {
          setSelectedCustomer(matchingCustomer.value);
          console.log('Set customer to prescription patient company:', matchingCustomer.value);
        } else {
          // If no matching customer found, default to self-paid
          const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
          if (defaultSelfPaidCustomer) {
            setSelectedCustomer(defaultSelfPaidCustomer.value);
            console.log('No matching customer found for prescription, defaulted to self-paid:', defaultSelfPaidCustomer.value);
          }
        }
      } else {
        // If prescription has no patient company, default to self-paid
        const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
        if (defaultSelfPaidCustomer) {
          setSelectedCustomer(defaultSelfPaidCustomer.value);
          console.log('Prescription has no patient company, defaulted to self-paid:', defaultSelfPaidCustomer.value);
        }
      }
    }

    // Set prescription/requisition details
    setRequisitionNo(fullPrescriptionData.name);
    setRequisitionFrom(fullPrescriptionData.requisition_from);
    setRequisitionDate(new Date(fullPrescriptionData.creation)); // Using creation date as prescription date
    setToLocation(fullPrescriptionData.to_location);
    setSelectedSaleType(fullPrescriptionData.sale_type);
    // setSelectedKit(fullPrescriptionData.kit);

    // Set boolean flags
    setIsRoutine(fullPrescriptionData.routine === 1);
    setIsStat(fullPrescriptionData.stat === 1);
    setIsDischarge(fullPrescriptionData.discharge === 1);
    setIsAsap(fullPrescriptionData.asap === 1);
    setIsExpired(fullPrescriptionData.expired === 1);
    setIsReturn(fullPrescriptionData.is_return === 1);

    // Add prescription items to the table
    const warehouse = selectedWarehouse; // Ensure selectedWarehouse is set before this point
    if (!warehouse) {
      showAlert("danger", "Error", "Please select a warehouse first to load prescription items.");
      setShowPrescriptionList(false);
      return;
    }

    const company = selectedCompany; // Ensure selectedCompany is set before this point
    if (!company) {
      showAlert("danger", "Error", "Please select a company first to load prescription items.");
      setShowPrescriptionList(false);
      return;
    }

    if (!fullPrescriptionData.patient_requisition_item_details || !Array.isArray(fullPrescriptionData.patient_requisition_item_details)) {
      showAlert("danger", "Error", "Prescription item details are missing or not in a valid format.");
      setShowPrescriptionList(false);
      return;
    }

    for (const reqItem of fullPrescriptionData.patient_requisition_item_details) {
      console.log('Prescription item details:', reqItem);
      const itemCode = reqItem.item_code;
      const requestedQty = reqItem.req_qty;
      console.log('Processing item - itemCode:', itemCode, 'requestedQty:', requestedQty);

      try {
        // Get the invoiced quantity for this specific item from prescription
        const invoicedQty = await getItemInvoicedQuantityFromPrescription(prescription.prescription_number, itemCode);
        let remainingQtyToAllocate = requestedQty - invoicedQty;

        console.log(`Prescription Item ${itemCode}: Requested=${requestedQty}, Invoiced=${invoicedQty}, Remaining=${remainingQtyToAllocate}`);

        // Skip items that are already fully invoiced
        if (remainingQtyToAllocate <= 0) {
          console.log(`Skipping prescription item ${itemCode} - already fully invoiced`);
          continue;
        }

        const batches = await fetchItemBatchesWithParams(itemCode, warehouse, company);
        console.log('handleSelectPrescription - fetched batches for', itemCode, ':', batches, 'Type:', typeof batches, 'Is Array:', Array.isArray(batches));
        const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
        console.log('handleSelectPrescription - sortedBatches for', itemCode, ':', sortedBatches, 'Length:', sortedBatches.length);

        if (sortedBatches.length === 0) {
          // Add item without stock to grid with red color indicator
          const itemWithoutStock: Item = {
            id: `${itemCode}-nostock-${Date.now()}`,
            alternateBatches: "1", // Indicate it's an alternative item
            substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
            itemCode: itemCode,
            itemName: reqItem.item_name,
            uom: reqItem.unit,
            stockQty: 0,
            orderedQty: requestedQty, // Show original requested quantity
            saleQty: remainingQtyToAllocate, // Show remaining quantity to be invoiced
            batch: "",
            batchNo: "",
            expiryDate: "",
            batchStockQty: 0,
            rate: null,
            taxTemplate: "",
            description: "",
            itemAmount: 0,
            discountPercent: 0,
            discountAmt: 0,
            cgstPercent: 0,
            cgstAmt: 0,
            sgstPercent: 0,
            sgstAmt: 0,
            igstPercent: 0,
            igstAmt: 0,
            totalAmt: 0,
            totalPckgAmt: 0,
            kitName: "",
            packageName: "",
            binLocation: "",
            hasStock: false, // Mark as no stock
            covered: reqItem.covered === 1 || reqItem.covered === true,
            preAuthRequired: reqItem.pre_auth_req === 1 || reqItem.pre_auth_req === true || reqItem.pre_auth_req === "Yes",
            preAuthStatus: reqItem.pre_auth_status || "",
            preAuthNo: reqItem.pre_auth_no || "",
            preAuthDateTime: reqItem.pre_auth_date_time || "",
            coPayPercentage: reqItem.co_pay || 0,
            isFromPrescription: true,
            custom_his_item_id: reqItem.his_item_id || reqItem.custom_his_item_id || reqItem.name || "",
          };
          await handleAddItemToDetails(itemWithoutStock);
          showAlert("warning", "Warning", `No stock available for item ${itemCode} from prescription. Item added to grid with no stock indicator.`);
          remainingQtyToAllocate = 0;
          continue;
        }

        for (const batch of sortedBatches) {
          if (remainingQtyToAllocate <= 0) break;

          const batchAvailableQty = batch.batch_qty;
          const qtyToTake = Math.min(remainingQtyToAllocate, batchAvailableQty);

          if (qtyToTake > 0) {
            const itemRate = await fetchItemPrice(itemCode, batch.name, 'Standard Selling');
            const batchStockQty = await getBatchQty(itemCode, batch.name, warehouse);

            const itemToAdd: Item = {
              id: `${itemCode}-${batch.name}-${Date.now()}`,
              alternateBatches: "1", // Indicate it's an alternative item
              substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
              itemCode: itemCode,
              itemName: reqItem.item_name,
              uom: reqItem.unit,
              stockQty: batchStockQty,
              orderedQty: requestedQty, // Use full prescription quantity instead of batch quantity
              saleQty: qtyToTake, // Keep saleQty as the actual batch quantity being allocated
              batch: batch.name,
              batchNo: batch.name,
              expiryDate: batch.expiry_date,
              batchStockQty: batchStockQty,
              rate: itemRate,
              taxTemplate: "",
              description: "",
              itemAmount: 0,
              discountPercent: 0,
              discountAmt: 0,
              cgstPercent: 0,
              cgstAmt: 0,
              sgstPercent: 0,
              sgstAmt: 0,
              igstPercent: 0,
              igstAmt: 0,
              totalAmt: 0,
              totalPckgAmt: 0,
              kitName: "", // Add kitName
              packageName: "",
              binLocation: "",
              covered: reqItem.covered === 1 || reqItem.covered === true,
              preAuthRequired: reqItem.pre_auth_req === 1 || reqItem.pre_auth_req === true || reqItem.pre_auth_req === "Yes",
              preAuthStatus: reqItem.pre_auth_status || "",
              preAuthNo: reqItem.pre_auth_no || "",
              preAuthDateTime: reqItem.pre_auth_date_time || "",
              coPayPercentage: reqItem.co_pay || 0,
              isFromPrescription: true,
              custom_his_item_id: reqItem.his_item_id || reqItem.custom_his_item_id || reqItem.name || "",
            };
            await handleAddItemToDetails(itemToAdd);
            remainingQtyToAllocate -= qtyToTake;
          }
        }

        if (remainingQtyToAllocate > 0) {
          showAlert("warning", "Warning", `Only ${requestedQty - remainingQtyToAllocate} of ${requestedQty} quantity for item ${itemCode} could be fulfilled from batches. Showing alternatives for remaining ${remainingQtyToAllocate}.`);
          const originalItemForAltPartial: Item = {
            id: `${itemCode}-alt-${Date.now()}`,
            alternateBatches: "1", // Indicate it's an alternative item
            substituteItem: reqItem.item_code, // Pass the original itemCode as substituteItem
            itemCode: itemCode,
            itemName: reqItem.item_name,
            uom: reqItem.unit,
            stockQty: 0,
            orderedQty: requestedQty, // Show original requested quantity
            saleQty: remainingQtyToAllocate, // Show remaining quantity to be invoiced
            batch: "",
            batchNo: "",
            expiryDate: "",
            batchStockQty: 0,
            rate: null,
            taxTemplate: "",
            description: "",
            itemAmount: 0,
            discountPercent: 0,
            discountAmt: 0,
            cgstPercent: 0,
            cgstAmt: 0,
            sgstPercent: 0,
            sgstAmt: 0,
            igstPercent: 0,
            igstAmt: 0,
            totalAmt: 0,
            totalPckgAmt: 0,
            kitName: "",
            packageName: "",
            binLocation: "",
            covered: reqItem.covered === 1 || reqItem.covered === true,
            preAuthRequired: reqItem.pre_auth_req === 1 || reqItem.pre_auth_req === true || reqItem.pre_auth_req === "Yes",
            preAuthStatus: reqItem.pre_auth_status || "",
            preAuthNo: reqItem.pre_auth_no || "",
            preAuthDateTime: reqItem.pre_auth_date_time || "",
            coPayPercentage: reqItem.co_pay || 0,
            isFromPrescription: true,
            custom_his_item_id: reqItem.his_item_id || reqItem.custom_his_item_id || reqItem.name || "",
          };
          await handleNoBatchesFound(originalItemForAltPartial);
        }
      } catch (error) {
        console.error(`Error processing item ${itemCode} from prescription:`, error);
        showAlert("danger", "Error", `Failed to add item ${itemCode} from prescription.`);
      }
    }

    setShowPrescriptionList(false);
    showAlert("success", "Success", `Prescription ${prescription.prescription_number} selected and loaded.`);
  };

  const fetchSubstituteItems = async (itemCode: string) => {
    if (!itemCode) return [];
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const filters1 = encodeURIComponent(JSON.stringify([["item_code", "=", itemCode]]));
      const url1 = `${API_BASE_URL}/Item%20Alternative?fields=["alternative_item_code","alternative_item_name"]&filters=${filters1}`;

      const filters2 = encodeURIComponent(JSON.stringify([["alternative_item_code", "=", itemCode], ["two_way", "=", 1]]));
      const url2 = `${API_BASE_URL}/Item%20Alternative?fields=["item_code","item_name"]&filters=${filters2}`;

      const [r1, r2] = await Promise.all([
        fetch(url1, { method: 'GET', headers, credentials: 'include' }),
        fetch(url2, { method: 'GET', headers, credentials: 'include' })
      ]);

      let alternatives: { alternative_item_code: string; alternative_item_name?: string }[] = [];
      if (r1.ok) {
        const j1 = await r1.json();
        if (j1.data) alternatives = alternatives.concat(j1.data.map((d: any) => ({
          alternative_item_code: d.alternative_item_code,
          alternative_item_name: d.alternative_item_name
        })));
      }
      if (r2.ok) {
        const j2 = await r2.json();
        if (j2.data) alternatives = alternatives.concat(j2.data.map((d: any) => ({
          alternative_item_code: d.item_code,
          alternative_item_name: d.item_name
        })));
      }
      const seen = new Set();
      return alternatives.filter(a => {
        if (seen.has(a.alternative_item_code)) return false;
        seen.add(a.alternative_item_code);
        return true;
      });
    } catch (e) {
      console.error('Error fetching substitutes:', e);
      return [];
    }
  };

  const fetchAlternativeItemsWithBatches = async (itemCode: string) => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const itemInfoResponse = await fetch(`${API_BASE_URL}/Item/${encodeURIComponent(itemCode)}?fields=["item_name","stock_uom"]`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      const itemInfoData = itemInfoResponse.ok ? await itemInfoResponse.json() : { data: null };
      const itemInfo = itemInfoData.data || {};

      const batches = await fetchItemBatches(itemCode);
      const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

      return {
        item_code: itemCode,
        item_name: itemInfo.item_name || itemCode,
        uom: itemInfo.stock_uom || '',
        batches: sortedBatches.map(b => ({
          batch_no: b.name,
          expiry_date: b.expiry_date,
          qty: b.batch_qty,
        }))
      };
    } catch (error) {
      console.error(`Error fetching alternative item batches for ${itemCode}:`, error);
      return null;
    }
  };
  const fetchTaxDetails = async (itemCode: string, rate: number, qty: number, uom: string) => {
    const companyValue = selectedCompany || 'City Hospital'; // Use selectedCompany
    const customerValue = selectedCustomer || patientData?.mrn || 'PQR Ltd'; // Use selectedCustomer
    const priceListValue = 'Standard Selling';

    const args = {
      item_code: itemCode,
      company: companyValue, // Using selectedCompany as company
      customer: customerValue,
      price_list: priceListValue,
      qty: qty,
      uom: uom,
      input_rate: rate, // Pass the rate directly
    };

    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(ITEM_DETAILS_API_URL, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(args),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.message || {};

      if (result.error) {
        throw new Error(result.error);
      }

      return {
        cgstRate: result.cgst_rate || 0,
        sgstRate: result.sgst_rate || 0,
        igstRate: result.igst_rate || 0,
        itemRate: result.rate || rate, // Use fetched rate if available, otherwise original rate
        taxTemplate: result.item_tax_template || '',
        custom_his_item_id: result.custom_his_item_id || '',
      };
    } catch (error: any) {
      console.error('Error fetching item details:', error);
      showAlert("danger", "Error", `Failed to fetch tax details: ${error.message || 'Unknown error'}`);
      return {
        cgstRate: 0,
        sgstRate: 0,
        igstRate: 0,
        itemRate: rate,
        taxTemplate: '',
        custom_his_item_id: '',
      };
    }
  };



  const handleNoBatchesFound = async (item: Item) => {
    showAlert("warning", "Warning", `No batches available for ${item.itemName}. Searching for alternatives...`);
    setItemSeekingAlternatives(item);
    if (!selectedWarehouse) {
      showAlert("danger", "Error", "Please select a warehouse first.");
      return;
    }// Use selectedWarehouse
    try {
      const substitutes = await fetchSubstituteItems(item.itemCode);
      const alternativeDetailsPromises = substitutes.map(async (alt: any) => {
        return await fetchAlternativeItemsWithBatches(alt.alternative_item_code);
      });
      const fetchedAlternativeDetails = (await Promise.all(alternativeDetailsPromises)).filter(Boolean);
      setAlternativeItems(fetchedAlternativeDetails);
      setShowAlternativeItemsPopover(true);
    } catch (error) {
      console.error('Error fetching alternative items:', error);
      showAlert("danger", "Error", "Failed to fetch alternative items.");
    }
  };

  const handleSelectAlternativeItem = async (itemCode: string, batchNo: string, expiryDate: string, qty: number) => {
    if (!itemSeekingAlternatives) return;

    if (!selectedWarehouse) {
      showAlert("danger", "Error", "Please select a warehouse first.");
      return;
    }
    const warehouse = selectedWarehouse; // Use selectedWarehouse
    const itemRate = await fetchItemPrice(itemCode, batchNo, 'Standard Selling');
    const batchStockQty = await getBatchQty(itemCode, batchNo, warehouse);

    const itemToAdd: Item = {
      ...itemSeekingAlternatives,
      id: `${itemCode}-${batchNo}-${Date.now()}`,
      itemCode: itemCode,
      itemName: alternativeItems.find(alt => alt.item_code === itemCode)?.item_name || itemCode,
      uom: alternativeItems.find(alt => alt.item_code === itemCode)?.uom || itemSeekingAlternatives.uom,
      stockQty: batchStockQty,
      orderedQty: qty,
      saleQty: qty,
      batch: batchNo,
      batchNo: batchNo,
      expiryDate: expiryDate,
      batchStockQty: batchStockQty,
      rate: itemRate,
      substituteItem: itemSeekingAlternatives.itemCode,
      alternateBatches: "1", // Indicate it's an alternative item
    };
    await handleAddItemToDetails(itemToAdd);
    setItemSeekingAlternatives(null);
    setAlternativeItems([]);
    setShowAlternativeItemsPopover(false);
  };

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
  const [_pendingQtyIncrement, setPendingQtyIncrement] = useState<number>(0);

  // High-alert save dialog state
  const [showHighAlertSaveDialog, setShowHighAlertSaveDialog] = useState(false);
  const [highAlertItems, setHighAlertItems] = useState<Item[]>([]);
  const [pendingSaveAction, setPendingSaveAction] = useState<'draft' | 'finalize' | null>(null);

  useEffect(() => {
    console.log('Alert state changed:', alert);
  }, [alert]);

  // Show alert function
  const showAlert = (variant: AlertState['variant'], heading: string, content: string) => {
    console.log('Setting alert state:', variant, heading, content);
    setAlert({
      show: true,
      variant,
      heading,
      content
    });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // High-alert dialog handlers
  const handleHighAlertConfirm = async () => {
    if (pendingItem) {
      console.log("User confirmed high-alert item, proceeding with normal addition process:", pendingItem);

      // Create a modified item that bypasses the high-alert check
      // We'll add a flag to skip the high-alert check in the normal flow
      const itemForNormalAddition = {
        ...pendingItem,
        _skipHighAlertCheck: true, // Add flag to bypass high-alert check
      };

      // Call the normal handleAddItemToDetails function
      // This will ensure all calculations work exactly like normal item addition
      await handleAddItemToDetails(itemForNormalAddition);
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

  // High-alert save dialog handlers
  const handleHighAlertSaveConfirm = async () => {
    console.log("User confirmed high-alert items, proceeding with save/finalize");

    // Reset dialog state first
    setShowHighAlertSaveDialog(false);
    const actionToExecute = pendingSaveAction;
    setHighAlertItems([]);
    setPendingSaveAction(null);

    // Execute the pending action - skip high-alert check this time
    if (actionToExecute === 'draft') {
      // Call the actual save draft function with flag to skip high-alert check
      console.log("Calling handleSaveAsDraft after high-alert confirmation");
      await handleSaveAsDraft(true); // Pass true to skip high-alert check
    } else if (actionToExecute === 'finalize') {
      // Call the actual finalize function with flag to skip high-alert check
      console.log("Calling handleFinalizeAndPrint after high-alert confirmation");
      await handleFinalizeAndPrint(true); // Pass true to skip high-alert check
    }
  };

  const handleHighAlertSaveCancel = () => {
    console.log("User cancelled save/finalize due to high-alert items");
    setShowHighAlertSaveDialog(false);
    setHighAlertItems([]);
    setPendingSaveAction(null);
  };

  // Apply global discount to all items
  const handleApplyGlobalDiscount = () => {
    if (items.length === 0) {
      console.log('Setting alert state:', "warning", "Warning", "No items in the table to apply discount.");
      showAlert("warning", "Warning", "No items in the table to apply discount.");
      return;
    }

    if (globalDiscountPercent < 0 || globalDiscountPercent > 100) {
      console.log('Setting alert state:', "danger", "Error", "Discount percentage must be between 0 and 100.");
      showAlert("danger", "Error", "Discount percentage must be between 0 and 100.");
      return;
    }

    // Check if any items have max_discount restriction
    const restrictedItems = items.filter(item =>
      item.max_discount && globalDiscountPercent > item.max_discount
    );

    if (restrictedItems.length > 0) {
      const itemNames = restrictedItems.map(item => `${item.itemName} (${item.itemCode})`).join(', ');
      showAlert("danger", "Error", `Cannot apply ${globalDiscountPercent}% discount. The following items have maximum discount limits: ${itemNames}`);
      return;
    }

    // Update all items with the global discount percentage
    // For tax-inclusive rates, apply discount to the total amount (which includes tax)
    // The calculateItemTaxAndTotals function will handle extracting the taxable amount and taxes
    const updatedItems = items.map(item => {
      const calculated = calculateItemTaxAndTotals({
        ...item,
        discountPercent: globalDiscountPercent,
      }, true);

      console.log('Applied global discount to item:', {
        itemCode: item.itemCode,
        discountPercent: globalDiscountPercent,
        newDiscountAmount: calculated.discountAmt,
        newTotalAmount: calculated.totalAmt
      });

      return calculated;
    });

    setItems(updatedItems);
    recalculateTotals(updatedItems);
    showAlert("success", "Success", `Applied ${globalDiscountPercent}% discount to all items.`);
  };

  // Helper function to fetch req_qty from requisition/prescription
  const fetchReqQtyForItem = async (sourceDocName: string, itemCode: string): Promise<number> => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      // Fetch the requisition/prescription document
      const response = await fetch(`${API_BASE_URL}/Patient%20Requisition/${sourceDocName}?fields=["name","patient_requisition_item_details"]`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        console.warn(`Failed to fetch requisition/prescription ${sourceDocName}`);
        return 0;
      }

      const data = await response.json();
      const requisitionItems = data.data?.patient_requisition_item_details || [];

      // Find the matching item and return its req_qty
      const matchingItem = requisitionItems.find((item: any) => item.item_code === itemCode);
      if (matchingItem) {
        const reqQty = matchingItem.req_qty || matchingItem.quantity || matchingItem.qty || 0;
        console.log(`Found req_qty for item ${itemCode}: ${reqQty}`);
        return reqQty;
      }

      console.warn(`Item ${itemCode} not found in requisition/prescription ${sourceDocName}`);
      return 0;
    } catch (error) {
      console.error(`Error fetching req_qty for item ${itemCode}:`, error);
      return 0;
    }
  };

  // --- START: Function to get full file URL ---
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFullFileUrl = (fileUrl: string) => {
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    // Otherwise, prepend the server URL
    return `https://gmcerp.quantcloud.in/${fileUrl}`;
  };
  // --- END: Function to get full file URL ---

  // --- START: Function to load attachments for an invoice ---
  const loadInvoiceAttachments = async (invoiceName: string) => {
    try {
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch('https://gmcerp.quantcloud.in/api/method/frappe.client.get_list', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          doctype: 'File',
          filters: {
            attached_to_doctype: 'POS Invoice',
            attached_to_name: invoiceName
          },
          fields: ['name', 'file_name', 'file_url', 'file_size', 'is_private']
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message && result.message.length > 0) {
          console.log("Found attachments for invoice:", invoiceName, result.message);

          // Store attachments in state
          setLoadedAttachments(result.message);

          // Log the attachments
          result.message.forEach((attachment: any) => {
            console.log(`- ${attachment.file_name} (${attachment.file_url})`);
          });

          // Show alert about attachments
          showAlert("primary", "Attachments Found", `Found ${result.message.length} attachment(s) for this invoice.`);
        } else {
          console.log("No attachments found for invoice:", invoiceName);
          // Clear loaded attachments
          setLoadedAttachments([]);
        }
      } else {
        console.error("Failed to fetch attachments:", await response.json());
        setLoadedAttachments([]);
      }
    } catch (error) {
      console.error("Error loading invoice attachments:", error);
      setLoadedAttachments([]);
    }
  };
  // --- END: Function to load attachments for an invoice ---

  const handleLoadInvoice = async (invoice: any) => {
    try {
      // Set flag to prevent recalculation
      setIsLoadingFromPosInvoice(true);

      // Fetch full invoice details including all child tables
      // Use the same authentication logic as other functions
      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await fetch(`${API_BASE_URL}/Sale%20Bill/${invoice.name}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        showAlert("danger", "Error", "Failed to load invoice details.");
        setIsLoadingFromPosInvoice(false);
        return;
      }

      const data = await response.json();
      const fullInvoice = data.data;
      console.log(fullInvoice)

      // Store loaded invoice details
      setLoadedInvoiceName(fullInvoice.name);
      setLoadedInvoiceDocstatus(fullInvoice.docstatus || 0);

      // Load attachments for this invoice
      await loadInvoiceAttachments(fullInvoice.name);

      let patientSelected = false;
      const invoicePatient = {
        patientFullName: fullInvoice.custom_patient_name || fullInvoice.patient_name || "",
        mrn: fullInvoice.custom_uhid || fullInvoice.custom_mrn || fullInvoice.custom_patient_id || "",
        ageDisplay: fullInvoice.custom_age || "",
        genderValue: fullInvoice.custom_gender || fullInvoice.sex || "",
        mobileNo: fullInvoice.custom_phone || fullInvoice.contact_mobile || "",
        aadharCardNo: fullInvoice.custom_aadhar || "",
        patientCategory: fullInvoice.custom_patient_category || "",
        consultingDoctor: fullInvoice.custom_doctor_name || fullInvoice.custom_doctor || "",
        departmentName: fullInvoice.custom_department || "",
        patientVisitType: fullInvoice.patientVisitType || fullInvoice.visitType || fullInvoice.visit_type || fullInvoice.custom_visit_type || (fullInvoice.custom_is_ipd_invoice === 1 || fullInvoice.custom_ipd_effect === 1 ? "IPD" : "OPD"),
        patientCompany: fullInvoice.custom_patient_company || "",
        bedName: fullInvoice.custom_bed_no || fullInvoice.custom_bed || fullInvoice.bed_no || fullInvoice.bed_name || "",
        wardName: fullInvoice.custom_ward || fullInvoice.custom_ward_no || fullInvoice.custom_ward_name || fullInvoice.ward || "",
        visitID: fullInvoice.custom_visit_code || "",
        visitNo: fullInvoice.visitNumber || fullInvoice.visitNo || fullInvoice.visit_no || fullInvoice.custom_visit_code || "",
        payerType: fullInvoice.custom_payer_category || "",
        payerName: fullInvoice.custom_payer_name || "",
        network: fullInvoice.custom_network || "",
        insurnaceNo: fullInvoice.custom_insurance_no || "",
        subInsurance: fullInvoice.custom_sub_insurance || "",
        otherNo: fullInvoice.custom_other_no || "",
        validateFrom: fullInvoice.custom_validity_from || "",
        expiryDate: fullInvoice.custom_validity_to || "",
        hospitalId: fullInvoice.custom_hospital || "",
        co_Pay: fullInvoice.co_pay || 0,
      };

      const searchUHID = (fullInvoice.custom_uhid || fullInvoice.custom_mrn || fullInvoice.custom_patient_id || "").trim();

      if (searchUHID && searchUHID !== "N/A" && searchUHID !== "undefined") {
        try {
          const PATIENT_API_BASE_URL = "https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.patient_api.search_patient";
          const fetchHeaders: any = { 'Content-Type': 'application/json' };
          if (apiKey && apiSecret) {
            fetchHeaders['Authorization'] = `token ${apiKey}:${apiSecret}`;
          }

          console.log("Patient Search API request for invoice patient_id:", searchUHID);
          const searchRes = await fetch(`${PATIENT_API_BASE_URL}?search_type=UHID&search_value=${searchUHID}&PageIndex=1&PageSize=10&IsExpired=false`, {
            method: 'GET',
            headers: fetchHeaders,
            credentials: 'include',
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const patients = searchData.message || [];
            if (patients.length > 0) {
              const fetchedPatient = patients[0];
              if (opdCardRef.current) {
                opdCardRef.current.handleSelectPatient(fetchedPatient);
                patientSelected = true;
              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch patient details via API, using invoice patient data:", e);
        }
      }

      // Fallback: Populate patient details directly from invoice document if search API didn't select patient
      if (!patientSelected && opdCardRef.current) {
        console.log("Populating patient card directly from invoice fields:", invoicePatient);
        opdCardRef.current.handleSelectPatient(invoicePatient);
      }

      // Set other form fields
      setSelectedCustomer(fullInvoice.customer || '');
      setSelectedCompany(fullInvoice.company || '');
      if (fullInvoice.custom_hospital) {
        setSelectedBranch(fullInvoice.custom_hospital);
      }
      if (fullInvoice.custom_department) {
        setSelectedDepartment(fullInvoice.custom_department);
      }
      setRequisitionNo(fullInvoice.custom_req_no || '');
      setReqId(fullInvoice.custom_req_no || '');
      setIsReqIdReadonly(!!fullInvoice.custom_req_no);
      setRequisitionFrom(fullInvoice.custom_requisition_from || '');
      setRemarks(fullInvoice.remarks || ''); // Load remarks from invoice
      if (fullInvoice.posting_date) {
        setRequisitionDate(new Date(fullInvoice.posting_date));
      }
      setSelectedSaleType(fullInvoice.custom_sale_type || '');
      setIsReturn(fullInvoice.is_return === 1);
      setIsIpdEffect(fullInvoice.custom_ipd_effect === 1); // Set isIpdEffect from invoice's custom_ipd_effect field

      // Set transaction type (Cash or Credit) based on loaded invoice flags
      if (fullInvoice.is_cash_bill === 1 || invoice?.is_cash_bill === 1) {
        setTransactionType('cash');
      } else if (fullInvoice.is_credit_bill === 1 || invoice?.is_credit_bill === 1) {
        setTransactionType('credit');
      } else if (fullInvoice.transaction_type || invoice?.transaction_type) {
        const tt = String(fullInvoice.transaction_type || invoice?.transaction_type).toLowerCase();
        if (tt.includes('cash')) {
          setTransactionType('cash');
        } else if (tt.includes('credit')) {
          setTransactionType('credit');
        }
      }

      // Populate payer fields from invoice
      setPayerCategory(fullInvoice.custom_payer_category || '');
      setPayerName(fullInvoice.custom_payer_name || '');
      setSubInsurance(fullInvoice.custom_sub_insurance || '');
      setNetwork(fullInvoice.custom_network || '');
      setInsuranceNo(fullInvoice.custom_insurance_no || '');
      setOtherNo(fullInvoice.custom_other_no || '');
      setTotalPayerAmount(Number(fullInvoice.payer_amount) || 0);
      setTotalPatientAmount(Number(fullInvoice.patient_amount) || 0);
      setGlobalCoPayPercent(Number(fullInvoice.co_pay) || 0);
      if (fullInvoice.custom_validity_from) {
        setValidityFrom(new Date(fullInvoice.custom_validity_from));
      }
      if (fullInvoice.custom_validity_to) {
        setExpiryValidityTo(new Date(fullInvoice.custom_validity_to));
      }

      // Extract tax rates from invoice taxes array
      const taxRatesFromInvoice: { [key: string]: { cgst: number, sgst: number, igst: number } } = {};
      if (fullInvoice.taxes && Array.isArray(fullInvoice.taxes)) {
        fullInvoice.taxes.forEach((tax: any) => {
          const accountHead = tax.account_head || "";
          const rate = tax.rate || 0;

          if (accountHead.includes("CGST")) {
            // Parse item_wise_tax_detail to get item-specific rates
            if (tax.item_wise_tax_detail) {
              try {
                const itemWiseTax = JSON.parse(tax.item_wise_tax_detail);
                Object.keys(itemWiseTax).forEach(itemCode => {
                  if (!taxRatesFromInvoice[itemCode]) {
                    taxRatesFromInvoice[itemCode] = { cgst: 0, sgst: 0, igst: 0 };
                  }
                  taxRatesFromInvoice[itemCode].cgst = itemWiseTax[itemCode][0] || rate;
                });
              } catch (e) {
                console.error("Error parsing item_wise_tax_detail:", e);
              }
            }
          } else if (accountHead.includes("SGST")) {
            if (tax.item_wise_tax_detail) {
              try {
                const itemWiseTax = JSON.parse(tax.item_wise_tax_detail);
                Object.keys(itemWiseTax).forEach(itemCode => {
                  if (!taxRatesFromInvoice[itemCode]) {
                    taxRatesFromInvoice[itemCode] = { cgst: 0, sgst: 0, igst: 0 };
                  }
                  taxRatesFromInvoice[itemCode].sgst = itemWiseTax[itemCode][0] || rate;
                });
              } catch (e) {
                console.error("Error parsing item_wise_tax_detail:", e);
              }
            }
          } else if (accountHead.includes("IGST")) {
            if (tax.item_wise_tax_detail) {
              try {
                const itemWiseTax = JSON.parse(tax.item_wise_tax_detail);
                Object.keys(itemWiseTax).forEach(itemCode => {
                  if (!taxRatesFromInvoice[itemCode]) {
                    taxRatesFromInvoice[itemCode] = { cgst: 0, sgst: 0, igst: 0 };
                  }
                  taxRatesFromInvoice[itemCode].igst = itemWiseTax[itemCode][0] || rate;
                });
              } catch (e) {
                console.error("Error parsing item_wise_tax_detail:", e);
              }
            }
          }
        });
      }

      // Load items from invoice
      const loadedItems: Item[] = [];
      if (fullInvoice.items && Array.isArray(fullInvoice.items)) {
        for (const invItem of fullInvoice.items) {
          // Get tax rates from invoice taxes array first
          const itemTaxRates = taxRatesFromInvoice[invItem.item_code] || { cgst: 0, sgst: 0, igst: 0 };

          // Use rates from invoice item if available, otherwise from taxes array
          const taxDetails = {
            cgstRate: invItem.cgst_rate || itemTaxRates.cgst,
            sgstRate: invItem.sgst_rate || itemTaxRates.sgst,
            igstRate: invItem.igst_rate || itemTaxRates.igst,
            taxTemplate: invItem.item_tax_template || "",
          };

          // Use exact values from invoice instead of calculating
          const itemAmount = Math.abs(invItem.base_amount || 0);
          // const itemAmountAfterDiscount = itemAmount - Math.abs(invItem.discount_amount || 0);

          // Use exact tax amounts from invoice item
          const cgstAmount = Math.abs(invItem.cgst_amount || 0);
          const sgstAmount = Math.abs(invItem.sgst_amount || 0);
          const igstAmount = Math.abs(invItem.igst_amount || 0);
          const totalAmount = Math.abs(invItem.amount || 0);

          // Fetch current stock quantity for the batch in the warehouse
          let currentStockQty = 0;
          console.log('Loading item:', {
            item_code: invItem.item_code,
            batch_no: invItem.batch_no,
            warehouse: fullInvoice.warehouse,
            set_warehouse: fullInvoice.set_warehouse
          });

          if (invItem.batch_no && invItem.item_code && (fullInvoice.warehouse || fullInvoice.set_warehouse)) {
            const warehouse = fullInvoice.warehouse || fullInvoice.set_warehouse;
            try {
              console.log(`Fetching stock for ${invItem.item_code}, batch ${invItem.batch_no}, warehouse ${warehouse}`);
              currentStockQty = await getBatchQty(invItem.item_code, invItem.batch_no, warehouse);
              console.log(`Stock qty fetched: ${currentStockQty}`);
            } catch (error) {
              console.error(`Error fetching stock qty for ${invItem.item_code} batch ${invItem.batch_no}:`, error);
              currentStockQty = 0;
            }
          } else {
            console.log('Missing required data for stock fetch:', {
              hasBatchNo: !!invItem.batch_no,
              hasItemCode: !!invItem.item_code,
              hasWarehouse: !!(fullInvoice.warehouse || fullInvoice.set_warehouse)
            });
          }

          // Fetch req_qty from requisition/prescription if invoice has custom_req_no or custom_prescription_no
          let reqQty = 0;
          if (fullInvoice.custom_req_no) {
            reqQty = await fetchReqQtyForItem(fullInvoice.custom_req_no, invItem.item_code);
          }

          const item: Item = {
            id: `${invItem.item_code}-${invItem.batch_no || 'no-batch'}-${Date.now()}-${Math.random()}`,
            alternateBatches: "",
            substituteItem: "",
            itemCode: invItem.item_code || "",
            itemName: invItem.item_name || "",
            uom: invItem.uom || "",
            stockQty: currentStockQty, // Use fetched current stock quantity
            orderedQty: Math.abs(reqQty || 0),
            saleQty: Math.abs(invItem.qty || 0),
            batch: invItem.batch_no || "",
            batchNo: invItem.batch_no || "",
            expiryDate: invItem.custom_expiry_date || "",
            batchStockQty: currentStockQty, // Use fetched current stock quantity for batch stock
            rate: invItem.price_list_rate || invItem.rate || 0, // Use price_list_rate (MRP) if available, fallback to rate
            taxTemplate: taxDetails.taxTemplate,
            description: invItem.description || "",
            itemAmount: itemAmount,
            discountPercent: invItem.discount_percentage || 0,
            discountAmt: Math.abs(invItem.discount_amount || 0), // Keep exact amount from invoice
            cgstPercent: taxDetails.cgstRate,
            cgstAmt: cgstAmount, // Use exact amount from invoice
            sgstPercent: taxDetails.sgstRate,
            sgstAmt: sgstAmount, // Use exact amount from invoice
            igstPercent: taxDetails.igstRate,
            igstAmt: igstAmount, // Use exact amount from invoice
            totalAmt: totalAmount,
            totalPckgAmt: 0,
            kitName: "",
            packageName: "",
            binLocation: invItem.custom_bin_location || "", // Load bin_location from invoice
            includedInPrintRate: invItem.included_in_print_rate === 1, // Set includedInPrintRate for loaded item
            req_qty: reqQty, // Add req_qty from requisition/prescription
            coPayPercentage: invItem.co_pay || 0,
            patientAmount: invItem.patient_amount || 0,
            payerAmount: invItem.payer_amount || 0,
            covered: invItem.covered === 1,
            preAuthRequired: invItem.pre_auth_req === "Yes" || invItem.pre_auth_req === 1,
            preAuthStatus: invItem.pre_auth_status || "",
            preAuthNo: invItem.pre_auth_no || "",
            preAuthDateTime: invItem.pre_auth_date_time || "",
            isFromPrescription: !!(fullInvoice.source_prescription || fullInvoice.custom_prescription_no || invItem.custom_is_prescribed === 1 || invItem.is_from_prescription === 1),
          };

          // Recalculate discount amount based on discount percentage to ensure consistency
          if (item.discountPercent > 0 && item.rate !== null && item.rate !== undefined && item.rate > 0) {
            const recalculatedDiscount = (item.rate as number) * (item.discountPercent / 100) * item.saleQty;
            item.discountAmt = truncateToTwoDecimals(recalculatedDiscount);
          }
          loadedItems.push(item);
        }
      }
      setItems(loadedItems);

      // Manually set totals from the invoice to avoid recalculation
      setTotalBillAmount(Math.abs(fullInvoice.rounded_total || fullInvoice.grand_total || 0));
      setTotalDiscountAmount(Math.abs(fullInvoice.discount_amount || 0));

      // Calculate tax totals from invoice taxes
      let cgstTotal = 0;
      let sgstTotal = 0;
      let igstTotal = 0;
      if (fullInvoice.taxes && Array.isArray(fullInvoice.taxes)) {
        fullInvoice.taxes.forEach((tax: any) => {
          const accountHead = tax.account_head || "";
          const taxAmount = Math.abs(tax.tax_amount || 0);
          if (accountHead.includes("CGST")) {
            cgstTotal += taxAmount;
          } else if (accountHead.includes("SGST")) {
            sgstTotal += taxAmount;
          } else if (accountHead.includes("IGST")) {
            igstTotal += taxAmount;
          }
        });
      }
      setTotalCgstAmount(cgstTotal);
      setTotalSgstAmount(sgstTotal);
      setTotalIgstAmount(igstTotal);

      // Load payments and set paid amounts correctly
      if (fullInvoice.payments && Array.isArray(fullInvoice.payments)) {
        const loadedPayments = fullInvoice.payments.map((payment: any, index: number) => ({
          id: index + 1,
          name: payment.name, // Preserve Frappe child table row identifier
          paymentMode: payment.mode_of_payment || "Cash",
          amount: parseFloat(payment.base_amount || payment.amount || 0) || 0,
          reference_no: payment.custom_transaction_no || payment.reference_no || "",
          custom_bank_name: payment.custom_bank_name || payment.bank || "",
          custom_branch_name: payment.custom_branch_name || payment.branch || "",
          transactionNo: payment.reference_no || "",
          bankName: payment.bank || "",
          branchName: payment.branch || "",
          paidAmount: Math.abs(payment.base_amount || payment.amount || 0).toString(), // Set individual payment amount
          paymentDate: payment.posting_date || "",
          approvalNo: payment.approval_no || "",
          custom_transaction_no: payment.custom_transaction_no || "",
        }));

        setRecordedPayments(loadedPayments);

        // Log total paid amount for debugging
        const totalPaidAmount = loadedPayments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0);
        console.log('Payments loaded successfully. Total paid amount:', totalPaidAmount);
        console.log('Individual payment amounts:', loadedPayments.map(p => ({ mode: p.paymentMode, amount: p.paidAmount })));
      } else {
        // No payments found, set empty payment record
        setRecordedPayments([{
          id: 1,
          name: '',
          paymentMode: 'Cash',
          transactionNo: '',
          bankName: '',
          branchName: '',
          paidAmount: '0',
          paymentDate: '',
          approvalNo: '',
          custom_bank_name: '',
          custom_branch_name: '',
          custom_transaction_no: ''
        }]);
        console.log('No payments found in loaded invoice, set to 0');
      }

      // Reset flag after all data is loaded
      setIsLoadingFromPosInvoice(false);

      showAlert("success", "Success", `Invoice ${invoice.name} loaded successfully!`);
    } catch (error) {
      console.error("Error loading invoice:", error);
      showAlert("danger", "Error", "Failed to load invoice. Please try again.");
      setIsLoadingFromPosInvoice(false);
    }
  };

  const handleFinalizeAndPrint = async (skipHighAlertCheck: boolean = false) => {
    // Prevent multiple submissions
    if (isSaving) {
      console.log('Submit operation already in progress');
      return;
    }

    // Restrict submitting based on pre-auth rules
    const invalidPreAuthItems = items.filter(item => {
      const isCovered = item.covered === true;
      const isPreAuthRequired = item.preAuthRequired === true;

      // If both covered and preAuthRequired are true, then check preAuthStatus
      if (isCovered && isPreAuthRequired) {
        const status = item.preAuthStatus;
        // Only allow if status is explicitly Approved or Rejected
        if (status !== 'Approved' && status !== 'Rejected') {
          return true; // Block submission
        }
      }
      // If preAuthRequired is false, or covered is false, don't check preAuthStatus and allow submit
      return false;
    });

    if (invalidPreAuthItems.length > 0) {
      const itemNames = invalidPreAuthItems.map(item => item.itemName).join(', ');
      showAlert("danger", "Validation Error", `Cannot submit bill. Pre-auth Status must be Approved or Rejected for items requiring pre-auth: ${itemNames}`);
      return;
    }

    // Set loading state to true and freeze screen
    setIsSaving(true);

    // If a draft invoice is loaded, submit it
    if (loadedInvoiceName && loadedInvoiceDocstatus === 0) {
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
        const response = await fetch(`${API_BASE_URL}/Sale%20Bill/${loadedInvoiceName}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            docstatus: 1,
            custom_ipd_effect: isIpdEffect ? 1 : 0
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showAlert("danger", "Error", `Failed to submit invoice: ${errorData.message || 'Unknown error'}`);
          return;
        }

        // const result = await response.json();
        showAlert("success", "Success", `Invoice ${loadedInvoiceName} submitted successfully!`);

        // Update the docstatus state
        setLoadedInvoiceDocstatus(1);

        // Update requisition status if this invoice is against a requisition
        if (sourceDocumentName && sourceDocumentType === 'requisition') {
          await updateRequisitionStatus(sourceDocumentName);
        }

        // Print the invoice using network printer
        if (networkPrinter) {
          try {
            await networkPrinter.printDocument(loadedInvoiceName, 'Sale Bill', 'Pos Invoice print Format');
            showAlert("success", "Print Success", `Invoice ${loadedInvoiceName} sent to network printer successfully!`);
          } catch (error) {
            console.error("Network printing failed:", error);
            showAlert("warning", "Print Warning", "Network printing failed, opened in browser instead.");
            // Fallback to browser print
            const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=Sale%20Bill&name=${encodeURIComponent(loadedInvoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
            securePrintPdf(printUrl, getAuthHeaders, showAlert);
          }
        } else {
          // Fallback to browser print if network printer not available
          console.warn('Network printer not available, using browser print');
          const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=Sale%20Bill&name=${encodeURIComponent(loadedInvoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
          securePrintPdf(printUrl, getAuthHeaders, showAlert);
        }

      } catch (error) {
        console.error("Error submitting draft invoice:", error);
        showAlert("danger", "Error", "Failed to submit invoice. Please try again.");
      } finally {
        // Reset loading state and unfreeze screen
        setIsSaving(false);
      }
    } else {
      // Handle return invoice submission
      if (isReturn) {
        // Filter items with return quantity > 0
        const itemsToReturn = items.filter(item => (item.returnQty || 0) > 0);

        if (itemsToReturn.length === 0) {
          showAlert("danger", "Error", "Please enter return quantities for at least one item.");
          setIsSaving(false);
          return;
        }

        // Prepare return data with proper GST-inclusive calculations
        const returnData = {
          original_invoice: returnAgainstInvoice || null, // null for direct returns
          included_in_print_rate: 1, // GST included in MRP - set at invoice level
          customer: selectedCustomer || '',
          company: selectedCompany || '',
          pos_profile: posProfile || '',
          // Custom fields
          custom_patient_name: patientData?.name || '',
          custom_uhid: patientData?.ABHAID || '',
          custom_bed_no: patientData?.bed || '',
          custom_req_no: reqId || sourceDocumentName || requisitionNo || '',
          custom_prescription_no: reqId || sourceDocumentName || requisitionNo || '',
          prescription_no: reqId || sourceDocumentName || requisitionNo || '',
          custom_visit_code: patientData?.visitID || '',
          custom_phone: patientData?.phone || '',
          custom_doctor_name: patientData?.doctor || '',
          custom_age: patientData?.age || '',
          visit_type: patientData?.visitType || "IPD",
          visit_no: patientData?.visitNo || patientData?.visitID || '',
          transaction_type: transactionType === 'cash' ? "Cash" : "Credit",
          is_cash_bill: transactionType === 'cash' ? 1 : 0,
          is_credit_bill: transactionType === 'credit' ? 1 : 0,
          return_items: itemsToReturn.map(item => {
            const returnQty = item.returnQty || 0;
            // const saleQty = item.saleQty || 1;
            const discountPercent = item.discountPercent || 0;

            // Rate per unit (MRP with GST included)
            const ratePerUnit = item.rate || 0;

            // For GST-inclusive calculations with discount:
            // If discount is applied, we need to send the rate AFTER discount
            // Backend will handle the GST extraction
            const discountAmount = ratePerUnit * (discountPercent / 100);
            const rateAfterDiscount = ratePerUnit - discountAmount;

            return {
              item_code: item.itemCode,
              item_name: item.itemName,
              return_qty: returnQty,
              margin_type: discountPercent > 0 ? "Percentage" : "", // Use Percentage only if discount applied
              margin_rate_or_amount: 0,
              discount_percentage: discountPercent, // Original discount percentage
              discount_amount: discountAmount * returnQty, // Total discount amount for return qty
              rate: rateAfterDiscount, // Rate after discount (GST still included)
              price_list_rate: ratePerUnit, // Original MRP before discount
              cgst_rate: item.cgstPercent || 0,
              sgst_rate: item.sgstPercent || 0,
              igst_rate: item.igstPercent || 0,
              batch_no: item.batchNo || '',
              custom_expiry_date: item.expiryDate || '',
              warehouse: item.warehouse || selectedWarehouse,
              item_tax_template: item.taxTemplate || '',
            };
          }),
          refund_mode: 'Cash',
          return_remarks: remarks || (returnAgainstInvoice ? 'Return invoice' : 'Direct return invoice'),
          taxes: []
        };

        try {
          // Use the same authentication logic as other functions
          const authHeaders = getAuthHeaders();
          // Convert HeadersInit to plain object for fetch compatibility
          const headers = typeof authHeaders === 'string' ?
            JSON.parse(authHeaders) :
            Array.isArray(authHeaders) ?
              Object.fromEntries(authHeaders) :
              authHeaders;

          const response = await fetch('https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_return', {
            method: 'POST',
            headers,
            body: JSON.stringify(returnData),
          });

          const result = await response.json();

          if (response.ok) {
            const returnInvoiceName = result.message?.return_invoice || result.data?.return_invoice;
            const returnMessage = returnAgainstInvoice
              ? `Return invoice ${returnInvoiceName} created successfully against ${returnAgainstInvoice}.`
              : `Direct return invoice ${returnInvoiceName} created successfully.`;
            showAlert('success', 'Success', returnMessage);

            // Print the return invoice
            if (returnInvoiceName) {
              const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=Sale%20Bill&name=${returnInvoiceName}&trigger_print=1&format=IP%20SALE%20RETURN%20INVOICE&no_letterhead=0&letterhead=City%20Hospital&settings=%7B%7D&_lang=en`;
              securePrintPdf(printUrl, getAuthHeaders, showAlert);
            }

            // Reset form
            handleReset();
            setIsReturn(false);
            setIsReturnInvoice(false);
            setIsDirectReturn(false);
            setReturnAgainstInvoice('');
          } else {
            throw new Error(result.message || 'Failed to create return invoice');
          }
        } catch (error: any) {
          showAlert('danger', 'Error', error.message || 'Failed to create return invoice');
        }

        return;
      }

      // Create new invoice and submit it directly
      if (!patientData) {
        showAlert("danger", "Error", "Please select a patient before finalizing.");
        return;
      }

      if (items.length === 0) {
        showAlert("danger", "Error", "Please add at least one item to the invoice.");
        return;
      }

      // Check for high-alert items and show confirmation if any exist (unless skipped)
      if (!skipHighAlertCheck) {
        console.log("Checking for high-alert items in finalize, items count:", items.length);
        const highAlertItems = items.filter(item => checkHighAlertClassification(item));
        console.log("High-alert items found:", highAlertItems.length);
        if (highAlertItems.length > 0) {
          console.log("Showing high-alert save dialog for finalize");
          // const highAlertItemNames = highAlertItems.map(item => `${item.itemName} (${item.custom_classification})`).join(', ');
          setHighAlertItems(highAlertItems);
          setPendingSaveAction('finalize');
          setShowHighAlertSaveDialog(true);
          setIsSaving(false); // Reset loading state since we're waiting for user confirmation
          return; // Wait for user confirmation
        }
      }

      // Continue with finalize logic...
      // Check for items with zero or negative stock
      const itemsWithZeroOrNegativeStock = items.filter(item => (item.stockQty || 0) <= 0);
      if (itemsWithZeroOrNegativeStock.length > 0) {
        const itemNames = itemsWithZeroOrNegativeStock.map(item => `${item.itemName} (Stock: ${item.stockQty})`).join(', ');
        showAlert("danger", "Error", `Cannot submit invoice. The following items have zero or negative stock: ${itemNames}`);
        setIsSaving(false);
        return;
      }

      if (!posProfile) {
        showAlert("danger", "Error", "Please select a POS profile.");
        setShowPosProfileSelector(true);
        setIsSaving(false);
        return;
      }

      // Check if requisition is fully completed
      if (sourceDocumentName && sourceDocumentType === 'requisition') {
        console.log("Checking requisition completion for:", sourceDocumentName);
        const isFullyCompleted = await isRequisitionFullyCompleted(sourceDocumentName);
        console.log("Is requisition fully completed?", isFullyCompleted);

        if (isFullyCompleted) {
          showAlert("danger", "Error", "Cannot create sale for this requisition: All quantities have already been completed");
          setIsSaving(false);
          return;
        }
      }

      // Calculate total discount amount for invoice level
      const totalDiscountAmount = items.reduce((sum, item) => sum + (Number(item.discountAmt) || 0), 0);

      console.log('DEBUG: isIpdEffect value when finalizing:', isIpdEffect);
      console.log('DEBUG: isIpdEffect type when finalizing:', typeof isIpdEffect);

      const payload = {
        doctype: "Sale Bill",
        currency: "QAR",
        customer: selectedCustomer || patientData.mrn || "PQR Ltd",
        pos_profile: posProfile,
        is_pos: 1,
        update_stock: 1,
        company: selectedCompany || patientData.company || "Default Company",
        docstatus: 0, // Initially save as draft
        gst_category: gstCategory || "Unregistered",
        customer_address: CompanyAddress,
        remarks: remarks,
        included_in_print_rate: 1, // Always consider included_in_print_rate as true
        custom_is_ipd_invoice: 1, // Mark as IPD invoice
        custom_ipd_effect: isIpdEffect ? 1 : 0, // IPD Effect checkbox value

        // Payer details
        custom_payer_category: payerCategory,
        custom_payer_name: payerName,
        custom_sub_insurance: subInsurance,
        custom_network: network,
        custom_insurance_no: insuranceNo,
        custom_other_no: otherNo,
        custom_validity_from: validityFrom ? validityFrom.toISOString().split('T')[0] : '',
        custom_validity_to: expiryValidityTo ? expiryValidityTo.toISOString().split('T')[0] : '',
        payer_amount: Number(totalPayerAmount) || 0,
        patient_amount: Number(totalPatientAmount) || 0,
        co_pay: Number(globalCoPayPercent) || 0,

        // Add invoice-level discount fields
        // apply_discount_on: hasAnyDiscount ? "Grand Total" : "",
        // base_discount_amount: totalDiscountAmount,
        // discount_amount: totalDiscountAmount,
        // additional_discount_percentage: hasAnyDiscount ? (totalDiscountAmount / (items.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.saleQty) || 0), 0))) * 100 : 0,

        posting_date: requisitionDate ? requisitionDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        items: items.map(item => {
          // Recalculate to get correct values with MRP Inclusive GST formula
          const calculatedItem = calculateItemTaxAndTotals(item, true);

          // Get MRP (original rate includes GST)
          const mrp = Number(item.rate) || 0;
          const saleQty = Number(calculatedItem.saleQty) || 0;
          const discountPercent = Number(calculatedItem.discountPercent) || 0;
          const totalGstRate = (Number(calculatedItem.cgstPercent) + Number(calculatedItem.sgstPercent) + Number(calculatedItem.igstPercent)) / 100;

          // When included_in_print_rate = 1, Frappe expects:
          // rate = MRP - discount_amount (already discounted price, includes GST)
          // Then Frappe removes GST: taxable_amount = rate / (1 + GST%)
          // Then Frappe adds GST back: GST = taxable_amount * GST%
          // Final amount = taxable_amount + GST

          // Calculate discount amount on MRP
          const discountAmountOnMrp = mrp * (discountPercent / 100);
          // Rate after discount (includes GST)
          const rateAfterDiscount = mrp - discountAmountOnMrp;
          // Remove GST to get taxable amount
          const taxableAmountPerUnit = totalGstRate > 0 ? rateAfterDiscount / (1 + totalGstRate) : rateAfterDiscount;

          // Calculate GST amounts (per unit)
          const cgstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.cgstPercent) / 100);
          const sgstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.sgstPercent) / 100);
          const igstAmountPerUnit = taxableAmountPerUnit * (Number(calculatedItem.igstPercent) / 100);

          // Final amount per unit
          const finalAmountPerUnit = taxableAmountPerUnit + cgstAmountPerUnit + sgstAmountPerUnit + igstAmountPerUnit;

          // Multiply by quantity for totals
          const totalDiscountAmount = discountAmountOnMrp * saleQty;
          const totalCgstAmount = cgstAmountPerUnit * saleQty;
          const totalSgstAmount = sgstAmountPerUnit * saleQty;
          const totalIgstAmount = igstAmountPerUnit * saleQty;
          const totalAmount = finalAmountPerUnit * saleQty;
          const netAmount = taxableAmountPerUnit * saleQty;

          console.log('Finalize item with MRP Inclusive GST (Frappe format):', {
            itemCode: calculatedItem.itemCode,
            mrp,
            saleQty,
            discountPercent,
            discountAmountOnMrp,
            rateAfterDiscount,
            taxableAmountPerUnit,
            cgstAmountPerUnit,
            sgstAmountPerUnit,
            igstAmountPerUnit,
            finalAmountPerUnit,
            totalAmount,
            netAmount
          });

          return {
            item_code: item.itemCode,
            qty: isReturn ? saleQty : saleQty,
            uom: item.uom,
            // Send rate as MRP minus discount (Frappe will remove GST from this when included_in_print_rate = 1)
            rate: rateAfterDiscount,
            // MRP (includes GST) - original price before discount
            price_list_rate: mrp,
            batch_no: item.batchNo || item.batch || "",
            custom_expiry_date: item.expiryDate || "",
            custom_bin_location: item.binLocation || "",
            warehouse: selectedWarehouse || item.warehouse || "",
            margin_type: "",
            discount_percentage: discountPercent,
            discount_amount: totalDiscountAmount,
            cgst_rate: Number(calculatedItem.cgstPercent) || 0,
            cgst_amount: totalCgstAmount,
            sgst_rate: Number(calculatedItem.sgstPercent) || 0,
            sgst_amount: totalSgstAmount,
            igst_rate: Number(calculatedItem.igstPercent) || 0,
            igst_amount: totalIgstAmount,
            amount: totalAmount,
            item_tax_template: item.taxTemplate || "",
            included_in_print_rate: 1,
            use_serial_batch_fields: 1,
            co_pay: Number(calculatedItem.coPayPercentage) || 0,
            patient_amount: Number(calculatedItem.patientAmount) || 0,
            payer_amount: Number(calculatedItem.payerAmount) || 0,
            covered: calculatedItem.covered ? 1 : 0,
            pre_auth_req: calculatedItem.preAuthRequired ? "Yes" : "No",
            pre_auth_status: calculatedItem.preAuthStatus || "",
            pre_auth_no: calculatedItem.preAuthNo || "",
            pre_auth_date_time: calculatedItem.preAuthDateTime || "",
            custom_his_item_id: calculatedItem.custom_his_item_id || item.custom_his_item_id || "",
          };
        }),
        payments: recordedPayments.map(p => ({
          mode_of_payment: p.paymentMode || "Cash",
          amount: parseFloat(p.paidAmount || "0") || 0,
          reference_no: p.custom_transaction_no || p.transactionNo || "",
          custom_bank_name: p.custom_bank_name || p.bankName || "",
          custom_branch_name: p.custom_branch_name || p.branchName || "",
          custom_transaction_no: p.custom_transaction_no || p.transactionNo || "",
        })),
        // Add Pricing Rule Detail child table if any pricing rules were applied
        pricing_rule_details: items
          .filter(item => item.appliedPricingRule)
          .map(item => ({
            pricing_rule: item.appliedPricingRule,
            item_code: item.itemCode,
            rate_or_discount: "Discount",
            rule_applied: 1
          })),
        patient_data: {
          mrn: patientData.mrn || "",
          age: patientData.age || "",
          sex: patientData.sex || "",
          phone: patientData.phone || "",
          abha_id: patientData.ABHAID || "",
          category: patientData.category || "",
          doctor: patientData.doctor || "",
          department: patientData.dept || "",
          visit_type: patientData.visitType || "",
          visit_id: patientData.visitID || "",
          visit_no: patientData.visitNo || patientData.visitID || "",
          bed_no: patientData.bed || "",
          company: selectedCompany || patientData.company || "",
        },
        sale_type: selectedSaleType || "retail",
        is_routine: isRoutine ? 1 : 0,
        is_stat: isStat ? 1 : 0,
        is_discharge: isDischarge ? 1 : 0,
        is_asap: isAsap ? 1 : 0,
        is_expired: isExpired ? 1 : 0,
        is_return: isReturn ? 1 : 0,
        kit: selectedKit || "",
        requisition_no: requisitionNo || "",
        requisition_from: requisitionFrom || "",
        requisition_to: requisitionTo || "",
        custom_patient_name: patientData?.name || "",
        custom_uhid: patientData?.mrn || "",
        custom_abha_id: patientData?.ABHAID || "",
        custom_age: patientData?.age || "",
        custom_req_no: reqId || sourceDocumentName || requisitionNo || "",
        custom_prescription_no: reqId || sourceDocumentName || requisitionNo || "",
        prescription_no: reqId || sourceDocumentName || requisitionNo || "",
        custom_visit_code: patientData?.visitID || "",
        custom_phone: patientData?.phone || "",
        custom_doctor_name: patientData?.doctor || "",
        custom_bed_no: patientData?.bed || "",
        custom_department: selectedDepartment || patientData?.dept || "",
        custom_hospital: selectedHospital || "",
        visit_type: patientData?.visitType || "IPD",
        visit_no: patientData?.visitNo || patientData?.visitID || "",
        transaction_type: transactionType === 'cash' ? "Cash" : "Credit",
        is_cash_bill: transactionType === 'cash' ? 1 : 0,
        is_credit_bill: transactionType === 'credit' ? 1 : 0,
        custom_sale_bill: loadedInvoiceName || "",
        custom_doctype_link: loadedInvoiceName || "",
        custom_doctype: "Sale Bill",
      };

      // Construct the taxes array dynamically
      const taxesPayload: any[] = [];
      const taxBaseAmount = totalBillAmount - totalDiscountAmount;

      if (totalCgstAmount !== 0) {
        taxesPayload.push({
          charge_type: "On Net Total",
          account_head: cgstAccounts.length > 0 ? cgstAccounts[0]?.name : "",
          description: "CGST",
          rate: taxBaseAmount !== 0 ? (totalCgstAmount / taxBaseAmount) * 100 : 0,
          gst_tax_type: "cgst",
          tax_amount: totalCgstAmount,
          total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
          tax_amount_after_discount_amount: totalCgstAmount,
          base_tax_amount: totalCgstAmount,
          base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
          base_tax_amount_after_discount_amount: totalCgstAmount,
          included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
          item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
            if (item.cgstAmt !== 0) {
              acc[item.itemCode] = [item.cgstAmt, item.cgstPercent];
            }
            return acc;
          }, {} as Record<string, [number, number]>)),
        });
      }

      if (totalSgstAmount !== 0) {
        taxesPayload.push({
          charge_type: "On Net Total",
          account_head: sgstAccounts.length > 0 ? sgstAccounts[0]?.name : "",
          description: "SGST",
          rate: taxBaseAmount !== 0 ? (totalSgstAmount / taxBaseAmount) * 100 : 0,
          gst_tax_type: "sgst",
          tax_amount: totalSgstAmount,
          total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
          tax_amount_after_discount_amount: totalSgstAmount,
          base_tax_amount: totalSgstAmount,
          base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
          base_tax_amount_after_discount_amount: totalSgstAmount,
          included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
          item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
            if (item.sgstAmt !== 0) {
              acc[item.itemCode] = [item.sgstAmt, item.sgstPercent];
            }
            return acc;
          }, {} as Record<string, [number, number]>)),
        });
      }

      if (totalIgstAmount !== 0) {
        taxesPayload.push({
          charge_type: "On Net Total",
          account_head: igstAccounts.length > 0 ? igstAccounts[0]?.name : "",
          description: "IGST",
          rate: taxBaseAmount !== 0 ? (totalIgstAmount / taxBaseAmount) * 100 : 0,
          gst_tax_type: "igst",
          tax_amount: totalIgstAmount,
          total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
          tax_amount_after_discount_amount: totalIgstAmount,
          base_tax_amount: totalIgstAmount,
          base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount, // Grand Total
          base_tax_amount_after_discount_amount: totalIgstAmount,
          included_in_print_rate: 1, // Always set to 1 for MRP inclusive GST
          item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
            if (item.igstAmt !== 0) {
              acc[item.itemCode] = [item.igstAmt, item.igstPercent];
            }
            return acc;
          }, {} as Record<string, [number, number]>)),
        });
      }

      const finalPayload: any = {
        ...payload,
        taxes_and_charges: taxTemplate,
        taxes: taxesPayload,
        total_taxes_and_charges: totalCgstAmount + totalSgstAmount + totalIgstAmount,
        // Calculate outstanding amount as grand_total - paid_amount
        paid_amount: recordedPayments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0),
        outstanding_amount: (roundedGrandTotal || totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount) -
          (recordedPayments.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0)),
      };

      // --- START: Handle file upload ---
      let attachmentUrl: string | null = null;
      let selectedFile: File | null = null;
      if (selectedDocument) {
        console.log("Preparing to upload document for finalize:", selectedDocument.name);
        selectedFile = selectedDocument;
        // Upload the file first to get the URL
        attachmentUrl = await uploadFile(selectedFile);
        if (attachmentUrl) {
          console.log("Document uploaded successfully:", attachmentUrl);
        } else {
          console.warn("File upload failed, saving invoice without attachment");
          showAlert("warning", "Upload Warning", "File upload failed. Invoice saved without attachment.");
          selectedFile = null; // Clear the file if upload failed
        }
      }
      // --- END: Handle file upload ---

      try {
        console.log("Final payload for creating submitted invoice:", finalPayload);
        console.log("Items being sent:", JSON.stringify(finalPayload.items, null, 2)); // Log items with formatting
        console.log("Sample item custom_bin_location:", finalPayload.items[0]?.custom_bin_location); // Log first item's bin_location

        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ?
          JSON.parse(authHeaders) :
          Array.isArray(authHeaders) ?
            Object.fromEntries(authHeaders) :
            authHeaders;

        const response = await fetch(`https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_draft`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(finalPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to create invoice:", response.status, errorData);
          showAlert("danger", "Error", `Failed to create invoice: ${errorData.message || 'Unknown error'}`);
          return;
        }

        const result = await response.json();
        const invoiceName = result.message?.data?.name; // Corrected path to invoice name

        if (!invoiceName) {
          showAlert("danger", "Error", "Failed to retrieve invoice name after saving draft.");
          console.error("No invoice name returned:", result);
          return;
        }

        // Now submit the created draft invoice
        const submitResponse = await fetch(`${API_BASE_URL}/Sale%20Bill/${invoiceName}`, {
          method: 'PUT',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            docstatus: 1,
            custom_ipd_effect: isIpdEffect ? 1 : 0
          }),
        });

        if (!submitResponse.ok) {
          const errorData = await submitResponse.json();
          showAlert("danger", "Error", `Failed to submit invoice: ${errorData.message || 'Unknown error'}`);
          // Optionally, you might want to handle the case where submission fails after draft save
          return;
        }

        if (transactionType === 'credit' && rawPatientData) {
          try {
            const patientCreateResponse = await fetch(
              "https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_patient_from_his_data",
              {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ patient_data: rawPatientData }),
              }
            );

            if (!patientCreateResponse.ok) {
              const patientError = await patientCreateResponse.text();
              console.warn("Patient creation API warning:", patientError);
              showAlert("warning", "Patient Creation", "Invoice submitted successfully, but patient master creation failed.");
            } else {
              const patientResult = await patientCreateResponse.json();
              if (patientResult.status === 'created' || patientResult.message?.status === 'created') {
                console.log("Patient created from HIMS data:", patientResult.message?.patient || patientResult.patient);
              } else if (patientResult.status === 'exists' || patientResult.message?.status === 'exists') {
                console.log("Patient already exists, no action needed:", patientResult.message?.patient || patientResult.patient);
              }
            }
          } catch (patientError) {
            console.warn("Patient creation request failed:", patientError);
            showAlert("warning", "Patient Creation", "Invoice submitted successfully, but patient master creation failed.");
          }
        }

        showAlert("success", "Success", `Invoice ${invoiceName} created and submitted successfully!`);
        console.log("Invoice created and submitted:", result);

        // --- START: Link file to invoice if file was uploaded ---
        if (selectedFile && attachmentUrl && invoiceName) {
          console.log("Linking file to finalized invoice:", invoiceName);

          try {
            // Use the same authentication logic as other functions
            const authHeaders = getAuthHeaders();
            // Convert HeadersInit to plain object for fetch compatibility
            const headers = typeof authHeaders === 'string' ?
              JSON.parse(authHeaders) :
              Array.isArray(authHeaders) ?
                Object.fromEntries(authHeaders) :
                authHeaders;

            const fileDocResponse = await fetch('https://gmcerp.quantcloud.in/api/resource/File', {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify({
                doctype: 'File',
                file_name: selectedFile.name,
                file_url: attachmentUrl,
                attached_to_doctype: 'Sale Bill',
                attached_to_name: invoiceName,
                is_private: 0,
                folder: 'Home/Attachments'
              }),
            });

            if (fileDocResponse.ok) {
              console.log("File document created and linked to invoice:", invoiceName);
              showAlert("success", "File Attached", "Document successfully attached to the invoice.");
            } else {
              console.error("Failed to create File document:", await fileDocResponse.json());
              showAlert("warning", "Attachment Warning", "Invoice saved but file attachment failed.");
            }
          } catch (error) {
            console.error("Error creating File document:", error);
            showAlert("warning", "Attachment Warning", "Invoice saved but file attachment failed.");
          }
        }
        // --- END: Link file to invoice ---

        // Update state to reflect the loaded invoice
        setLoadedInvoiceName(invoiceName);
        setLoadedInvoiceDocstatus(1);

        // Update requisition status if this invoice is against a requisition
        if (sourceDocumentName && sourceDocumentType === 'requisition') {
          await updateRequisitionStatus(sourceDocumentName, isComplete);
        }

        // Print the invoice using network printer
        if (networkPrinter) {
          try {
            await networkPrinter.printDocument(invoiceName, 'Sale Bill', 'Pos Invoice print Format');
            showAlert("success", "Print Success", `Invoice ${invoiceName} sent to network printer successfully!`);
          } catch (error) {
            console.error("Network printing failed:", error);
            showAlert("warning", "Print Warning", "Network printing failed, opened in browser instead.");
            // Fallback to browser print
            const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=Sale%20Bill&name=${encodeURIComponent(invoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
            securePrintPdf(printUrl, getAuthHeaders, showAlert);
          }
        } else {
          // Fallback to browser print if network printer not available
          console.warn('Network printer not available, using browser print');
          const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=Sale%20Bill&name=${encodeURIComponent(invoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
          securePrintPdf(printUrl, getAuthHeaders, showAlert);
        }

      } catch (error) {
        console.error("Error creating invoice:", error);
        showAlert("danger", "Error", "Error creating invoice. Please try again.");
      } finally {
        // Reset loading state and unfreeze screen for the entire function
        setIsSaving(false);
      }
    }
  };

  const handleCreateClosingEntry = (openingEntryName: string) => {
    setShowClosingEntryModal(false);
  };


  return (
    <>
      {/* Splash Screen */}
      <SplashScreen
        show={initialLoading}
        message="Initializing IPD Billing System..."
      />

      {/* Saving/Submitting Splash Screen */}
      <SplashScreen
        show={isSaving}
        message={isReturn ? "Submitting Return... Please wait" : loadedInvoiceName && loadedInvoiceDocstatus === 0 ? "Submitting Invoice... Please wait" : "Saving Invoice... Please wait"}
      />

      <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
        {/* Alert Component */}
        {alert.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md">
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
        <ToastContainer aria-label="Notifications" />
        <div className="my-16 px-4 md:px-6">
          <PageHeader
            parentTitle="POS"
            parentLink="/pos"
            title={isReturn ? `Return Invoice - ${returnAgainstInvoice}` : "New IPD Bill"}
            icon="../pos/assets/icons/BriefcaseIcon.svg"
            posProfile={posProfile || undefined}
            warehouse={selectedWarehouse || undefined}
            rightButtons={
              <div className="flex flex-row space-x-2">
                <Button type="primary-button" size="button-small" onClick={() => setShowPatientRequisitionList(true)}>
                  Patient Requisition
                </Button>
                <Button type="primary-button" size="button-small" onClick={() => setShowPrescriptionList(true)}>
                  Prescription
                </Button>
                <Button type="secondary-button" size="button-small" onClick={() => setShowViewPosInvoicesModal(true)}>
                  View Sale Bills
                </Button>
                <Button type="secondary-button" size="button-small" onClick={() => { window.location.href = "https://gmcerp.quantcloud.in/app/home"; }}>
                  Home
                </Button>
                <Button type="secondary-button" size="button-small" onClick={handleChangePOSProfile}>
                  Change POS Profile
                </Button>
                {/* <Button type="secondary-button" size="button-medium" onClick={logout}>
                Logout
              </Button> */}
                {/* <Button type="danger-button" size="button-medium" onClick={clearPatient}>
                Clear Patient
              </Button> */}
              </div>
            }
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-0.5 py-6 px-4 mx-2 md:px-4 pb-24">
          {/* Left Panel - Patient Search and Cards */}
          <div className="flex flex-col gap-6 w-full lg:w-80 xl:w-75 flex-shrink-0">

            {/* <div className="flex flex-col items-center space-y-4">
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
                             <span>Age: {patient.ageDisplay || "N/A"}</span>
                             <span>Gender: {patient.genderValue || "N/A"}</span>
                             {patient.mobileNo && <span>Mobile: {patient.mobileNo}</span>}
                           </div>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               )}
             </div>
           </div> */}

            <div>
              <OpdCard
                ref={opdCardRef}
                patientData={patientData}
                onPatientChange={(p, rawPatient) => {
                  console.log("Final patientData:", p);
                  setPatientData(p);
                  setRawPatientData(rawPatient || null);

                  const itemMap = new Map();
                  const pharmacyDetails = rawPatient?.patinetCompnayPreauthPharmacyDetailsDTO || [];
                  pharmacyDetails.forEach((d: any) => {
                    if (d.itemId) {
                      itemMap.set(d.itemId, {
                        isIncluded: d.isIncluded,
                        isPreAuthRequired: d.isPreAuthRequired
                      });
                    }
                  });
                  preauthItemIdsRef.current = itemMap;
                }}
                selectedWarehouse={selectedWarehouse}
                setSelectedWarehouse={setSelectedWarehouse}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedSubDepartment={selectedSubDepartment}
                setSelectedSubDepartment={setSelectedSubDepartment}
                isReturn={isReturn}
                onReturnStatusChange={setIsReturn}
              />
              {patientData && (
                <div className="mt-2">
                  <Button size="link-size" type="link-secondary" onClick={clearPatient}>
                    Change Patient
                  </Button>
                </div>
              )}
            </div>
            <BillBreakdown
              totalBillAmount={totalBillAmount}
              totalDiscountAmount={totalDiscountAmount}
              totalCgstAmount={totalCgstAmount}
              totalSgstAmount={totalSgstAmount}
              totalIgstAmount={totalIgstAmount}
              totalPayerAmount={totalPayerAmount}
              totalPatientAmount={totalPatientAmount}
              showPayerPatientAmounts={true}
              posProfile={posProfile || undefined}
              onRoundOffChange={(roundOffData) => setRoundedGrandTotal(roundOffData.grand_total)}
            // onRecordPayments prop is removed
            />
          </div>

          {/* Right Panel - Item Details */}
          <div className="flex-1 min-w-0 space-y-2 text-sm">
            {/* Insurance Information */}
            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle>Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 overflow-x-auto p-3 pt-0">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 [&_.mb-2]:!mb-1">
                  <RenderFormElement
                    label="Payer Category"
                    inputType="select"
                    value={payerCategory}
                    onChange={(value) => setPayerCategory(value)}
                    data={payerCategoryOptions}
                    placeholder="Select Payer Category"
                    readonly={_isItemsLoadedFromRequisitionOrPrescription}
                  />

                  <RenderFormElement
                    label="Payer Name"
                    inputType="select"
                    value={payerName}
                    onChange={(value) => setPayerName(value)}
                    data={payerNameOptions}
                    placeholder="Select Payer Name"
                    readonly={_isItemsLoadedFromRequisitionOrPrescription}
                  />

                  <RenderFormElement
                    label="Sub Insurance"
                    inputType="select"
                    value={subInsurance}
                    onChange={(value) => setSubInsurance(value)}
                    data={subInsuranceOptions}
                    placeholder="Select Sub Insurance"
                    readonly={_isItemsLoadedFromRequisitionOrPrescription}
                  />

                  <RenderFormElement
                    label="Network"
                    inputType="select"
                    value={network}
                    onChange={(value) => setNetwork(value)}
                    data={networkOptions}
                    placeholder="Select Network"
                    readonly={_isItemsLoadedFromRequisitionOrPrescription}
                  />

                  <div className="space-y-1">
                    <Label htmlFor="insuranceNo">Insurance No</Label>
                    <Input
                      id="insuranceNo"
                      type="text"
                      value={insuranceNo}
                      onChange={(e) => setInsuranceNo(e.target.value)}
                      placeholder="Enter Insurance No"
                      readOnly={_isItemsLoadedFromRequisitionOrPrescription}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="validityFrom">Validity From</Label>
                    <Input
                      id="validityFrom"
                      type="date"
                      value={validityFrom ? validityFrom.toISOString().split('T')[0] : ''}
                      onChange={(e) => setValidityFrom(e.target.value ? new Date(e.target.value) : undefined)}
                      readOnly={_isItemsLoadedFromRequisitionOrPrescription}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="expiryValidityTo">Expiry Validity To</Label>
                    <Input
                      id="expiryValidityTo"
                      type="date"
                      value={expiryValidityTo ? expiryValidityTo.toISOString().split('T')[0] : ''}
                      onChange={(e) => setExpiryValidityTo(e.target.value ? new Date(e.target.value) : undefined)}
                      readOnly={_isItemsLoadedFromRequisitionOrPrescription}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="otherNo">Other No</Label>
                    <Input
                      id="otherNo"
                      type="text"
                      value={otherNo}
                      onChange={(e) => setOtherNo(e.target.value)}
                      placeholder="Enter Other No"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-2 px-3">
                <CardTitle>Item Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 overflow-x-auto p-3 pt-0">
                <div className="flex flex-col gap-2 w-full">
                  {/* First Row */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_auto_1fr] gap-4 items-center">
                    <RenderFormElement
                      inputType="select"
                      value={selectedSaleType}
                      onChange={handleClassificationChange}
                      data={[{ label: "", value: "CLEAR" }, ...classificationTypeOptions]}
                      placeholder="Select Classification"
                    />

                    <EnhancedItemSearch
                      onSelectItem={handleAddItemToDetails}
                      placeholder="Search Items"
                      fetchItemBatches={fetchItemBatches}
                      fetchItemPrice={fetchItemPrice}
                      getBatchQty={getBatchQty}
                      onNoBatchesFound={handleNoBatchesFound}
                      selectedWarehouse={selectedWarehouse}
                      selectedCompany={selectedCompany}
                      selectedCustomer={selectedCustomer}
                      applyPricingRules={applyPricingRules}
                      selectedClassification={selectedSaleType}
                      isGeneric={isGeneric}
                      isDisabled={_isItemsLoadedFromRequisitionOrPrescription}
                      criticalCategoryDialog={criticalCategoryDialog}
                      setCriticalCategoryDialog={setCriticalCategoryDialog}
                    />

                    <div className="flex items-center gap-2 pl-2">
                      <Checkbox id="terms" checked={isGeneric} onCheckedChange={(checked) => setIsGeneric(checked === true)} />
                      <Label htmlFor="terms" className="text-sm font-medium text-gray-700">Generic</Label>
                    </div>

                    <RenderFormElement
                      inputType="select"
                      value={selectedKit}
                      onChange={handleSelectKit}
                      data={kitOptions}
                      placeholder="Select Kit"
                    />
                  </div>

                  {/* Second Row */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 items-center mt-1">
                    {/* Global Co-Pay % Input */}
                    <div className="flex flex-row items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Co-Pay %:</Label>
                      <Input
                        type="number"
                        value={globalCoPayPercent}
                        onChange={(e) => setGlobalCoPayPercent(parseFloat(e.target.value) || 0)}
                        placeholder="%"
                        className="w-20 h-9 text-sm"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <Button
                        type="primary-button"
                        size="button-medium"
                        onClick={() => {
                          const updatedItems = items.map(item => {
                            const updatedItem = {
                              ...item,
                              coPayPercentage: !item.covered ? 0 : globalCoPayPercent
                            };
                            return calculateItemTaxAndTotals(updatedItem, true);
                          });
                          setItems(updatedItems);
                          showAlert("success", "Success", `Co-Pay % applied to all items.`);
                        }}
                      >
                        Apply
                      </Button>
                    </div>

                    {/* Global Discount Input */}
                    <div className="flex flex-row items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Discount %:</Label>
                      <Input
                        type="number"
                        value={globalDiscountPercent}
                        onChange={(e) => setGlobalDiscountPercent(parseFloat(e.target.value) || 0)}
                        placeholder="%"
                        className="w-20 h-9 text-sm"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <Button
                        type="primary-button"
                        size="button-medium"
                        onClick={handleApplyGlobalDiscount}
                      >
                        Apply
                      </Button>
                    </div>

                    {/* Check Status */}
                    <Button
                      type="button-primary"
                      size="button-medium"
                      onClick={handleCheckPreAuthStatus}
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:text-white justify-self-start"
                    >
                      <UploadCloud className="h-4 w-4 text-white cursor-pointer mr-2" /> Check Status
                    </Button>
                  </div>

                  {/* Transaction Type and IPD Effect */}
                  <div className="flex flex-row items-center gap-4 mt-1">
                    {/* Transaction Type Toggle */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Transaction Type:</Label>
                      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 gap-1">
                        <button
                          type="button"
                          onClick={() => setTransactionType('cash')}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${transactionType === 'cash'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-transparent text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Cash
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransactionType('credit')}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${transactionType === 'credit'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-transparent text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Credit
                        </button>
                      </div>
                    </div>

                    {/* IPD Effect Checkbox */}
                    <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
                      <Checkbox
                        id="ipd-effect"
                        checked={isIpdEffect && !isDischargedPatient}
                        disabled={transactionType === 'cash' || isDischargedPatient}
                        onCheckedChange={(checked) => {
                          if (isDischargedPatient) {
                            showAlert('warning', 'Blocked', 'IPD Effect is blocked for discharged patients.');
                            return;
                          }
                          setIsIpdEffect(checked === true);
                        }}
                        className={transactionType === 'cash' || isDischargedPatient ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                      <Label
                        htmlFor="ipd-effect"
                        className={`text-sm font-medium ${transactionType === 'cash' || isDischargedPatient ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'} whitespace-nowrap`}
                        title={isDischargedPatient ? "IPD Effect is blocked for discharged patients" : ""}
                      >
                        IPD Effect
                      </Label>
                    </div>

                    {/* Barcode Input */}
                    <div className="flex items-center gap-2 pl-4 border-l border-gray-300 flex-1 max-w-[200px]">
                      <Input
                        placeholder="Barcode"
                        value={barcode || ""}
                        onChange={(e) => setBarcode?.(e.target.value)}
                        className="w-full h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <HorizontallyScrollableTable
                  items={items}
                  setItems={setItems}
                  fetchItemBatches={fetchItemBatches}
                  fetchSubstituteItems={fetchSubstituteItems}
                  fetchItemPrice={fetchItemPrice}
                  getBatchQty={getBatchQty}
                  fetchBinLocationFromItem={fetchBinLocationFromItem}
                  selectedWarehouse={selectedWarehouse}
                  calculateItemTaxAndTotals={calculateItemTaxAndTotals}
                  recalculateTotals={recalculateTotals}
                  fetchTaxDetails={fetchTaxDetails}
                  showAlert={showAlert}
                  isReturnMode={isReturn}
                  isReturnInvoice={isReturnInvoice}
                  isDirectReturn={isDirectReturn}
                  canChangeRate={canChangeRate}
                  barcode={barcode}
                  setBarcode={setBarcode}
                  reqId={reqId}
                  setReqId={setReqId}
                  isReqIdReadonly={isReqIdReadonly}
                  setIsReqIdReadonly={setIsReqIdReadonly}
                  isComplete={isComplete}
                  setIsComplete={setIsComplete}
                  applyPricingRules={applyPricingRules}
                  selectedCustomer={selectedCustomer}
                  hideTaxFields={true}
                  showInsuranceFields={true}
                  showPreAuthFields={true}
                  isFromPrescription={sourceDocumentType === 'prescription'}
                />
              </CardContent>
            </Card>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Payment Table Component for New Bill Page */}
            <PaymentTable
              payments={recordedPayments}
              setPayments={setRecordedPayments}
              posProfile={posProfile ?? undefined}
              totalBillAmount={totalBillAmount}
              transactionType={transactionType}
              roundedGrandTotal={roundedGrandTotal}
              isLoadedInvoice={!!loadedInvoiceName}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full min-h-16 px-4 md:px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-y border-[#D9D9E0] bg-white z-10">
          <div className="w-full sm:w-fit h-fit flex items-center gap-4 justify-center sm:justify-start">
            <Popover>
              <PopoverTrigger asChild>
                <Image
                  src="assets/icons/DotsVertical.svg"
                  alt="Dots"
                  width={50}
                  height={50}
                  className="cursor-pointer border rounded-md px-3 py-2 border-[#D9D9E0]"
                />
              </PopoverTrigger>
              <PopoverContent className="bg-white mx-3 border shadow-md rounded p-0 space-y-2 w-40">
                <div className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer">Case Papers</div>
                <div className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer">Export to Word</div>
                <div className="hover:bg-gray-100 text-[#60646C] text-sm font-normal px-2 py-2 rounded cursor-pointer">Patient Due Details</div>
              </PopoverContent>
            </Popover>
            {/* <Button type="secondary-button" size="button-medium">Preview & Print</Button> */}
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center sm:justify-end text-[#60646C] text-xs font-normal w-full sm:w-auto">
            {isReturn ? (
              // Show Cancel Return button when in return mode
              <>
                <Button type="danger-button" size="button-medium" disabled={isSaving} onClick={() => {
                  setIsReturn(false);
                  setIsReturnInvoice(false);
                  setIsDirectReturn(false);
                  setReturnAgainstInvoice('');
                  handleReset();
                }}>
                  Cancel Return
                </Button>
                <Button type="primary-button" size="button-medium" disabled={isSaving} onClick={handleFinalizeAndPrint}>
                  Submit Return
                </Button>
              </>
            ) : loadedInvoiceName && loadedInvoiceDocstatus === 1 ? (
              // Show Print and Reset buttons for submitted invoices
              <>
                <Button type="secondary-button" size="button-medium" onClick={handleReset}>Reset</Button>
                <Button
                  type="primary-button"
                  size="button-medium"
                  onClick={async () => {
                    if (networkPrinter) {
                      try {
                        await networkPrinter.printDocument(loadedInvoiceName, 'Sale Bill', 'Sale Bill print Format');
                        showAlert("success", "Print Success", `Invoice ${loadedInvoiceName} sent to network printer successfully!`);
                      } catch (error) {
                        console.error("Network printing failed:", error);
                        showAlert("warning", "Print Warning", "Network printing failed, opened in browser instead.");
                        // Fallback to browser print
                        const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=POS%20Invoice&name=${encodeURIComponent(loadedInvoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
                        securePrintPdf(printUrl, getAuthHeaders, showAlert);
                      }
                    } else {
                      // Fallback to browser print if network printer not available
                      console.warn('Network printer not available, using browser print');
                      const printUrl = `https://gmcerp.quantcloud.in/printview?doctype=POS%20Invoice&name=${encodeURIComponent(loadedInvoiceName)}&format=Pos%20Invoice%20print%20Format&trigger_print=1&no_letterhead=0&_lang=en`;
                      securePrintPdf(printUrl, getAuthHeaders, showAlert);
                    }
                  }}
                >
                  Print Invoice
                </Button>
              </>
            ) : (
              // Show all buttons for new invoices or drafts
              <>
                <Button type="secondary-button" size="button-medium" disabled={isSaving} onClick={handleReset}>Reset</Button>
                <Button type="primary-outlined-button" size="button-medium" disabled={isSaving} onClick={handleSaveAsDraft}>
                  {loadedInvoiceName && loadedInvoiceDocstatus === 0 ? 'Update' : 'Save as Draft'}
                </Button>
                {/* <Button
                type="primary-outlined-button"
                size="button-medium"
                onClick={() => setShowSelectInvoiceModal(true)}
                disabled={isReturn}
              >
                Return Bill
              </Button> */}
                <Button type="primary-button" size="button-medium" disabled={isSaving} onClick={() => setShowClosingEntryModal(true)}>
                  Closing Entry
                </Button>
                <Button type="primary-button" size="button-medium" disabled={isSaving} onClick={handleFinalizeAndPrint}>
                  {isReturn ? 'Submit Return' : (loadedInvoiceName && loadedInvoiceDocstatus === 0 ? 'Submit and Print' : 'Finalize and Print')}
                </Button>
              </>
            )}
          </div>
        </div>

        {showPosProfileSelector && (
          <POSProfileSelector
            isOpen={showPosProfileSelector}
            onSelect={handlePOSProfileSelect}
          />
        )}

        {showPatientRequisitionList && (
          <PatientRequisitionList
            isOpen={showPatientRequisitionList}
            onClose={() => {
              console.log('Closing PatientRequisitionList');
              setShowPatientRequisitionList(false)
            }}
            onSelectRequisition={handleSelectRequisition}
          />
        )}

        {showPrescriptionList && (
          <PrescriptionList
            isOpen={showPrescriptionList}
            onClose={() => setShowPrescriptionList(false)}
            onSelectPrescription={handleSelectPrescription}
          />
        )}

        {/* --- START: Modified Modal Call --- */}
        {showDocumentUpload && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
              <Document
                setOpen={setShowDocumentUpload}
                onFileSelect={(file) => setSelectedDocument(file)} // Pass the file to state
              />
            </div>
          </div>
        )}
        {/* --- END: Modified Modal Call --- */}

        {showViewPosInvoicesModal && (
          <ViewPosInvoicesModal
            isOpen={showViewPosInvoicesModal}
            onClose={() => setShowViewPosInvoicesModal(false)}
            posProfile={posProfile}
            showAlert={showAlert}
            onLoadInvoice={handleLoadInvoice}
            isIPDPage={true}
          />
        )}

        {showAlternativeItemsPopover && itemSeekingAlternatives && (
          <AlternativeItemsPopover
            isOpen={showAlternativeItemsPopover}
            onClose={() => setShowAlternativeItemsPopover(false)}
            onSelectAlternative={handleSelectAlternativeItem}
            alternativeItems={alternativeItems}
            originalItem={itemSeekingAlternatives}
          />
        )}
        <ClosingEntryModal // New ClosingEntryModal component
          isOpen={showClosingEntryModal}
          onClose={() => setShowClosingEntryModal(false)}
          onSelectOpeningEntry={handleCreateClosingEntry}
          posProfile={posProfile}
          showAlert={showAlert}
        />
        {showSelectInvoiceModal && (
          <SelectInvoiceModal
            isOpen={showSelectInvoiceModal}
            onClose={() => setShowSelectInvoiceModal(false)}
            isIPDPage={true}
            onSelect={async (invoices: any[]) => {  // Handle array of invoices
              try {
                // Take the first invoice for return processing
                const invoice = invoices[0];
                if (!invoice) {
                  showAlert('warning', 'No Invoice', 'No invoice data received');
                  return;
                }

                // Load invoice data into the new_bill page for return processing
                setIsReturn(true);
                setIsReturnInvoice(true);
                setIsDirectReturn(false); // This is not a direct return
                setReturnAgainstInvoice(invoice.name);

                // Load customer and patient data
                setSelectedCustomer(invoice.customer || '');
                if (invoice.custom_patient_name) {
                  setPatientData({
                    name: invoice.custom_patient_name || '',
                    age: invoice.custom_age || '',
                    sex: invoice.custom_sex || '',
                    phone: invoice.custom_phone || '',
                    ABHAID: invoice.custom_abha_id || '',
                    category: invoice.custom_category || '',
                    doctor: invoice.custom_doctor_name || '',
                    mrn: invoice.custom_mrn || '',
                    displayNo: invoice.custom_display_no || '',
                    dept: invoice.custom_department || '',
                    visitType: invoice.patientVisitType || invoice.visitType || invoice.visit_type || invoice.custom_visit_type || '',
                    company: invoice.custom_company || '',
                    visitID: invoice.custom_visit_code || invoice.visit_id || '',
                    visitNo: invoice.visitNumber || invoice.visitNo || invoice.visit_no || invoice.custom_visit_code || '',
                    bed: invoice.custom_bed || '',
                  });
                }

                // Load company, warehouse, and other settings
                setSelectedCompany(invoice.company || '');
                setSelectedWarehouse(invoice.set_warehouse || '');

                // Load items with returnQty initialized to 0 and calculate alreadyReturnedQty
                const loadedItems: Item[] = await Promise.all(
                  invoice.items.map(async (item: any, index: number) => {
                    let alreadyReturnedQty = 0;

                    try {
                      // Fetch return invoices against this invoice
                      // Use the same authentication logic as other functions
                      const authHeaders = getAuthHeaders();
                      // Convert HeadersInit to plain object for fetch compatibility
                      const headers = typeof authHeaders === 'string' ?
                        JSON.parse(authHeaders) :
                        Array.isArray(authHeaders) ?
                          Object.fromEntries(authHeaders) :
                          authHeaders;

                      const returnResponse = await fetch(
                        `https://gmcerp.quantcloud.in/api/resource/POS%20Invoice?filters=[["return_against","=","${invoice.name}"],["docstatus","=",1]]&fields=["name"]&limit_page_length=100`,
                        {
                          headers,
                        }
                      );
                      const returnData = await returnResponse.json();

                      if (returnData.data && returnData.data.length > 0) {
                        for (const returnInv of returnData.data) {
                          const returnInvResponse = await fetch(
                            `https://gmcerp.quantcloud.in/api/resource/POS%20Invoice/${returnInv.name}`,
                            {
                              headers,
                            }
                          );
                          const returnInvData = await returnInvResponse.json();

                          if (returnInvData.data?.items) {
                            const returnedItem = returnInvData.data.items.find(
                              (ri: any) => ri.item_code === item.item_code
                            );
                            if (returnedItem) {
                              alreadyReturnedQty += Math.abs(returnedItem.qty || 0);
                            }
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Failed to fetch already returned quantities:', error);
                      alreadyReturnedQty = 0;
                    }

                    return {
                      id: `${item.item_code}-${item.batch_no || ''}-${index}`,
                      alternateBatches: '',
                      substituteItem: '',
                      itemCode: item.item_code,
                      itemName: item.item_name,
                      uom: item.uom,
                      stockQty: item.actual_qty || 0,
                      orderedQty: 0,
                      saleQty: item.qty,
                      returnQty: 0,
                      alreadyReturnedQty,
                      batch: item.batch_no || '',
                      batchNo: item.batch_no || '',
                      expiryDate: item.custom_expiry_date || '',
                      batchStockQty: item.actual_batch_qty || 0,
                      rate: item.rate,
                      taxTemplate: item.item_tax_template || '',
                      description: item.description || '',
                      itemAmount: item.base_amount || 0,
                      discountPercent: item.discount_percentage || 0,
                      discountAmt: item.discount_amount || 0,
                      cgstPercent: item.cgst_rate || 0,
                      cgstAmt: item.cgst_amount || 0,
                      sgstPercent: item.sgst_rate || 0,
                      sgstAmt: item.sgst_amount || 0,
                      igstPercent: item.igst_rate || 0,
                      igstAmt: item.igst_amount || 0,
                      totalAmt: item.amount || 0,
                      kitName: '',
                      totalPckgAmt: 0,
                      packageName: '',
                      binLocation: item.custom_bin_location || '',
                      warehouse: item.warehouse || '',
                      marginType: item.margin_type || '',
                      includedInPrintRate: true,
                      mrp: item.custom_mrp || 0,
                    };
                  })
                );

                setItems(loadedItems);

                // Close modal
                setShowSelectInvoiceModal(false);

                // Show success message
                showAlert('success', 'Invoice Loaded', `Invoice ${invoice.name} loaded for return. Enter return quantities and submit.`);
              } catch (err) {
                console.error('Error loading invoice for return:', err);
                showAlert('danger', 'Error', 'Failed to load invoice data.');
              }
            }}
          />
        )}

        {/* Patient Status Warning Modal */}
        <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
          <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-amber-600 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Patient Status Warning
              </DialogTitle>
              <DialogDescription className="pt-3 text-sm text-gray-700 font-medium leading-relaxed">
                {statusModalMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex justify-end">
              <Button
                type="primary-button"
                size="button-medium"
                onClick={() => setStatusModalOpen(false)}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

        {/* High-Alert Save/Submit Confirmation Dialog */}
        <Dialog open={showHighAlertSaveDialog} onOpenChange={setShowHighAlertSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">High Alert Items Warning</DialogTitle>
              <DialogDescription>
                The following items in your invoice belong to High Alert Classifications. Please handle with care.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">High Alert Items:</p>
                {highAlertItems.map((item, index) => (
                  <p key={index} className="text-sm text-gray-700 mb-1">
                    <strong>{item.itemName}</strong> ({item.itemCode}) - <span className="text-red-600">{item.custom_classification}</span>
                  </p>
                ))}
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="secondary-button"
                size="button-medium"
                onClick={handleHighAlertSaveCancel}
              >
                Cancel
              </Button>
              <Button
                type="primary-button"
                size="button-medium"
                onClick={handleHighAlertSaveConfirm}
              >
                Proceed with {pendingSaveAction === 'draft' ? 'Save' : 'Submit'}
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