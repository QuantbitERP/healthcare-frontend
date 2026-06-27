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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllOpdFilters } from "@/store/opd_bills/thunks";
import { fetchCompanyList, fetchPaymentTypes, fetchVisitTypes, fetchCreatedByList } from "@/store/payments_received/thunks";
// import { CompanyListDto } from "@/api-client/models/CompanyListDto";

interface LabelValue {
  label: string;
  value: string;
}

const patient: LabelValue[] = [
  {
    label: "Ananya Sharma",
    value: "Ananya Sharma",
  },
  {
    label: "Rohan Jadhav",
    value: "Rohan Jadhav",
  },
  {
    label: "Aditya Patil",
    value: "Aditya Patil",
  },
];

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
  const dispatch = useDispatch<AppDispatch>();

  const paymentTypes = useSelector(
    (state: RootState) => state.paymentReceived.paymentTypes.data
  );
  const visitTypeList = useSelector(
    (state: RootState) => state.paymentReceived.visitTypes.data
  );
  const createdByListPayment = useSelector(
    (state: RootState) => state.paymentReceived.createdByList.data
  );
  const companies = useSelector(
    (state: RootState) => state.paymentReceived.companyList.data
  );
  const [localFilters, setLocalFilters] = useState({});

  const onSubmit = () => {
    setFilters({ ...localFilters });
  };

  const [paymentMode, setPaymentMode] = useState<string[]>([]);
  const [visitType, setVisitType] = useState<string[]>([]);
  const [company, setcompany] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string[]>([]);
  const [modifiedBy, setModifiedBy] = useState<string[]>([]);
  const [patientSelected, setPatientSelected] = useState<string[]>([]);

  const companyList = companies ? (Array.isArray(companies) ? companies : [companies]) : [];

  useEffect(() => {
    dispatch(
      fetchAllOpdFilters({
        version: "1",
        tenant: "",
        hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
      })
    );
    dispatch(
      fetchCompanyList({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchPaymentTypes({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchVisitTypes({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchCreatedByList({
        version: "1",
        tenant: "",
      })
    );
  }, [dispatch]);
  console.log("Companies list for payments received", companies);
  useEffect(() => {
    const count = {
      paymentMode: paymentMode.length > 0 ? [...paymentMode] : null,
      visitType: visitType.length > 0 ? [...visitType] : null,
      company: company.length > 0 ? [...company] : null,
      patientSelected: patientSelected.length > 0 ? [...patientSelected] : null,
      createdBy: createdBy.length > 0 ? [...createdBy] : null,
      modifiedBy: modifiedBy.length > 0 ? [...modifiedBy] : null,
    };

    setLocalFilters(
      Object.fromEntries(
        Object.entries(count).filter(
          ([, value]) => value !== null && value !== undefined
        )
      )
    );
  }, [paymentMode, visitType, company, patientSelected, createdBy, modifiedBy]);
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[640px] p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-between border-b border-[#D9D9E0] px-6 py-4">
            <div className="flex items-center gap-2">
              <Image
                src={"assets/icons/FilterIcon.svg"}
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
                src={"assets/icons/x.svg"}
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
                Payment Mode
              </label>

              <Select
                onValueChange={(value) =>
                  setPaymentMode((prev: string[]) =>
                    value && !prev.includes(value)
                      ? [...prev, value]
                      : prev.filter((status) => status !== value)
                  )
                }
                value={`${paymentMode.length !== 0
                    ? `${paymentMode.length} Selected`
                    : "Payment Mode"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${paymentMode.length !== 0
                        ? `${paymentMode.length} Selected`
                        : "All"
                      }`}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                        {paymentTypes?.map((mode) => (
                          <CommandItem
                            key={mode.paymentTypeId}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={paymentMode.includes(mode.paymentTypeName ?? "")}
                              onCheckedChange={(value) => {
                                setPaymentMode((prev) =>
                                  value && mode.paymentTypeName
                                    ? [...prev, mode.paymentTypeName]
                                    : prev.filter((pers) => pers !== mode.paymentTypeName)
                                );
                              }}
                              id={mode.paymentTypeId ?? ""}
                            />

                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={mode.paymentTypeId ?? ""}
                            >
                              {mode.paymentTypeName}
                            </label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex flex-col space-y-2 ">
              <label className="font-normal text-sm" htmlFor="bill-select">
                Company
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${company.length !== 0
                    ? `${company.length} Selected`
                    : "Patient Company"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Patient Company">
                    {company.length !== 0
                      ? `${company.length} Selected`
                      : "All"}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                            if (company.length !== companyList.length) {
                              setcompany(companyList.map((item) => item.companyListId));
                            } else {
                              setcompany([]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={company.length === companyList.length}
                            onCheckedChange={() => { }}
                            id="All"
                          />
                          <label
                            className="pl-2 pr-4 cursor-pointer"
                            htmlFor="All"
                          >
                            All
                          </label>
                        </CommandItem>

                        {companyList.map((item) => (
                          <CommandItem
                            key={item.companyListId}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={company.includes(item.companyListId)}
                              onCheckedChange={(checked) =>
                                setcompany((prev) =>
                                  checked
                                    ? [...prev, item.companyListId]
                                    : prev.filter(
                                      (id) => id !== item.companyListId
                                    )
                                )
                              }
                              id={item.companyListId}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={item.companyListId}
                            >
                              {item.companyListName}
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
            <div className="w-full flex flex-col space-y-2 py-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Patient
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${patientSelected.length !== 0
                    ? `${patientSelected.length} Selected`
                    : "Patient Company"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${patientSelected.length !== 0
                        ? `${patientSelected.length} Selected`
                        : "All"
                      }`}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                        {patient.map((person) => (
                          <CommandItem
                            key={person.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={patientSelected.includes(person.label)}
                              onCheckedChange={(checked) =>
                                setPatientSelected((prev) =>
                                  checked
                                    ? [...prev, person.label]
                                    : prev.filter(
                                      (pers) => pers !== person.label
                                    )
                                )
                              }
                              id={person.label}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={person.label}
                            >
                              {person.label}
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
                Visit Type
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${visitType.length !== 0
                    ? `${visitType.length} Selected`
                    : "Created By"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${visitType.length !== 0
                        ? `${visitType.length} Selected`
                        : "All"
                      }`}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                        {visitTypeList?.map((visit) => (
                          <CommandItem
                            key={visit.paymentModeId}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={visitType.includes(String(visit.paymentModeId))}
                              onCheckedChange={(checked) =>
                                setVisitType((prev) =>
                                  checked && visit.paymentModeId !== undefined
                                    ? [...prev, String(visit.paymentModeId)]
                                    : prev.filter(
                                      (pers) => pers !== String(visit.paymentModeId)
                                    )
                                )
                              }
                              id={String(visit.paymentModeId)}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={String(visit.paymentModeId)}
                            >
                              {visit.paymentModeName}
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
            <div className="w-full flex flex-col space-y-2 py-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Created By
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${createdBy.length !== 0
                    ? `${createdBy.length} Selected`
                    : "Created By"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Created By`}>
                    {`${createdBy.length !== 0
                        ? `${createdBy.length} Selected`
                        : "All"
                      }`}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                        {createdByListPayment?.map((person) => (
                          <CommandItem
                            key={person.paymentModeId}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                  font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={createdBy.includes(String(person.paymentModeId))}
                              onCheckedChange={(checked) =>
                                setCreatedBy((prev) =>
                                  checked && person.paymentModeId
                                    ? [...prev, String(person.paymentModeId)]
                                    : prev.filter(
                                      (pers) => pers !== String(person.paymentModeId)
                                    )
                                )
                              }
                              id={String(person.paymentModeId)}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={String(person.paymentModeId)}
                            >
                              {person.paymentModeName}
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
                Modified By
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${modifiedBy.length !== 0
                    ? `${modifiedBy.length} Selected`
                    : "Created By"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${modifiedBy.length !== 0
                        ? `${modifiedBy.length} Selected`
                        : "All"
                      }`}
                  </SelectValue>
                  <Image
                    src={"assets/icons/CaretDownDark.svg"}
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
                        {createdByListPayment?.map((person) => (
                          <CommandItem
                            key={person.paymentModeId}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                  font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={modifiedBy.includes(String(person.paymentModeId))}
                              onCheckedChange={(checked) =>
                                setModifiedBy((prev) =>
                                  checked && person.paymentModeId
                                    ? [...prev, String(person.paymentModeId)]
                                    : prev.filter(
                                      (pers) => pers !== String(person.paymentModeId)
                                    )
                                )
                              }
                              id={String(person.paymentModeId)}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={String(person.paymentModeId)}
                            >
                              {person.paymentModeName}
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
          <div className="w-full pt-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="cancelled-bills"
                className="cursor-pointer text-sm font-normal"
              >
                Settled Bill(s)
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
                setFilters({});
                setPaymentMode([]);
                setcompany([]);
                setPatientSelected([]);
                setCreatedBy([]);
                setModifiedBy([]);
                setVisitType([]);

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
