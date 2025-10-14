"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { setPackageBillConversionLogFilters as setPackageBillConversionLogFiltersAction } from "@/store/slices/packagebillconversionlogFilters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Checkbox } from "@/components/ui/checkbox";


import {
  fetchPackageBillConversionLogChangeType,
  fetchPackageBillConversionLogModifiedBy,
  fetchPackageBillConversionLogSourcePackage,
  fetchPackageBillConversionLogTargetPackage,
} from "@/store/package_bill_conversion_log/thunks";
import { RootState, AppDispatch } from "@/store";
import { PackageBillConversionLogFiltersState } from "@/store/slices/packagebillconversionlogFilters";


interface FilterDialogueProps {
  trigger: React.ReactNode;
  filterProps: {
    filterCounts: Record<string, unknown>;
    setFilterCounts: (filters: Record<string, unknown>) => void;
  }
  modalProps: {
    openFilters: boolean;
    setOpenFilters: (open: boolean) => void;
  };
}

const FilterDialogue: React.FC<FilterDialogueProps> = ({
  trigger,
  modalProps: { setOpenFilters },
  filterProps: {
    setFilterCounts
  }
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { changeType, modifiedBy, sourcePackage, targetPackage} =
    useSelector((state: RootState) => state.packageBillConversionLog);
  const [localFilters, setLocalFilters] = useState({});
  const [tempFilters, setTempFilters] = useState<Partial<PackageBillConversionLogFiltersState>>({});



  const [sourcePackages, setSourcePackages] = useState<string[]>([]);
  const [targetPackages, setTargetPackages] = useState<string[]>([]);
  const [changeTypes, setChangeTypes] = useState<number[]>([]);
  const [modifiedByPerson, setModifiedByPerson] = useState<string[]>([]);

  useEffect(() => {
    const count = {
      sourcePackage: sourcePackages.length > 0 ? sourcePackages : undefined,
      targetPackage: targetPackages.length > 0 ? targetPackages : undefined,
      changeType: changeTypes.length > 0 ? changeTypes : undefined,
      modifiedByList:
        modifiedByPerson.length > 0 ? modifiedByPerson : undefined,
    };
    setTempFilters(count);
    setLocalFilters(
      Object.fromEntries(
        Object.entries(count).filter(
          ([, value]) => value !== null && value !== undefined
        )
      )
    );
  }, [sourcePackages, targetPackages, changeTypes, modifiedByPerson]);

  const onSubmit = () => {
    dispatch(setPackageBillConversionLogFiltersAction(tempFilters));
    setFilterCounts({ ...localFilters });
  };


  useEffect(() => {
    const version = "1"; 
    const tenant = ""; 

    dispatch(fetchPackageBillConversionLogChangeType({ version, tenant }));
    dispatch(fetchPackageBillConversionLogModifiedBy({ version, tenant }));
    dispatch(fetchPackageBillConversionLogSourcePackage({ version, tenant }));
    dispatch(fetchPackageBillConversionLogTargetPackage({ version, tenant }));
  }, [dispatch]);

  console.log(changeType, modifiedBy, sourcePackage, targetPackage);
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[640px] p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-between border-b border-[#D9D9E0] px-6 py-4">
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/icons/FilterIcon.svg"}
                height={24}
                width={24}
                alt="filter icon"
              />
              <DialogTitle className="text-base font-semibold text-[#1C2024]">
                Filter
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
        <div className="px-6 py-2 flex flex-col space-y-lg items-center w-full">
          <div className="flex items-center gap-2 space-x-lg w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Source Package
              </label>

              <Select
                onValueChange={(value) =>
                  setSourcePackages((prev: string[]) =>
                    value
                      ? [...prev, value]
                      : [...prev.filter((status) => status !== value)]
                  )
                }
                value={`${
                  sourcePackages.length !== 0
                    ? `${sourcePackages.length} Selected`
                    : "Created By"
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${
                      sourcePackages.length !== 0
                        ? `${sourcePackages.length} Selected`
                        : "All"
                    }`}
                  </SelectValue>
                  <Image
                    src={"/assets/icons/CaretDownDark.svg"}
                    height={16}
                    width={16}
                    alt="no data found"
                  />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0 ">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className=" px-0 py-0">
                        {sourcePackage?.data?.items?.map((status) => (
                          <CommandItem
                            key={status.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={sourcePackages.includes(status.key ?? "")}
                              onCheckedChange={(value) => {
                                setSourcePackages((prev) =>
                                  value
                                    ? [...prev, status.key ?? ""]
                                    : [
                                        ...prev.filter(
                                          (pers) => pers !== status.key
                                        ),
                                      ]
                                );
                              }}
                              id={status.key}
                            />

                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={status.key}
                            >
                              {status.value}
                            </label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Target Package
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${
                  targetPackages.length !== 0
                    ? `${targetPackages.length} Selected`
                    : "Created By"
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${
                      targetPackages.length !== 0
                        ? `${targetPackages.length} Selected`
                        : "All"
                    }`}
                  </SelectValue>
                  <Image
                    src={"/assets/icons/CaretDownDark.svg"}
                    height={16}
                    width={16}
                    alt="no data found"
                  />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="px-0 pb-2">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {targetPackage?.data?.items?.map((person) => (
                          <CommandItem
                            key={person.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={targetPackages.includes(person.key ?? "")}
                              onCheckedChange={(checked) =>
                                setTargetPackages((prev) =>
                                  checked
                                    ? [...prev, person.key ?? ""]
                                    : prev.filter(
                                        (pers) => pers !== person.key
                                      )
                                )
                              }
                              id={person.key}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={person.key}
                            >
                              {person.value}
                            </label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 items-center pt-1 space-x-lg w-full">
            <div className="w-full flex flex-col space-y-2 ">
              <label className="font-normal text-sm" htmlFor="bill-select">
                Change Type
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${
                  changeTypes.length !== 0
                    ? `${changeTypes.length} Selected`
                    : "Patient Company"
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${
                      changeTypes.length !== 0
                        ? `${changeTypes.length} Selected`
                        : "All"
                    }`}
                  </SelectValue>
                  <Image
                    src={"/assets/icons/CaretDownDark.svg"}
                    height={16}
                    width={16}
                    alt="no data found"
                  />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="px-0 pb-2">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        <CommandItem
                          key="All"
                          className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          onClick={() => {
                            if (changeTypes.length !== changeType?.data?.items?.length) {
                              setChangeTypes(
                                changeType?.data?.items?.map((patient) => Number(patient.key)).filter((value): value is number => !isNaN(value)) || []
                              );
                            } else {
                              setChangeTypes([]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={changeTypes.length === changeType?.data?.items?.length}
                            onCheckedChange={() => {}}
                            id="All"
                          />
                          <label
                            className="pl-2 pr-4 cursor-pointer"
                            htmlFor="All"
                          >
                            All
                          </label>
                        </CommandItem>
                        {changeType?.data?.items?.map((patient) => (
                          <CommandItem
                            key={patient.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={changeTypes.includes(Number(patient.key))}
                              onCheckedChange={(checked) =>
                                setChangeTypes((prev) =>
                                  checked
                                    ? [...prev, Number(patient.key)]
                                    : prev.filter(
                                        (pers) => pers !== Number(patient.key)
                                      )
                                )
                              }
                              id={patient.key}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={patient.key}
                            >
                              {patient.value}
                            </label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col space-y-2 py-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Modified By
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${
                  modifiedByPerson.length !== 0
                    ? `${modifiedByPerson.length} Selected`
                    : "Patient Company"
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${
                      modifiedByPerson.length !== 0
                        ? `${modifiedByPerson.length} Selected`
                        : "All"
                    }`}
                  </SelectValue>
                  <Image
                    src={"/assets/icons/CaretDownDark.svg"}
                    height={16}
                    width={16}
                    alt="no data found"
                  />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {modifiedBy?.data?.items?.map((patient) => (
                          <CommandItem
                            key={patient.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={modifiedByPerson.includes(patient.key ?? "")}
                              onCheckedChange={(checked) =>
                                setModifiedByPerson((prev) =>
                                  checked
                                    ? [...prev, patient.key ?? ""]
                                    : prev.filter(
                                        (pers) => pers !== patient.key 
                                      )
                                )
                              }
                              id={patient.key}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={patient.key}
                            >
                              {patient.value}
                            </label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between w-full px-6 py-md border-t border-[#D9D9E0]">
          <div>
            <Button
              type="button"
              variant="ghost"
              className="text-primary bg-transparent shadow-none"
              onClick={() => {
                setSourcePackages([]);
                setChangeTypes([]);
                setModifiedByPerson([]);
                setTargetPackages([]);

                setOpenFilters(false);
              }}
            >
              Reset
            </Button>
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenFilters(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                className="bg-primary text-white"
                onClick={onSubmit}
              >
                Apply
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialogue;
