"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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
      if (!warehouse || !apiKey || !apiSecret) {
        setWarehouseName(warehouse || "");
        return;
      }

      try {
        const response = await fetch(
          `http://192.168.1.30:4414/api/resource/Warehouse/${warehouse}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${apiKey}:${apiSecret}`,
            },
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
