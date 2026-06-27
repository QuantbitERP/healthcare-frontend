import React, { useEffect, useRef, useState, useMemo } from "react";
import Tags from "@/components/statusTags/Tags";
import Search from "@/assets/icons/Search.svg";
import SmallList from "@/components/checklistSmall/ChecklistSmall";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "./dataTable";
import Image from "next/image";
import PatientCard from "@/components/patientCardIPD/PatientCard";
import TotalBreakdownCardIPD from "@/components/totalBreakDownCardIPD/TotalBreakdownCardIPD";
import Alerts from "../alerts/Alerts";
import Requisition from "../requisition/Requisition";
import FilterIcon from "@/assets/icons/FilterIconDark.svg";
import TableUtilFilterButton from "../table-util-buttons/TableUtilFilterButton";
import FilterDialogue from "./FilterDialogue";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { initialData, useColumns, columnNames, allServices } from "./tableData";
import TwoUp from "@/assets/icons/TwoArrowUp.svg";
import Sad from "@/assets/icons/Emoji.svg";
import Pipe from "@/assets/icons/DividerVertical.svg";
import SearchDark from "@/assets/icons/SearchDark.svg";
import Carret from "@/assets/icons/CaretDownDark.svg";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "../buttons/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Body({ selectedPatient, billId }) {
  const patientInputRef = useRef<HTMLInputElement | null>(null);
  const [_searchTerm, setSearchTerm] = useState("");
  const [_filteredPatients, setFilteredPatients] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  // const [selectedIndex, setSelectedIndex] = useState(-1);
  // const [showChangePatientDilogue, setShowChangePatientDilogue] =
  //     useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showRequisition, setShowRequisition] = useState(false);
  const [showAlert, _setShowAlert] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCommand, setOpenCommand] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showPackageFilter, setShowPackageFilter] = useState(false);
  const [_savedPreferences, setSavedPreferences] = useState<string[]>([]);
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // Service filter
      const matchService =
        !filters.service ||
        !Array.isArray(filters.service) ||
        filters.service.length === 0 ||
        filters.service.includes(item.service);

      // Charge Billing Class filter
      const matchBillingClass =
        !filters.chargeBillingClass ||
        !Array.isArray(filters.chargeBillingClass) ||
        filters.chargeBillingClass.length === 0 ||
        filters.chargeBillingClass.includes(item.chargeBillingClass);

      // Department filter
      const matchDepartment =
        !filters.department ||
        !Array.isArray(filters.department) ||
        filters.department.length === 0 ||
        filters.department.includes(item.serviceDepartment);

      // Doctor filter
      const matchDoctor =
        !filters.doctor ||
        !Array.isArray(filters.doctor) ||
        filters.doctor.length === 0 ||
        filters.doctor.includes(item.doctor);

      // Concession Given By filter
      const matchConcessionGivenBy =
        !filters.concessionGivenBy ||
        !Array.isArray(filters.concessionGivenBy) ||
        filters.concessionGivenBy.length === 0 ||
        filters.concessionGivenBy.includes(item.concessionGivenBy);

      // Modified By filter
      const matchModifiedBy =
        !filters.modifiedBy ||
        !Array.isArray(filters.modifiedBy) ||
        filters.modifiedBy.length === 0 ||
        filters.modifiedBy.includes(item.modifiedby);

      // Search service in table filter
      const matchSearchQuery =
        !tableSearchQuery ||
        item.service.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        item.serviceDepartment
          ?.toLowerCase()
          .includes(tableSearchQuery.toLowerCase()) ||
        item.chargeBillingClass
          ?.toLowerCase()
          .includes(tableSearchQuery.toLowerCase());

      // Package filter
      const matchPackage =
        selectedPackages.length === 0 ||
        selectedPackages.includes(item.package);

      return (
        matchService &&
        matchBillingClass &&
        matchDepartment &&
        matchDoctor &&
        matchConcessionGivenBy &&
        matchModifiedBy &&
        matchSearchQuery &&
        matchPackage
      );
    });
  }, [filters, tableSearchQuery, selectedPackages]);
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  useEffect(() => {
    const departments = Array.from(
      new Set(filteredData.map((item) => item.serviceDepartment || "Others"))
    );

    setExpandedGroups((prev) => {
      const initialized = {};
      departments.forEach((dept) => {
        initialized[dept] = false;
      });

      return { ...initialized, ...prev }; // Preserve any existing toggled values
    });
  }, [filteredData]);

  // Function to toggle the open state of all accordions
  const toggleAllAccordions = () => {
    const allAreOpen =
      Object.values(expandedGroups).length > 0 &&
      Object.values(expandedGroups).every(Boolean);

    const updatedState = Object.keys(expandedGroups).reduce((acc, dept) => {
      acc[dept] = !allAreOpen; // toggle based on current state
      return acc;
    }, {});
    setExpandedGroups(updatedState);
  };

  const [data, setData] = useState(filteredData || []);
  const handleAddService = (service) => {
    const newEntry = {
      ...service,
      id: `${service.id}-${Date.now()}`, // unique row id
    };

    setData((prevData) => [...prevData, newEntry]);
  };

  const table = useReactTable({
    columns: useColumns(),
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });
  // const handlePatientClick = (patient) => {
  //   if (selectedPatient && selectedPatient.id !== patient.id) {
  //     // If switching patients, show confirmation dialog
  //     setNewPatient(patient);
  //     setShowChangePatientDilogue(true);
  //   } else {
  //     // Directly set the patient if no previous selection
  //     setSelectedPatient(patient);
  //     setShowAvatar(true);
  //     setSearchTerm("");
  //     setFilteredPatients([]);
  //   }
  // };

  //for clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      setTimeout(() => {
        if (
          patientInputRef.current &&
          !patientInputRef.current?.contains(event.target)
        ) {
          setFilteredPatients([]);
          setSearchTerm("");
        }
      }, 100); // Small delay to allow click event on list items
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard events
  // useEffect(() => {
  //   function handleKeyDown(event) {
  //     if (!filteredPatients.length) return;

  //     if (event.key === "ArrowDown") {
  //       setSelectedIndex((prevIndex) =>
  //         prevIndex < filteredPatients.length - 1 ? prevIndex + 1 : prevIndex
  //       );
  //     } else if (event.key === "ArrowUp") {
  //       setSelectedIndex((prevIndex) =>
  //         prevIndex > 0 ? prevIndex - 1 : prevIndex
  //       );
  //     } else if (event.key === "Enter" && selectedIndex >= 0) {
  //       handlePatientClick(filteredPatients[selectedIndex]);
  //     }
  //   }

  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [filteredPatients, selectedIndex, handlePatientClick]);

  // //for focusing on the textbox
  // const handleAssignPatientClick = () => {
  //   patientInputRef.current.focus();
  // };

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add effect to focus input when search box appears
  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  // Get unique packages from the data
  const availablePackages = useMemo(() => {
    return Array.from(
      new Set(initialData.map((item) => item.package).filter(Boolean))
    );
  }, []);

  const filteredPackages = useMemo(() => {
    if (!searchQuery) return availablePackages;
    return availablePackages.filter((pkg) =>
      pkg.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availablePackages, searchQuery]);

  const handleSavePreferences = () => {
    setSavedPreferences([...selectedPackages]);
    setShowPackageFilter(false);
  };

  return (
    <div className="w-full px-6 h-fit flex items-center justify-center gap-4 flex-col">
      <Alerts
        buttonText="View"
        content=""
        heading="6 Requisitions are Pending "
        showButton
        variant="danger"
        open
        onClick={() => setShowRequisition(true)}
      />
      <Dialog
        open={showRequisition}
        onOpenChange={(isOpen) => setShowRequisition(isOpen)}
      >
        <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden">
          <Requisition setOpen={setShowRequisition} />
        </DialogContent>
      </Dialog>
      <div className="w-full h-fit flex flex-row gap-5">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-fit h-fit gap-4 flex flex-row">
            <span className="text-[#1C2024] text-2xl font-semibold">
              {selectedPatient ? selectedPatient.billNumber : `#${billId}`}
            </span>
            <div className="flex flex-row gap-2 items-center">
              <Tags variant="tag" tagText="Draft" type="secondary" border />
              <Tags
                variant="tag"
                tagText="Payment Pending"
                type="warning"
                border
              />
              <Tags
                variant="tag"
                tagText="Requisition Pendings"
                type="danger"
                border
              />
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <span className="text-[#60646C] text-xs font-normal">
              Created on 15 May 2025 8:00 AM ·
            </span>
            <span className="text-[#0D74CE] text-xs font-normal">
              Rohan Sharma
            </span>
          </div>
        </div>
        <div className="relative w-[326px]">
          <Image
            src={Search}
            alt="Search"
            width={24}
            height={24}
            className="absolute left-3 top-2.5"
          />
          <input
            type="text"
            className="w-full h-10 rounded-lg border border-[#CDCED6] bg-white pr-3 py-2 pl-12"
            placeholder="Search & Add Services"
            onFocus={() => setOpenCommand(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setOpenCommand(false), 200)}
            value={searchQuery}
          />

          {openCommand && (
            <div className="absolute top-11 z-50 w-full bg-white border border-gray-200 rounded-md shadow-md">
              <Command className="pb-2 flex items-center justify-center">
                <CommandList className="no-scrollbar [&>div>div]:!p-0 [&>div>div]:!m-0 w-fit">
                  {(() => {
                    const filteredServicesByDept = allServices.reduce(
                      (acc, service) => {
                        if (
                          searchQuery.trim() === "" ||
                          service.service
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          service.serviceNumber
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ) {
                          const dept = service.serviceDepartment;
                          if (!acc[dept]) acc[dept] = [];
                          acc[dept].push(service);
                        }
                        return acc;
                      },
                      {}
                    );

                    const hasServices =
                      Object.keys(filteredServicesByDept).length > 0;

                    return hasServices ? (
                      Object.entries(filteredServicesByDept).map(
                        ([department, services]) => (
                          <CommandGroup
                            key={department}
                            heading={<div className="px-2">{department}</div>}
                            className="text-[#60646C] text-xs font-normal px-4"
                          >
                            {Array.isArray(services) &&
                              services.map((service) => (
                                <CommandItem
                                  key={service.id}
                                  onSelect={() => handleAddService(service)}
                                  className="text-[#1C2024] px-4 py-1 h-10 items-center text-sm font-normal flex justify-between w-full hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] rounded-none"
                                >
                                  <span className="whitespace-nowrap">
                                    {service.service}
                                  </span>
                                  <span className="whitespace-nowrap">
                                    {service.serviceNumber}
                                  </span>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )
                      )
                    ) : (
                      <div className="w-full h-[144px] px-4 py-2 flex flex-col gap-2 items-center justify-center text-center">
                        <Image src={Sad.src} alt="Sad" width={32} height={32} />
                        <span className="text-[#1C2024] text-base font-semibold text-center block">
                          No Service Found!
                        </span>
                      </div>
                    );
                  })()}
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          height: showAlert ? "calc(100vh - 296px)" : "calc(100vh - 216px)",
        }}
        className="w-full flex flex-row gap-4 overflow-y-auto no-scrollbar overflow-x-hidden"
      >
        <div className="flex flex-col gap-4">
          <PatientCard />
          <TotalBreakdownCardIPD selectedPatientBill={null} showDeposit />
        </div>
        <div className="w-full h-fit flex flex-col gap-4">
          <div className="w-[calc(100%-276px)] h-fit flex flex-row justify-between py-1">
            <div className="flex flex-row gap-2 cursor-pointer text-[#1C2024] text-lg font-semibold items-center">
              <Popover
                open={showPackageFilter}
                onOpenChange={setShowPackageFilter}
              >
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span>All Services </span>
                    <Image src={Carret.src} alt="Carret" width={16} height={16} />
                    <span>{table.getRowModel().rows.length}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search"
                      className="h-10"
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList className="[&>div>div]:!p-0">
                      <CommandEmpty>
                        <div className="w-full h-fit px-4 py-6 flex flex-col gap-2 items-center justify-center text-center">
                          <Image src={Sad.src} alt="Sad" width={32} height={32} />
                          <span className="text-[#1C2024] text-base font-semibold text-center block">
                            No Package Found!
                          </span>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          className="data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          onSelect={() => {
                            setSelectedPackages((prev) =>
                              prev.length === availablePackages.length
                                ? []
                                : [...availablePackages]
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={
                                selectedPackages.length ===
                                availablePackages.length
                              }
                              onCheckedChange={() => { }}
                            />
                            <span className="font-normal text-[#1C2024] text-sm">
                              All
                            </span>
                          </div>
                        </CommandItem>
                        <div />
                        {filteredPackages.map((pkg) => (
                          <CommandItem
                            key={pkg}
                            onSelect={() => {
                              setSelectedPackages((prev) =>
                                prev.includes(pkg)
                                  ? prev.filter((p) => p !== pkg)
                                  : [...prev, pkg]
                              );
                            }}
                            className="data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedPackages.includes(pkg)}
                                onCheckedChange={() => { }}
                              />
                              <span className="font-normal text-[#1C2024] text-sm">
                                {pkg}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {filteredPackages.length > 0 && (
                      <div className="flex items-center justify-start py-2 px-4">
                        <Button
                          onClick={handleSavePreferences}
                          size="button-small"
                          type="secondary-button"
                          variant="button"
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="relative" ref={searchRef}>
                <div className="flex items-center">
                  {!showSearchInput && (
                    <button
                      className="flex items-center justify-center p-2 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300 ease-in-out"
                      onClick={() => setShowSearchInput(true)}
                    >
                      <Image
                        src={SearchDark}
                        alt="Search"
                        width={16}
                        height={16}
                      />
                    </button>
                  )}
                  <div
                    className={` top-0 right-0 h-8 bg-white border border-[#D9D9E0]  rounded-lg focus-within:ring-2 focus-within:ring-[#0090FF] focus-within:ring-offset-2 z-50 transition-all duration-300 ease-in-out transform origin-right overflow-hidden
                                    ${showSearchInput
                        ? "w-[216px] opacity-100"
                        : "w-0 opacity-0"
                      }`}
                  >
                    <div className="flex items-center px-3 gap-2">
                      <Image src={Search.src} alt="Search" width={16} height={16} />
                      <input
                        ref={inputRef}
                        type="text"
                        className="w-full h-8 flex items-center text-xs focus:outline-none placeholder:text-[#60646C] placeholder:text-xs placeholder:font-normal"
                        placeholder="Search"
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Image src={Pipe.src} alt="Pipe" width={0} height={29} />
              </div>
              <button
                className="flex items-center justify-center p-2 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300 ease-in-out"
                onClick={toggleAllAccordions}
              >
                <Image
                  src={TwoUp}
                  alt="Up"
                  width={16}
                  height={16}
                  className={`transition-transform duration-300 ease-in-out ${Object.values(expandedGroups).length > 0 &&
                    Object.values(expandedGroups).every(Boolean)
                    ? ""
                    : "rotate-180"
                    }`}
                />
              </button>
              <FilterDialogue
                trigger={
                  <TableUtilFilterButton
                    icon={FilterIcon}
                    label={"Filters"}
                    badgeCount={Object.keys(filters).length}
                  />
                }
                modalProps={{ openFilters, setOpenFilters }}
                filterProps={{ filters, setFilters }}
              />
              <SmallList
                items={[
                  "Package",
                  "Requisition No",
                  "Requisition Date/Time",
                  "Service Department",
                  "Charge Billing Class",
                  "Rate",
                  "Quantity",
                  "Patient Amount",
                  "Company Amount",
                  "Concession",
                  "GST",
                  "Doctor",
                  "Concession Given By",
                  "Is Urgent",
                  "Is Sample Collected",
                  "Service Remark",
                  "Concession Remark",
                  "Modified by",
                  "Rate Lock",
                  "Total Amount",
                ]}
                title="Show/Hide Columns"
                table={table}
                columnNames={columnNames}
              />
            </div>
          </div>
          <div className="w-[calc(100%-276px)]">
            <DataTable
              columns={useColumns()}
              initialData={filteredData}
              addButton={true}
              table={table}
              dataProps={{ data, setData }}
              expandedGroups={expandedGroups}
              setExpandedGroups={setExpandedGroups}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
