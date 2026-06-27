"use client";
import React, { useEffect, useState } from "react";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `animate-spin ${className}` : "animate-spin"}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

interface SplashScreenProps {
  show: boolean;
  message?: string;
  progress?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ show, message }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto-hide after 3 seconds as requested
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
        <LoadingSpinner size={24} className="text-blue-600" />
        <p className="text-gray-700 font-medium text-sm">{message || "Loading..."}</p>
      </div>
    </div>
  );
};

export default SplashScreen;