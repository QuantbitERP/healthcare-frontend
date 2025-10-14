"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const avatarColors = [
  "bg-[#0090FF]",
  "bg-[#3358D4]",
  "bg-[#EF5F00]",
  "bg-[#0797B9]",
  "bg-[#12A594]",
  "bg-[#C2298A]",
  "bg-[#EC9455]",
  "bg-[#641723]",
  "bg-[#E5484D]",
];

// Avatar Component
const Avatar = React.forwardRef<HTMLElement, React.ComponentProps<typeof AvatarPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

// AvatarImage Component
const AvatarImage = React.forwardRef<HTMLImageElement, React.ComponentProps<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// AvatarFallback Component
const AvatarFallback = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof AvatarPrimitive.Fallback>>(
  ({ className, children, ...props }, ref) => {
    const [bgColor, setBgColor] = React.useState("bg-gray-300"); // Default color

    React.useEffect(() => {
      const randomColor =
        avatarColors[Math.floor(Math.random() * avatarColors.length)];
      setBgColor(randomColor);
    }, []);

    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          "flex w-full items-center justify-center rounded-full",
          bgColor,
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Fallback>
    );
  }
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
