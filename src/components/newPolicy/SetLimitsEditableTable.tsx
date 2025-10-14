import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type RowData = {
  id: string;
  description: string;
  amount: number;
};

const defaultData: RowData[] = [
  { id: "opd", description: "OPD", amount: 0 },
  { id: "ipd", description: "IPD", amount: 0 },
  { id: "total", description: "Total Amount", amount: 0 },
];

interface EditableAmountTableProps {
  onDataChange: (data: { opd: number; ipd: number; total: number }) => void;
  data?: { opd?: number; ipd?: number; total?: number }; // ✅ support pre-filled data
}

const EditableAmountTable: React.FC<EditableAmountTableProps> = ({
  onDataChange,
  data,
}) => {
  const [tableData, setTableData] = useState<RowData[]>(defaultData);
  const [inputErrors, setInputErrors] = useState<boolean[]>(
    Array(defaultData.length).fill(false)
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isUpdatingFromParent = useRef(false);

  /* 🔹 Pre-fill if data prop is passed */
  useEffect(() => {
    if (data && !isUpdatingFromParent.current) {
      const opd = data.opd ?? 0;
      const ipd = data.ipd ?? 0;
      const total = data.total ?? opd + ipd;
      setTableData([
        { id: "opd", description: "OPD", amount: opd },
        { id: "ipd", description: "IPD", amount: ipd },
        { id: "total", description: "Total Amount", amount: total },
      ]);
    }
  }, [data]);

  useEffect(() => {
    inputRefs.current.forEach((input) => input?.blur());
  }, []);

  useEffect(() => {
    if (!isUpdatingFromParent.current) {
      const opd = tableData.find((e) => e.id === "opd")?.amount ?? 0;
      const ipd = tableData.find((e) => e.id === "ipd")?.amount ?? 0;
      const total = tableData.find((e) => e.id === "total")?.amount ?? 0;

      isUpdatingFromParent.current = true;
      onDataChange({ opd, ipd, total });
      
      // Reset the flag after a short delay to allow parent state to update
      const timeoutId = setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 0);

      // Cleanup timeout on unmount
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [tableData, onDataChange]);

  const handleAmountChange = (index: number, value: string) => {
    const isValid = /^\d*\.?\d*$/.test(value.trim()) && value.trim() !== "";
    const parsed = parseFloat(value);

    setInputErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = isNaN(parsed) || parsed < 0;
      return updatedErrors;
    });

    if (isValid) {
      if (!isNaN(parsed) && parsed >= 0) {
        setTableData((prev) => {
          const updated = prev.map((row, i) =>
            i === index ? { ...row, amount: parsed } : row
          );
          const total = updated[0].amount + updated[1].amount;
          updated[2] = { ...updated[2], amount: total }; // update total row
          return updated;
        });
        
        
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        inputRefs.current[index]?.blur();
      }
    }
    // const opd = tableData.find((e) => e.id === "opd")?.amount ?? 0;
    //     const ipd = tableData.find((e) => e.id === "ipd")?.amount ?? 0;
    //     const total = tableData.find((e) => e.id === "total")?.amount ?? 0;
    // onDataChange({ opd , ipd, total });
  };

  return (
    <>
      <div className="flex justify-between items-center py-xs">
        <span className="text-[#1C2024] text-lg font-semibold">Set Limits</span>
      </div>
      <div className="">
        <div className="relative border border-[#CDCED6] rounded-lg overflow-hidden">
          <Table className="w-full table-fixed border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="bg-[#F9F9FB] text-xs font-semibold text-[#60646C]">
                <TableHead className="w-[72%] px-3 py-2 border-b border-r border-[#CDCED6]">
                  Applicable For
                </TableHead>
                <TableHead className="w-[25%] px-2 py-2 text-right border-b border-[#CDCED6]">
                  Amount Limit (₹)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => {
                const isEditable = index !== tableData.length - 1;
                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "h-8 text-sm text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE]",
                      index !== tableData.length - 1
                        ? "border-b border-[#E4E4E7]"
                        : ""
                    )}
                  >
                    <TableCell className="px-3 py-2 font-medium border-b border-r border-[#E4E4E7]">
                      {row.description}
                    </TableCell>
                    <TableCell className="px-0 py-0 text-right border-b border-[#E4E4E7]">
                      {isEditable ? (
                        <input
                          type="text"
                          value={row.amount.toString()}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          onBlur={(e) => {
                            const rawValue = e.target.value.trim();
                            const cleaned = rawValue.replace(/[₹,]/g, "");
                            if (!isNaN(Number(cleaned))) {
                              handleAmountChange(index, cleaned);
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numeric = value.replace(/[^\d]/g, "");
                            handleAmountChange(index, numeric);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className={`block w-full text-black px-3 py-3 ${
                            inputErrors[index] ? "outline-red-400" : ""
                          } outline-[#0090FF] text-right focus:text-left`}
                        />
                      ) : (
                        <span className="font-bold text-lg text-[#1C2024] px-2 py-4">
                          ₹{row.amount.toLocaleString("en-IN")}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default EditableAmountTable;
