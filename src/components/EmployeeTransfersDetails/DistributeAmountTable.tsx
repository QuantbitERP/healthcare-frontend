"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Dropdown from "../dropdownForPatientCard/Dropdown";

interface LabelValue {
  label: string;
  value: string;
}

const patientCategories = [
  { label: "OPD", value: "OPD" },
  { label: "IPD", value: "IPD" },
];

export function DistributeDataTable({ employeeData }) {
  const [fromVisitType, setFromVisitType] = useState("");
  const [toVisitType, setToVisitType] = useState("");
  const [transferAmount, setTransferAmount] = useState("37000");

  const dataAmountAccumulated: LabelValue[] = [
    { label: "OPD", value: "₹" + (employeeData.opd || 0) },
    { label: "IPD", value: "₹" + (employeeData.ipd || 0) },
    { label: "Total Available Limit", value: "₹" + (employeeData.total || 0) },
  ];

  return (
    <div>
      <div className="flex justify-between items-center py-md">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Manage Limits</h2>
          <p className="text-sm text-gray-500">
            Explore the specifics regarding the maximum transfer limits for
            various transactions.
          </p>
        </div>
      </div>
      <div className="relative w-full border border-[#CDCED6] rounded-t-lg overflow-x-auto bg-white rounded-lg">
        <div className="relative flex flex-col">
          {/* Row 1: From Visit Type */}
          <div className="grid grid-cols-[2fr_2fr] items-center gap-4 border-b border-[#CDCED6]">
            <div className="font-medium text-sm text-[#1C2024] border-r border-[#CDCED6] flex items-center h-full px-4 py-2">
              From Visit Type
            </div>
            <div className="flex items-center justify-end h-full py-2">
              <Dropdown
                reasons={patientCategories.map((cat) => ({
                  key: cat.label,
                  value: cat.value,
                }))}
                value={fromVisitType}
                onChange={setFromVisitType}
                placeholder="Select"
              />
            </div>
          </div>

          {/* Row 2: To Visit Type */}
          <div className="grid grid-cols-[2fr_2fr] items-center gap-4 border-b border-[#CDCED6]">
            <div className="font-medium text-sm text-[#1C2024] border-r border-[#CDCED6] flex items-center h-full px-4 py-3">
              To Visit Type
            </div>
            <div className="flex items-center justify-end h-full  py-2">
              <Dropdown
                reasons={patientCategories.map((cat) => ({
                  key: cat.label,
                  value: cat.value,
                }))}
                value={toVisitType}
                onChange={setToVisitType}
                placeholder="Select"
                className="w-[110px]"
              />
            </div>
          </div>

          {/* Row 3: Available Limit */}
          <div className="grid grid-cols-[2fr_2fr] items-center gap-4 border-b border-[#CDCED6]">
            <div className="font-medium text-sm text-[#1C2024] border-r border-[#CDCED6] flex items-center h-full px-4 py-3">
              Available Limit (From Category)
            </div>
            <span className="text-right px-2 text-sm text-[#8B8D98]">
              ₹50,000
            </span>
          </div>

          {/* Row 4: Transfer Amount */}
          <div className="grid grid-cols-[2fr_2fr] items-center gap-4">
            <div className="font-medium text-sm text-[#1C2024] border-r border-[#CDCED6] flex items-center h-full px-4 py-3">
              Transfer Amount
            </div>
            <div className="px-2">
              <Input
                className="w-full text-right outline-none border-none focus:ring-0 pr-2"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-[344px] h-[150px] bg-[#F9F9FB] mt-8 rounded-md p-4 flex flex-col justify-between ml-auto">
        <span className="text-[#1C2024] text-sm font-bold">
          Available Limit
        </span>
        {dataAmountAccumulated.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-[#1C2024]"
          >
            <span>{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
