import React from "react";

// Define types for props
interface StatusBadgeProps {
  variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "cyan" | "disabled"; 
  text: string | null | undefined;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, text }) => {
  const variantClassMapper = (variant: StatusBadgeProps['variant']) => {
    switch (variant) {
      case "primary":
        return "bg-badge-yellow text-text-link";
      case "secondary":
        return "bg-badge-secondary text-text-pink";
      case "danger":
        return "bg-badge-danger text-text-destructive";
      case "warning":
        return "bg-badge-warning text-text-warning";
      case "success":
        return "bg-badge-success text-text-success";
      case "cyan":
        return "bg-badge-cyan text-text-cyan";
      case "disabled":
        return "bg-badge-disabled text-text-primary";
      default:
        return "bg-badge-disabled text-text-primary";
    }
  };

  return (
    <div
      className={`py-xs px-sm w-fit rounded-lg text-xs ${variantClassMapper(variant)}`}
    >
      {text}
    </div>
  );
};

export default StatusBadge;
