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
import { TooltipArrow } from "@radix-ui/react-tooltip"
import Alerts from "../alerts/Alerts";
import { GetBillReceiptPaymentDetails } from "@/services/api-client/models/GetBillReceiptPaymentDetails";
import { GetBillDetailsDTO } from "@/services/api-client";

// Props interface
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
  // setRecordRefundClicked,
  // setRefundFooterButtons,
  selectedPatientBillReceipts,
  selectedPatientBill,
}) => {
  return (
    <div className="w-[880px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center gap-2">
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
      <div className="w-full overflow-x-auto  flex mx-auto px-4">
      <div className="overflow-x-auto">
        <Table className="w-fit rounded-lg border-1 border-[#D9D9E0] overflow-hidden block">
          <TableHeader className="text-[#60646C] text-xs font-semibold h-10 w-fit">
            <TableRow className="bg-[#F9F9FB] hover:bg-[#F9F9FB] flex flex-row items-center justify-center border-[#D9D9E0]">
              <TableHead className="flex items-center w-[120px] px-3 py-2 whitespace-nowrap">
                <span className="block truncate">Paid Amount</span>
              </TableHead>
              <TableHead className="flex items-center w-[280px] px-3 py-2 whitespace-nowrap">
                <span className="block truncate">Payment Date</span>
              </TableHead>
              <TableHead className="flex items-center w-[130px] px-3 py-2 whitespace-nowrap">
                <span className="block truncate">Payment Mode</span>
              </TableHead>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="flex items-center w-[138px] px-3 py-2 whitespace-nowrap cursor-pointer">
                      <span className="block truncate">
                        Transaction No/Cheque/Card
                      </span>
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
                    <TableHead className="flex items-center w-[180px] px-3 py-2 whitespace-nowrap cursor-pointer">
                      <span className="block truncate">
                        Bank Name/Branch Name
                      </span>
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
                className="text-[#1C2024] text-xs font-normal h-10 flex flex-row justify-center hover:bg-[#E6F4FE] hover:text-[#0090FF] border-[#D9D9E0]"
              >
                <TableCell className="w-[90px] px-3 py-2">
                  <span>{receipt.amount}</span>
                </TableCell>
                <TableCell className="w-[280px] px-3 py-2">{receipt.receiptDate && format(new Date(receipt.receiptDate), "dd/MM/yyyy hh:mm a")}
                </TableCell>
                <TableCell className="w-[130px] px-3 py-2">
                  <Badge text={receipt?.modeOfPayment} variant="success" />
                </TableCell>
                <TableCell className="w-[128px] px-3 py-2">
                  {receipt?.transactionnumber}
                </TableCell>
                <TableCell className="w-[180px] px-3 py-2">{receipt?.bankname}/{receipt.branchname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-6 py-3 border-t border-t-[#D9D9E0] flex justify-end">
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
