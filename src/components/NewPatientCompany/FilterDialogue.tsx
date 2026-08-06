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


interface LabelValue {
  label: string;
  value: string;
}

const Hospitals: LabelValue[] = [
  { label: "Sunrise Medical Center", value: "Sunrise Medical Center" },
  { label: "Holy Spirit Hospital", value: "Holy Spirit Hospital" },
  { label: "Grand Oak Medical Center", value: "Grand Oak Medical Center" },
  { label: "Hopewell Health Institute", value: "Hopewell Health Institute" },
  { label: "Mercy General Hospital", value: "Mercy General Hospital" },
  { label: "Lifeline Specialty Clinic", value: "Lifeline Specialty Clinic" },
];

const Patients: LabelValue[] = [
  { label: "Ananya Iyer", value: "Ananya Iyer" },
  { label: "Aditya Patil", value: "Aditya Patil" },
  { label: "Rohan Jadhav", value: "Rohan Jadhav" },
  { label: "Priya Sharma", value: "Priya Sharma" },
  { label: "Priya Deshmukh", value: "Priya Deshmukh" },
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
  const [localFilters, setLocalFilters] = useState({});

  const onSubmit = () => {
    setFilters({ ...localFilters });
  };

  const [hospital, setHospital] = useState<string[]>([]);
  const [patient, setPatient] = useState<string[]>([]);

  useEffect(() => {
    const count = {
      hospital: hospital.length > 0 ? [...hospital] : null,
      patient: patient.length > 0 ? [...patient] : null,
    };

    setLocalFilters(
      Object.fromEntries(
        Object.entries(count).filter(
          ([, value]) => value !== null && value !== undefined
        )
      )
    );
  }, [hospital, patient]);
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[640px] p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-between border-b border-[#D9D9E0] px-6 py-4">
            <div className="flex items-center gap-2">
              <Image src={"assets/icons/FilterIcon.svg"} height={24} width={24} alt="filter icon" />
              <DialogTitle className="text-base font-semibold text-[#1C2024]">
                Filter
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <Image className="border border-[#D9D9E0] cursor-pointer rounded-md p-1" src={"assets/icons/x.svg"} height={24} width={24} alt="filter icon" />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="px-6 py-2 flex flex-col space-y-lg items-center w-full">
          <div className="flex items-center gap-2 space-x-lg w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">
                Hospital
              </label>

              <Select
                onValueChange={(value) =>
                  setHospital((prev: string[]) =>
                    value
                      ? [...prev, value]
                      : [...prev.filter((status) => status !== value)]
                  )
                }
                value={`${hospital.length !== 0
                    ? `${hospital.length} Selected`
                    : "Hospital"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${"Created By"}`}>
                    {`${hospital.length !== 0
                        ? `${hospital.length} Selected`
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
                        <CommandItem
                          key="All"
                          className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          onClick={() => {
                            if (hospital.length !== Hospitals.length) {
                              setHospital(
                                Hospitals.map((hos) => hos.label)
                              );
                            } else {
                              setHospital([]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={hospital.length === Hospitals.length}
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
                        {Hospitals.map((mode) => (
                          <CommandItem
                            key={mode.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={hospital.includes(mode.label)}
                              onCheckedChange={(value) => {
                                setHospital((prev) =>
                                  value
                                    ? [...prev, mode.label]
                                    : [
                                      ...prev.filter(
                                        (pers) => pers !== mode.label
                                      ),
                                    ]
                                );
                              }}
                              id={mode.label}
                            />

                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={mode.label}
                            >
                              {mode.label}
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
                Patient
              </label>
              <Select
                onValueChange={(e) => console.log(e)}
                value={`${patient.length !== 0
                    ? `${patient.length} Selected`
                    : "Patient Company"
                  }`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Patient Company`}>
                    {`${patient.length !== 0
                        ? `${patient.length} Selected`
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
                        <CommandItem
                          key="All"
                          className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          onClick={() => {
                            if (patient.length !== Patients.length) {
                              setPatient(
                                Patients.map((patient) => patient.label)
                              );
                            } else {
                              setPatient([]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={patient.length === Patients.length}
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
                        {Patients.map((mode) => (
                          <CommandItem
                            key={mode.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={patient.includes(mode.label)}
                              onCheckedChange={(checked) =>
                                setPatient((prev) =>
                                  checked
                                    ? [...prev, mode.label]
                                    : prev.filter(
                                      (pers) => pers !== mode.label
                                    )
                                )
                              }
                              id={mode.label}
                            />
                            <label
                              className="pl-2 pr-4 cursor-pointer"
                              htmlFor={mode.label}
                            >
                              {mode.label}
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
                setFilters({});
                setHospital([]);
                setPatient([]);
                setOpenFilters(false);
              }}
            >
              Reset
            </Button>
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setOpenFilters(false)}>
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
