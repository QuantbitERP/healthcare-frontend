import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';

import Logo from '@/assets/icons/Concession.svg';
import Circle from '@/assets/icons/InfoCircleWhite.svg';

import Button from '../buttons/Button';

import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { TooltipArrow } from '@radix-ui/react-tooltip';

interface RecordPaymentsProps {
  setOpen: (value: boolean) => void;
}

const RecordPayments: React.FC<RecordPaymentsProps> = ({ setOpen }) => {
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  const isValidNumber = (value: string): boolean => {
    return /^\d*\.?\d*$/.test(value);
  };

  const formatNumber = (value: string): string => {
    if (value === "") return "";
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isValidNumber(value) && value !== "") {
      setError("Enter a valid percentage");
      return;
    }

    setDiscountPercent(value);
    setDiscountAmount("");

    if (value === "") {
      setError("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setError("Enter a valid percentage");
    } else {
      setError("");
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isValidNumber(value) && value !== "") {
      setAmountError("Enter a valid amount");
      return;
    }

    setDiscountAmount(value);
    setDiscountPercent("");

    if (value === "") {
      setAmountError("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setAmountError("Enter a valid amount");
    } else {
      setAmountError("");
    }
  };

  return (
    <div className='w-[640px] h-fit rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]'>
      <div className='w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row'>
        <Image src={Logo.src} width={24} height={24} alt='Rupee' />
        <p className='text-[#1C2024] text-base font-semibold'>Discount</p>
      </div>

      <div className='w-full flex flex-col p-6 gap-4'>
        <div className='w-full flex flex-row'>
          <div className='w-full flex flex-col gap-2 text-[#1C2024] text-sm font-normal'>
            <label>Discount (%)</label>
            <TooltipProvider>
              <Tooltip open={!!error}>
                <TooltipTrigger asChild>
                  <input
                    type="text"
                    placeholder="Enter Discount %"
                    value={discountPercent}
                    onChange={handleDiscountChange}
                    onBlur={(e) => setDiscountPercent(formatNumber(e.target.value))}
                    className={`w-full h-10 px-4 py-2 rounded-lg border text-[#1C2024] focus:outline-none focus:ring-1 focus:ring-[#0090FF] ${error ? 'border-red-500 bg-red-50' : 'border-[#CDCED6]'}`}
                  />
                </TooltipTrigger>
                <TooltipContent className='bg-[#DC3E42] text-white text-sm font-medium flex flex-row gap-1 items-center'>
                  <Image src={Circle.src} alt="Info" width={16} height={16} className="rounded-lg" />
                  {error}
                  <TooltipArrow className="fill-[#DC3E42]" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className='px-4 flex items-center'>or</span>
          <div className='w-full flex flex-col gap-2 text-[#1C2024] text-sm font-normal'>
            <label>Discount (₹)</label>
            <TooltipProvider>
              <Tooltip open={!!amountError}>
                <TooltipTrigger asChild>
                  <input
                    type="text"
                    placeholder="Enter Discount Amount"
                    value={discountAmount}
                    onChange={handleAmountChange}
                    onBlur={(e) => setDiscountAmount(formatNumber(e.target.value))}
                    className={`w-full h-10 px-4 py-2 rounded-lg border text-[#1C2024] focus:outline-none focus:ring-1 focus:ring-[#0090FF] ${amountError ? 'border-red-500 bg-red-50' : 'border-[#CDCED6]'}`}
                  />
                </TooltipTrigger>
                <TooltipContent className='bg-[#DC3E42] text-white text-sm font-medium flex flex-row gap-1 items-center'>
                  <Image src={Circle.src} alt="Info" width={16} height={16} className="rounded-lg" />
                  {amountError}
                  <TooltipArrow className="fill-[#DC3E42]" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className='w-[272px] flex flex-col gap-2 text-[#1C2024] text-sm font-normal'>
          <label>Applies to</label>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="account">Bill</TabsTrigger>
              <TabsTrigger value="password">All Services</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className='px-6 py-3 border-t border-t-[#D9D9E0] flex flex-row justify-between items-center'>
        <Button size="button-small" type="ghost-black-button" variant="button">
          Reset
        </Button>
        <div className='flex flex-row gap-4'>
          <Button size="button-small" type="secondary-button" variant="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="button-small" type="primary-button" variant="button" onClick={() => setOpen(false)}>Done</Button>
        </div>
      </div>
    </div>
  );
};

export default RecordPayments;