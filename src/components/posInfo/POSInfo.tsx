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
          `https://gmcerp.quantcloud.in/api/resource/Warehouse/${warehouse}`,
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
    <div className={`flex items-center gap-2 text-sm font-medium text-white ${className}`}>
      {posProfile && (
        <div className="flex items-center gap-1">
          <span className="text-white">{posProfile}</span>
          {warehouse && <span className="text-white/70">•</span>}
        </div>
      )}
      {warehouse && (
        <div className="flex items-center gap-1">
          <span className="text-white/90">({warehouseName})</span>
        </div>
      )}
    </div>
  );
}

export default POSInfo;
