import React, { useState } from "react";
import Image from "next/image";
import Button from "../buttons/Button";
// import { Switch } from "@/components/ui/switch";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FilterContainer: React.FC = () => {
  const [Open, setOpen] = useState<boolean>(false); // Use boolean for open state

  return (
    <Popover open={Open} onOpenChange={setOpen}>
      <div>
        <PopoverTrigger asChild>
          <button className="w-fit h-10 p-2 border border-black rounded-lg">
            Toggle Filter
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none">
          <div
            className="w-[400px] h-[1024px] flex flex-col items-center border border-[#D9D9E0] bg-[#FFF]
    shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] rounded-lg gap-0"
          >
            <div className="w-[400px] h-[64px] p-4 flex flex-row justify-between border-b border-b-[#D9D9E0]">
              <span className="text-[#1C2024] text-base font-semibold leading-6">
                Filter
              </span>
              <Image
                src={"/assets/icons/x.svg"}
                width={20}
                height={20}
                alt="close icon"
                onClick={() => {
                  setOpen(false);
                }}
              />
            </div>
            <div className="w-[400px] h-[352px] p-4 gap-4 flex flex-col ">
              <div className="w-[368px] h-[68px] flex flex-col gap-4 text-[#1C2024] font-normal text-sm leading-5">
                <span>Patient</span>
                <div className="relative w-[368px]">
                  <select className="w-[368px] h-10 rounded-lg px-4 py-2 bg-[#FFFFFF] border border-[#CDCED6] text-[#1C2024] text-sm font-normal leading-5 appearance-none">
                    <option value="" disabled selected>
                      All{" "}
                    </option>
                    <option value="incorrect">Incorrect Billing</option>
                    <option value="duplicate">Duplicate Entry</option>
                    <option value="other">Other</option>
                  </select>
                  <Image
                    src={"/assets/icons/CaretDownFilled.svg"}
                    width={16}
                    height={16}
                    alt="caret down icon"
                    className="absolute right-4  top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
              <div className="w-[368px] h-[68px]  flex flex-col gap-4 text-[#1C2024] font-normal text-sm leading-5">
                <span>Company</span>
                <div className="relative w-[368px]">
                  <select className="w-[368px] h-10 rounded-lg px-4 py-2 bg-[#FFFFFF] border border-[#CDCED6] text-[#1C2024] text-sm font-normal leading-5 appearance-none">
                    <option value="" disabled selected>
                      All{" "}
                    </option>
                    <option value="incorrect">Incorrect Billing</option>
                    <option value="duplicate">Duplicate Entry</option>
                    <option value="other">Other</option>
                  </select>
                  <Image
                    src={"/assets/icons/CaretDownFilled.svg"}
                    width={16}
                    height={16}
                    alt="caret down icon"
                    className="absolute right-4  top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
              <div className="w-[368px] h-[68px]  flex flex-col gap-4 text-[#1C2024] font-normal text-sm leading-5">
                <span>Bill Status</span>
                <div className="relative w-[368px]">
                  <select className="w-[368px] h-10 rounded-lg px-4 py-2 bg-[#FFFFFF] border border-[#CDCED6] text-[#1C2024] text-sm font-normal leading-5 appearance-none">
                    <option value="" disabled selected>
                      All{" "}
                    </option>
                    <option value="incorrect">Incorrect Billing</option>
                    <option value="duplicate">Duplicate Entry</option>
                    <option value="other">Other</option>
                  </select>
                  <Image
                    src={"/assets/icons/CaretDownFilled.svg"}
                    width={16}
                    height={16}
                    alt="caret down icon"
                    className="absolute right-4  top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
              <div className="w-[368px] h-[68px]  flex flex-col gap-4 text-[#1C2024] font-normal text-sm leading-5">
                <span>Created By</span>
                <div className="relative w-[368px]">
                  <select className="w-[368px] h-10 rounded-lg px-4 py-2 bg-[#FFFFFF] border border-[#CDCED6] text-[#1C2024] text-sm font-normal leading-5 appearance-none">
                    <option value="" disabled selected>
                      All{" "}
                    </option>
                    <option value="incorrect">Incorrect Billing</option>
                    <option value="duplicate">Duplicate Entry</option>
                    <option value="other">Other</option>
                  </select>
                  <Image
                    src={"/assets/icons/CaretDownFilled.svg"}
                    width={16}
                    height={16}
                    alt="caret down icon"
                    className="absolute right-4  top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div className="w-[370px] h-[544px]"></div>
            <div className="w-[400px] h-[64px] px-4 py-3 rounded-bl-lg rounded-br-lg flex flex-row items-center justify-between border-t border-[#D9D9E0]">
              <div>
                <Button type="link-button link-primary link-size p-0">
                  Reset
                </Button>
              </div>
              <div className="flex flex-row gap-4">
                <Button type="secondary-button" size="button-medium">
                  Cancel
                </Button>
                <Button type="primary-button" size="button-medium">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default FilterContainer;
