"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { ReportService } from "@/services/api-client/services/ReportService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import Image from "next/image";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface BuildReportProps {
  trigger: React.ReactNode;
  filterProps: {
    filters: Record<string, unknown>;
    setFilters: (filters: Record<string, unknown>) => void;
  };
  dateProps: { date: any; setDate: any };
  modalProps: {
    openFilters: boolean;
    setOpenFilters: (open: boolean) => void;
  };
  serviceGroupProps: { serviceGroup: string[]; setServiceGroup: Dispatch<SetStateAction<string[]>> };
  departmentProps: { department: string[]; setDepartment: Dispatch<SetStateAction<string[]>> };
  serviceProps: { service: string[]; setService: Dispatch<SetStateAction<string[]>> };
  billingClassProps: { billingClass: string[]; setBillingClass: Dispatch<SetStateAction<string[]>> };
  companyNameProps: { companyName: string[]; setCompanyName: Dispatch<SetStateAction<string[]>> };
  groupByProps: { groupBy: string[]; setGroupBy: Dispatch<SetStateAction<string[]>> };
  ApplyFilter: () => void;
  onSuccess?: () => void;
}

function BuildReport({
  trigger,
  filterProps: { setFilters },
  modalProps: { setOpenFilters },
  serviceGroupProps: { serviceGroup, setServiceGroup },
  departmentProps: { department, setDepartment },
  serviceProps: { service, setService },
  billingClassProps: { billingClass, setBillingClass },
  companyNameProps: { companyName, setCompanyName },
  groupByProps: { groupBy, setGroupBy },
  dateProps: { setDate },
  ApplyFilter,
  onSuccess,
}: BuildReportProps): React.ReactElement {
  const isMountedRef = useRef(true);
  const [_, setLocalFilters] = useState({});

  // API data states
  const [serviceGroups, setServiceGroups] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [billingClasses, setBillingClasses] = useState<any[]>([]);
  const [companyNames, setCompanyNames] = useState<any[]>([]);
  const [groupByOptions, setGroupByOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch all APIs in parallel
        const [
          serviceGroupsRes,
          departmentsRes,
          servicesRes,
          billingClassesRes,
          companyNamesRes,
          groupByRes
        ] = await Promise.allSettled([
          ReportService.getApiV1ServiceGroups(),
          ReportService.getApiVDepartmentsDepartmentKVlist('v1'),
          ReportService.getApiV1ServiceMaster(),
          ReportService.getApiV1BillingClass(),
          ReportService.getApiVCompany(),
          ReportService.getApiV1GrouBy()
        ]);

        // Helper function to normalize API response
        const normalizeList = (response: any) => {
          if (response.status === 'fulfilled' && response.value) {
            const data = response.value;
            const items = Array.isArray(data)
              ? data
              : Array.isArray(data?.data?.items)
                ? data.data.items
                : Array.isArray(data?.items)
                  ? data.items
                  : [];

            return items.map((item: any) => ({
              key: item.key || item.id || "",
              value: item.value || item.name || "",
              label: item.value || item.name || item.label || ""
            }));
          }
          return [];
        };

        if (!isMountedRef.current) return;

        setServiceGroups(normalizeList(serviceGroupsRes));
        setDepartments(normalizeList(departmentsRes));
        setServices(normalizeList(servicesRes));
        setBillingClasses(normalizeList(billingClassesRes));
        setCompanyNames(normalizeList(companyNamesRes));
        setGroupByOptions(normalizeList(groupByRes));

      } catch {
        // Set empty arrays on error - no fallback data
        if (!isMountedRef.current) return;
        setServiceGroups([]);
        setDepartments([]);
        setServices([]);
        setBillingClasses([]);
        setCompanyNames([]);
        setGroupByOptions([]);
      } finally {
        if (!isMountedRef.current) return;
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;

    const count = {
      serviceGroup: serviceGroup.length > 0 ? serviceGroup : undefined,
      department: department.length > 0 ? department : undefined,
      service: service.length > 0 ? service : undefined,
      billingClass: billingClass.length > 0 ? billingClass : undefined,
      companyName: companyName.length > 0 ? companyName : undefined,
      groupBy: groupBy.length > 0 ? groupBy : undefined,
    };
    setLocalFilters(
      Object.fromEntries(Object.entries(count).filter(([, value]) => value !== null && value !== undefined))
    );
  }, [serviceGroup, department, service, billingClass, companyName, groupByOptions, groupBy]);

  const onSubmit = () => {
    if (loading || !isMountedRef.current) return;
    const filters = {
      serviceGroup: serviceGroup.length > 0 ? serviceGroup : undefined,
      department: department.length > 0 ? department : undefined,
      service: service.length > 0 ? service : undefined,
      billingClass: billingClass.length > 0 ? billingClass : undefined,
      companyName: companyName.length > 0 ? companyName : undefined,
      groupBy: groupBy.length > 0 ? groupBy : undefined,
    };


    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== null && value !== undefined)
    );

    setFilters(cleanedFilters);
    setOpenFilters(false);

    // Call success callback to show toast on parent page
    if (onSuccess) {
      onSuccess();
    }

    // Trigger API fetch via parent Apply handler
    ApplyFilter();
  };

  const renderDropdown = (
    label: string,
    options: { label: string; key: string; value: string }[] = [],
    selected: string[],
    setSelected: Dispatch<SetStateAction<string[]>>,
    placeholder: string,
    allId: string,
    dropdownId: string
  ) => {
    const isOpen = openDropdown === dropdownId;

    return (
      <div className="w-full flex flex-col space-y-2">
        <label className="font-normal text-sm">{label}</label>
        <Select
          open={isOpen}
          onOpenChange={(open) => {
            if (open) {
              setOpenDropdown(dropdownId);
            } else {
              setOpenDropdown(null);
            }
          }}
          value={selected.length !== 0 ? `${selected.length} Selected` : placeholder}
        >
          <SelectTrigger className="w-full" disabled={loading}>
            <SelectValue placeholder={placeholder}>
              {loading ? "Loading..." : selected.length !== 0 ? `${selected.length} Selected` : "All"}
            </SelectValue>
            <Image src={"assets/icons/CaretDownDark.svg"} height={16} width={16} alt="no data found" />
          </SelectTrigger>
          <SelectContent
            className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0"
            style={{ maxWidth: 350, minWidth: 250, width: "100%" }}
          >
            <Command>
              <CommandInput placeholder="Search" />
              <CommandList className="px-0 pb-2">
                <CommandEmpty>{loading ? "Loading..." : "Not found."}</CommandEmpty>
                <CommandGroup className="p-0">
                  <CommandItem key="All">
                    <Checkbox
                      checked={selected.length === options.length}
                      onCheckedChange={(value) =>
                        setSelected(value ? options.map((item) => item.key) : [])
                      }
                      id={allId}
                    />
                    <label className="pl-2 pr-4 cursor-pointer" htmlFor={allId}>
                      All
                    </label>
                  </CommandItem>
                  {options.map((item) => (
                    <CommandItem key={item.key}>
                      <Checkbox
                        checked={selected.includes(item.key)}
                        onCheckedChange={(value) => {
                          setSelected((prev) =>
                            value
                              ? [...prev, item.key]
                              : prev.filter((v) => v !== item.key)
                          );
                        }}
                        id={item.key}
                      />
                      <label
                        className="pl-2 pr-4 cursor-pointer"
                        htmlFor={item.key}
                      >
                        {item.label}
                      </label>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[700px] !p-0 [&>button]:!hidden gap-6">
        <DialogHeader>
          <div className="flex items-center justify-start space-x-xs border-b border-[#D9D9E0] px-6 py-4">
            <Image src={"assets/icons/NotepadTimer.svg"} height={24} width={24} alt="Build Report" />
            <DialogTitle>Build Report</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 flex flex-col space-y-3 items-center w-full">
          <div className="flex items-center space-x-3 w-full">
            {renderDropdown("Service Group", serviceGroups, serviceGroup, setServiceGroup, "Service Group", "select-all-serviceGroup", "serviceGroup")}
            {renderDropdown("Department", departments, department, setDepartment, "Department", "select-all-department", "department")}
          </div>
          <div className="flex items-center space-x-3 w-full">
            {renderDropdown("Service", services, service, setService, "Service", "select-all-service", "service")}
            {renderDropdown("Billing Class", billingClasses, billingClass, setBillingClass, "Billing Class", "select-all-billingClass", "billingClass")}
          </div>
          <div className="flex items-center space-x-3 w-full">
            {renderDropdown("Company Name", companyNames, companyName, setCompanyName, "Company Name", "select-all-companyName", "companyName")}
            {renderDropdown("Group By", groupByOptions, groupBy, setGroupBy, "Group By", "select-all-groupBy", "groupBy")}
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
                  setServiceGroup([]);
                  setDepartment([]);
                  setService([]);
                  setBillingClass([]);
                  setCompanyName([]);
                  setGroupBy([]);
                  setOpenFilters(false);
                  setDate({
                    from: new Date(),
                  });
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
                variant="default"
                className="bg-primary text-white"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Apply"}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BuildReport;