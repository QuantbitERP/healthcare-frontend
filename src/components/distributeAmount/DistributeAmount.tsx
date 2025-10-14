import React from "react";
import Image from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Alerts from "../alerts/Alerts";

interface TotalBreakdownCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function TotalBreakdownCard({ open, setOpen }: TotalBreakdownCardProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[540px] p-0 [&>button]:!hidden gap-2">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-between border-b border-[#D9D9E0] px-6 py-4">
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/icons/moneybag.svg"}
                height={24}
                width={24}
                alt="amount icon"
              />
              <DialogTitle className="text-base font-semibold text-[#1C2024]">
                Distribute Amount
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Image
                className="border border-[#D9D9E0] cursor-pointer rounded-md p-1"
                src={"/assets/icons/x.svg"}
                height={24}
                width={24}
                alt="filter icon"
              />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="px-2">
            <Alerts heading="2 bills selected" content="" variant="secondary"/>
            <div className="px-2 py-2 flex flex-col space-y-6 items-center w-full">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm">Receipt Amount</Label>
                <Input className="min-w-60 h-10" placeholder="₹5,000" defaultValue="₹5,000" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm" >Concession %</Label>
                <Input className="min-w-60 h-10" placeholder="10%" defaultValue="10%" />
              </div>
            </div>
            <div className="grid grid-cols-2  gap-3">
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm">Concession Amount</Label>
                <Input className="min-w-60 h-10" placeholder="₹1,000" defaultValue="₹1,000" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm">TDS Amount</Label>
                <Input className="min-w-60 h-10" placeholder="₹500" defaultValue="₹500" />
              </div>
            </div>
            <div className="grid grid-cols-2  gap-3">
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm">Processing Amount</Label>
                <Input className="min-w-60 h-10" placeholder="₹350" defaultValue="₹350" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label className="text-[#1C2024] text-sm">Disallow Amount</Label>
                <Input className="min-w-60 h-10" placeholder="0" defaultValue="0" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between w-full px-6 py-md border-t border-[#D9D9E0]">
          <div></div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                className="bg-primary text-white"
                // onClick={onSubmit}
              >
                Distribute Amount
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TotalBreakdownCard;
