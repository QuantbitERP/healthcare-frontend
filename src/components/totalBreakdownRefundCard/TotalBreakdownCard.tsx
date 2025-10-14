import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '../buttons/Button';
// import Exclaim from "@/assets/icons/ExclamationCircle.svg";
// import Caret from "@/assets/icons/CaretDownDark.svg";
import RecordPayments from '../recordPayments/RecordPayments';
import Discount from "@/components/totalBreakdownCardComponents/Discount";
// import Transactions from "@/components/totalBreakdownCardComponents/PaymentsReceived";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Tags from '../statusTags/Tags';

interface TotalBreakdownCardProps {
  amountPaid?: string;
  deposit?: string;
  discount?: number;
  amount?: string;
  primaryButtonText?: string;
}

const TotalBreakdownCard: React.FC<TotalBreakdownCardProps> = ({
  amountPaid = "₹1,770",
  deposit = "₹5,000",
  discount = 10,
  amount = "₹6,770",
  primaryButtonText = "View Refund Voucher",
}) => {
  // const [visible, setVisible] = useState<boolean>(true);
  const [dialogType, setDialogType] = useState<"Discount" | "Transactions" | "Record" | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  // const [selectedValue, setSelectedValue] = useState<string>("");
  const [, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // const handleSelect = (value: string) => {
  //   setSelectedValue(value);
  //   setIsOpen(false);
  // };

  // const handleClose = () => {
  //   setVisible(false);
  // };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className='w-[256px] h-fit flex flex-col rounded-lg p-4 gap-3 border border-[#D9D9E0] shadow-sm bg-[linear-gradient(135deg,#E5DCFF_0%,rgba(255,255,255,0.50)_37.73%),#FFF]'
        style={{
          background:
            "linear-gradient(135deg, #E5DCFF 0%, rgba(255, 255, 255, 0.50) 37.73%), #FFF",
        }}
      >
        <div className='flex flex-col gap-3'>
          <div className='text-[#60646C] text-xs font-normal'>
            Total Breakdown
          </div>
          <div>
            <div className='flex flex-row justify-between items-center h-8'>
              <p className='text-[#1C2024] text-sm font-medium'>Amount Paid</p>
              <p className='text-[#1C2024] text-xs font-semibold'>{amountPaid}</p>
            </div>
            <div className='flex flex-row justify-between items-center h-8'>
              <p className='text-[#1C2024] text-sm font-medium'>Deposit(s)</p>
              <p className='text-[#1C2024] text-xs font-semibold'>{deposit}</p>
            </div>
            <div className='flex flex-row justify-between items-center h-8'>
              <DialogTrigger>
                <div>
                  <p
                    className='text-[#0D74CE] text-sm font-medium cursor-pointer'
                    onClick={() => setDialogType("Discount")}
                  >
                    Discount
                  </p>
                </div>
              </DialogTrigger>
              <p className='text-[#8B8D98] text-xs font-semibold'>{discount}%</p>
            </div>
          </div>
          <div>
            <Image src={"/assets/icons/DividerHorizontal.svg"} width={224} height={220} alt='Divider' />
          </div>
          <div className='flex flex-row justify-between items-center'>
            <p className='w-full text-[#1C2024] text-sm font-medium'>
              Amount to Refund
            </p>
            <p className='text-[#CE2C31] text-base font-bold'>{amount}</p>
          </div>
          <div className='w-full h-fit flex flex-row gap-2 items-center text-[#0D74CE] text-xs font-medium '>
            <DialogTrigger>
              <div>
                <p
                  className='text-[#0D74CE] text-sm font-medium cursor-pointer'
                  onClick={() => setDialogType("Transactions")}
                >
                  Transactions
                </p>
              </div>
            </DialogTrigger>
            <Tags tagText="4" type="primary" variant="tag" border />
          </div>
          <DialogTrigger asChild>
            <Button
              size="button-medium"
              type="primary-button"
              variant="button"
              className={"!w-full cursor-pointer"}
              onClick={() => setDialogType("Record")}
            >
              {primaryButtonText}
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden max-w-none"
      >
        {dialogType === "Discount" && <Discount setOpen={setOpen} />}
        {/* {dialogType === "Transactions" && <Transactions setOpen={setOpen} />} */}
        {dialogType === "Record" && <RecordPayments setOpen={setOpen} />}
      </DialogContent>
    </Dialog>
  );
};

export default TotalBreakdownCard;
