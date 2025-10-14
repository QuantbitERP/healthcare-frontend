import * as React from "react";
import { cn } from "@/lib/utils";
import { JSX } from "react/jsx-runtime";

// Generic HTML element props
type TableElementProps<T extends keyof JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T> & { className?: string };

// Table
const Table = React.forwardRef<HTMLTableElement, TableElementProps<"table">>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

// TableHeader
const TableHeader = React.forwardRef<HTMLElement, TableElementProps<"thead">>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref as React.RefObject<HTMLTableSectionElement>}
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

// TableBody
const TableBody = React.forwardRef<HTMLElement, TableElementProps<"tbody">>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref as React.RefObject<HTMLTableSectionElement>}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

// TableFooter
const TableFooter = React.forwardRef<HTMLElement, TableElementProps<"tfoot">>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref as React.RefObject<HTMLTableSectionElement>}
      className={cn(
        "border-t bg-zinc-100/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

// TableRow
const TableRow = React.forwardRef<HTMLTableRowElement, TableElementProps<"tr">>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b bg-white  border-[#D9D9E0]  hover:bg-secondary-hover data-[state=selected]:bg-secondary-hover",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

// TableHead
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableElementProps<"th">
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 ",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// TableCell
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableElementProps<"td">
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle text-[#1C2024] text-sm [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// TableCaption
const TableCaption = React.forwardRef<
  HTMLElement,
  TableElementProps<"caption">
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-zinc-500", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Export all
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
