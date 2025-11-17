"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserProfileProps {
  className?: string;
}

function UserProfile({ className = "" }: UserProfileProps) {
  const { currentUser } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!currentUser) {
    return null;
  }

  // Get the first letter of the username/email
  const initial = currentUser.charAt(0).toUpperCase();

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-600 transition-colors duration-200"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={currentUser}
      >
        {initial}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-12 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap z-50">
          {currentUser}
          <div className="absolute bottom-full right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
