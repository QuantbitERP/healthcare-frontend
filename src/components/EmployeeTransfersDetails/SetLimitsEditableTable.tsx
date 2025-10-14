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

const initialData: RowData[] = [
  { id: "1", description: "OPD", amount: 35000 },
  { id: "2", description: "IPD", amount: 35000 },
  { id: "3", description: "Total Amount", amount: 70000 }, // Total (non-editable)
];

const EditableAmountTable = ({ tdata, onDataChange }: any) => {
  const [data, setData] = useState<RowData[]>([
    { id: "opd", description: "OPD", amount: tdata?.opd || 0 },
    { id: "ipd", description: "IPD", amount: tdata?.ipd || 0 },
    { id: "total", description: "Total Amount", amount: tdata?.total || 0 }, // Total (non-editable)
  ]);
  const [inputErrors, setInputErrors] = useState<boolean[]>(
    Array(initialData.length).fill(false)
  );
  const inputRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current.forEach((input) => input?.blur());
  }, []);

  const handleAmountChange = (index: number, value: string) => {
    const isValid = /^\d*\.?\d*$/.test(value.trim()) && value.trim() !== "";
    const parsed = parseFloat(value);

    setInputErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = isNaN(parsed) || parsed < 0;
      return updatedErrors;
    });

    if (isValid) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0) {
        setData((prev) => {
          const updated = prev.map((row, i) =>
            i === index ? { ...row, amount: parsed } : row
          );
          const total = updated[0].amount + updated[1].amount;
          updated[2] = { ...updated[2], amount: total };
          return updated;
        });
      }
    }
  };
  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

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
  };

  return (
    <div>
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
            {data.map((row, index) => {
              const isEditable = index !== data.length - 1;
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "h-8 text-sm text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE]",
                    index !== data.length - 1 ? "border-b border-[#E4E4E7]" : ""
                  )}
                >
                  <TableCell className="px-3 py-2 font-medium border-b border-r border-[#E4E4E7]">
                    {row.description}
                  </TableCell>
                  <TableCell className="px-0 py-0 text-right border-b border-[#E4E4E7]">
                    {isEditable ? (
                      <input
                        type="text"
                        value={data[index].amount.toString()}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        onBlur={(e) => {
                          const rawValue = e.target.value.trim();

                          // Clean formatting (remove ₹ and commas)
                          const cleaned = rawValue.replace(/[₹,]/g, "");

                          // Only update if it's a valid number
                          if (!isNaN(Number(cleaned))) {
                            handleAmountChange(index, cleaned);
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow only digits while typing
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
  );
};

export default EditableAmountTable;
