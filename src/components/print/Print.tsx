import Image from "next/image";
import React, { useState } from "react";
import Buttons from "../buttons/Button";
import SplitButton from "../splitButton/splitButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Check from "../checkbox/CheckboxComponent";  

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";

interface PrintProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Print: React.FC<PrintProps> = ({ open, setOpen }) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [dischargeDateTime, setDischargeDateTime] = useState<Date | undefined>(undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden">
        <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
          <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
            <Image src={'/assets/icons/PrinterBlack.svg'} width={24} height={24} alt="Printer" />
            <p className="text-[#1C2024] text-base font-semibold">Print</p>
          </div>
          <div className="w-full px-6">
            <div className="flex flex-col gap-4">
              <Tabs defaultValue="Print Package" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-10">
                  <TabsTrigger value="Print Package">Print Package</TabsTrigger>
                  <TabsTrigger value="Print Company Bill">Print Company Bill</TabsTrigger>
                  <TabsTrigger value="Print Gate Pass">Print Gate Pass</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 w-full">
                  <Check label="" />
                  <span className="text-[#1C2024] text-sm font-normal">Show Provisional Print in Detail</span>
                </div>
                <div className="flex flex-row gap-2 w-full">
                  <Check label="" />
                  <span className="text-[#1C2024] text-sm font-normal">Print Advanced Details</span>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex items-start">
                    <Check label="" />
                  </div> 
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-[#1C2024] text-sm font-normal">From Date</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal hover:bg-white focus:outline-none border-[#D9D9E0]",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          {fromDate ? (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">{format(fromDate, "dd/MM/yy")}</span>
                          ) : (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">Pick a Date</span>
                          )}
                          <Image src={'/assets/icons/CalendarGrey.svg'} width={16} height={16} alt="Calendar" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-[#1C2024] text-sm font-normal">To Date</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal hover:bg-white border-[#D9D9E0]",
                            !toDate && "text-muted-foreground"
                          )}
                        >
                          {toDate ? (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">{format(toDate, "dd/MM/yy")}</span>
                          ) : (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">Pick a Date</span>
                          )}
                          <Image src={'/assets/icons/CalendarGrey.svg'} width={16} height={16} alt="Calendar" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div> 
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex items-start">
                    <Check label="" />
                  </div>
                  <div className="flex flex-col gap-2 w-[275px]">
                    <span className="text-[#1C2024] text-sm font-normal">Planned Discharge Date/Time</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal hover:bg-white border-[#D9D9E0]",
                            !dischargeDateTime && "text-muted-foreground"
                          )}
                        >
                          {dischargeDateTime ? (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">
                              {format(dischargeDateTime, "dd/MM/yy hh:mm a")}
                            </span>
                          ) : (
                            <span className="text-[#8B8D98] text-sm font-normal w-full">Pick Date and Time</span>
                          )}
                          <Image src={'/assets/icons/CalendarGrey.svg'} width={16} height={16} alt="Calendar" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[275px] p-0" align="start">
                        <div className="flex flex-col">
                          <Calendar
                            mode="single"
                            selected={dischargeDateTime}
                            onSelect={(date) => {
                              if (date) {
                                const newDateTime = new Date(date);
                                if (dischargeDateTime) {
                                  newDateTime.setHours(dischargeDateTime.getHours());
                                  newDateTime.setMinutes(dischargeDateTime.getMinutes());
                                }
                                setDischargeDateTime(newDateTime);
                              }
                            }}
                            initialFocus
                          />
                          <div className="border-t border-[#D9D9E0]">
                            <TimePicker
                              value={dischargeDateTime}
                              onChange={setDischargeDateTime}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div> 
            </div>
          </div>

          <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
            <SplitButton
              buttonText="Export to PDF"
              listHeader="Export to"
              listItems={['PDF', 'Company Excel', 'Excel']}
              size="small"
              type="secondary-button"
              onClick={() => setOpen(false)}
              onItemClick={() => {
                setOpen(false);
                setTimeout(() => {
                  document.body.style.pointerEvents = "auto";
                }, 100);
              }}
              className=""
            />
            <Buttons size="button-small" type="secondary-button" variant="button" onClick={() => setOpen(false)}>
              Preview & Print
            </Buttons>
            <Buttons size="button-small" type="primary-button" variant="button" onClick={() => setOpen(false)}>
              Print
            </Buttons>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Print;
