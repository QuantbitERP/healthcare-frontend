'use client';
import React, { useEffect, useState, useRef } from "react";
import { Search, X, Plus } from 'lucide-react';

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
}

interface ItemSearchProps {
  onSelectItem: (item: Item) => void;
  placeholder?: string;
  className?: string;
  selectedClassification?: string;
  isGeneric?: boolean;
}

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

  const API_BASE_URL = '/api/resource';

  const searchItems = async (query: string): Promise<Item[]> => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      const storedCsrfToken = localStorage.getItem('csrfToken');
      if (storedCsrfToken) {
        headers['X-Frappe-CSRF-Token'] = storedCsrfToken;
      }

      // Build filters array
      const filters = [["item_name", "like", `%${query}%`]];
      if (selectedClassification) {
        filters.push(["custom_classification", "=", selectedClassification]);
      }
      if (isGeneric) {
        filters.push(["custom_is_generic", "=", "1"]);
      }

      const response = await fetch(
        `${API_BASE_URL}/Item?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=["name","item_name","stock_uom","custom_classification","custom_is_generic"]`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Item API Response:', data); // Debug: Log the full API response

        const fetchedItems: Item[] = data.data.map((item: any, index: number) => {
          const unit = item.stock_uom || 'Unit'; // Ensure unit has a fallback
          console.log(`Mapping item: ${item.item_name}, Unit: ${unit}`); // Debug: Log each item
          return {
            id: item.name ? String(item.name.hashCode()) : String(index + Date.now()),
            itemCode: item.name || '',
            itemName: item.item_name || '',
            unit: unit,
            stockQty: '0', // Replace with actual stock fetch if needed
            reqQty: '0',
            kit: '',
            remark: '',
            expiryDate: item.end_of_life || '', // Optional: Include expiry date if needed
          };
        });
        console.log('Mapped Items:', fetchedItems); // Debug: Log the final mapped items
        return fetchedItems.slice(0, 10);
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
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await searchItems(searchTerm);
          setSuggestions(results);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
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
    console.log('Selected item:', item); // Debug: Log the selected item
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
            if (suggestions.length > 0) {
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
                            {item.unit || 'Unit'} {/* Ensure unit is displayed */}
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
              {searchTerm.length < 2
                ? 'Type at least 2 characters to search'
                : 'No items found'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedItemSearch;