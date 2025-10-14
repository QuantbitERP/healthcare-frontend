import React, { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Define the types for the component props
interface ScaleDropdownProps {
  items?: string[];
  showButton?: boolean;
  showSearch?: boolean;
  buttonText?: string;
  selectedItem?: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScaleDropdown: React.FC<ScaleDropdownProps> = ({
  items = ["Corporate", "General", "VIP", "Insurance"],
  showButton = false,
  showSearch = false,
  buttonText = "New Item",
  selectedItem,
  onSelect,
  placeholder = "Select an item",
  isOpen,
  onOpenChange,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    onSelect(item);
    onOpenChange(false);
    setSearchInput("");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="relative w-[114px] h-8 flex items-center justify-between rounded-lg bg-[#FFFFFF] cursor-pointer transition-transform duration-200 hover:scale-105">
            <span className="whitespace-nowrap text-[#1C2024] text-sm font-medium leading-5">{selectedItem || placeholder}</span>
            <Image
              src={'/assets/icons/CaretDownFilled.svg'}
              width={16}
              height={16}
              alt="Caret Down Icon"
              className={`transition-all duration-200 ${isOpen ? 'rotate-180' : ''} hover:scale-110`}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[224px] p-0" align="start">
          {showSearch && (
            <div className="w-full h-fit p-2 border-b border-[#D9D9E0] flex flex-row items-center">
              <Image src={'/assets/icons/Search.svg'} width={16} height={16} alt="Search Icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-fit appearance-none pl-2 pr-4 focus:outline-none text-[#1C2024] text-sm font-medium leading-5"
              />
            </div>
          )}
          {items
            .filter((item) =>
              item.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => handleSelect(item)}
                className="cursor-pointer hover:bg-[#E6F4FE] text-[#1C2024] text-sm font-medium leading-5 rounded-none"
              >
                {item}
              </DropdownMenuItem>
            ))}
          {showButton && (
            <DropdownMenuItem className="flex items-center gap-2 text-[#0D74CE] hover:bg-[#E6F4FE] text-sm font-medium leading-5">
              <Image src={'/assets/icons/PlusBlue.svg'} width={20} height={20} alt="Plus" />
              <span className="font-semibold">{buttonText}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ScaleDropdown;
