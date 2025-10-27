"use client";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Document from "@/components/documentUpload/Document";
import PageHeader from "@/components/billbreakdown/PageHeader";
import RenderFormElement from "@/components/form/RenderFormElement";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Image from "next/image";
import BillBreakdown from "@/components/billbreakdown/billbreakdown";
import POSProfileSelector from '@/components/pos/POSProfileSelector';
import { Search, X, Plus } from 'lucide-react';
import OpdCard from "@/components/OpdInfo/Opdinfo";
import HorizontallyScrollableTable from "@/components/editableTablePos/editable";
import PatientRequisitionList from "@/components/patientRequisitionList/PatientRequisitionList";
import PrescriptionList from "@/components/prescriptionList/PrescriptionList";
import Alerts from "@/components/alerts/Alerts";
import AlternativeItemsPopover from "@/components/itemAlternative/ItemAlternative";
import { useFrappeApi } from "@/api/api";
import ClosingEntryModal from '@/components/pos/ClosingEntryModal';
import ViewPosInvoicesModal from '@/components/pos/ViewPosInvoicesModal'; // New Import
import SelectInvoiceModal from '@/components/return/SelectInvoiceModal';
import CreateReturnEntryModal from '@/components/return/CreateReturnEntryModal';
import { useAlert } from "@/components/AlertContext/AlertContext";

interface AlertState {
    show: boolean;
    variant: "success" | "warning" | "danger" | "primary" | "secondary";
    heading: string;
    content: string;
}

// Define types
export interface Item {
    id: string;
    alternateBatches: string;
    substituteItem: string;
    itemCode: string;
    itemName: string;
    uom: string;         // Changed from unit to uom, moved up
    stockQty: number;
    orderedQty: number;
    saleQty: number;
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
    marginType?: string; // Add marginType as optional property
}

interface ItemSearchProps {
    onSelectItem: (item: Item) => void;
    placeholder?: string;
    className?: string;
    fetchItemBatches: (itemCode: string) => Promise<any[]>;
    fetchItemPrice: (itemCode: string, batchNo: string | null, priceList: string) => Promise<number | null>;
    getBatchQty: (itemCode: string, batchNo: string, warehouse: string) => Promise<number>;
    onNoBatchesFound?: (item: Item) => void;
    selectedWarehouse?: string; // Add selectedWarehouse to the interface
    selectedCompany?: string; // Add selectedCompany to the interface
    // showAlert: (variant: AlertState['variant'], heading: string, content: string) => void;
    selectedClassification?: string;
    isGeneric?: boolean;
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
    bed?: string;
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
    selectedCompany, // Destructure selectedCompany
    // showAlert, // Destructure selectedWarehouse
    selectedClassification,
    isGeneric,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subSearchTerm, setSubSearchTerm] = useState('');
    const [allSuggestions, setAllSuggestions] = useState<Item[]>([]);
    const [suggestions, setSuggestions] = useState<Item[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null); // New state for selected batch
    const [itemBatches, setItemBatches] = useState<any[]>([]); // To store batches for the highlighted item
    const [quantity, setQuantity] = useState<number>(1); // New state for quantity
    const [currentRate, setCurrentRate] = useState<number | null>(null); // New state for current rate
    const { showAlert } = useAlert();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    const API_BASE_URL = 'https://192.168.7.221:4422/api/resource';

    const searchItems = async (query: string, selectedClassification?: string, isGeneric?: boolean): Promise<Item[]> => {
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

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

            const response = await fetch(`${API_BASE_URL}/Item?filters=${JSON.stringify(filters)}${isGeneric ? '&limit_page_length=1000' : ''}`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                const fetchedItems: Item[] = data.data.map((item: any) => ({
                    id: item.name || '', // Use item.name (which is itemCode) as the initial ID
                    itemCode: item.name || '',
                    itemName: item.name || '',
                    uom: item.uom || 'Unit', // Use uom instead of unit, provide default
                    stockQty: item.actual_qty || 0,
                    orderedQty: 0,
                    saleQty: 0,
                    batch: '',
                    batchNo: '', // Initialize batchNo
                    expiryDate: '', // Initialize expiryDate
                    batchStockQty: 0, // Initialize batchStockQty
                    rate: item.rate || 0,
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
                }));
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
    const { posProfile, apiKey, apiSecret } = useAuth();

    useEffect(() => {
        const delayedSearch = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setLoading(true);
                try {
                    const results = await searchItems(searchTerm, selectedClassification, isGeneric);
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
    }, [searchTerm, selectedClassification, isGeneric]);

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
            }
        };

        fetchBatchesForHighlightedItem();
    }, [highlightedIndex, suggestions, posProfile, fetchItemBatches, selectedWarehouse, selectedCompany]); // Depend on highlightedIndex and suggestions

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
                    handleDistributedQuantitySelection(item, quantity);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
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
        if (batchNo) {
            // Use the batch quantity from the list if provided, otherwise fetch from API
            if (batchQtyFromList !== undefined && batchQtyFromList !== null) {
                batchStockQty = batchQtyFromList;
            } else {
                batchStockQty = await getBatchQty(item.itemCode, batchNo, warehouse); // Fetch batch quantity
            }
        }

        const itemWithBatchAndRate: Item = {
            ...item,
            id: `${item.itemCode}-${batchNo}-${Date.now()}`, // Generate unique ID for each batch item
            batchNo: batchNo, // Use the provided batchNo
            expiryDate: expiryDate, // Use the provided expiryDate
            batchStockQty: batchStockQty, // Set batchStockQty from fetched quantity
            stockQty: batchStockQty, // Ensure stockQty also reflects the batch-specific quantity
            rate: itemRate,
            orderedQty: qtyToTake, // Set orderedQty to the quantity taken from this batch
            saleQty: qtyToTake, // Set saleQty to the quantity taken from this batch
        };
        console.log("handleConfirmedSelectItem - itemWithBatchAndRate: ", itemWithBatchAndRate); // Log here
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

    const handleDistributedQuantitySelection = async (item: Item, totalRequestedQty: number) => {
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

        if (sortedBatches.length === 0) {
            showAlert("warning", "Warning", `Only ${totalRequestedQty - remainingQty} of ${totalRequestedQty} quantity could be fulfilled.`);
            if (onNoBatchesFound) {
                onNoBatchesFound(item);
            }
            return;
        }

        for (const batch of sortedBatches) {
            if (remainingQty <= 0) break;

            const batchAvailableQty = batch.batch_qty;
            const qtyToTake = Math.min(remainingQty, batchAvailableQty);

            if (qtyToTake > 0) {
                await handleConfirmedSelectItem(item, batch.name, batch.expiry_date, qtyToTake, batch.batch_qty);
                remainingQty -= qtyToTake;
            }
        }

        if (remainingQty > 0) {

        } else {
            showAlert("success", "Success", `Successfully added ${totalRequestedQty} quantity across batches.`);
        }
        setSearchTerm('');
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setSelectedBatch(null); // Clear selected batch after selection
        setItemBatches([]); // Clear batches
        setQuantity(1); // Reset quantity after selection
        inputRef.current?.focus();
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSubSearchTerm('');
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
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    placeholder={isGeneric ? "Search Generic Name" : placeholder}
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
                                            handleDistributedQuantitySelection(item, quantity);
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
                                                    <span>Stock: {item.stockQty}</span>
                                                    {item.batch && <span>Batch: {item.batch}</span>}
                                                    {currentRate !== null ? ( // Show currentRate if available
                                                        <span>Rate: ₹{currentRate.toFixed(2)}</span>
                                                    ) : (
                                                        item.rate !== null && <span>Rate: ₹{item.rate.toFixed(2)}</span> // Fallback to item.rate
                                                    )}
                                                </div>
                                                {itemBatches.length > 0 && highlightedIndex === index && selectedWarehouse && selectedCompany && (
                                                    <div className="mt-2" onClick={(e) => e.stopPropagation()}> {/* Prevent li onClick when clicking inside batch dropdown */}
                                                        <label htmlFor="batch-select" className="sr-only">Select Batch</label>
                                                        <select
                                                            id="batch-select"
                                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                            value={selectedBatch || ''}
                                                            onChange={(e) => {
                                                                setSelectedBatch(e.target.value);
                                                                const selectedBatchData = itemBatches.find(b => b.name === e.target.value);
                                                                if (selectedBatchData) {
                                                                    // If a specific batch is selected from dropdown, only add that batch with the specified quantity
                                                                    handleConfirmedSelectItem(item, selectedBatchData.name, selectedBatchData.expiry_date, quantity, selectedBatchData.batch_qty);
                                                                } else {
                                                                    // If 'Select a Batch' is chosen, but a quantity is entered, distribute it
                                                                    handleDistributedQuantitySelection(item, quantity);
                                                                }
                                                            }}
                                                        >
                                                            <option value="">Select a Batch</option>
                                                            {itemBatches.map((batch) => (
                                                                <option key={batch.name} value={batch.name}>
                                                                    {batch.name} (Exp: {batch.expiry_date} | Qty: {batch.batch_qty})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {highlightedIndex === index && selectedWarehouse && selectedCompany && ( // Show quantity input when item is highlighted, only if warehouse and company are selected
                                                    <div className="mt-2" onClick={(e) => e.stopPropagation()}> {/* Prevent li onClick when clicking inside quantity input */}
                                                        <label htmlFor="quantity-input" className="sr-only">Quantity</label>
                                                        <Input
                                                            id="quantity-input"
                                                            type="number"
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                                            placeholder="Enter Quantity"
                                                            // min="1"
                                                            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                        />
                                                        <label htmlFor="rate-input" className="sr-only">Rate</label>
                                                        <Input
                                                            id="rate-input"
                                                            type="number"
                                                            value={currentRate !== null ? currentRate : ''}
                                                            onChange={(e) => setCurrentRate(parseFloat(e.target.value) || null)}
                                                            placeholder="Enter Rate"
                                                            min="0"
                                                            step="any"
                                                            className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mt-2"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                <Plus
                                                    className="h-4 w-4 text-gray-400 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent li onClick from firing
                                                        handleDistributedQuantitySelection(item, quantity); // Use the new handler
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
}

const calculateItemTaxAndTotals = (item: Item): CalculatedItem => {
    const rate = item.rate !== null ? item.rate : 0;
    const baseAmount = item.orderedQty * rate;
    const discountAmount = baseAmount * (item.discountPercent / 100);
    const itemAmountAfterDiscount = baseAmount - discountAmount;

    const cgstAmount = itemAmountAfterDiscount * (item.cgstPercent / 100);
    const sgstAmount = itemAmountAfterDiscount * (item.sgstPercent / 100);
    const igstAmount = itemAmountAfterDiscount * (item.igstPercent / 100);

    const totalAmount = itemAmountAfterDiscount + cgstAmount + sgstAmount + igstAmount;

    return {
        ...item,
        itemAmount: baseAmount,
        discountAmt: discountAmount,
        cgstAmt: cgstAmount,
        sgstAmt: sgstAmount,
        igstAmt: igstAmount,
        totalAmt: totalAmount,
    };
};

export default function NewBill() {
    const [remarks, setRemarks] = useState('');

    const router = useRouter();
    const { logout, isAuthenticated, posProfile, setPosProfile, isInitialized, apiKey, apiSecret } = useAuth();
    const { classifications, fetchUserDefaultCompany } = useFrappeApi();

    const API_BASE_URL = 'https://192.168.7.221:4422/api/resource';
    // const PATIENT_API_BASE_URL = "https://192.168.6.254:8085/masterdata/search-patient";
    const ITEM_DETAILS_API_URL = 'https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.item_details';

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

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

            // Call the new API method that filters by warehouse and company
            const response = await fetch('https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_item_batches_by_warehouse_and_company', {
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
                console.error('Failed to fetch batches:', response.status, response.statusText);
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
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
            const resp = await fetch('https://192.168.7.221:4422/api/method/erpnext.stock.doctype.batch.batch.get_batch_qty', {
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
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
            const filters = [
                ["item_code", "=", itemCode],
                ["price_list", "=", priceList]
            ];
            if (batchNo) {
                filters.push(["batch_no", "=", batchNo]);
            }

            const response = await fetch(`${API_BASE_URL}/Item Price?filters=${JSON.stringify(filters)}&fields=["price_list_rate", "valid_from", "valid_upto"]&order_by=valid_from desc&limit=1`, {
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
                    console.log(`Set price ${rate} from Price List for item ${itemCode}, batch ${batchNo}`);
                    return rate;
                } else {
                    console.log(`Price found in Price List but not valid for current date for item ${itemCode}, batch ${batchNo}`);
                }
            } else {
                console.log(`No price found in Price List for item ${itemCode}, batch ${batchNo} in price list ${priceList}`);
            }
        } catch (error) {
            console.error('Error fetching item price from Price List:', error);
        }

        // If not found in Price List or not valid, try to fetch custom_mrp from Batch
        if (batchNo) {
            try {
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };
                const response = await fetch(`${API_BASE_URL}/Batch?filters=[["item", "=", "${itemCode}"], ["name", "=", "${batchNo}"]]&fields=["custom_mrp"]&limit=1`, {
                    method: 'GET',
                    headers,
                    credentials: 'include',
                });

                const data = await response.json();
                if (data.data && data.data.length > 0 && data.data[0].custom_mrp) {
                    rate = data.data[0].custom_mrp;
                    console.log(`Set price ${rate} from Batch custom_mrp for item ${itemCode}, batch ${batchNo}`);
                } else {
                    console.log(`No custom_mrp found for item ${itemCode}, batch ${batchNo}`);
                }
            } catch (error) {
                console.error('Error fetching custom_mrp from Batch:', error);
            }
        }
        return rate; // Return null if no rate is found
    };

    const classificationTypeOptions = classifications;

    // const [searchValue, setSearchValue] = useState<string>("");
    const [requisitionDate, setRequisitionDate] = useState<Date | undefined>(undefined);
    const [requisitionNo, setRequisitionNo] = useState('');
    const [requisitionFrom, setRequisitionFrom] = useState('');
    const [requisitionTo] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [selectedKit, setSelectedKit] = useState('');
    const [selectedSaleType, setSelectedSaleType] = useState('');
    const [isRoutine, setIsRoutine] = useState(false);
    const [isStat, setIsStat] = useState(false);
    const [isDischarge, setIsDischarge] = useState(false);
    const [isAsap, setIsAsap] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isGeneric, setIsGeneric] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [patientData, setPatientData] = useState<SelectedPatient | null>(null);
    // const [searchResults, setSearchResults] = useState<any[]>([]);
    const [_showDropdown, setShowDropdown] = useState(false);
    const [showPosProfileSelector, setShowPosProfileSelector] = useState(false);
    const [showPatientRequisitionList, setShowPatientRequisitionList] = useState(false);
    const [showPrescriptionList, setShowPrescriptionList] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
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
    const [showViewPosInvoicesModal, setShowViewPosInvoicesModal] = useState(false); // New state for View POS Invoices modal

    const [showSelectInvoiceModal, setShowSelectInvoiceModal] = useState(false);
    const [showCreateReturnModal, setShowCreateReturnModal] = useState(false);
    const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] = useState<any>(null);
    const [loadedInvoiceName, setLoadedInvoiceName] = useState<string | null>(null);
    const [loadedInvoiceDocstatus, setLoadedInvoiceDocstatus] = useState<number>(0);

    // Global discount state
    const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
    //Transaction Type Toggle
    const [transactionType, setTransactionType] = useState<'cash' | 'credit'>('cash');
    // IPD Effect checkbox
    const [isIpdEffect, setIsIpdEffect] = useState(false);

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
    const [showClosingEntryModal, setShowClosingEntryModal] = useState(false); // New state
    const [CompanyAddress, setCompanyAddress] = useState<string | null>(null);
    const [isReturn, setIsReturn] = useState(false);
    // Payments captured from RecordPaymentModal
    const [recordedPayments, setRecordedPayments] = useState<Array<{
        id: number;
        paymentMode: string;
        transactionNo: string;
        bankName: string;
        branchName: string;
        paidAmount: string;
        paymentDate: string;
        approvalNo: string;
    }>>([]);

    // Recalculate totals whenever items change
    useEffect(() => {
        const calculatedItems = items.map(calculateItemTaxAndTotals);

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
    }, [items]);

    const clearPatient = () => {
        setPatientData(null);
        // setSearchValue("");
        // setSearchResults([]);
        setShowDropdown(false);
        setItems([]);
        <Alerts
            heading="Sucess"


        />;
    };

    // useEffect to fetch kit options
    useEffect(() => {
        const fetchKitOptions = async () => {
            try {
                const headers: HeadersInit = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };

                const response = await fetch(`${API_BASE_URL}/Product Bundle?fields=["name"]&limit_page_length=1000000`, {
                    method: 'GET',
                    headers,
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.data) {
                    const fetchedKitOptions = data.data.map((kit: { name: string }) => ({
                        label: kit.name,
                        value: kit.name,
                    }));
                    setKitOptions(fetchedKitOptions);
                }
            } catch (error: any) {
                console.error('Error fetching kit options:', error);
                showAlert("danger", "Error", "Failed to fetch kit options.");
            }
        };

        if (apiKey && apiSecret) {
            fetchKitOptions();
        }
    }, [apiKey, apiSecret]);

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
            if (!selectedCompany || !apiKey || !apiSecret) return;

            try {
                // Fetch Tax Template
                const taxTemplateHeaders: HeadersInit = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };
                const taxTemplateResponse = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_tax_template`, {
                    method: 'POST',
                    headers: taxTemplateHeaders,
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
                const taxAccountsHeaders: HeadersInit = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };
                const taxAccountsResponse = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_tax_accounts`, {
                    method: 'POST',
                    headers: taxAccountsHeaders,
                    credentials: 'include',
                    body: JSON.stringify({ company: selectedCompany }),
                });

                if (taxAccountsResponse.ok) {
                    const taxAccountsData = await taxAccountsResponse.json();
                    if (taxAccountsData.message) {
                        setCgstAccounts(taxAccountsData.message.cgst_accounts || []);
                        setSgstAccounts(taxAccountsData.message.sgst_accounts || []);
                        setIgstAccounts(taxAccountsData.message.igst_accounts || []);
                    }
                } else {
                    console.error('Failed to fetch tax accounts:', taxAccountsResponse.status, taxAccountsResponse.statusText);
                }

            } catch (error) {
                console.error('Error fetching tax data:', error);
            }
        };

        fetchTaxData();
    }, [selectedCompany, selectedCustomer, apiKey, apiSecret]);

    // useEffect to fetch GST Category for the selected company
    useEffect(() => {
        const fetchGstCategory = async () => {
            if (!selectedCompany || !apiKey || !apiSecret) return;

            try {
                const headers: HeadersInit = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };

                const response = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_company_gst_category`, {
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
    }, [selectedCompany, apiKey, apiSecret]);


    useEffect(() => {
        const fetchCompanyAddress = async () => {
            if (!selectedCustomer || !apiKey || !apiSecret) {
                console.log('Missing required parameters:', { selectedCustomer, apiKey, apiSecret });
                setCompanyAddress(null);
                return;
            }

            try {
                const headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `token ${apiKey}:${apiSecret}`,
                };

                const response = await fetch(
                    'https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_company_billing_address',
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
    }, [selectedCustomer, apiKey, apiSecret]);


    const handleSelectKit = async (kitName: string) => {
        setSelectedKit(kitName);
        if (!kitName) {
            showAlert("primary", "Information", "No kit selected.");
            return;
        }

        try {
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

            const response = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.get_product_bundle_items`, {
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
    const handleAddItemToDetails = async (item: Item) => {
        console.log("handleAddItemToDetails - received item: ", item); // Log here
        try {
            const taxDetails = await fetchTaxDetails(item.itemCode, item.rate || 0, 1, item.uom);
            // The item passed from EnhancedItemSearch should already have batchNo, expiryDate, and rate set.
            // We will use these directly.
            const finalBatchNo = item.batchNo;
            const finalExpiryDate = item.expiryDate;
            const finalRate = item.rate !== null ? item.rate : 0; // Use item's rate, ensure it's not null
            const finalBatchStockQty = item.batchStockQty; // Use item's batchStockQty

            setItems(prevItems => {
                // Always add as a new item, as each batch-specific item has a unique ID now
                const newItemWithCalculations = calculateItemTaxAndTotals({
                    ...item,
                    orderedQty: item.saleQty, // Use saleQty as the ordered quantity for the new row
                    stockQty: finalBatchStockQty, // Set stockQty with batch-specific quantity for new item
                    rate: finalRate, // Use the final rate from the item
                    batchNo: finalBatchNo, // Use the final batch number
                    expiryDate: finalExpiryDate, // Use the final expiry date
                    cgstPercent: taxDetails.cgstRate,
                    sgstPercent: taxDetails.sgstRate,
                    igstPercent: taxDetails.igstRate,
                    taxTemplate: taxDetails.taxTemplate,
                });
                console.log("handleAddItemToDetails - newItemWithCalculations: ", newItemWithCalculations); // Log here
                return [...prevItems, newItemWithCalculations];
            });
            showAlert("success", "Success", "Item added successfully");
        } catch (error) {
            console.error("Error adding item with tax details:", error);
            showAlert("danger", "Error", "Failed to add item. Please try again.");
        }
    };

    // const handleRemoveItemFromDetails = (itemId: string) => {
    //   setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    //   showAlert("success", "Success", "Item removed successfully");
    // };

    // const handleUpdateQuantity = (itemId: string, newQty: number) => {
    //   if (newQty <= 0) {
    //     handleRemoveItemFromDetails(itemId);
    //     return;
    //   }
    //   setItems(prevItems =>
    //     prevItems.map(item =>
    //       item.id === itemId
    //         ? calculateItemTaxAndTotals({ ...item, orderedQty: newQty })
    //         : item
    //     )
    //   );
    //   showAlert("success", "Success", "Quantity updated successfully");
    // };

    // Save as Draft functionality
    // Inside NewBill component
    const handleSaveAsDraft = async () => {
        if (!patientData) {
            showAlert("danger", "Error", "Please select a patient before saving.");
            return;
        }

        if (items.length === 0) {
            showAlert("danger", "Error", "Please add at least one item to the invoice.");
            return;
        }

        if (!posProfile) {
            showAlert("danger", "Error", "Please select a POS profile.");
            setShowPosProfileSelector(true);
            return;
        }

        // // Check if POS session is open
        // try {
        //   const isPosOpen = await checkOpenPOS(posProfile);
        //   if (!isPosOpen) {
        //     showAlert("danger", "Error", "No open POS session found for the selected profile.");
        //     return;
        //   }
        // } catch (error) {
        //   console.error("Error checking POS session:", error);
        //   showAlert("danger", "Error", "Failed to verify POS session. Please try again.");
        //   return;
        // }

        const payload = {
            doctype: "POS Invoice",
            customer: selectedCustomer || patientData.mrn || "PQR Ltd", // Using selectedCustomer
            pos_profile: posProfile,
            is_pos: 1,
            update_stock: 1,
            company: selectedCompany || patientData.company || "Default Company",
            docstatus: 0, // Draft status
            gst_category: gstCategory || "Unregistered",
            customer_address: CompanyAddress,
            remarks: remarks,

            posting_date: requisitionDate ? requisitionDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            items: items.map(item => ({
                item_code: item.itemCode,
                qty: isReturn ? (Number(item.saleQty) || 0) : (Number(item.saleQty) || 0),
                uom: item.uom,
                rate: Number(item.rate) || 0,
                batch_no: item.batch || "",
                margin_type: (Number(item.discountPercent) || 0) > 0 ? "Percentage" : "",
                discount_percentage: Number(item.discountPercent) || 0,
                base_amount: Number(item.itemAmount) || 0,
                discount_amount: Number(item.discountAmt) || 0,
                cgst_rate: Number(item.cgstPercent) || 0,
                cgst_amount: Number(item.cgstAmt) || 0,
                sgst_rate: Number(item.sgstPercent) || 0,
                sgst_amount: Number(item.sgstAmt) || 0,
                igst_rate: Number(item.igstPercent) || 0,
                igst_amount: Number(item.igstAmt) || 0,
                amount: Number(item.totalAmt) || 0,
                item_tax_template: item.taxTemplate || "",
            })),
            payments: recordedPayments.map(p => ({
                mode_of_payment: p.paymentMode || "Cash",
                amount: parseFloat(p.paidAmount || "0") || 0,
                reference_no: p.transactionNo || "",
                // bank: p.bankName || "",
                // branch: p.branchName || "",
                // posting_date: p.paymentDate || "",
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
            custom_req_no: requisitionNo || "",
            custom_visit_code: patientData?.visitID || "",
            custom_phone: patientData?.phone || "",
            custom_doctor_name: patientData?.doctor || "",
            custom_bed_no: patientData?.bed || "",
        };

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
                item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
                    if (item.igstAmt !== 0) {
                        acc[item.itemCode] = [item.igstAmt, item.igstPercent];
                    }
                    return acc;
                }, {} as Record<string, [number, number]>)),
            });
        }

        const finalPayload = {
            ...payload,
            taxes_and_charges: taxTemplate, // Add taxes_and_charges field
            taxes: taxesPayload,
            total_taxes_and_charges: totalCgstAmount + totalSgstAmount + totalIgstAmount,
        }

        try {
            console.log("Final payload for saving draft:", finalPayload); // Log the final payload
            const response = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                },
                credentials: 'include',
                body: JSON.stringify(finalPayload),
            });
            console.log(response);

            if (response.ok) {
                const result = await response.json();
                showAlert("success", "Success", "POS Invoice saved as draft successfully!");
                console.log("Draft saved:", result);
                // clearPatient();
                // router.push("/pos");
            } else {
                const errorData = await response.json();
                console.error("Failed to save draft:", response.status, errorData);
                showAlert("danger", "Error", `Failed to save draft: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error saving draft:", error);
            showAlert("danger", "Error", "Error saving draft. Please try again.");
        }
    };

    // Authentication and POS profile handling
    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated) {
            router.push('/login');
        } else if (!posProfile) {
            setShowPosProfileSelector(true);
        }
    }, [isAuthenticated, router, posProfile, isInitialized]);

    // Automatically set warehouse based on selected POS Profile
    useEffect(() => {
        const fetchPosProfileWarehouse = async () => {
            if (!posProfile || !apiKey || !apiSecret) return;

            try {
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };

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
                } else {
                    console.error('Failed to fetch POS Profile:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching POS Profile warehouse:', error);
            }
        };

        fetchPosProfileWarehouse();
    }, [posProfile, apiKey, apiSecret]);

    const handlePOSProfileSelect = (profile: string) => {
        setPosProfile(profile);
        localStorage.setItem('posProfile', profile);
        setShowPosProfileSelector(false);
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

    const handleSelectRequisition = async (requisition: any) => {
        console.log("Selected requisition:", requisition);
        // Fetch the full requisition document to ensure child tables are available
        let fullRequisitionData = requisition;
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
            const response = await fetch(`${API_BASE_URL}/Patient%20Requisition/${requisition.name}`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                fullRequisitionData = data.data;
            } else {
                console.error('Failed to fetch full requisition details:', response.status, response.statusText);
                showAlert("danger", "Error", "Failed to load full requisition details. Please try again.");
                setShowPatientRequisitionList(false);
                return;
            }
        } catch (error) {
            console.error('Error fetching full requisition details:', error);
            showAlert("danger", "Error", "Error fetching full requisition details. Please try again.");
            setShowPatientRequisitionList(false);
            return;
        }

        // Set patient data
        const newPatientData = {
            name: fullRequisitionData.full_name || "N/A",
            age: fullRequisitionData.age || "N/A",
            sex: fullRequisitionData.gender || "N/A",
            phone: fullRequisitionData.mobile_number || "N/A",
            ABHAID: fullRequisitionData.patient_id || "N/A",
            category: fullRequisitionData.patient_category || "N/A",
            doctor: fullRequisitionData.consulting_doctor || "N/A",
            mrn: fullRequisitionData.patient_id || "N/A",
            displayNo: fullRequisitionData.patient_id || "N/A",
            dept: fullRequisitionData.department || "N/A",
            visitType: fullRequisitionData.visit_type || "N/A",
            company: fullRequisitionData.patient_company || "N/A",
        };
        setPatientData(newPatientData);

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

        if (!fullRequisitionData.patient_requisition_item_details || !Array.isArray(fullRequisitionData.patient_requisition_item_details)) {
            showAlert("danger", "Error", "Requisition item details are missing or not in a valid format.");
            setShowPatientRequisitionList(false);
            return;
        }

        for (const reqItem of fullRequisitionData.patient_requisition_item_details) {
            const itemCode = reqItem.item_code;
            const requestedQty = reqItem.req_qty;

            try {
                const batches = await fetchItemBatches(itemCode);
                const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

                let remainingQtyToAllocate = requestedQty;

                if (sortedBatches.length === 0) {
                    showAlert("warning", "Warning", `No batches available for item ${itemCode} from requisition. Showing alternatives...`);
                    // Trigger alternative selection flow instead of adding without batch
                    const originalItemForAlt: Item = {
                        id: `${itemCode}-alt-${Date.now()}`,
                        alternateBatches: "",
                        substituteItem: "",
                        itemCode: itemCode,
                        itemName: reqItem.item_name,
                        uom: reqItem.unit,
                        stockQty: 0,
                        orderedQty: requestedQty,
                        saleQty: requestedQty,
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
                    await handleNoBatchesFound(originalItemForAlt);
                    remainingQtyToAllocate = 0; // Stop further processing for this item
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
                            alternateBatches: "",
                            substituteItem: "",
                            itemCode: itemCode,
                            itemName: reqItem.item_name,
                            uom: reqItem.unit,
                            stockQty: batchStockQty,
                            orderedQty: qtyToTake,
                            saleQty: qtyToTake,
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
                        alternateBatches: "",
                        substituteItem: "",
                        itemCode: itemCode,
                        itemName: reqItem.item_name,
                        uom: reqItem.unit,
                        stockQty: 0,
                        orderedQty: remainingQtyToAllocate,
                        saleQty: remainingQtyToAllocate,
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
        // Fetch the full prescription document to ensure child tables are available
        let fullPrescriptionData = prescription;
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
            const response = await fetch(`${API_BASE_URL}/Patient%20Requisition/${prescription.prescription_number}`, {
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

        // Set patient data (assuming prescription object has similar patient fields)
        const newPatientData = {
            name: fullPrescriptionData.full_name || "N/A",
            age: fullPrescriptionData.age || "N/A",
            sex: fullPrescriptionData.gender || "N/A",
            phone: fullPrescriptionData.mobile_number || "N/A",
            ABHAID: fullPrescriptionData.patient_id || "N/A",
            category: fullPrescriptionData.patient_category || "N/A",
            doctor: fullPrescriptionData.doctor || "N/A",
            mrn: fullPrescriptionData.patient_id || "N/A",
            displayNo: fullPrescriptionData.patient_id || "N/A",
            dept: fullPrescriptionData.department || "N/A",
            visitType: fullPrescriptionData.visit_type || "N/A",
            company: fullPrescriptionData.patient_company || "N/A",
        };
        setPatientData(newPatientData);

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

        if (!fullPrescriptionData.patient_requisition_item_details || !Array.isArray(fullPrescriptionData.patient_requisition_item_details)) {
            showAlert("danger", "Error", "Prescription item details are missing or not in a valid format.");
            setShowPrescriptionList(false);
            return;
        }

        for (const reqItem of fullPrescriptionData.patient_requisition_item_details) {
            const itemCode = reqItem.item_code;
            const requestedQty = reqItem.req_qty;

            try {
                const batches = await fetchItemBatches(itemCode);
                const sortedBatches = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

                let remainingQtyToAllocate = requestedQty;

                if (sortedBatches.length === 0) {
                    showAlert("warning", "Warning", `No batches available for item ${itemCode} from prescription. Showing alternatives...`);
                    const originalItemForAlt: Item = {
                        id: `${itemCode}-alt-${Date.now()}`,
                        alternateBatches: "",
                        substituteItem: "",
                        itemCode: itemCode,
                        itemName: reqItem.item_name,
                        uom: reqItem.unit,
                        stockQty: 0,
                        orderedQty: requestedQty,
                        saleQty: requestedQty,
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
                    await handleNoBatchesFound(originalItemForAlt);
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
                            alternateBatches: "",
                            substituteItem: "",
                            itemCode: itemCode,
                            itemName: reqItem.item_name,
                            uom: reqItem.unit,
                            stockQty: batchStockQty,
                            orderedQty: qtyToTake,
                            saleQty: qtyToTake,
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
                        alternateBatches: "",
                        substituteItem: "",
                        itemCode: itemCode,
                        itemName: reqItem.item_name,
                        uom: reqItem.unit,
                        stockQty: 0,
                        orderedQty: remainingQtyToAllocate,
                        saleQty: remainingQtyToAllocate,
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
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
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
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };
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
            const headers: HeadersInit = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

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

    // Show alert function
    const showAlert = (variant: AlertState['variant'], heading: string, content: string) => {
        setAlert({
            show: true,
            variant,
            heading,
            content
        });
        // Auto hide after 3 seconds
        setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Apply global discount to all items
    const handleApplyGlobalDiscount = () => {
        if (items.length === 0) {
            showAlert("warning", "Warning", "No items in the table to apply discount.");
            return;
        }

        if (globalDiscountPercent < 0 || globalDiscountPercent > 100) {
            showAlert("danger", "Error", "Discount percentage must be between 0 and 100.");
            return;
        }

        // Update all items with the global discount percentage applied to rate
        const updatedItems = items.map(item => {
            const originalRate = item.rate !== null ? item.rate : 0;

            // Apply discount to the rate itself
            const discountedRate = originalRate * (1 - globalDiscountPercent / 100);

            // Recalculate with new discounted rate
            return calculateItemTaxAndTotals({
                ...item,
                rate: discountedRate,
                discountPercent: globalDiscountPercent,
                discountAmt: originalRate * item.orderedQty * (globalDiscountPercent / 100), // Discount on original amount
            });
        });

        setItems(updatedItems);
        showAlert("success", "Success", `Applied ${globalDiscountPercent}% discount to all item rates.`);
    };

    const handleLoadInvoice = async (invoice: any) => {
        try {
            // Fetch full invoice details including all child tables
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

            const response = await fetch(`${API_BASE_URL}/POS%20Invoice/${invoice.name}`, {
                method: 'GET',
                headers,
                credentials: 'include',
            });

            if (!response.ok) {
                showAlert("danger", "Error", "Failed to load invoice details.");
                return;
            }

            const data = await response.json();
            const fullInvoice = data.data;

            // Store loaded invoice details
            setLoadedInvoiceName(fullInvoice.name);
            setLoadedInvoiceDocstatus(fullInvoice.docstatus || 0);

            // Set patient data from invoice
            const newPatientData = {
                name: fullInvoice.custom_patient_name || fullInvoice.customer || "N/A",
                age: fullInvoice.custom_age || "N/A",
                sex: fullInvoice.custom_sex || "N/A",
                phone: fullInvoice.custom_phone || "N/A",
                ABHAID: fullInvoice.custom_abha_id || "N/A",
                category: fullInvoice.custom_category || "N/A",
                doctor: fullInvoice.custom_doctor_name || "N/A",
                mrn: fullInvoice.custom_uhid || fullInvoice.customer || "N/A",
                displayNo: fullInvoice.custom_uhid || "N/A",
                dept: fullInvoice.custom_department || "N/A",
                visitType: fullInvoice.custom_visit_type || "N/A",
                company: fullInvoice.company || "N/A",
                visitID: fullInvoice.custom_visit_code || "N/A",
                bed: fullInvoice.custom_bed_no || "N/A",
            };
            setPatientData(newPatientData);

            // Set other form fields
            setSelectedCustomer(fullInvoice.customer || '');
            setSelectedCompany(fullInvoice.company || '');
            setRequisitionNo(fullInvoice.custom_req_no || '');
            setRequisitionFrom(fullInvoice.custom_requisition_from || '');
            if (fullInvoice.posting_date) {
                setRequisitionDate(new Date(fullInvoice.posting_date));
            }
            setSelectedSaleType(fullInvoice.custom_sale_type || '');
            setIsReturn(fullInvoice.is_return === 1);

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

                    // Calculate tax amounts based on item amount
                    const itemAmount = Math.abs(invItem.base_amount || 0);
                    const itemAmountAfterDiscount = itemAmount - Math.abs(invItem.discount_amount || 0);

                    const item: Item = {
                        id: `${invItem.item_code}-${invItem.batch_no || 'no-batch'}-${Date.now()}-${Math.random()}`,
                        alternateBatches: "",
                        substituteItem: "",
                        itemCode: invItem.item_code || "",
                        itemName: invItem.item_name || "",
                        uom: invItem.uom || "",
                        stockQty: invItem.actual_qty || 0,
                        orderedQty: Math.abs(invItem.qty || 0),
                        saleQty: Math.abs(invItem.qty || 0),
                        batch: invItem.batch_no || "",
                        batchNo: invItem.batch_no || "",
                        expiryDate: invItem.expiry_date || "",
                        batchStockQty: invItem.actual_batch_qty || 0,
                        rate: invItem.rate || 0,
                        taxTemplate: taxDetails.taxTemplate,
                        description: invItem.description || "",
                        itemAmount: itemAmount,
                        discountPercent: invItem.discount_percentage || 0,
                        discountAmt: Math.abs(invItem.discount_amount || 0),
                        cgstPercent: taxDetails.cgstRate,
                        cgstAmt: itemAmountAfterDiscount * (taxDetails.cgstRate / 100),
                        sgstPercent: taxDetails.sgstRate,
                        sgstAmt: itemAmountAfterDiscount * (taxDetails.sgstRate / 100),
                        igstPercent: taxDetails.igstRate,
                        igstAmt: itemAmountAfterDiscount * (taxDetails.igstRate / 100),
                        totalAmt: itemAmountAfterDiscount +
                            (itemAmountAfterDiscount * (taxDetails.cgstRate / 100)) +
                            (itemAmountAfterDiscount * (taxDetails.sgstRate / 100)) +
                            (itemAmountAfterDiscount * (taxDetails.igstRate / 100)),
                        totalPckgAmt: 0,
                        kitName: "",
                        packageName: "",
                        binLocation: "",
                    };
                    loadedItems.push(item);
                }
            }
            setItems(loadedItems);

            // Load payments
            if (fullInvoice.payments && Array.isArray(fullInvoice.payments)) {
                const loadedPayments = fullInvoice.payments.map((payment: any, index: number) => ({
                    id: index + 1,
                    paymentMode: payment.mode_of_payment || "Cash",
                    transactionNo: payment.reference_no || "",
                    bankName: payment.bank || "",
                    branchName: payment.branch || "",
                    paidAmount: Math.abs(payment.amount || 0).toString(),
                    paymentDate: payment.posting_date || "",
                    approvalNo: payment.approval_no || "",
                }));
                setRecordedPayments(loadedPayments);
            }

            showAlert("success", "Success", `Invoice ${invoice.name} loaded successfully!`);
        } catch (error) {
            console.error("Error loading invoice:", error);
            showAlert("danger", "Error", "Failed to load invoice. Please try again.");
        }
    };

    const handleFinalizeAndPrint = async () => {
        // If a draft invoice is loaded, submit it
        if (loadedInvoiceName && loadedInvoiceDocstatus === 0) {
            try {
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                };

                // Submit the draft invoice
                const response = await fetch(`${API_BASE_URL}/POS%20Invoice/${loadedInvoiceName}`, {
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

                const result = await response.json();
                showAlert("success", "Success", `Invoice ${loadedInvoiceName} submitted successfully!`);

                // Update the docstatus state
                setLoadedInvoiceDocstatus(1);

                // Print the invoice
                const company = selectedCompany || result.data?.company || '';
                const printUrl = 'https://192.168.7.221:4422/printview?' +
                    'doctype=POS Invoice&' +
                    'name=' + encodeURIComponent(loadedInvoiceName) + '&' +
                    'format=' + encodeURIComponent('Pos Invoice print Format') + '&' +
                    'trigger_print=1&' +
                    'no_letterhead=0&' +
                    'letterhead=' + encodeURIComponent(company) + '&' +
                    'settings=' + encodeURIComponent('{}') + '&' +
                    '_lang=en';
                window.open(printUrl, '_blank');

            } catch (error) {
                console.error("Error submitting invoice:", error);
                showAlert("danger", "Error", "Failed to submit invoice. Please try again.");
            }
        } else {
            // Create new invoice and submit it directly
            if (!patientData) {
                showAlert("danger", "Error", "Please select a patient before finalizing.");
                return;
            }

            if (items.length === 0) {
                showAlert("danger", "Error", "Please add at least one item to the invoice.");
                return;
            }

            if (!posProfile) {
                showAlert("danger", "Error", "Please select a POS profile.");
                setShowPosProfileSelector(true);
                return;
            }

            const payload = {
                doctype: "POS Invoice",
                customer: selectedCustomer || patientData.mrn || "PQR Ltd",
                pos_profile: posProfile,
                is_pos: 1,
                update_stock: 1,
                company: selectedCompany || patientData.company || "Default Company",
                docstatus: 1, // Submitted status
                gst_category: gstCategory || "Unregistered",
                customer_address: CompanyAddress,
                remarks: remarks,
                posting_date: requisitionDate ? requisitionDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                items: items.map(item => ({
                    item_code: item.itemCode,
                    qty: isReturn ? (Number(item.saleQty) || 0) : (Number(item.saleQty) || 0),
                    uom: item.uom,
                    rate: Number(item.rate) || 0,
                    batch_no: item.batch || "",
                    margin_type: (Number(item.discountPercent) || 0) > 0 ? "Percentage" : "",
                    discount_percentage: Number(item.discountPercent) || 0,
                    base_amount: Number(item.itemAmount) || 0,
                    discount_amount: Number(item.discountAmt) || 0,
                    cgst_rate: Number(item.cgstPercent) || 0,
                    cgst_amount: Number(item.cgstAmt) || 0,
                    sgst_rate: Number(item.sgstPercent) || 0,
                    sgst_amount: Number(item.sgstAmt) || 0,
                    igst_rate: Number(item.igstPercent) || 0,
                    igst_amount: Number(item.igstAmt) || 0,
                    amount: Number(item.totalAmt) || 0,
                    item_tax_template: item.taxTemplate || "",
                })),
                payments: recordedPayments.map(p => ({
                    mode_of_payment: p.paymentMode || "Cash",
                    amount: parseFloat(p.paidAmount || "0") || 0,
                    reference_no: p.transactionNo || "",
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
                custom_req_no: requisitionNo || "",
                custom_visit_code: patientData?.visitID || "",
                custom_phone: patientData?.phone || "",
                custom_doctor_name: patientData?.doctor || "",
                custom_bed_no: patientData?.bed || "",
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
                    base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
                    base_tax_amount_after_discount_amount: totalCgstAmount,
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
                    total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
                    tax_amount_after_discount_amount: totalSgstAmount,
                    base_tax_amount: totalSgstAmount,
                    base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
                    base_tax_amount_after_discount_amount: totalSgstAmount,
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
                    total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
                    tax_amount_after_discount_amount: totalIgstAmount,
                    base_tax_amount: totalIgstAmount,
                    base_total: totalBillAmount - totalDiscountAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount,
                    base_tax_amount_after_discount_amount: totalIgstAmount,
                    item_wise_tax_detail: JSON.stringify(items.reduce((acc, item) => {
                        if (item.igstAmt !== 0) {
                            acc[item.itemCode] = [item.igstAmt, item.igstPercent];
                        }
                        return acc;
                    }, {} as Record<string, [number, number]>)),
                });
            }

            const finalPayload = {
                ...payload,
                taxes_and_charges: taxTemplate,
                taxes: taxesPayload,
                total_taxes_and_charges: totalCgstAmount + totalSgstAmount + totalIgstAmount,
            };

            try {
                console.log("Final payload for creating submitted invoice:", finalPayload);
                const response = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_draft`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `token ${apiKey}:${apiSecret}`,
                    },
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
                const invoiceName = result.message?.name || result.data?.name;


                showAlert("success", "Success", `Invoice ${invoiceName} created and submitted successfully!`);
                console.log("Invoice created and submitted:", result);

                // Update state to reflect the loaded invoice
                setLoadedInvoiceName(invoiceName);
                setLoadedInvoiceDocstatus(1);


                // Print the invoice
                const company = selectedCompany || patientData.company || '';
                const printUrl = 'https://192.168.7.221:4422/printview?' +
                    'doctype=POS Invoice&' +
                    'name=' + encodeURIComponent(invoiceName) + '&' +
                    'format=' + encodeURIComponent('Pos Invoice print Format') + '&' +
                    'trigger_print=1&' +
                    'no_letterhead=0&' +
                    'letterhead=' + encodeURIComponent(company) + '&' +
                    'settings=' + encodeURIComponent('{}') + '&' +
                    '_lang=en';
                window.open(printUrl, '_blank');

            } catch (error) {
                console.error("Error creating invoice:", error);
                showAlert("danger", "Error", "Error creating invoice. Please try again.");
            }
        }
    };

    const handleCreateClosingEntry = async (openingEntryName: string) => {
        if (!posProfile) {
            showAlert("danger", "Error", "Please select a POS profile first.");
            return;
        }
        if (!apiKey || !apiSecret) {
            showAlert("danger", "Error", "API credentials are not available.");
            return;
        }

        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
            };

            const response = await fetch(`https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_closing_entry`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ opening_entry_name: openingEntryName }),
            });

            const result = await response.json();
            console.log("Closing entry response:", result);

            if (response.ok && result.success) {
                showAlert("success", "Success", `POS Closing Entry ${result.closing_entry} created and submitted successfully!`);
                setShowClosingEntryModal(false);
                // Optionally, refresh data or navigate
            } else {
                console.error("Failed to create POS Closing Entry:", result.error);
                showAlert("danger", "Error", `Failed to create POS Closing Entry: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error creating POS Closing Entry:", error);
            showAlert("danger", "Error", "Error creating POS Closing Entry. Please try again.");
        }
    };

    return (

        <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
            {/* Alert Component */}
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
            <ToastContainer aria-label="Notifications" />
            <div className="my-16 px-4 md:px-6">
                <PageHeader
                    parentTitle="POS"
                    parentLink="/pos"
                    title="New IPD Bill"
                    icon="../assets/icons/BriefcaseIcon.svg"
                    rightButtons={
                        <div className="flex flex-row space-x-2">
                            <Button type="secondary-button" size="button-medium" onClick={() => setShowViewPosInvoicesModal(true)}>
                                View POS Invoices
                            </Button>
                            <Button type="secondary-button" size="button-medium" onClick={logout}>
                                Logout
                            </Button>
                            <Button type="danger-button" size="button-medium" onClick={clearPatient}>
                                Clear Patient
                            </Button>
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
                            patientData={patientData}
                            onPatientChange={(p) => setPatientData(p)}
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
                        posProfile={posProfile || undefined}
                        onRecordPayments={(data) => {
                            setRecordedPayments(data.payments || []);
                        }}
                    />
                </div>

                {/* Right Panel - Item Details */}
                <div className="flex-1 min-w-0 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 overflow-x-auto">
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                                <RenderFormElement
                                    inputType="select"
                                    value={selectedSaleType}
                                    onChange={setSelectedSaleType}
                                    data={classificationTypeOptions}
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
                                    // showAlert={showAlert}
                                    selectedClassification={selectedSaleType}
                                    isGeneric={isGeneric}
                                    className="pt-2"// Pass getBatchQty as a prop
                                />

                                <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <Checkbox id="terms" checked={isGeneric} onCheckedChange={(checked) => setIsGeneric(checked === true)} />
                                    <Label htmlFor="terms">Generic</Label>
                                    <Button type="primary-button" size="button-medium" onClick={() => {
                                        console.log('Patient Requisition button clicked');
                                        setShowPatientRequisitionList(true)
                                        console.log('showPatientRequisitionList', showPatientRequisitionList);
                                    }
                                    }>
                                        Patient Requisition
                                    </Button>
                                    <Button type="primary-button" size="button-medium" onClick={() => setShowPrescriptionList(true)}>
                                        Prescription
                                    </Button>
                                    <Button
                                        type="primary-button"
                                        size="button-medium"
                                        onClick={() => setShowDocumentUpload(true)}
                                    >
                                        Upload
                                    </Button>
                                    {/* IPD Effect Checkbox */}
                                    <div className="flex items-center gap-2 pl-2">
                                        <Checkbox
                                            id="ipd-effect"
                                            checked={isIpdEffect}
                                            onCheckedChange={(checked) => setIsIpdEffect(checked === true)}
                                        />
                                        <Label
                                            htmlFor="ipd-effect"
                                            className="text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap"
                                        >
                                            IPD Effect
                                        </Label>
                                    </div>
                                </div>

                                <RenderFormElement
                                    inputType="select"
                                    value={selectedKit}
                                    onChange={handleSelectKit}
                                    data={kitOptions}
                                    placeholder="Select Kit"
                                />

                                {/* Global Discount Input */}
                                <div className="flex flex-row items-center gap-3">
                                    <Label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Discount %:</Label>
                                    <Input
                                        type="number"
                                        value={globalDiscountPercent}
                                        onChange={(e) => setGlobalDiscountPercent(parseFloat(e.target.value) || 0)}
                                        placeholder="Enter discount %"
                                        className="w-32 text-sm"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                    <Button
                                        type="primary-button"
                                        size="button-small"
                                        onClick={handleApplyGlobalDiscount}
                                        className="whitespace-nowrap"
                                    >
                                        Apply Discount
                                    </Button>

                                    {/* Transaction Type Toggle*/}
                                    <div className="flex items-center gap-2 ml-2">
                                        <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Transaction Type:</Label>
                                        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 gap-1">
                                            <button
                                                onClick={() => setTransactionType('cash')}
                                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${transactionType === 'cash'
                                                    ? 'bg-blue-500 text-white shadow-sm'
                                                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Cash
                                            </button>
                                            <button
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


                                    {/* <span className="text-xs text-gray-500">This will apply {globalDiscountPercent}% discount to all items</span> */}
                                    <div className="w-full mt-0 pt-0 sm:w-auto flex-1 min-w-[150px]">
                                        <RenderFormElement
                                            inputType="input"
                                            InputValueType="text"
                                            value={toLocation}
                                            onChange={setToLocation}
                                            placeholder="Barcode"
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
                                selectedWarehouse={selectedWarehouse}
                                calculateItemTaxAndTotals={calculateItemTaxAndTotals}
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
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full min-h-16 px-4 md:px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-y border-[#D9D9E0] bg-white z-10">
                <div className="w-full sm:w-fit h-fit flex items-center gap-4 justify-center sm:justify-start">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Image
                                src="/assets/icons/DotsVertical.svg"
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
                    <Button type="secondary-button" size="button-medium">Preview & Print</Button>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center sm:justify-end text-[#60646C] text-xs font-normal w-full sm:w-auto">
                    <Button type="secondary-button" size="button-medium">Reset</Button>
                    <Button type="primary-outlined-button" size="button-medium" onClick={handleSaveAsDraft}>
                        Save as Draft
                    </Button>
                    <Button type="primary-outlined-button" size="button-medium" onClick={() => setShowSelectInvoiceModal(true)}>
                        Return Bill
                    </Button>
                    <Button type="primary-button" size="button-medium" onClick={() => setShowClosingEntryModal(true)}>
                        Closing Entry
                    </Button>
                    <Button type="primary-button" size="button-medium" onClick={handleFinalizeAndPrint}>
                        {loadedInvoiceName && loadedInvoiceDocstatus === 0 ? 'Submit and Print' : 'Finalize and Print'}
                    </Button>
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

            {showDocumentUpload && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-100">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
                        <Document setOpen={setShowDocumentUpload} />
                    </div>
                </div>
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
                    onSelect={(invoice) => {
                        setSelectedInvoiceForReturn(invoice);
                        setShowSelectInvoiceModal(false);
                        setShowCreateReturnModal(true);
                    }}
                />
            )}

            {showCreateReturnModal && selectedInvoiceForReturn && (
                <CreateReturnEntryModal
                    isOpen={showCreateReturnModal}
                    onClose={() => setShowCreateReturnModal(false)}
                    invoice={selectedInvoiceForReturn}
                    onSubmit={async (returnData) => {
                        try {
                            const response = await fetch('https://192.168.7.221:4422/api/method/quantbit_hims_integration.quantbit_hims_integration.api.create_pos_invoice_return', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `token ${apiKey}:${apiSecret}`,
                                },
                                body: JSON.stringify(returnData),
                            });
                            const result = await response.json();
                            if (response.ok) {
                                showAlert('success', 'Success', 'Return invoice created successfully.');
                                setShowCreateReturnModal(false);
                            } else {
                                throw new Error(result.message || 'Failed to create return invoice');
                            }
                        } catch (error: any) {
                            showAlert('danger', 'Error', error.message);
                        }
                    }}
                />
            )}

            {/* New View POS Invoices Modal */}
            {showViewPosInvoicesModal && (
                <ViewPosInvoicesModal
                    isOpen={showViewPosInvoicesModal}
                    onClose={() => setShowViewPosInvoicesModal(false)}
                    posProfile={posProfile}
                    showAlert={showAlert}
                    onLoadInvoice={handleLoadInvoice}
                />
            )}

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

