import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the prop types for the Checkbox component
interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {
  className?: string;
}

// Define the Checkbox component with proper typing
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-[4px] border border-zinc-200 border-zinc-400 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-secondary-hover data-[state=checked]:border-outlined-border",
        className
      )}
      {...props} 
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-primary-hover")}
      >
        <Check className="!h-3 !w-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

// Name the component correctly for display purposes in dev tools
Checkbox.displayName = "Checkbox";

export { Checkbox };
