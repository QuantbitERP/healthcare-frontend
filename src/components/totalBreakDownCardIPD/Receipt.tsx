import Image from "next/image";
import React from "react";
import Button from "../buttons/Button";
import { format } from "date-fns";
import Badge from "@/components/StatusBadge/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import Alerts from "../alerts/Alerts";
import { GetBillReceiptPaymentDetails } from "@/services/api-client/models/GetBillReceiptPaymentDetails";
import { GetBillDetailsDTO } from "@/services/api-client";

interface RecordPaymentsProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatientBill: GetBillDetailsDTO | null;
  selectedPatientBillReceipts: GetBillReceiptPaymentDetails[] | null | undefined;
  setDialogType: (type: string) => void;
  setRecordRefundClicked?: (val: boolean) => void;
  setRefundFooterButtons?: (val: boolean) => void;
  amount?: string;
  date?: string;
  mode?: string;
  transaction?: string;
  bank?: string;
}

const RecordPayments: React.FC<RecordPaymentsProps> = ({
  setOpen,
  setDialogType,
  selectedPatientBillReceipts,
  selectedPatientBill,
}) => {
  return (
    <div className="w-full h-full rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center gap-2 border-b border-[#D9D9E0]">
        <Image
          src="/assets/icons/Notepad.svg"
          width={24}
          height={24}
          alt="Notepad"
        />
        <p className="text-[#1C2024] text-base font-semibold">
          Payments Received
        </p>
      </div>

      {/* Content Section (scrollable) */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {/* Alerts */}
        <div className="px-4">
          <Alerts
            buttonText="Record a Refund"
            content={`Pending Payment of ₹${selectedPatientBill?.outstandingAmount}`}
            heading="Outstanding!"
            open
            showButton
            variant="danger"
            onClick={() => {
              setDialogType("Refund");
            }}
          />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Table className="w-full min-w-[700px] rounded-lg border border-[#D9D9E0]">
            <TableHeader className="text-[#60646C] text-xs font-semibold h-10">
              <TableRow className="bg-[#F9F9FB] hover:bg-[#F9F9FB] border-[#D9D9E0]">
                <TableHead className="w-[120px] px-3 py-2 whitespace-nowrap">
                  Paid Amount
                </TableHead>
                <TableHead className="w-[180px] px-3 py-2 whitespace-nowrap">
                  Payment Date
                </TableHead>
                <TableHead className="w-[130px] px-3 py-2 whitespace-nowrap">
                  Payment Mode
                </TableHead>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead className="w-[160px] px-3 py-2 whitespace-nowrap cursor-pointer">
                        Transaction No/Cheque/Card
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="w-fit px-2 py-1 rounded-lg bg-[#0090FF] text-sm text-white font-medium"
                    >
                      Transaction No/Cheque/Card
                      <TooltipArrow className="fill-[#0090FF]" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableHead className="w-[180px] px-3 py-2 whitespace-nowrap cursor-pointer">
                        Bank Name/Branch Name
                      </TableHead>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="w-fit px-2 py-1 rounded-lg bg-[#0090FF] text-sm text-white font-medium"
                    >
                      Bank Name/Branch Name
                      <TooltipArrow className="fill-[#0090FF]" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedPatientBillReceipts?.map((receipt, idx) => (
                <TableRow
                  key={idx}
                  className="text-[#1C2024] text-xs font-normal h-10 hover:bg-[#E6F4FE] hover:text-[#0090FF] border-[#D9D9E0]"
                >
                  <TableCell className="w-[90px] px-3 py-2">
                    ₹{receipt.amount}
                  </TableCell>
                  <TableCell className="w-[180px] px-3 py-2">
                    {receipt.receiptDate &&
                      format(new Date(receipt.receiptDate), "dd/MM/yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="w-[130px] px-3 py-2">
                    <Badge text={receipt?.modeOfPayment} variant="success" />
                  </TableCell>
                  <TableCell className="w-[160px] px-3 py-2">
                    {receipt?.transactionnumber}
                  </TableCell>
                  <TableCell className="w-[180px] px-3 py-2">
                    {receipt?.bankname}/{receipt.branchname}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer (always at bottom) */}
      <div className="w-full px-6 py-3 border-t border-[#D9D9E0] flex justify-end bg-white">
        <Button
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default RecordPayments;
