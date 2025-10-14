import React from "react";
import Image from "next/image";
import "./Alerts.css";

type AlertVariant = "success" | "warning" | "danger" | "primary" | "secondary";

interface AlertsProps {
  heading?: string;
  content?: string;
  buttonText?: string;
  variant?: AlertVariant;
  showCloseIcon?: boolean;
  showButton?: boolean;
  onClick?: () => void;
  className?: string;
  open?: boolean;
  disappear?: boolean;
}

const Alerts: React.FC<AlertsProps> = ({
  heading = "Alert title",
  content = "Alert content",
  buttonText = "Button",
  variant = "success",
  showCloseIcon = false,
  showButton = false,
  onClick,
  className = "",
  open = true,
  disappear = true,
}) => {
  const getInfoIcon = (): string => {
    switch (variant) {
      case "success":
        return "/assets/icons/InfoCircleSuccess.svg";
      case "warning":
        return "/assets/icons/InfoCircleWarning.svg";
      case "danger":
        return "/assets/icons/InfoCircleDanger.svg";
      case "primary":
        return "/assets/icons/InfoCirclePrimary.svg";
      case "secondary":
      default:
        return "/assets/icons/InfoCircleSecondary.svg";
    }
  };

  return (
    <div
      className={`alert ${variant} flex flex-row items-center justify-between h-fit flex-grow ${className} mt-md mb-0 transition-opacity duration-300 ${disappear && (open ? "block opacity-100" : "opacity-0")
        }`}
    >
      <div className="flex flex-row">
        <Image
          src={getInfoIcon()}
          alt="Circle"
          width={24}
          height={24}
          className="rounded-lg"
        />
        <div className="px-2 flex flex-row gap-2">
          <div className="font-medium flex items-center">{heading}</div>
          <div className="font-normal flex items-center">{content}</div>
        </div>
      </div>
      <div className="flex flex-row items-center">
        {showButton && (
          <button
            className="font-medium w-fit h-fit px-2 cursor-pointer"
            onClick={onClick}
          >
            {buttonText}
          </button>
        )}
        {showCloseIcon && (
          <button
            className="font-medium w-fit h-fit px-2 cursor-pointer"
            onClick={onClick}
          >
            <Image
              src="/assets/icons/x.svg"
              alt="close"
              width={24}
              height={24}
              className="p-1 rounded-lg"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alerts;
