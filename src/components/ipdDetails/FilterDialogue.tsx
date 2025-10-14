"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {  Dialog,  DialogClose,  DialogContent,   DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog";
import {  Select,  SelectContent,  SelectTrigger,  SelectValue,} from "@/components/ui/select";
// import CaretDown from "@/assets/icons/CaretDownDark.svg";
import Image from "next/image";
import {  Command,  CommandEmpty,  CommandGroup,  CommandInput,  CommandItem,  CommandList,} from "../ui/command";
//import FilterIcon from "@/assets/icons/FilterIcon.svg";
// import { Switch } from "../ui/switch";
// import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox"

const services = [
  { label: "All", value: "All" },
  { label: "Bed Charges (General Ward)", value: "Bed Charges (General Ward)" },
  { label: "Nursing Charges", value: "Nursing Charges" },
  { label: "Admission Charges", value: "Admission Charges" },
  { label: "Kidney Function Test", value: "Kidney Function Test" },
  { label: "Dialysis Session", value: "Dialysis Session" },
  { label: "OT Usage Charges", value: "OT Usage Charges" },
];

const chargeBillingClasses = [
  { label: "All", value: "All" },
  { label: "General", value: "General" },
  { label: "Private", value: "Private" },
  { label: "Deluxe", value: "Deluxe" },
];

// Dummy arrays for new dropdowns
const departments = [
  { label: "All", value: "All" },
  { label: "Cardiac Operation Theatre", value: "Cardiac Operation Theatre" },
  { label: "Laboratory", value: "Laboratory" },
  { label: "Radiology", value: "Radiology" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Physiotherapy", value: "Physiotherapy" },
  { label: "Emergency", value: "Emergency" },
];

const doctors = [
  { label: "All", value: "All" },
  { label: "Dr. Sangram Chougale", value: "Dr. Sangram Chougale" },
  { label: "Dr. Ashish Shinde", value: "Dr. Ashish Shinde" },
  { label: "Dr. Sahil Chougale", value: "Dr. Sahil Chougale" },
  { label: "Dr. Vaibhav Gavas", value: "Dr. Vaibhav Gavas" },
  { label: "Dr. Priya Iyer", value: "Dr. Priya Iyer" },
  { label: "Dr. Rajesh Sharma", value: "Dr. Rajesh Sharma" },
  { label: "Dr. Arvind Mehta", value: "Dr. Arvind Mehta" },
];

function FilterDialogue({
  trigger,
  filterProps: { filters, setFilters },
  modalProps: { openFilters, setOpenFilters },
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [service, setService] = useState<string[]>([]);
  const [chargeBillingClass, setChargeBillingClass] = useState<string[]>([]);
  const [status, setStatus] =useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [doctor, setDoctor] = useState<string[]>([]);

  const onSubmit = () => {
    // Create filter object with all selected values
    const newFilters = {
      service: service.length > 0 ? service : null,
      chargeBillingClass: chargeBillingClass.length > 0 ? chargeBillingClass : null,
      department: status.length > 0 ? status : null, // status is actually department
      doctor: priority.length > 0 ? priority : null, // priority is actually doctor
      concessionGivenBy: department.length > 0 ? department : null, // department is actually concessionGivenBy
      modifiedBy: doctor.length > 0 ? doctor : null, // doctor is actually modifiedBy
    };

    // Remove null values from filters
    const filteredFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => value !== null)
    );

    // Update the filters in parent component
    setFilters(filteredFilters);
    setOpenFilters(false);
  };

  useEffect(() => {
    const count = {
      service: service.length > 0 ? [...service] : null,
      chargeBillingClass: chargeBillingClass.length > 0 ? [...chargeBillingClass] : null,
      department: status.length > 0 ? [...status] : null,
      doctor: priority.length > 0 ? [...priority] : null,
      concessionGivenBy: department.length > 0 ? [...department] : null,
      modifiedBy: doctor.length > 0 ? [...doctor] : null,
    };

    setLocalFilters(
      Object.fromEntries(
        Object.entries(count).filter(
          ([_, value]) => value !== null && value !== undefined
        )
      )
    );
  }, [service, chargeBillingClass, status, priority, department, doctor]);

  console.log(localFilters);

  return (
    <Dialog open={openFilters} onOpenChange={setOpenFilters}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[640px] !p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
          <div className="flex items-center justify-start space-x-xs border-b border-[#D9D9E0] px-6 py-4">
            <Image src={"/assets/icons/FilterIcon.svg"} height={24} width={24} alt="filter" />
            <DialogTitle>Filter</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 flex flex-col space-y-lg items-center w-full">
          <div className="flex items-center space-x-4 w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="created-by">Services</label>
              <Select
                value={`${service.length !== 0 ? `${service.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${service.length !== 0 ? `${service.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Service Not Found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {services.map((status) => (
                          <CommandItem
                            key={status.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={status.label === "All" ? service.length === services.length - 1 : service.includes(status.label)}
                              onCheckedChange={(value) => {
                                if (status.label === "All") {
                                  if (value) {
                                    setService(services.filter(s => s.label !== "All").map(s => s.label));
                                  } else {
                                    setService([]);
                                  }
                                } else {
                                  setService((prev) =>
                                    value
                                      ? [...prev, status.label]
                                      : prev.filter((s) => s !== status.label)
                                  );
                                }
                              }}
                              id={status.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={status.label}>
                              {status.label}
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
              <label className="font-normal text-sm" htmlFor="created-by">Charge Billing Class</label>
              <Select
                value={`${chargeBillingClass.length !== 0 ? `${chargeBillingClass.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${chargeBillingClass.length !== 0 ? `${chargeBillingClass.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2 [&>div]:!pt-0">
                  <Command>
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {chargeBillingClasses.map((person) => (
                          <CommandItem
                            key={person.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={person.label === "All" ? chargeBillingClass.length === chargeBillingClasses.length - 1 : chargeBillingClass.includes(person.label)}
                              onCheckedChange={(value) => {
                                if (person.label === "All") {
                                  if (value) {
                                    setChargeBillingClass(chargeBillingClasses.filter(c => c.label !== "All").map(c => c.label));
                                  } else {
                                    setChargeBillingClass([]);
                                  }
                                } else {
                                  setChargeBillingClass((prev) =>
                                    value
                                      ? [...prev, person.label]
                                      : prev.filter((s) => s !== person.label)
                                  );
                                }
                              }}
                              id={person.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={person.label}>
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
          </div>

          {/* New dropdowns */}
          <div className="flex items-center space-x-4 w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="status">Department</label>
              <Select
                value={`${status.length !== 0 ? `${status.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${status.length !== 0 ? `${status.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Status Not Found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {departments.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={option.label === "All" ? status.length === departments.length - 1 : status.includes(option.label)}
                              onCheckedChange={(value) => {
                                if (option.label === "All") {
                                  if (value) {
                                    setStatus(departments.filter(s => s.label !== "All").map(s => s.label));
                                  } else {
                                    setStatus([]);
                                  }
                                } else {
                                  setStatus((prev) =>
                                    value
                                      ? [...prev, option.label]
                                      : prev.filter((s) => s !== option.label)
                                  );
                                }
                              }}
                              id={option.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={option.label}>
                              {option.label}
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
              <label className="font-normal text-sm" htmlFor="priority">Doctor</label>
              <Select
                value={`${priority.length !== 0 ? `${priority.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${priority.length !== 0 ? `${priority.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Priority Not Found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {doctors.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={option.label === "All" ? priority.length === doctors.length - 1 : priority.includes(option.label)}
                              onCheckedChange={(value) => {
                                if (option.label === "All") {
                                  if (value) {
                                    setPriority(doctors.filter(p => p.label !== "All").map(p => p.label));
                                  } else {
                                    setPriority([]);
                                  }
                                } else {
                                  setPriority((prev) =>
                                    value
                                      ? [...prev, option.label]
                                      : prev.filter((p) => p !== option.label)
                                  );
                                }
                              }}
                              id={option.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={option.label}>
                              {option.label}
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

          <div className="flex items-center space-x-4 w-full">
            <div className="w-full flex flex-col space-y-2">
              <label className="font-normal text-sm" htmlFor="department">Concession Given By</label>
              <Select
                value={`${department.length !== 0 ? `${department.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${department.length !== 0 ? `${department.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Department Not Found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {doctors.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={option.label === "All" ? department.length === doctors.length - 1 : department.includes(option.label)}
                              onCheckedChange={(value) => {
                                if (option.label === "All") {
                                  if (value) {
                                    setDepartment(doctors.filter(d => d.label !== "All").map(d => d.label));
                                  } else {
                                    setDepartment([]);
                                  }
                                } else {
                                  setDepartment((prev) =>
                                    value
                                      ? [...prev, option.label]
                                      : prev.filter((d) => d !== option.label)
                                  );
                                }
                              }}
                              id={option.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={option.label}>
                              {option.label}
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
              <label className="font-normal text-sm" htmlFor="doctor">Modified by</label>
              <Select
                value={`${doctor.length !== 0 ? `${doctor.length} Selected` : "Created By"}`}
              >
                <SelectTrigger className="w-full border border-[#D9D9E0] shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0 [&:focus-visible]:outline-none">
                  <SelectValue placeholder="Created By">
                    {`${doctor.length !== 0 ? `${doctor.length} Selected` : "All"}`}
                  </SelectValue>
                  <Image src={"/assets/icons/CaretDownDark.svg"} height={16} width={16} alt="dropdown" />
                </SelectTrigger>
                <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!pb-2">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0">
                      <CommandEmpty>Doctor Not Found.</CommandEmpty>
                      <CommandGroup className="p-0">
                        {doctors.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="h-9 cursor-pointer w-full px-4 py-2 flex flex-row text-[#1C2024] 
                              font-normal text-sm rounded-none hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <Checkbox
                              checked={option.label === "All" ? doctor.length === doctors.length - 1 : doctor.includes(option.label)}
                              onCheckedChange={(value) => {
                                if (option.label === "All") {
                                  if (value) {
                                    setDoctor(doctors.filter(d => d.label !== "All").map(d => d.label));
                                  } else {
                                    setDoctor([]);
                                  }
                                } else {
                                  setDoctor((prev) =>
                                    value
                                      ? [...prev, option.label]
                                      : prev.filter((d) => d !== option.label)
                                  );
                                }
                              }}
                              id={option.label}
                            />
                            <label className="pl-2 pr-4 cursor-pointer" htmlFor={option.label}>
                              {option.label}
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
            <DialogClose>
              <Button
                type="button"
                variant="secondary"
                className="text-primary bg-transparent shadow-none"
                onClick={() => {
                  setFilters({});
                  setService([]);
                  setChargeBillingClass([]);
                  setStatus([]);
                  setPriority([]);
                  setDepartment([]);
                  setDoctor([]);
                  setOpenFilters(false);
                }}
              >
                Reset
              </Button>
            </DialogClose>
          </div>
          <div className="flex space-x-2">
            <DialogClose>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                type="button"
                variant="primary"
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
}

export default FilterDialogue;
