import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "@/components/splitButton/splitButton.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the types for the props
interface SplitButtonProps {
  type?: "primary-button" | "danger-button" | "secondary-button" | "primary-outlined-button";
  size?: "small" | "medium" | "large";
  listItems?: string[];
  listHeader?: string;
  buttonText: string;
  onClick?: () => void;
  onItemClick?: () => void;
  className?: string;
}

const SplitButton: React.FC<SplitButtonProps> = ({
  type = "primary-button",
  size = "medium",
  listItems = ["CompanyDetails", "Print"],
  listHeader = "Print",
  buttonText,
  onClick,
  onItemClick,
  className,
}) => {
  const iconSrc =
    type === "primary-button" || type === "danger-button"
      ? '/assets/icons/ArrowUp.svg'
      : type === "secondary-button"
      ? '/assets/icons/Up.svg'
      : type === "primary-outlined-button"
      ? '/assets/icons/Up.svg'
      : '/assets/icons/ArrowUp.svg';

  return (
    <div className={cn("button", `${type}-ring`, size, className)} tabIndex={0}>
      <div className={cn("button-left", `${type}-left`, `${size}-left`)} onClick={onClick}>
        {buttonText}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={cn("button-right", `${type}-right`, `${size}-right`, className)}>
            <Image src={iconSrc} alt="^" width={16} height={16} className="p-0" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8} className="px-0 py-2 w-fit h-fit border border-[#D9D9E0]">
          <DropdownMenuLabel className="text-[#60646C] text-xs font-normal">{listHeader}</DropdownMenuLabel>
          {listItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => onItemClick?.()}
              className="h-9 flex items-center pl-2 pr-4 hover:bg-[#E6F4FE] hover:text-[#0D74CE] rounded-none"
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SplitButton;
