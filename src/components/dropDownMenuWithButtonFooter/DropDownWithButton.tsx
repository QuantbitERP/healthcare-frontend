"use client";
import { Fragment, useState } from "react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

// interface MenuItem {
//   label: string;
//   value: string;
// }

interface DropdownMenuGroup {
  title: string;
  items: string[];
}

interface DropDownWithButtonProps {
  trigger: React.ReactNode;
  menuRendering: DropdownMenuGroup[];
}

export function DropDownWithButton({ trigger, menuRendering }: DropDownWithButtonProps) {
  const allItems = menuRendering.flatMap((group) => group.items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleToggleAll = () => {
    setSelectedItems((prev) =>
      prev.length === allItems.length ? [] : allItems
    );
  };

  const handlePrint = () => {
    console.log("Printing selected items:", selectedItems);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 m-2 px-0 py-2">
        {/* Select All */}
        <div className="flex items-center px-4 py-1.5 text-[#1C2024] hover:text-[#0D74CE] outline-none transition-colors focus:bg-secondary-hover cursor-pointer hover:bg-secondary-hover"
          tabIndex={0}>
          <Checkbox
            checked={selectedItems.length === allItems.length}
            onCheckedChange={handleToggleAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="ml-4 text-sm">
            All
          </label>
        </div>

        <div className="flex items-center">
          {menuRendering.map((group) => (
            <Fragment key={group.title}>
              {group.title.length > 0 && (
                <DropdownMenuLabel className="font-normal text-text-secondary text-xs px-4">
                  {group.title}
                </DropdownMenuLabel>
              )}
              <DropdownMenuGroup>
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className="flex items-center space-x-2 cursor-pointer px-4 rounded-none"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item)}
                      onCheckedChange={() => handleToggleItem(item)}
                      id={item}
                    />
                    <label htmlFor={item} className="text-sm cursor-pointer">
                      {item}
                    </label>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </Fragment>
          ))}
        </div>

        {/* Print Button */}
        <div className="px-2 pt-1">
          <Button className="w-2/4" variant="outline" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
