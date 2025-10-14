"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { t } from "@/utils/languages";

// Removed unused interface

interface FilterDialogueProps {
  trigger: React.ReactNode;
  filterProps: {
    filters: Record<string, unknown>;
    setFilters: (filters: Record<string, unknown>) => void;
  };
  modalProps: {
    openFilters: boolean;
    setOpenFilters: (open: boolean) => void;
  };
}

const FilterDialogue: React.FC<FilterDialogueProps> = ({
  trigger,
  filterProps: { setFilters },
  modalProps: { setOpenFilters },
}) => {
  const [localFilters, setLocalFilters] = useState({});
  
  // Use the filter options hook
  const { filterOptions, loading: filterLoading, error: filterError } = useFilterOptions();

  // Add state for managing dropdown open/close
  const [openDropdowns, setOpenDropdowns] = useState({
    billStatus: false,
    billType: false,
    company: false,
    associateCompany: false,
    groupBy: false,
  });

  // Function to close all other dropdowns when one opens
  const handleDropdownOpen = (dropdownName: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key as keyof typeof openDropdowns] = false;
        return acc;
      }, {} as typeof openDropdowns);
      newState[dropdownName] = true;
      return newState;
    });
  };

  const onSubmit = () => {
    setFilters({ ...localFilters });
  };

  const [billStatus, setBillStatus] = useState<string[]>([]);
  const [billType, setbillType] = useState<string[]>([]);
  const [company, setcompany] = useState<string[]>([]);
  const [associateCompany, setassociateCompany] = useState<string[]>([]);
  const [groupBy, setgroupBy] = useState("");

  useEffect(() => {
    const count = {
      billStatus: billStatus.length > 0 ? [...billStatus] : null,
      billType: billType.length > 0 ? [...billType] : null,
      company: company.length > 0 ? [...company] : null,
      associateCompany:
      associateCompany.length > 0 ? [...associateCompany] : null,
      groupBy: groupBy ? groupBy : null,
    };

    setLocalFilters(
      Object.fromEntries(
        Object.entries(count).filter(
          ([,value]) => value !== null && value !== undefined
        )
      )
    );
  }, [billStatus, billType, company, associateCompany, groupBy]);
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[640px] p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
         <div className="flex items-center gap-2 justify-between border-b border-[#D9D9E0] px-6 py-4">
                     <div className="flex items-center gap-2">
                       <Image src={"/assets/icons/FilterIcon.svg"} height={24} width={24} alt="filter icon" />
                     <DialogTitle className="text-base font-semibold text-[#1C2024]">
                       {t("actionLabels.filters")}
                     </DialogTitle>
                     </div>
                      <DialogClose asChild>
                     <Image className="border border-[#D9D9E0] cursor-pointer rounded-md p-1" src={"/assets/icons/x.svg"} height={24} width={24} alt="filter icon" />
                   </DialogClose>
                   </div>
        </DialogHeader>
        <div className="px-6 py-2 flex flex-col space-y-lg items-center w-full">
          <div className="flex items-center gap-2 space-x-lg w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Bill Status
              </label>

              <Select
                open={openDropdowns.billStatus}
                onOpenChange={(open) => {
                  if (open) {
                    handleDropdownOpen('billStatus');
                  } else {
                    setOpenDropdowns(prev => ({ ...prev, billStatus: false }));
                  }
                }}
                onValueChange={(value) =>
                  setBillStatus((prev: string[]) =>
                    value
                      ? [...prev, value]
                      : [...prev.filter((status) => status !== value)]
                  )
                }
                value={`${
                  billStatus.length !== 0
                    ? `${billStatus.length} Selected`
                    : t("common.createdBy")
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${t("common.createdBy")}`}>
                    {`${
                      billStatus.length !== 0
                        ? `${billStatus.length} Selected`
                        : t("actionLabels.all")
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
                    <CommandInput placeholder={t("common.search")} />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className=" px-0 py-0">
                        {filterLoading ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm">
                            Loading...
                          </CommandItem>
                        ) : filterError ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row font-normal text-sm text-red-500">
                            Error loading options
                          </CommandItem>
                        ) : (
                          filterOptions.billStatus.map((status) => (
                            <CommandItem
                              key={status.value}
                              className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                                font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                            >
                              <Checkbox
                                checked={billStatus.includes(status.value)}
                                onCheckedChange={(value) => {
                                  setBillStatus((prev) =>
                                    value
                                      ? [...prev, status.value]
                                      : [
                                          ...prev.filter(
                                            (pers) => pers !== status.value
                                          ),
                                        ]
                                  );
                                }}
                                id={status.value}
                              />

                              <label
                                className="pl-2 pr-4 cursor-pointer"
                                htmlFor={status.value}
                              >
                                {status.label}
                              </label>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Bill Type
              </label>
              <Select
                open={openDropdowns.billType}
                onOpenChange={(open) => {
                  if (open) {
                    handleDropdownOpen('billType');
                  } else {
                    setOpenDropdowns(prev => ({ ...prev, billType: false }));
                  }
                }}
                onValueChange={() => {}}
                value={`${
                  billType.length !== 0
                    ? `${billType.length} Selected`
                    : t("common.createdBy")
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${t("common.createdBy")}`}>
                    {`${
                      billType.length !== 0
                        ? `${billType.length} Selected`
                        : t("actionLabels.all")
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
                    <CommandInput placeholder={t("common.search")} />
                    <CommandList className="px-0 pb-2">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {filterLoading ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm">
                            Loading...
                          </CommandItem>
                        ) : filterError ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row font-normal text-sm text-red-500">
                            Error loading options
                          </CommandItem>
                        ) : (
                          filterOptions.billType.map((billTypeOption) => (
                            <CommandItem
                              key={billTypeOption.value}
                              className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                                font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                            >
                              <Checkbox
                                checked={billType.includes(billTypeOption.value)}
                                onCheckedChange={(checked) =>
                                  setbillType((prev) =>
                                    checked
                                      ? [...prev, billTypeOption.value]
                                      : prev.filter(
                                          (pers) => pers !== billTypeOption.value
                                        )
                                  )
                                }
                                id={billTypeOption.value}
                              />
                              <label
                                className="pl-2 pr-4 cursor-pointer"
                                htmlFor={billTypeOption.value}
                              >
                                {billTypeOption.label}
                              </label>
                            </CommandItem>
                          ))
                        )}
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
                Company
              </label>
              <Select
                open={openDropdowns.company}
                onOpenChange={(open) => {
                  if (open) {
                    handleDropdownOpen('company');
                  } else {
                    setOpenDropdowns(prev => ({ ...prev, company: false }));
                  }
                }}
                onValueChange={() => {}}
                value={`${
                  company.length !== 0
                    ? `${company.length} Selected`
                    : t("table.patientCompany")
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${
                      company.length !== 0
                        ? `${company.length} Selected`
                        : t("actionLabels.all")
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
                    <CommandInput placeholder={t("common.search")} />
                    <CommandList className="px-0 pb-2">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {filterLoading ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm">
                            Loading...
                          </CommandItem>
                        ) : filterError ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row font-normal text-sm text-red-500">
                            Error loading options
                          </CommandItem>
                        ) : (
                          <>
                            <CommandItem
                              key={t("actionLabels.all")}
                              className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                              onClick={() => {
                                if (company.length !== filterOptions.companies.length) {
                                  setcompany(
                                    filterOptions.companies.map((comp) => comp.value)
                                  );
                                } else {
                                  setcompany([]);
                                }
                              }}
                            >
                              <Checkbox
                                checked={company.length === filterOptions.companies.length}
                                onCheckedChange={() => {}}
                                id={t("actionLabels.all")}
                              />
                              <label
                                className="pl-2 pr-4 cursor-pointer"
                                htmlFor={t("actionLabels.all")}
                              >
                                All
                              </label>
                            </CommandItem>
                            {filterOptions.companies.map((companyOption) => (
                              <CommandItem
                                key={companyOption.value}
                                className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                                  font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                              >
                                <Checkbox
                                  checked={company.includes(companyOption.value)}
                                  onCheckedChange={(checked) =>
                                    setcompany((prev) =>
                                      checked
                                        ? [...prev, companyOption.value]
                                        : prev.filter(
                                            (pers) => pers !== companyOption.value
                                          )
                                    )
                                  }
                                  id={companyOption.value}
                                />
                                <label
                                  className="pl-2 pr-4 cursor-pointer"
                                  htmlFor={companyOption.value}
                                >
                                  {companyOption.label}
                                </label>
                              </CommandItem>
                            ))}
                          </>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col space-y-2 py-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Associate Company
              </label>
              <Select
                open={openDropdowns.associateCompany}
                onOpenChange={(open) => {
                  if (open) {
                    handleDropdownOpen('associateCompany');
                  } else {
                    setOpenDropdowns(prev => ({ ...prev, associateCompany: false }));
                  }
                }}
                onValueChange={() => {}}
                value={`${
                  associateCompany.length !== 0
                    ? `${associateCompany.length} Selected`
                    : t("table.patientCompany")
                }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${
                      associateCompany.length !== 0
                        ? `${associateCompany.length} Selected`
                        : t("actionLabels.all")
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
                    <CommandInput placeholder={t("common.search")} />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {filterLoading ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm">
                            Loading...
                          </CommandItem>
                        ) : filterError ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row font-normal text-sm text-red-500">
                            Error loading options
                          </CommandItem>
                        ) : (
                          filterOptions.associateCompanies.map((associateCompanyOption) => (
                            <CommandItem
                              key={associateCompanyOption.value}
                              className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                                font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                            >
                              <Checkbox
                                checked={associateCompany.includes(associateCompanyOption.value)}
                                onCheckedChange={(checked) =>
                                  setassociateCompany((prev) =>
                                    checked
                                      ? [...prev, associateCompanyOption.value]
                                      : prev.filter(
                                          (pers) => pers !== associateCompanyOption.value
                                        )
                                  )
                                }
                                id={associateCompanyOption.value}
                              />
                              <label
                                className="pl-2 pr-4 cursor-pointer"
                                htmlFor={associateCompanyOption.value}
                              >
                                {associateCompanyOption.label}
                              </label>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-start w-full ">
            <div className="w-1/2 flex items-start flex-col space-y-2 py-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Group By
              </label>
              <Select
                open={openDropdowns.groupBy}
                onOpenChange={(open) => {
                  if (open) {
                    handleDropdownOpen('groupBy');
                  } else {
                    setOpenDropdowns(prev => ({ ...prev, groupBy: false }));
                  }
                }}
                onValueChange={() => {}}
                value={groupBy ? groupBy : t("actionLabels.none")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("actionLabels.none")}>
                    {groupBy || t("actionLabels.none")}
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
                    <CommandInput placeholder={t("common.search")} />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {filterLoading ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm">
                            Loading...
                          </CommandItem>
                        ) : filterError ? (
                          <CommandItem className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row font-normal text-sm text-red-500">
                            Error loading options
                          </CommandItem>
                        ) : (
                          filterOptions.groupBy.map((groupByOption) => (
                            <CommandItem
                              key={groupByOption.value}
                              className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                                font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                            >
                              <Checkbox
                                checked={groupBy === groupByOption.label}
                                onCheckedChange={(checked) => {
                                  setgroupBy(checked ? groupByOption.label : "");
                                }}
                                id={groupByOption.label}
                              />
                              <label
                                className="pl-2 pr-4 cursor-pointer"
                                htmlFor={groupByOption.label}
                              >
                                {groupByOption.label}
                              </label>
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full pt-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="cancelled-bills"
                className="cursor-pointer text-sm font-normal"
              >
                Cover Letter Available
              </Label>
              <Switch id="cancelled-bills" />
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
                setBillStatus([]);
                setgroupBy("");
                setcompany([]);
                setassociateCompany([]);
                setbillType([]);
                // Close all dropdowns when resetting
                setOpenDropdowns({
                  billStatus: false,
                  billType: false,
                  company: false,
                  associateCompany: false,
                  groupBy: false,
                });
              }}
            >
              {t("actionLabels.reset")}
            </Button>
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setOpenFilters(false)}>
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                className="bg-primary text-white"
                onClick={onSubmit}
              >
                {t("common.apply")}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialogue;
