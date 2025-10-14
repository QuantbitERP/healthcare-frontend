import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KVPair } from '@/services/api-client';
interface SearchableSelectProps {
  searchValue?: string;
  selectedValue?: string;
  onSearchChange?: (value: string) => void;
  onSelectionChange?: (value: string) => void;
  placeholder?: string;
  items:KVPair[];
  onApiSearch?: (query: string) => Promise<string[]>;
}
function SearchableSelect({
  searchValue = "",
  selectedValue = "",
  onSearchChange,
  onSelectionChange,
  placeholder = "Select ",
  items,
}: SearchableSelectProps) {
  const [search, setSearch] = useState(searchValue);
  const [, setSelected] = useState(selectedValue);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Show API results if searched, otherwise show local items
  
 

  // Sync with parent component props
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  // Focus search input when it appears
  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  // Maintain focus when filtered items change
  useEffect(() => {
    if (search && searchInputRef.current && isOpen) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    }
  }, [search, isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange?.(value);
    // Always open dropdown when typing
    if (!isOpen) {
      setIsOpen(true);
    }
    // Keep focus on input after filtering
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (search.trim()) {
      }
    }
  };

  const handleSelectChange = (value: string) => {
    setSelected(value);
    setSearch('');
    setShowSearchInput(false);
    setIsOpen(false);
    setHasSearched(false);
    onSelectionChange?.(value);
    onSearchChange?.('');
  };

  const handleSelectOpen = () => {
    setShowSearchInput(true);
    setIsOpen(true);
  };

  // Get the display value for the selected item
  const getSelectedDisplayValue = () => {
    if (!selectedValue) return placeholder;
    const selectedItem = items.find(item => item.key === selectedValue);
    return selectedItem?.value || placeholder;
  };

  return (
    <div className="flex flex-col gap-2">
      <Select 
        value={selectedValue} 
        onValueChange={handleSelectChange}
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            setShowSearchInput(true);
            setTimeout(() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }, 100);
          } else {
            // Only clear search if dropdown is being closed intentionally
            if (!search) {
              setShowSearchInput(false);
              setSearch('');
            }
          }
        }}
      >
        <SelectTrigger 
          className="w-full min-h-[2.5rem] h-auto" 
          onClick={handleSelectOpen}
        >
          <SelectValue 
            placeholder={selectedValue ? getSelectedDisplayValue() : placeholder}
            className="whitespace-normal break-words"
          >
            {selectedValue ? getSelectedDisplayValue() : placeholder}
          </SelectValue>
          <Image src={'/assets/icons/CaretDownDark.svg'} height={16} width={16} alt="caret icon" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-[400px] max-w-[400px] border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0 z-[300] max-h-[300px] flex flex-col">
          {/* Search input inside dropdown - sticky at top */}
          <div className="flex items-center border-b border-b-[#D9D9E0] px-3 sticky top-0 bg-white z-10" cmdk-input-wrapper="">
            <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={"Search..."}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
              
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {
                // Keep dropdown open when focusing on search input
                setIsOpen(true);
              }}
              onBlur={(e) => {
                // Only close if clicking outside the entire dropdown
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('[data-radix-select-content]')) {
                  // Don't close immediately, let user continue typing
                  setTimeout(() => {
                    // Only close if no search text and not actively typing
                    if (!search && !isOpen) {
                      setIsOpen(false);
                    }
                  }, 300);
                }
              }}
            />
          </div>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {/* Filtered items */}
            {
               items.length > 0 ? (
              items.map((item,index) => (
                <SelectItem 
                  key={index} 
                  value={item.key || ''}
                  className="h-9 cursor-pointer w-full px-4 py-2 flex text-[#1C2024] text-sm hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] whitespace-normal break-words min-h-[2.5rem] h-auto"
                >
                  {item.value}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-[#60646C]">
                No results found.
              </div>)
              }
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SearchableSelect;