import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface DropdownProps {
  reasons?: { key: string; value: string }[];
  showButton?: boolean;
  showSearch?: boolean;
  buttonText?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  reasons,
  showButton = false,
  showSearch = false,
  buttonText = "New Doctor",
  value, // controlled value from parent
  onChange, // controlled onChange from parent
  placeholder = "Select an option", // default placeholder
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [internalSelected, setInternalSelected] = useState<string>(""); // internal state for uncontrolled mode
  const [searchInput, setSearchInput] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Use controlled value if provided, else internal state
  const selectedReason = value !== undefined && value !== null ? value : internalSelected;

  // On option select
  const handleSelect = (reason: { key: string; value: string }) => {
    // Call parent's onChange if present (controlled mode)
    if (onChange) {
      onChange(reason.value);
    } else {
      // Else update internal state (uncontrolled mode)
      setInternalSelected(reason.value);
    }
    setIsOpen(false);
    setSearchInput("");
  };

  return (
    <div ref={dropdownRef} className="relative flex flex-col gap-2 text-[#1C2024] font-normal text-sm">
      {/* Dropdown button */}
      <div
        className={`relative w-[114px] h-8 flex items-center justify-between rounded-lg text-xs font-medium text-right px-2 
          ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-[#E8E8EC] cursor-pointer"}
        `}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
      >
        {/* Show selected reason or placeholder */}
        <span className="absolute right-8 truncate max-w-[80px]">
          {selectedReason || placeholder}
        </span>
        <Image
          src={'assets/icons/CaretDownFilled.svg'}
          width={16}
          height={16}
          alt="Caret Down Icon"
          className={`w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* Dropdown list */}
      {!disabled && isOpen && (
        <div className={`${className} absolute mt-11 left-0 w-[224px] max-h-48 overflow-y-auto flex flex-col bg-white border border-[#D9D9E0] rounded-lg shadow-sm z-50 overflow-hidden`}>
          {/* Search input if enabled */}
          {showSearch && (
            <div className="w-full h-fit p-2 border-b border-[#D9D9E0] flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <Image src={'assets/icons/Search.svg'} width={16} height={16} alt="Search Icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-fit appearance-none pl-2 pr-4 focus:outline-none"
                />
              </div>
              {searchInput.length > 0 && (
                <Image
                  src={'assets/icons/x.svg'}
                  width={16}
                  height={16}
                  alt="Close"
                  className="cursor-pointer"
                  onClick={() => setSearchInput("")}
                />
              )}
            </div>
          )}

          {/* Filtered reasons */}
          {reasons?.
            filter((reason) =>
              reason.value.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((reason) => (
              <div
                key={reason.key}
                className={`w-full  h-fit p-2 flex items-center bg-white hover:bg-[#E6F4FE] hover:cursor-pointer ${reason.value === selectedReason ? "bg-[#D6E9FC]" : ""
                  }`}
                onClick={() => handleSelect(reason)}
              >
                {reason.value}
              </div>
            ))}

          {/* Optional Button */}
          {showButton && (
            <div className="w-full h-fit py-2 flex items-center justify-start bg-white hover:bg-[#E6F4FE] hover:cursor-pointer rounded-[4px]">
              <Image src={'assets/icons/PlusBlue.svg'} width={20} height={20} alt="Plus" className="pl-1" />
              <span className="text-[#0D74CE] text-sm font-semibold pl-2 pr-4">
                {buttonText}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
