"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/utils/sessionAuth";

interface POSInfoProps {
  posProfile?: string;
  warehouse?: string;
  className?: string;
}

function POSInfo({ posProfile, warehouse, className = "" }: POSInfoProps) {
  const [warehouseName, setWarehouseName] = useState<string>("");
  const { apiKey, apiSecret } = useAuth();

  // Fetch warehouse name if warehouse code is provided
  useEffect(() => {
    const fetchWarehouseName = async () => {
      if (!warehouse) {
        setWarehouseName("");
        return;
      }

      try {
        // Use the same authentication logic as other functions
        const authHeaders = getAuthHeaders();
        // Convert HeadersInit to plain object for fetch compatibility
        const headers = typeof authHeaders === 'string' ? 
          JSON.parse(authHeaders) : 
          Array.isArray(authHeaders) ? 
            Object.fromEntries(authHeaders) : 
            authHeaders;
        
        const response = await fetch(
          `https://192.168.7.221:4422/api/resource/Warehouse/${warehouse}`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWarehouseName(data.data?.warehouse_name || warehouse);
        } else {
          setWarehouseName(warehouse);
        }
      } catch (error) {
        console.error("Error fetching warehouse name:", error);
        setWarehouseName(warehouse);
      }
    };

    fetchWarehouseName();
  }, [warehouse, apiKey, apiSecret]);

  if (!posProfile && !warehouse) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${className}`}>
      {posProfile && (
        <div className="flex items-center gap-1">
          <span className="text-gray-600">{posProfile}</span>
          {warehouse && <span className="text-gray-400">•</span>}
        </div>
      )}
      {warehouse && (
        <div className="flex items-center gap-1">
          <span className="text-gray-500">({warehouseName})</span>
        </div>
      )}
    </div>
  );
}

export default POSInfo;
