import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Buttons from "../buttons/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import { useGlobalTables } from "@/context/GlobalTablesContext";

type RowData = {
  id: string;
  description: string;
  amount: number | null | undefined;
};

interface EditableAmountCellProps {
  selectedPatientBill: GetBillDetailsDTO | null;
  setOpen: (val: boolean) => void;
  onSave: (finalAmount: number) => void;
}

const EditableAmountTable: React.FC<EditableAmountCellProps> = ({
  selectedPatientBill,
  setOpen,
  onSave,
}) => {
  const { patientBalanceUtilized, setPatientBalanceUtilized } =
    useGlobalTables();
  const initialData: RowData[] = [
    {
      id: "1",
      description: "Balance Deposit",
      amount: selectedPatientBill?.totalDepositAfterBill ?? 0,
    },
    {
      id: "2",
      description: "Employee Balance",
      amount: selectedPatientBill?.employeeBalance ?? 0,
    },
    {
      id: "3",
      description: "Deposit Utilized",
      amount: selectedPatientBill?.utilizedDeposit ?? 0,
    },
    {
      id: "4",
      description: "Employee Balance Utilized",
      amount: selectedPatientBill?.employeeBalanceUtilized ?? 0,
    },
    {
      id: "5",
      description: "Balance Amount",
      amount: selectedPatientBill?.balanceAmount ?? 0,
    },
  ];
  const [data, setData] = useState<RowData[]>(initialData);
  const [inputErrors, setInputErrors] = useState<boolean[]>(
    Array(initialData.length).fill(false)
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (selectedPatientBill) {
      const initialData: RowData[] = [
        {
          id: "1",
          description: "Balance Deposit",
          amount: selectedPatientBill.totalDepositAfterBill ?? 0,
        },
        {
          id: "2",
          description: "Employee Balance",
          amount: selectedPatientBill?.employeeBalance ?? 0,
        },
        {
          id: "3",
          description: "Deposit Utilized",
          amount: selectedPatientBill.utilizedDeposit ?? 0,
        },
        {
          id: "4",
          description: "Employee Balance Utilized",
          amount: selectedPatientBill?.employeeBalanceUtilized ?? 0,
        },
        {
          id: "5",
          description: "Balance Amount",
          amount: selectedPatientBill?.balanceAmount ?? 0,
        },
      ];

      setPatientBalanceUtilized(initialData);
    }
  }, [selectedPatientBill, setPatientBalanceUtilized]);

  useEffect(() => {
    inputRefs.current.forEach((input) => input?.blur());
  }, []);

  // const validateAmounts = (updatedData: RowData[]): string[] => {
  //   const errors: string[] = [];

  //   // Row 3 (Deposit Utilized) should not be greater than Row 1 (Balance Deposit)
  //   const balanceDeposit = updatedData[0]?.amount ?? 0;
  //   const depositUtilized = updatedData[2]?.amount ?? 0;
  //   if (depositUtilized > balanceDeposit) {
  //     errors.push("Deposit Utilized cannot be greater than Balance Deposit");
  //   }

  //   // Row 2 (Employee Balance) should not be greater than Row 4 (Employee Balance Utilized)
  //   const employeeBalance = updatedData[1]?.amount ?? 0;
  //   const employeeBalanceUtilized = updatedData[3]?.amount ?? 0;
  //   if (employeeBalance > employeeBalanceUtilized) {
  //     errors.push("Employee Balance cannot be greater than Employee Balance Utilized");
  //   }

  //   // Row 4 (Employee Balance Utilized) should not be less than Row 2 (Employee Balance)
  //   if (employeeBalanceUtilized < employeeBalance) {
  //     errors.push("Employee Balance Utilized cannot be less than Employee Balance");
  //   }

  //   return errors;
  // };

  const handleAmountChange = (index: number, value: string) => {
    // Allow empty (user deleting)
    if (value.trim() === "") {
      setData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], amount: undefined }; // or null
        return updated;
      });
      return;
    }

    // Check if valid number
    const parsed = parseFloat(value);
    setInputErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = isNaN(parsed) || parsed < 0;
      return updatedErrors;
    });

    if (!isNaN(parsed) && parsed >= 0) {
      // Create temporary updated data to check validation
      const tempUpdated = data.map((row, i) =>
        i === index ? { ...row, amount: parsed } : row
      );

      // Check validation before accepting the value
      // const errors = validateAmounts(tempUpdated);

      // If there are validation errors for this specific change, reject the value
      const balanceDeposit = tempUpdated[0]?.amount ?? 0;
      const depositUtilized = tempUpdated[2]?.amount ?? 0;
      const employeeBalance = tempUpdated[1]?.amount ?? 0;
      const employeeBalanceUtilized = tempUpdated[3]?.amount ?? 0;

      // Reject invalid values based on the row being edited
      if (index === 2 && depositUtilized > balanceDeposit) {
        // Don't accept Deposit Utilized greater than Balance Deposit
        return;
      }
      if (index === 1 && employeeBalance > employeeBalanceUtilized) {
        // Don't accept Employee Balance greater than Employee Balance Utilized
        return;
      }
      if (index === 3 && employeeBalanceUtilized < employeeBalance) {
        // Don't accept Employee Balance Utilized less than Employee Balance
        return;
      }

      // If validation passes, update the data
      setData((prev) => {
        const updated = prev.map((row, i) =>
          i === index ? { ...row, amount: parsed } : row
        );

        const total =
          (updated[0]?.amount ?? 0) +
          (updated[1]?.amount ?? 0) -
          (updated[2]?.amount ?? 0) -
          (updated[3]?.amount ?? 0);

        updated[4] = { ...updated[4], amount: total };

        // Clear validation errors since we're only accepting valid values
        setValidationErrors([]);

        return updated;
      });
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
  };

  if (!patientBalanceUtilized || patientBalanceUtilized.length === 0) {
    return <div>Loading balance data...</div>;
  }

  return (
    <div className="w-[640px] rounded-lg bg-white border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#D9D9E0] flex items-center gap-2">
        <Image
          src={"assets/icons/RupeeIcon.svg"}
          width={24}
          height={24}
          alt="Rupee"
        />
        <p className="text-[#1C2024] text-base font-semibold">
          Balance Utilized
        </p>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="relative border border-[#CDCED6] rounded-lg overflow-hidden">
          <Table className="w-full table-fixed border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="bg-[#F9F9FB] text-xs font-semibold text-[#60646C]">
                <TableHead className="w-[72%] px-3 py-2 border-b border-r border-[#CDCED6]">
                  Description
                </TableHead>
                <TableHead className="w-[25%] px-2 py-2 text-right border-b border-[#CDCED6]">
                  Total Amount (₹)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const isEditable = row.id == "1" || row.id == "2" || row.id == "5" ? false : true;
                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "h-8 text-sm text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE]",
                      index !== data.length - 1
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
                          value={
                            data[index].amount !== undefined
                              ? data[index].amount?.toString()
                              : ""
                          }
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          onBlur={(e) => {
                            const rawValue = e.target.value.trim();
                            const cleaned = rawValue.replace(/[₹,]/g, "");
                            if (cleaned === "") {
                              handleAmountChange(index, "");
                            } else if (!isNaN(Number(cleaned))) {
                              const parsed = parseFloat(cleaned);

                              // Check validation before accepting the value
                              const tempUpdated = data.map((row, i) =>
                                i === index ? { ...row, amount: parsed } : row
                              );

                              const balanceDeposit = tempUpdated[0]?.amount ?? 0;
                              const depositUtilized = tempUpdated[2]?.amount ?? 0;
                              const employeeBalance = tempUpdated[1]?.amount ?? 0;
                              const employeeBalanceUtilized = tempUpdated[3]?.amount ?? 0;

                              // Reject invalid values and reset to previous value
                              if (index === 2 && depositUtilized > balanceDeposit) {
                                e.target.value = data[index].amount?.toString() || "";
                                return;
                              }
                              if (index === 1 && employeeBalance > employeeBalanceUtilized) {
                                e.target.value = data[index].amount?.toString() || "";
                                return;
                              }
                              if (index === 3 && employeeBalanceUtilized < employeeBalance) {
                                e.target.value = data[index].amount?.toString() || "";
                                return;
                              }

                              handleAmountChange(index, cleaned);
                            }
                          }}
                          onChange={(e) => {
                            handleAmountChange(index, e.target.value);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className={`block w-full text-black px-3 py-3 ${inputErrors[index] ? "outline-red-400" : ""
                            } outline-[#0090FF] text-right focus:text-left`}
                        />
                      ) : (
                        <span className="font-bold text-lg text-[#1C2024] px-2 py-4">
                          ₹{row?.amount?.toLocaleString("en-IN")}
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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="px-6 py-3 border-t border-[#D9D9E0]">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Validation Errors
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="px-6 py-3 border-t border-[#D9D9E0] flex justify-end gap-4">
        <Buttons
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Buttons>
        <Buttons
          size="button-small"
          type="primary-button"
          variant="button"
          disabled={validationErrors.length > 0}
          onClick={() => {
            if (validationErrors.length === 0) {
              const finalBalanceAmount = data[data.length - 1].amount ?? 0;
              onSave(finalBalanceAmount);
              setOpen(false);
            }
          }}
        >
          Save Changes
        </Buttons>
      </div>
    </div>
  );
};

export default EditableAmountTable;
