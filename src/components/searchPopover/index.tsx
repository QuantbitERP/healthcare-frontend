"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";

type Item = {
  id: string;
  name: string;
};

type SearchPopoverProps = {
  label?: string;
  dataList: Item[];
  selected: Item | null;
  setSelected: (item: Item) => void;
};

export const SearchPopover: React.FC<SearchPopoverProps> = ({
  label,
  dataList,
  selected,
  setSelected,
}) => {
  const [open, setOpen] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(0);
  const [searchText, setSearchText] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredList = dataList.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 >= filteredList.length ? 0 : prev + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev - 1 < 0 ? filteredList.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        const selectedItem = filteredList[highlightIndex];
        if (selectedItem) {
          setSelected(selectedItem);
          setSearchText(selectedItem.name);
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setOpen(true);
    setHighlightIndex(0);
  };

  React.useEffect(() => {
    if (!open && selected) {
      setSearchText(selected.name);
    }
  }, [selected, open]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <input
          ref={inputRef}
          type="text"
          placeholder={label || "Search..."}
          value={searchText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={0}
          align="start"
          className="w-full min-w-56 rounded-t-xl border border-gray-200 bg-white shadow-md z-50"
          onOpenAutoFocus={(e) => e.preventDefault()} // ✅ prevent input blur
          onCloseAutoFocus={(e) => e.preventDefault()} // ✅ prevent focus jump
        >
          <ul className="divide-y divide-gray-100 max-h-60 overflow-auto">
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setSelected(item);
                    setSearchText(item.name);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    index === highlightIndex
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-sm">
                No results found.
              </li>
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
