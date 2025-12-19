import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/userProfile/UserProfile";
import POSInfo from "@/components/posInfo/POSInfo";
import { useAuth } from "@/context/AuthContext";

interface PageHeaderProps {
  title: string;
  icon: string;
  rightButtons?: React.ReactNode;
  parentTitle?: string;
  parentLink?: string;
  posProfile?: string;
  warehouse?: string;
}

interface SearchSuggestion {
  label: string;
  route: string;
  icon: string;
  type?: 'page' | 'doctype' | 'document';
}

function PageHeader(props: PageHeaderProps) {
  const { title, icon, rightButtons } = props;
  const router = useRouter();
  const { apiKey, apiSecret, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define available pages for search
  const availablePages: SearchSuggestion[] = [
    { label: 'OPD', route: '/new_bill', icon: '🏥', type: 'page' },
    { label: 'IPD', route: '/ipd_bill', icon: '🛏️', type: 'page' },
    { label: 'Patient Requisition', route: '/PR', icon: '📋', type: 'page' },
    { label: 'Patient Requisition List', route: '/PatientRequistionList', icon: '📑', type: 'page' },
    { label: 'Return', route: '/return', icon: '↩️', type: 'page' },
    { label: 'Home', route: 'https://192.168.7.196/Home', icon: '🏠', type: 'page' },
    { label: 'ERP', route: 'https://192.168.7.196/Home', icon: '🏢', type: 'page' },
  ];

  // Search Frappe for pages and documents
  const searchFrappe = async (query: string): Promise<SearchSuggestion[]> => {
    if (!isAuthenticated || !apiKey || !apiSecret) {
      return [];
    }

    try {
      const frappeResults: SearchSuggestion[] = [];

      // Search for Frappe pages/modules
      try {
        const response = await fetch(
          `https://192.168.7.221:4422/api/method/frappe.client.get_list?doctype=Page&filters=[["name","like","%${query}%"]]&fields=["name","title"]&limit_page_length=5`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `token ${apiKey}:${apiSecret}`,
            },
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.message && Array.isArray(data.message)) {
            data.message.forEach((page: any) => {
              frappeResults.push({
                label: page.title || page.name,
                route: `https://192.168.7.221:4422/app/${page.name.toLowerCase().replace(/ /g, '-')}`,
                icon: '📄',
                type: 'page',
              });
            });
          }
        }
      } catch (error) {
        console.error('Error searching Frappe pages:', error);
      }

      // Search for documents across common doctypes
      const doctypes = ['Customer', 'Supplier', 'Item', 'Sales Invoice', 'Purchase Order', 'Patient', 'GRN'];

      for (const doctype of doctypes) {
        try {
          const response = await fetch(
            `https://192.168.7.221:4422/api/method/frappe.client.get_list?doctype=${doctype}&filters=[["name","like","%${query}%"]]&fields=["name"]&limit_page_length=3`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${apiKey}:${apiSecret}`,
              },
              credentials: 'include',
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.message && Array.isArray(data.message)) {
              data.message.forEach((doc: any) => {
                frappeResults.push({
                  label: `${doc.name} (${doctype})`,
                  route: `https://192.168.7.221:4422/app/${(doctype.toLowerCase().replace(/ /g, '-') === 'grn' ? 'purchase-receipt' : doctype.toLowerCase().replace(/ /g, '-'))}/${doc.name}`,
                  icon: '📋',
                  type: 'document',
                });
              });
            }
          }
        } catch (error) {
          console.error(`Error searching ${doctype}:`, error);
        }
      }

      return frappeResults;
    } catch (error) {
      console.error('Error in Frappe search:', error);
      return [];
    }
  };

  // Handle search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    } else {
      // Filter local pages based on search query
      const localFiltered = availablePages.filter(page =>
        page.label.toLowerCase().includes(query)
      );

      // Debounce Frappe search
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const frappeResults = await searchFrappe(query);

        // Combine local and Frappe results, prioritizing local pages
        const combined = [...localFiltered, ...frappeResults];

        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
        setIsSearching(false);
      }, 300);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (route: string) => {
    // Check if it's an external URL
    if (route.startsWith('http')) {
      window.location.href = route;
    } else {
      // Check if this is a return-related search and redirect to return page
      if (route.toLowerCase().includes('return') || route.toLowerCase().includes('invoice')) {
        router.push('/return');
      } else {
        router.push(route);
      }
    }
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex].route);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{}} className="flex justify-between items-center p-md border-b border-[#D9D9E0] fixed top-0 right-0 bg-white w-full z-50 " >
      <div className="flex space-x-2 items-center">
        <Image src={icon} alt="Rupee icon" width={24} height={24} />
        {props.parentLink && props.parentTitle ? (
          <>
            <Link
              href={props.parentLink}
              className="font-bold text-lg text-primary "
            >
              {props.parentTitle}
            </Link>
            <span className="text-lg" >/</span>
          </>
        ) : null}
        <span className="font-bold cappitalize  text-lg">{title}</span>
        {(props.posProfile || props.warehouse) && (
          <>
            <span className="text-gray-300 mx-2">|</span>
            <POSInfo posProfile={props.posProfile} warehouse={props.warehouse} />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search: Pages, Items, Patients, Invoices..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-64 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            {isSearching && (
              <div className="animate-spin">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
            )}
            {searchQuery && !isSearching && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.route}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.route)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${index === selectedIndex
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                    } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{suggestion.label}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{suggestion.route.substring(0, 50)}...</span>
                      {suggestion.type && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${suggestion.type === 'page' ? 'bg-blue-100 text-blue-700' :
                            suggestion.type === 'document' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {suggestion.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {isSearching && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 z-50">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                Searching...
              </div>
            </div>
          )}

          {/* No results message */}
          {showSuggestions && suggestions.length === 0 && searchQuery && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 z-50">
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {rightButtons}
        <UserProfile />
      </div>
    </div>
  );
}

export default PageHeader;
