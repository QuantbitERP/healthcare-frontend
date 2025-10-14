import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react";


interface MenuGroup {
  title: string;
  items: string[];
}

interface BasicDropDownProps {
  trigger: React.ReactNode; 
  menuRendering: MenuGroup[];
  onItemClick?: (item: string) => void;
}

export function BasicDropDown({ trigger, menuRendering, onItemClick }: BasicDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 px-0 pt-0 pb-2" align="end">
        {menuRendering.map((group) => (
          <Fragment key={group.title}>
            {group.title.length ? (
              <DropdownMenuLabel className="font-normal text-text-secondary text-xs">
                {group.title}
              </DropdownMenuLabel>
            ) : (
              <></>
            )}
            <DropdownMenuGroup>
              {group.items.map((item) => (
                <DropdownMenuItem 
                  key={item} 
                  className="rounded-none"
                  onClick={() => onItemClick?.(item)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
