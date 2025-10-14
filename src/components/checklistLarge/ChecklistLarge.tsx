import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChecklistLargeProps {
  showSearch?: boolean;
  items?: string[];
}

const ChecklistLarge: React.FC<ChecklistLargeProps> = ({
  showSearch = true,
  items = [
    "Rohan Patil",
    "Ananya Iyer",
    "Meera Kapoor",
    "Yash Rao",
    "Suman Mane",
    "Meeera Kapoor",
    "Kavya Nair",
  ],
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSelectAll = () => {
    const newCheckedState = !selectAll;
    const updatedCheckedItems: Record<string, boolean> = {};
    items.forEach((item) => {
      updatedCheckedItems[item] = newCheckedState;
    });
    setCheckedItems(updatedCheckedItems);
  };

  useEffect(() => {
    const allChecked =
      items.length > 0 && items.every((item) => checkedItems[item]);
    setSelectAll(allChecked);
  }, [checkedItems, items]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-fit h-10 p-2 border border-black rounded-lg">
          Toggle checklist
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none">
        <div className="w-[368px] h-fit rounded-lg bg-[#FFF] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)]">
          {showSearch && (
            <div className="w-full rounded-t-lg px-4 py-3 border border-[#D9D9E0] border-b-0 flex flex-row justify-between">
              <div className="flex flex-row">
                <Image src={'/assets/icons/SearchIcon.svg'} width={16} height={16} alt="Search" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-fit h-full appearance-none outline-none border-none pl-2 pr-4 text-[#60646C] text-xs font-normal"
                />
              </div>
              <Image
                src={'/assets/icons/CloseIcon.svg'}
                width={16}
                height={16}
                alt="Close"
                onClick={() => setOpen(false)}
              />
            </div>
          )}

          <div
            className={`border border-[#D9D9E0] p-2 ${
              showSearch ? "rounded-b-lg" : "rounded-lg"
            }`}
          >
            <div className="cursor-pointer w-full h-fit p-2 flex flex-row rounded text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm">
              <input
                type="checkbox"
                className="border border-[#B9BBC6] cursor-pointer"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label
                className="pl-2 pr-4 cursor-pointer"
                onClick={handleSelectAll}
              >
                All
              </label>
            </div>

            {items.map((item) => (
              <div
                key={item}
                className="checklist cursor-pointer w-full h-fit flex flex-row rounded text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm p-2"
              >
                <input
                  type="checkbox"
                  checked={checkedItems[item] || false}
                  onChange={() => handleCheckboxChange(item)}
                  className="border border-[#B9BBC6] cursor-pointer"
                />
                <label
                  className="pl-2 pr-4 cursor-pointer"
                  onClick={() => handleCheckboxChange(item)}
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChecklistLarge;
