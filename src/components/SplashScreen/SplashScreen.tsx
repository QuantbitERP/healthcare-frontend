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

export const QuantumLoader = ({ size = 120 }: { size?: number }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        .quantum-loader-wrapper {
          width: 90px;
          height: 90px;
          position: relative;
          perspective: 500px;
          transform-style: preserve-3d;
          transform: scale(${size / 90});
          transform-origin: center center;
        }
        .quantum-ring {
          position: absolute;
          inset: 0;
          border: 2.5px solid transparent;
          border-radius: 50%;
          animation-duration: 2.4s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          box-sizing: border-box;
        }
        .quantum-ring-1 {
          border-top-color: #3b82f6;
          border-bottom-color: rgba(59, 130, 246, 0.3);
          transform: rotateX(55deg) rotateY(15deg);
          animation-name: quantum-spin-1;
          filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));
        }
        .quantum-ring-2 {
          border-left-color: #3b82f6;
          border-right-color: rgba(59, 130, 246, 0.2);
          transform: rotateX(30deg) rotateY(-45deg);
          animation-name: quantum-spin-2;
          animation-duration: 1.8s;
          filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));
        }
        .quantum-ring-3 {
          border-top-color: #3b82f6;
          border-left-color: rgba(59, 130, 246, 0.4);
          transform: rotateX(60deg) rotateY(60deg);
          animation-name: quantum-spin-3;
          animation-duration: 3s;
          filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.5));
        }
        .quantum-core {
          position: absolute;
          width: 14px;
          height: 14px;
          background-color: #3b82f6;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 15px #3b82f6, 0 0 25px rgba(59, 130, 246, 0.8);
          animation: quantum-pulse 1.5s infinite ease-in-out;
        }
        @keyframes quantum-spin-1 {
          0% { transform: rotateX(55deg) rotateY(15deg) rotateZ(0deg); }
          100% { transform: rotateX(55deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes quantum-spin-2 {
          0% { transform: rotateX(30deg) rotateY(-45deg) rotateZ(360deg); }
          100% { transform: rotateX(30deg) rotateY(-45deg) rotateZ(0deg); }
        }
        @keyframes quantum-spin-3 {
          0% { transform: rotateX(60deg) rotateY(60deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(60deg) rotateZ(360deg); }
        }
        @keyframes quantum-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
      <div className="quantum-loader-wrapper">
        <div className="quantum-ring quantum-ring-1"></div>
        <div className="quantum-ring quantum-ring-2"></div>
        <div className="quantum-ring quantum-ring-3"></div>
        <div className="quantum-core"></div>
      </div>
    </div>
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
      <QuantumLoader size={120} />
    </div>
  );
};

export default SplashScreen;