import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/userProfile/UserProfile";
import POSInfo from "@/components/posInfo/POSInfo";

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
}

function PageHeader(props: PageHeaderProps) {
  const { title, icon, rightButtons } = props;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Define available pages for search
  const availablePages: SearchSuggestion[] = [
    { label: 'OPD', route: '/new_bill', icon: '🏥' },
    { label: 'IPD', route: '/ipd_bill', icon: '🛏️' },
    { label: 'Patient Requisition', route: '/PR', icon: '📋' },
    { label: 'Patient Requisition List', route: '/PatientRequistionList', icon: '📑' },
    { label: 'Home', route: 'https://192.168.7.196/Home', icon: '🏠' },
    { label: 'ERP', route: 'https://192.168.7.196/Home', icon: '🏢' },
  ];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);

    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      // Filter pages based on search query
      const filtered = availablePages.filter(page =>
        page.label.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (route: string) => {
    // Check if it's an external URL
    if (route.startsWith('http')) {
      window.location.href = route;
    } else {
      router.push(route);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              placeholder="Search: Pages, For Home type home"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-64 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
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
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.route}
                  onClick={() => handleSuggestionClick(suggestion.route)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{suggestion.label}</div>
                    <div className="text-xs text-gray-500">{suggestion.route}</div>
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {showSuggestions && suggestions.length === 0 && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500 z-50">
              No pages found for &quot;{searchQuery}&quot;
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
